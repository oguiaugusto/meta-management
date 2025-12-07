import { User } from '../../../../generated/prisma/client';

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
