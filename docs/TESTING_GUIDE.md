# Testing Guide: Streak & Notification Feature

This guide explains how to test the newly added **streak tracking and notification system**.

## 📋 Overview

The feature includes:
- **Daily streak tracking** - Updates user streaks when they complete activities
- **Automatic streak reset** - Resets streaks at midnight for inactive users
- **Email reminders** - Sends streak reminder emails at 6 PM daily
- **Progress gamification** - Encourages daily learning

## 🧪 Running Tests

### Unit Tests

Run the streak service unit tests:

```bash
cd backend
npm run test -- streaks.service.spec.ts
```

**Expected output:**
```
 PASS  src/modules/streaks/streaks.service.spec.ts
  StreaksService
    constructor
      ✓ should be defined
      ✓ should have notificationsService injected
    normalize
      ✓ should normalize valid dates correctly
      ✓ should return null for null input
      ✓ should return null for undefined input
      ✓ should return null for invalid dates
      ✓ should handle Date objects with time components
      ✓ should handle dates at midnight
    handleStreakResets
      ✓ should be defined
      ✓ should be a cron job method
    sendStreakReminders
      ✓ should be defined
      ✓ should be a cron job method
    updateUserStreak
      ✓ should be defined
      ✓ should handle errors gracefully without throwing

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

### E2E Tests (Integration Tests)

**Prerequisites:**
- MongoDB running locally or MongoDB Atlas connection string
- Update `.env.test` with your MongoDB URI

Run e2e tests:

```bash
cd backend
npm run test:e2e
```

Or run specific e2e test files:

```bash
# Test streaks integration
jest --config ./test/jest-e2e.json test/streaks.e2e-spec.ts

# Test notifications integration  
jest --config ./test/jest-e2e.json test/notifications.e2e-spec.ts
```

## 📁 Test Files Created

### 1. Unit Tests
- **`src/modules/streaks/streaks.service.spec.ts`** - Tests for streak logic
  - Date normalization
  - Constructor injection
  - Error handling
  - Method existence checks

### 2. Integration Tests
- **`test/streaks.e2e-spec.ts`** - Full integration tests with MongoDB
  - `updateUserStreak` - Tests streak creation, increment, and reset
  - `handleStreakResets` - Tests daily streak reset logic
  - `sendStreakReminders` - Tests email reminder functionality

- **`test/notifications.e2e-spec.ts`** - Email notification tests
  - Email sending
  - Streak reminder formatting
  - Transporter initialization

### 3. Configuration Files
- **`.env.test`** - Test environment variables
- **`jest.config.json`** - Jest configuration for ESM module support

## 🔍 Manual Testing

### 1. Test Streak Update

```bash
# Start the backend server
cd backend
npm run start:dev
```

Then test the streak update by completing a chapter in the frontend, or directly via MongoDB:

```javascript
// In MongoDB Compass or shell
db.user.insertOne({
  email: "test@example.com",
  name: "Test User",
  learningStreak: 0,
  lastActiveDate: null,
  createdAt: new Date()
})

// After calling updateUserStreak, check:
db.user.findOne({ email: "test@example.com" })
// Should show: learningStreak: 1, lastActiveDate: "YYYY-MM-DD"
```

### 2. Test Streak Reset (Cron Job)

The streak reset runs automatically at **midnight** every day. To test manually:

```javascript
// Setup: Create a user inactive for 2+ days
db.user.insertOne({
  email: "inactive@example.com",
  name: "Inactive User",
  learningStreak: 7,
  lastActiveDate: "2026-03-30", // 2 days ago
  createdAt: new Date()
})

// The cron job will reset this to 0 at midnight
```

### 3. Test Email Reminders

The reminder runs at **6:00 PM** daily. Configure SMTP in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="SkillTracker" <noreply@skilltracker.ai>
```

Users with active streaks who haven't been active today will receive an email.

## 📊 Test Coverage

Run with coverage:

```bash
npm run test:cov -- streaks.service.spec.ts
```

View the coverage report in `coverage/index.html`.

## 🐛 Troubleshooting

### Issue: "Cannot find module '../../auth/auth.service.js'"

**Solution:** The Jest config includes `moduleNameMapper` to handle `.js` extensions. Make sure you're using the updated `jest.config.json`.

### Issue: "Jest encountered an unexpected token"

**Solution:** This happens with ESM packages like `better-auth`. The test mocks the auth service to avoid this issue.

### Issue: E2E tests fail with MongoDB connection error

**Solution:** 
1. Ensure MongoDB is running: `mongod --dbpath /path/to/data`
2. Update `.env.test` with correct `MONGODB_URI`
3. Use a test database name (e.g., `skill-tracker-test`)

## 📝 Test Data Examples

### User with Active Streak
```json
{
  "email": "active@example.com",
  "name": "Active Learner",
  "learningStreak": 5,
  "lastActiveDate": "2026-04-01",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### User Expiring Streak (Needs Reminder)
```json
{
  "email": "expiring@example.com",
  "name": "Almost Lost It",
  "learningStreak": 10,
  "lastActiveDate": "2026-03-31", // Yesterday
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### User with Reset Streak
```json
{
  "email": "reset@example.com",
  "name": "Came Back",
  "learningStreak": 0, // Was reset
  "lastActiveDate": "2026-03-30", // 2+ days ago
  "createdAt": "2026-01-01T00:00:00Z"
}
```

## 🎯 Key Test Scenarios

| Scenario | Expected Behavior |
|----------|------------------|
| User completes chapter first time | Streak = 1 |
| User completes chapter after yesterday | Streak increments |
| User completes chapter after 2+ days | Streak resets to 1 |
| User completes chapter same day | No change |
| Midnight cron runs for inactive users | Streak reset to 0 |
| 6 PM reminder for eligible users | Email sent |

## 📚 Additional Resources

- [NestJS Testing Documentation](https://docs.nestjs.com/techniques/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MongoDB Testing Best Practices](https://www.mongodb.com/docs/manual/tutorial/manage-testing-and-development-environments/)
