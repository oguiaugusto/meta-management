import { prisma } from '../../../database/prisma';
import { UserRepositoryDTO } from './types';

class AuthRepository {
  public async createUser (data: UserRepositoryDTO) {
    return prisma.user.create({ data });
  }

  public async findUserByUsername (username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  public async findUserByEmail (email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}

export default AuthRepository;
