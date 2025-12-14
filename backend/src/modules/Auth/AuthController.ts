import z from 'zod';
import * as b from 'bcrypt';
import { v4 } from 'uuid';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AUTH } from '../../../../shared/constants/endpoints';
import { messageFormatters as m } from '../../shared/utils/messageFormatters';
import { ConflictError } from '../../shared/errors/ConflictError';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError';
import { BadRequestError } from '../../shared/errors/BadRequestError';
import { PasswordResetDTO, RefreshTokenDTO, UserRepositoryDTO } from './types';
import { MESSAGES } from '../../shared/constants/messages';
import { dayjsUtc } from '../../shared/utils/dayjsUtc';
import { sendPasswordResetEmail } from '../../shared/email/sendPasswordResetEmail';
import Endpoints from '../../shared/utils/Endpoint';
import AuthRepository from './AuthRepository';
import Token from './helpers/Token';

class AuthController {
  constructor(private repo: AuthRepository) {}

  public init() {
    Endpoints.route(this.register, 'post', AUTH.register);
    Endpoints.route(this.login, 'post', AUTH.login);
    Endpoints.route(this.refresh, 'post', AUTH.refresh);
    Endpoints.route(this.logout, 'post', AUTH.logout);
    Endpoints.route(this.forgotPassword, 'post', AUTH.forgotPassword);
    Endpoints.route(this.resetPassword, 'patch', AUTH.resetPassword);
  }

  private get schemas() {
    const keys = {
      name: z
        .string(m.required('Name'))
        .min(2, m.min('Name', 2))
        .max(50, m.max('Name', 50)),
      username: z
        .string(m.required('Username'))
        .min(5, m.min('Username', 5))
        .max(30, m.max('Username', 30)),
      email: z
        .email(m.email()),
      password: z
        .string(m.required('Password'))
        .min(6, m.min('Password', 6))
        .max(30, m.max('Password', 30)),
    };

    return {
      register: z.object({
        name: keys.name,
        username: keys.username,
        email: keys.email,
        password: keys.password,
      }),
      login: z.object({
        username: z
          .string()
          .min(5, m.min('Username/Email', 5))
          .max(254, m.max('Username/Email', 254)),
        password: keys.password,
      }),
      forgotPassword: z.object({
        email: z.email(m.email()),
        host: z.string(),
      }),
      resetPassword: z.object({
        token: z.string(),
        newPassword: z
          .string(m.required('Password'))
          .min(6, m.min('Password', 6))
          .max(30, m.max('Password', 30)),
      }),
    };
  }

  private register = async (req: Request, res: Response) => {
    const x = this.schemas.register.parse(req.body);

    const exUsername = await this.repo.findUserByUsername(x.username);
    if (exUsername) {
      throw new ConflictError(MESSAGES.uniqueUsername);
    }

    const exEmail = await this.repo.findUserByEmail(x.email);
    if (exEmail) {
      throw new ConflictError(MESSAGES.uniqueEmail);
    }

    const salt = await b.genSalt(11);
    const passwordHash = await b.hash(x.password, salt);

    const data: UserRepositoryDTO = {
      name: x.name,
      username: x.username,
      email: x.email,
      passwordHash,
    };

    await this.repo.createUser(data);
    res.status(StatusCodes.CREATED).send();
  };

  private login = async (req: Request, res: Response) => {
    const x = this.schemas.login.parse(req.body);

    const user = await this.repo.findUserByUsernameOrEmail(x.username);

    const passwordHash = user?.passwordHash || v4();
    const matchingPassword = await b.compare(x.password, passwordHash);

    if (!user || !matchingPassword) {
      throw new UnauthorizedError(MESSAGES.wrongCredentials);
    }

    const accessToken = await Token.signAccessToken(user.id);

    const refreshToken = Token.generateToken();
    const tokenHash = Token.hashToken(refreshToken);

    const refreshTokenDTO: RefreshTokenDTO = {
      tokenHash,
      userId: user.id,
      expiresAt: dayjsUtc.add(7, 'days').toISOString(),
    };

    await this.repo.createRefreshToken(refreshTokenDTO);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.status(StatusCodes.OK).json({ accessToken });
  };

  private refresh = async (req: Request, res: Response) => {
    const oldToken: string = req.cookies?.refreshToken;

    if (!oldToken) {
      throw new UnauthorizedError(MESSAGES.unauthorized);
    }

    const oldTokenHash = Token.hashToken(oldToken);
    const stored = await this.repo.findRefreshToken(oldTokenHash);

    if (!stored || dayjsUtc.isAfter(stored.expiresAt)) {
      throw new UnauthorizedError(MESSAGES.unauthorized);
    }

    const accessToken = await Token.signAccessToken(stored.userId);

    const refreshToken = Token.generateToken();
    const tokenHash = Token.hashToken(refreshToken);

    const refreshTokenDTO: RefreshTokenDTO = {
      tokenHash,
      userId: stored.userId,
      expiresAt: dayjsUtc.add(7, 'days').toISOString(),
    };

    await this.repo.createRefreshToken(refreshTokenDTO);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.status(StatusCodes.OK).json({ accessToken });
  };

  private logout = async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies?.refreshToken;

    if (refreshToken) {
      const tokenHash = Token.hashToken(refreshToken);
      await this.repo.deleteRefreshToken(tokenHash);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.status(StatusCodes.OK).send();
  };

  private forgotPassword = async (req: Request, res: Response) => {
    const x = this.schemas.forgotPassword.parse(req.body);

    const user = await this.repo.findUserByEmail(x.email);

    if (user) {
      const token = Token.generateToken();
      const data: PasswordResetDTO = {
        userId: user.id,
        tokenHash: Token.hashToken(token),
        expiresAt: dayjsUtc.add(30, 'minutes').toISOString(),
      };

      const link = `${x.host}${AUTH.resetPassword}/${token}`;

      await this.repo.createPasswordReset(data);
      await sendPasswordResetEmail(x.email, link);
    }

    res.status(StatusCodes.OK).json({ message: MESSAGES.sentPasswordReset });
  };

  private resetPassword = async (req: Request, res: Response) => {
    const x = this.schemas.resetPassword.parse(req.body);

    const tokenHash = Token.hashToken(x.token);
    const passwordReset = await this.repo.findPasswordReset(tokenHash);

    if (!passwordReset) {
      throw new BadRequestError(MESSAGES.invalidPasswordReset);
    }

    if (dayjsUtc.isAfter(passwordReset.expiresAt)) {
      throw new BadRequestError(MESSAGES.expiredPasswordReset);
    }

    const salt = await b.genSalt(11);
    const passwordHash = await b.hash(x.newPassword, salt);

    await this.repo.updateUser(passwordReset.userId, { passwordHash });
    await this.repo.deletePasswordReset(tokenHash);

    res.status(StatusCodes.OK).json({ message: MESSAGES.successPasswordReset })
  };
}

export default AuthController;
