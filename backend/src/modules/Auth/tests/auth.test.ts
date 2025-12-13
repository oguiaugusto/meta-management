import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Express, Router } from 'express';
import request from 'supertest';
import App from '../../../config/app';
import AuthRepository from '../AuthRepository';
import AuthController from '../AuthController';
import Endpoints from '../../../shared/utils/Endpoint';
import { AUTH } from '../../../shared/constants/endpoints';
import { mockRefreshToken, mockUser } from './data';
import { UserDTO } from '../types';
import { MESSAGES } from '../../../shared/constants/messages';

import * as b from 'bcrypt';
import Token from '../helpers/Token';
import { dayjsUtc } from '../../../shared/utils/dayjsUtc';
vi.mock('bcrypt', async () => {
  const actual = await vi.importActual<typeof import('bcrypt')>('bcrypt');

  return {
    ...actual,
    compare: vi.fn(),
  }
});

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
    findByUsernameOrEmail: vi.fn(),
    createRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
  };

  const authController = new AuthController(mockRepo);
  const mockApp = new App({ authController });

  const app = mockApp.app;
  const server = mockApp.start(1441);

  return [mockRepo, app, server] as [typeof mockRepo, typeof app, typeof server];
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

      it('should return 200 and access token if username/email and password are correct', async () => {
        mockRepo.findByUsernameOrEmail.mockResolvedValue(mockUser);
        mockRepo.createRefreshToken.mockResolvedValue(mockRefreshToken);
  
        vi.mocked(b.compare).mockResolvedValue(true as any);
  
        const data = { username: mockUser.email, password: 'valid_password' };
        const res = await request(app).post(AUTH.login).send(data);

        const accessToken = await Token.signAccessToken(mockUser.id)
  
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ accessToken });
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
        mockRepo.findByUsernameOrEmail.mockResolvedValue(null);

        vi.mocked(b.compare).mockResolvedValue(true as any);
  
        const data = { username: 'invalid_email', password: 'valid_password' };
        const res = await request(app).post(AUTH.login).send(data);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.wrongCredentials });
      });

      it('should return 401 and error message if password is incorrect', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(mockUser);
        mockRepo.findUserByEmail.mockResolvedValue(null);

        vi.mocked(b.compare).mockResolvedValue(false as any);
  
        const data = { username: mockUser.username, password: 'invalid_password' };
        const res = await request(app).post(AUTH.login).send(data);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.wrongCredentials });
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

      it('should return 200 and access token if refresh token exists and is not expired', async () => {
        mockRepo.findRefreshToken.mockResolvedValue(mockRefreshToken);
        mockRepo.createRefreshToken.mockResolvedValue(mockRefreshToken);

        const res = await request(app)
          .post(AUTH.refresh)
          .set('Cookie', `refreshToken=${mockRefreshToken.tokenHash}`);

        const accessToken = await Token.signAccessToken(mockRefreshToken.userId);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ accessToken });
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
      });

      it('should return 401 and error message if refresh token is not found', async () => {
        mockRepo.findRefreshToken.mockResolvedValue(null);

        const res = await request(app)
          .post(AUTH.refresh)
          .set('Cookie', 'refreshToken=invalid_refresh_token');

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: MESSAGES.unauthorized });
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
      });
    });
  });
});
