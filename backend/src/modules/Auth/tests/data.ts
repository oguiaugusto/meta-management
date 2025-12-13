import { PasswordReset, RefreshToken, User } from '../../../../generated/prisma/client';

export const mockUser: User = {
  id: 'uuid',
  email: 'email@example.com',
  username: 'johndoe',
  name: 'John Doe',
  passwordHash: 'passwordhash',
  isAdmin: false,
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockRefreshToken: RefreshToken = {
  id: 'uuid',
  userId: mockUser.id,
  tokenHash: 'token-hash',
  createdAt: new Date(),
  expiresAt: new Date(),
};

export const mockPasswordReset: PasswordReset = {
  id: 'uuid',
  userId: mockUser.id,
  tokenHash: 'token-hash',
  createdAt: new Date(),
  expiresAt: new Date(),
};
