import { prisma } from '../../../database/prisma';
import { PasswordResetDTO, RefreshTokenDTO, UserRepositoryDTO } from './types';

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

  public async findUserByUsernameOrEmail(value: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { email: value },
          { username: value },
        ],
      },
    });
  }

  public async createRefreshToken (data: RefreshTokenDTO) {
    await prisma.$transaction([
      prisma.refreshToken.deleteMany({ where: { userId: data.userId } }),
      prisma.refreshToken.create({ data }),
    ]);
  }

  public async findRefreshToken (tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  public async deleteRefreshToken (tokenHash: string) {
    await prisma.refreshToken.deleteMany({ where: { tokenHash } });
  }

  public async createPasswordReset (data: PasswordResetDTO) {
    await prisma.$transaction([
      prisma.passwordReset.deleteMany({ where: { userId: data.userId } }),
      prisma.passwordReset.create({ data }),
    ]);
  }

  public async findPasswordReset (tokenHash: string) {
    return prisma.passwordReset.findUnique({ where: { tokenHash } });
  }

  public async deletePasswordReset (tokenHash: string) {
    await prisma.passwordReset.deleteMany({ where: { tokenHash } });
  }
}

export default AuthRepository;
