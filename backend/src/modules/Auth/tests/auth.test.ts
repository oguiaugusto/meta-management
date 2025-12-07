import { Express, Router } from 'express';
import request from 'supertest';
import App from '../../../config/app';
import AuthRepository from '.././AuthRepository';
import AuthController from '../AuthController';
import Endpoints from '../../../shared/utils/Endpoint';
import { AUTH } from '../../../shared/constants/endpoints';
import { mockUser } from './data';
import { UserDTO } from '../types';
import { MESSAGES } from '../../../shared/constants/messages';

let baseUserTest: UserDTO = {
  username: 'usernametest',
  name: 'Name Test',
  email: 'test@test.com',
  password: 'passwordtest',
};

const beforeCallback = () => {
  Endpoints.router = Router();

  const mockRepo = {
    createUser: jest.fn(),
    findUserByUsername: jest.fn(),
    findUserByEmail: jest.fn(),
  };

  const authController = new AuthController(mockRepo);
  const mockApp = new App({ authController });

  const app = mockApp.app;
  const server = mockApp.start(1441);

  const userDTO = { ...baseUserTest };

  return [mockRepo, app, server, userDTO] as [typeof mockRepo, typeof app, typeof server, typeof userDTO];
};

describe('Auth Endpoints', () => {
  let app: Express;
  let server: ReturnType<InstanceType<typeof App>['start']>;

  let mockRepo: jest.Mocked<AuthRepository>;
  let userDTO: UserDTO;

  describe(`POST ${AUTH.register}`, () => {
    describe('on success', () => {
      beforeEach(() => { [mockRepo, app, server, userDTO] = beforeCallback(); });
      afterEach(() => { server.close(); });

      it('should return 201 and no content', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(null);
        mockRepo.findUserByEmail.mockResolvedValue(null);
        mockRepo.createUser.mockResolvedValue(mockUser);

        const res = await request(app).post(AUTH.register).send(userDTO);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({});
      });
    });

    describe('on fail', () => {
      beforeEach(() => { [mockRepo, app, server, userDTO] = beforeCallback(); });
      afterEach(() => { server.close(); });
  
      it('should return 409 and an error message if username already exists', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(mockUser);
  
        userDTO.username = mockUser.username;
        const res = await request(app).post(AUTH.register).send(userDTO);
  
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: MESSAGES.uniqueUsername });
      });
  
      it('should return 409 and an error message if email already exists', async () => {
        mockRepo.findUserByUsername.mockResolvedValue(null);
        mockRepo.findUserByEmail.mockResolvedValue(mockUser);
  
        userDTO.email = mockUser.email;
        const res = await request(app).post(AUTH.register).send(userDTO);
  
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: MESSAGES.uniqueEmail });
      });
    });
  });
});
