import { prisma } from '../../../database/prisma';
import { RefreshTokenDTO, UserRepositoryDTO } from './types';

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

  public async createRefreshToken (data: RefreshTokenDTO) {
    await prisma.$transaction([
      prisma.refreshToken.deleteMany({ where: { userId: data.userId } }),
      prisma.refreshToken.create({ data }),
    ]);
  }

  public async findRefreshToken (tokenHash: string) {
    return prisma.refreshToken.findFirst({ where: { tokenHash } });
  }
}

export default AuthRepository;
