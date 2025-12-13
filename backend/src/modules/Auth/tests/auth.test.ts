import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Express, Router } from 'express';
import request, { Response } from 'supertest';
import App from '../../../config/app';
import AuthRepository from '../AuthRepository';
import AuthController from '../AuthController';
import Endpoints from '../../../shared/utils/Endpoint';
import { AUTH } from '../../../shared/constants/endpoints';
import { mockPasswordReset, mockRefreshToken, mockUser } from './data';
import { UserDTO } from '../types';
import { MESSAGES } from '../../../shared/constants/messages';
import { dayjsUtc } from '../../../shared/utils/dayjsUtc';
import Token from '../helpers/Token';

import * as b from 'bcrypt';
import { sendEmail } from '../../../shared/email/sendEmail';

vi.mock('bcrypt', async () => {
  const actual = await vi.importActual<typeof import('bcrypt')>('bcrypt');

  return {
    ...actual,
    compare: vi.fn(),
  }
});

vi.mock('../../../shared/email/sendEmail.ts', () => ({
  sendEmail: vi.fn(),
}));

let baseUserTest: UserDTO = {
  username: 'usernametest',
  name: 'Name Test',
  email: 'test@test.com',
  password: 'passwordtest',
};

const beforeCallback = () => {
  Endpoints.router = Router();

  const mockRepo: Record<keyof AuthRepository, any> = {
    createUser: vi.fn(),
    findUserByUsername: vi.fn(),
    findUserByEmail: vi.fn(),
    findUserByUsernameOrEmail: vi.fn(),
    createRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    deleteRefreshToken: vi.fn(),
    createPasswordReset: vi.fn(),
  };

  const authController = new AuthController(mockRepo);
  const mockApp = new App({ authController });

  const app = mockApp.app;
  const server = mockApp.start(1441);

  return [mockRepo, app, server] as [typeof mockRepo, typeof app, typeof server];
};

const expectRefreshToken = (res: Response) => {
  expect(res.headers['set-cookie'][0]).toContain('refreshToken=');
  expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
  expect(res.headers['set-cookie'][0]).toContain('SameSite=Lax');
};

const expectRefreshTokenCleared = (res: Response) => {
  expect(res.headers['set-cookie'][0]).toContain('refreshToken=;');
  expect(res.headers['set-cookie'][0]).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
};

