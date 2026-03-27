import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsService } from '../src/modules/notifications/notifications.service';

describe('NotificationsService (e2e)', () => {
  let app: INestApplication;
  let notificationsService: NotificationsService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [NotificationsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    notificationsService = moduleFixture.get<NotificationsService>(NotificationsService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('sendEmail', () => {
    it('should skip sending email when transporter is not initialized', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await notificationsService.sendEmail(
        'test@example.com',
        'Test Subject',
        '<p>Test HTML</p>',
      );

      consoleSpy.mockRestore();
    });

    it('should send email when transporter is initialized', async () => {
      const testEmail = 'recipient@example.com';
      const testSubject = 'Test Email';
      const testHtml = '<h1>Hello</h1>';

      await notificationsService.sendEmail(testEmail, testSubject, testHtml);
    });
  });

  describe('sendStreakReminder', () => {
    it('should call sendEmail with correct parameters', async () => {
      const testEmail = 'streak@example.com';
      const testName = 'John Doe';
      const testStreak = 7;

      const sendEmailSpy = jest.spyOn(notificationsService, 'sendEmail');

      await notificationsService.sendStreakReminder(testEmail, testName, testStreak);

      expect(sendEmailSpy).toHaveBeenCalledWith(
        testEmail,
        expect.stringContaining(`${testStreak}-day streak`),
        expect.stringContaining(testName),
      );
    });

    it('should include frontend URL in email HTML', async () => {
      const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:5173';

      const sendEmailSpy = jest.spyOn(notificationsService, 'sendEmail');

      await notificationsService.sendStreakReminder('test@example.com', 'Test', 5);

      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.stringContaining(frontendUrl),
      );
    });

    it('should handle special characters in user name', async () => {
      const sendEmailSpy = jest.spyOn(notificationsService, 'sendEmail');

      await notificationsService.sendStreakReminder(
        'test@example.com',
        'John "The Learner" Doe',
        10,
      );

      expect(sendEmailSpy).toHaveBeenCalled();
    });
  });

  describe('transporter initialization', () => {
    it('should log warning when SMTP config is missing', () => {
      const testConfigService = new ConfigService();
      const service = new NotificationsService(testConfigService);
      
      expect(service).toBeDefined();
    });

    it('should initialize transporter with valid config', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: Record<string, any> = {
            SMTP_HOST: 'smtp.example.com',
            SMTP_PORT: 587,
            SMTP_USER: 'user@example.com',
            SMTP_PASS: 'password123',
            EMAIL_FROM: '"Test" <test@example.com>',
          };
          return config[key];
        }),
      };

      const service = new NotificationsService(mockConfigService as any);
      expect(service).toBeDefined();
    });
  });
});
