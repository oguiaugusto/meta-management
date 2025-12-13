import { PasswordReset, RefreshToken, User } from '../../../../generated/prisma/client';
import { dayjsUtc } from '../../../shared/utils/dayjsUtc';

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
  expiresAt: dayjsUtc.add(7, 'days').toDate(),
};

export const mockPasswordReset: PasswordReset = {
  id: 'uuid',
  userId: mockUser.id,
  tokenHash: 'token-hash',
  createdAt: new Date(),
  expiresAt: dayjsUtc.add(30, 'minutes').toDate(),
};