describe('Auth Endpoints', () => {
  let app: Express;
  let server: ReturnType<InstanceType<typeof App>['start']>;

  let mockRepo: Record<keyof AuthRepository, ReturnType<typeof vi.fn>>;

  describe(`POST ${AUTH.register}`, () => {
    describe('on success', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
      });
      
      afterEach(() => { 
        server.close();
      });

      it('should return 201 and no content', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(null);
        mockRepo.findUserByEmail.mockResolvedValue(null);
        mockRepo.createUser.mockResolvedValue(mockUser);

        const data = { ...baseUserTest };
        const res = await request(app).post(AUTH.register).send(data);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({});
      });
    });

    describe('on fail', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
      });
      
      afterEach(() => { 
        server.close();
      });
  
      it('should return 409 and an error message if username already exists', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(mockUser);
  
        const data = { ...baseUserTest, username: mockUser.username };
        const res = await request(app).post(AUTH.register).send(data);
  
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: MESSAGES.uniqueUsername });
      });
  
      it('should return 409 and an error message if email already exists', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(null);
        mockRepo.findUserByEmail.mockResolvedValue(mockUser);

        const data = { ...baseUserTest, email: mockUser.email };
        const res = await request(app).post(AUTH.register).send(data);
  
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: MESSAGES.uniqueEmail });
      });
    });
  });

  describe(`POST ${AUTH.login}`, () => {
    describe('on success', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
      });
      
      afterEach(() => { 
        server.close();
      });

      it('should return 200, access token, and refresh token if username/email and password are correct', async () => {
        mockRepo.findUserByUsernameOrEmail.mockResolvedValue(mockUser);
        mockRepo.createRefreshToken.mockResolvedValue(mockRefreshToken);
  
        vi.mocked(b.compare).mockResolvedValue(true as any);
  
        const data = { username: mockUser.email, password: 'valid_password' };
        const res = await request(app).post(AUTH.login).send(data);

        const accessToken = await Token.signAccessToken(mockUser.id)
  
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ accessToken });

        expectRefreshToken(res);
      });
    });

    describe('on fail', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
      });
      
      afterEach(() => { 
        server.close();
      });

      it('should return 401 and error message if username/email is incorrect', async () => {
        mockRepo.findUserByUsernameOrEmail.mockResolvedValue(null);

        vi.mocked(b.compare).mockResolvedValue(true as any);
  
        const data = { username: 'invalid_email', password: 'valid_password' };
        const res = await request(app).post(AUTH.login).send(data);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.wrongCredentials });

        expectRefreshTokenCleared(res);
      });

      it('should return 401 and error message if password is incorrect', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(mockUser);
        mockRepo.findUserByEmail.mockResolvedValue(null);

        vi.mocked(b.compare).mockResolvedValue(false as any);
  
        const data = { username: mockUser.username, password: 'invalid_password' };
        const res = await request(app).post(AUTH.login).send(data);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.wrongCredentials });

        expectRefreshTokenCleared(res);
      });
    });
  });

  describe(`POST ${AUTH.refresh}`, () => {
    describe('on success', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
      });
      
      afterEach(() => { 
        server.close();
      });

      it('should return 200, access token, and a new refresh token if the old one exists and is not expired', async () => {
        mockRepo.findRefreshToken.mockResolvedValue(mockRefreshToken);
        mockRepo.createRefreshToken.mockResolvedValue(mockRefreshToken);

        const res = await request(app)
          .post(AUTH.refresh)
          .set('Cookie', `refreshToken=${mockRefreshToken.tokenHash}`);

        const accessToken = await Token.signAccessToken(mockRefreshToken.userId);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ accessToken });

        expectRefreshToken(res);
      });
    });

    describe('on fail', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
      });
      
      afterEach(() => { 
        server.close();
      });

      it('should return 401 and error message if refresh token is not sent', async () => {
        const res = await request(app).post(AUTH.refresh);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.unauthorized });

        expectRefreshTokenCleared(res);
      });

      it('should return 401 and error message if refresh token is not found', async () => {
        mockRepo.findRefreshToken.mockResolvedValue(null);

        const res = await request(app)
          .post(AUTH.refresh)
          .set('Cookie', 'refreshToken=invalid_refresh_token');

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.unauthorized });

        expectRefreshTokenCleared(res);
      });

      it('should return 401 and error message if refresh token is expired', async () => {
        const mock: typeof mockRefreshToken = {
          ...mockRefreshToken,
          expiresAt: dayjsUtc.subtract(1, 'day').toDate(),
        };
        mockRepo.findRefreshToken.mockResolvedValue(mock);

        const res = await request(app)
          .post(AUTH.refresh)
          .set('Cookie', 'refreshToken=expired_refresh_token');

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.unauthorized });

        expectRefreshTokenCleared(res);
      });
    });
  });

  describe(`POST ${AUTH.logout}`, () => {
    describe('on success', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
        vi.clearAllMocks();
      });
      
      afterEach(() => { 
        server.close();
      });

      it('should return 200 and clear refresh token', async () => {
        const res = await request(app)
          .post(AUTH.logout)
          .set('Cookie', `refreshToken=${mockRefreshToken.tokenHash}`);

        expect(res.status).toBe(200);
        expect(mockRepo.deleteRefreshToken).toHaveBeenCalled();

        expectRefreshTokenCleared(res);
      });

      it('should return 200 and clear refresh token regardless if invalid or inexistent', async () => {
        const res = await request(app).post(AUTH.logout)

        expect(res.status).toBe(200);
        expect(mockRepo.deleteRefreshToken).not.toHaveBeenCalled();

        expectRefreshTokenCleared(res);
      });
    });
  });

  describe(`POST ${AUTH.forgotPassword}`, () => {
    describe('on success', () => {
      beforeEach(() => { 
        [mockRepo, app, server] = beforeCallback();
        vi.clearAllMocks();
      });
      
      afterEach(() => { 
        server.close();
      });

      it('should return 200 and success message', async () => {
        mockRepo.findUserByEmail.mockResolvedValue(mockUser);
        mockRepo.createPasswordReset.mockResolvedValue(mockPasswordReset);

        const data = { host: 'http://localhost:3000', email: mockUser.email };
        const res = await request(app).post(AUTH.forgotPassword).send(data);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: MESSAGES.sentPasswordReset });

        expect(sendEmail).toHaveBeenCalled();
      });

      it('should return 200 and success message regardless if user exists', async () => {
        mockRepo.findUserByEmail.mockResolvedValue(null);

        const data = { host: 'http://localhost:3000', email: 'invalid@email.com' };
        const res = await request(app).post(AUTH.forgotPassword).send(data);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: MESSAGES.sentPasswordReset });

        expect(sendEmail).not.toHaveBeenCalled();
      });
    });
  });
});
