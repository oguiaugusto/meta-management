export type UserDTO = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type UserRepositoryDTO = Omit<UserDTO, 'password'> & {
  passwordHash: string;
}

export type RefreshTokenDTO = {
  userId: string;
  tokenHash: string;
  expiresAt: string;
};
