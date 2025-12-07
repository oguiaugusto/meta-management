import z from 'zod';
import * as b from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AUTH } from '../../shared/constants/endpoints';
import { messageFormatters as m } from '../../shared/utils/messageFormatters';
import { ConflictError } from '../../shared/errors/ConflictError';
import { UserRepositoryDTO } from './types';
import Endpoints from '../../shared/utils/Endpoint';
import AuthRepository from './AuthRepository';
import { MESSAGES } from '../../shared/constants/messages';

class AuthController {
  constructor(private repo: AuthRepository) {}

  public init() {
    Endpoints.route(this.register, 'post', AUTH.register);
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
}

export default AuthController;
