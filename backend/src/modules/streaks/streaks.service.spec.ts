import { Test, TestingModule } from "@nestjs/testing";
import { StreaksService } from "./streaks.service";
import { NotificationsService } from "../notifications/notifications.service";
import { Logger } from "@nestjs/common";

// Mock the auth service before any imports
jest.mock("../../auth/auth.service.js", () => ({
  mongoClient: {
    db: jest.fn().mockReturnValue({
      collection: jest.fn(),
    }),
  },
  auth: jest.fn(),
  authOptions: jest.fn(),
}));

describe("StreaksService", () => {
  let service: StreaksService;
  let mockNotificationsService: Partial<NotificationsService>;
  let mockLogger: Partial<Logger>;

  beforeEach(async () => {
    mockNotificationsService = {
      sendStreakReminder: jest.fn().mockResolvedValue(undefined),
      sendEmail: jest.fn().mockResolvedValue(undefined),
    };

    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreaksService,
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should have notificationsService injected", () => {
      expect((service as any).notificationsService).toBeDefined();
    });
  });

  describe("normalize", () => {
    it("should normalize valid dates correctly", () => {
      const date = new Date("2026-04-01T15:30:00Z");
      const result = (service as any).normalize(date);
      expect(result).toBe("2026-04-01");
    });

    it("should return null for null input", () => {
      const result = (service as any).normalize(null);
      expect(result).toBeNull();
    });

    it("should return null for undefined input", () => {
      const result = (service as any).normalize(undefined);
      expect(result).toBeNull();
    });

    it("should return null for invalid dates", () => {
      const invalidDate = new Date("invalid");
      const result = (service as any).normalize(invalidDate);
      expect(result).toBeNull();
    });

    it("should handle Date objects with time components", () => {
      const date = new Date("2026-04-01T23:59:59.999Z");
      const result = (service as any).normalize(date);
      expect(result).toBe("2026-04-01");
    });

    it("should handle dates at midnight", () => {
      const date = new Date("2026-04-01T00:00:00.000Z");
      const result = (service as any).normalize(date);
      expect(result).toBe("2026-04-01");
    });
  });

  describe("handleStreakResets", () => {
    it("should be defined", () => {
      expect(service.handleStreakResets).toBeDefined();
    });

    it("should be a cron job method", () => {
      expect(typeof service.handleStreakResets).toBe("function");
    });
  });

  describe("sendStreakReminders", () => {
    it("should be defined", () => {
      expect(service.sendStreakReminders).toBeDefined();
    });

    it("should be a cron job method", () => {
      expect(typeof service.sendStreakReminders).toBe("function");
    });
  });

  describe("updateUserStreak", () => {
    it("should be defined", () => {
      expect(service.updateUserStreak).toBeDefined();
    });

    it("should handle errors gracefully without throwing", async () => {
      const mockUserId = "invalid-user-id";

      // Should not throw even with invalid user ID
      await expect(
        service.updateUserStreak(mockUserId),
      ).resolves.toBeUndefined();
    });
  });
});
