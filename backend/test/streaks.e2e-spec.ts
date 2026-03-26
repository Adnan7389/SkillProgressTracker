import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StreaksService } from '../src/modules/streaks/streaks.service';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import { mongoClient } from '../src/auth/auth.service';

interface UserDocument {
  _id: Types.ObjectId;
  email: string;
  name: string;
  learningStreak: number;
  lastActiveDate: string | null;
  save(): Promise<this>;
}

describe('StreaksService (e2e)', () => {
  let app: INestApplication;
  let streaksService: StreaksService;
  let notificationsService: NotificationsService;
  let userModel: Model<UserDocument>;

  const testUser = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/streak-test'),
      ],
      providers: [
        StreaksService,
        NotificationsService,
        {
          provide: NotificationsService,
          useFactory: () => ({
            sendStreakReminder: jest.fn().mockResolvedValue(undefined),
            sendEmail: jest.fn().mockResolvedValue(undefined),
          }),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    streaksService = moduleFixture.get<StreaksService>(StreaksService);
    notificationsService = moduleFixture.get<NotificationsService>(NotificationsService);
    userModel = moduleFixture.get<Model<UserDocument>>(getModelToken('User'));
  });

  afterAll(async () => {
    await userModel.deleteMany({ email: testUser.email });
    await mongoClient.close();
    await app.close();
  });

  beforeEach(async () => {
    await userModel.deleteMany({ email: testUser.email });
    jest.clearAllMocks();
  });

  describe('updateUserStreak', () => {
    it('should create a new streak for a user with no previous activity', async () => {
      const user = await userModel.create({
        ...testUser,
        learningStreak: 0,
        lastActiveDate: null,
      });

      await streaksService.updateUserStreak(user._id.toString());

      const updatedUser = await userModel.findById(user._id);
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.learningStreak).toBe(1);
      expect(updatedUser?.lastActiveDate).toBeDefined();
    });

    it('should increment streak if user was active yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const user = await userModel.create({
        ...testUser,
        learningStreak: 5,
        lastActiveDate: yesterdayStr,
      });

      await streaksService.updateUserStreak(user._id.toString());

      const updatedUser = await userModel.findById(user._id);
      expect(updatedUser?.learningStreak).toBe(6);
    });

    it('should reset streak to 1 if user was inactive for more than 1 day', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      const user = await userModel.create({
        ...testUser,
        learningStreak: 10,
        lastActiveDate: twoDaysAgoStr,
      });

      await streaksService.updateUserStreak(user._id.toString());

      const updatedUser = await userModel.findById(user._id);
      expect(updatedUser?.learningStreak).toBe(1);
    });

    it('should not update streak if user was already active today', async () => {
      const today = new Date().toISOString().split('T')[0];

      const user = await userModel.create({
        ...testUser,
        learningStreak: 3,
        lastActiveDate: today,
      });

      const originalStreak = user.learningStreak;
      await streaksService.updateUserStreak(user._id.toString());

      const updatedUser = await userModel.findById(user._id);
      expect(updatedUser?.learningStreak).toBe(originalStreak);
    });

    it('should handle non-existent user gracefully', async () => {
      const nonExistentId = new Types.ObjectId().toString();
      
      await expect(
        streaksService.updateUserStreak(nonExistentId),
      ).resolves.not.toThrow();
    });
  });

  describe('handleStreakResets', () => {
    it('should reset streak for users inactive for more than 1 day', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      await userModel.create({
        email: 'inactive@example.com',
        name: 'Inactive User',
        learningStreak: 7,
        lastActiveDate: twoDaysAgoStr,
      });

      await streaksService.handleStreakResets();

      const updatedUser = await userModel.findOne({ email: 'inactive@example.com' });
      expect(updatedUser?.learningStreak).toBe(0);
    });

    it('should not reset streak for users active yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      await userModel.create({
        email: 'active@example.com',
        name: 'Active User',
        learningStreak: 5,
        lastActiveDate: yesterdayStr,
      });

      await streaksService.handleStreakResets();

      const updatedUser = await userModel.findOne({ email: 'active@example.com' });
      expect(updatedUser?.learningStreak).toBe(5);
    });

    it('should not reset streak for users active today', async () => {
      const today = new Date().toISOString().split('T')[0];

      await userModel.create({
        email: 'today@example.com',
        name: 'Today User',
        learningStreak: 3,
        lastActiveDate: today,
      });

      await streaksService.handleStreakResets();

      const updatedUser = await userModel.findOne({ email: 'today@example.com' });
      expect(updatedUser?.learningStreak).toBe(3);
    });

    it('should not reset streak for users with zero streak', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      await userModel.create({
        email: 'zerostreak@example.com',
        name: 'Zero Streak User',
        learningStreak: 0,
        lastActiveDate: twoDaysAgoStr,
      });

      await streaksService.handleStreakResets();

      const updatedUser = await userModel.findOne({ email: 'zerostreak@example.com' });
      expect(updatedUser?.learningStreak).toBe(0);
    });
  });

  describe('sendStreakReminders', () => {
    it('should send reminder to users with streaks who were inactive today', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      await userModel.create({
        email: 'remind@example.com',
        name: 'Remind Me',
        learningStreak: 4,
        lastActiveDate: yesterdayStr,
      });

      await streaksService.sendStreakReminders();

      expect(notificationsService.sendStreakReminder).toHaveBeenCalledWith(
        'remind@example.com',
        'Remind Me',
        4,
      );
    });

    it('should not send reminder to users active today', async () => {
      const today = new Date().toISOString().split('T')[0];

      await userModel.create({
        email: 'active@example.com',
        name: 'Active Today',
        learningStreak: 5,
        lastActiveDate: today,
      });

      await streaksService.sendStreakReminders();

      expect(notificationsService.sendStreakReminder).not.toHaveBeenCalled();
    });

    it('should not send reminder to users without email', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      await userModel.create({
        name: 'No Email User',
        learningStreak: 3,
        lastActiveDate: yesterdayStr,
      });

      await streaksService.sendStreakReminders();

      expect(notificationsService.sendStreakReminder).not.toHaveBeenCalled();
    });

    it('should not send reminder to users with zero streak', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      await userModel.create({
        email: 'zerostreak@example.com',
        name: 'Zero Streak',
        learningStreak: 0,
        lastActiveDate: yesterdayStr,
      });

      await streaksService.sendStreakReminders();

      expect(notificationsService.sendStreakReminder).not.toHaveBeenCalled();
    });

    it('should send multiple reminders for multiple eligible users', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      await userModel.create([
        {
          email: 'user1@example.com',
          name: 'User One',
          learningStreak: 2,
          lastActiveDate: yesterdayStr,
        },
        {
          email: 'user2@example.com',
          name: 'User Two',
          learningStreak: 5,
          lastActiveDate: yesterdayStr,
        },
      ]);

      await streaksService.sendStreakReminders();

      expect(notificationsService.sendStreakReminder).toHaveBeenCalledTimes(2);
      expect(notificationsService.sendStreakReminder).toHaveBeenCalledWith(
        'user1@example.com',
        'User One',
        2,
      );
      expect(notificationsService.sendStreakReminder).toHaveBeenCalledWith(
        'user2@example.com',
        'User Two',
        5,
      );
    });
  });

  describe('date normalization', () => {
    it('should normalize valid dates correctly', () => {
      const date = new Date('2026-04-01T15:30:00Z');
      const normalized = (streaksService as any).normalize(date);
      expect(normalized).toBe('2026-04-01');
    });

    it('should return null for null input', () => {
      const normalized = (streaksService as any).normalize(null);
      expect(normalized).toBeNull();
    });

    it('should return null for undefined input', () => {
      const normalized = (streaksService as any).normalize(undefined);
      expect(normalized).toBeNull();
    });

    it('should return null for invalid dates', () => {
      const invalidDate = new Date('invalid');
      const normalized = (streaksService as any).normalize(invalidDate);
      expect(normalized).toBeNull();
    });
  });
});
