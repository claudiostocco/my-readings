export type CreateSessionDTO = {
  username?: string;
  email: string;
  password: string;
}

type UserData = {
  password: string;
  permissions: string[];
}

export type UsersStore = Map<string, UserData>

export type RefreshTokensStore = Map<string, string[]>

export type DecodedToken = {
  sub: string;
}