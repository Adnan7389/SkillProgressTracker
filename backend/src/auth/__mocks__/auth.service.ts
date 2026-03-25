// Mock mongoClient from auth service
export const mongoClient = {
  db: jest.fn().mockReturnValue({
    collection: jest.fn(),
  }),
};

export const auth = jest.fn();
export const authOptions = jest.fn();
