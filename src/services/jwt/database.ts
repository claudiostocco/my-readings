import { RefreshTokensStore, UsersStore } from "./types"
import { v4 as uuid } from 'uuid'

export const users: UsersStore = new Map()

export const tokens: RefreshTokensStore = new Map()

export function seedUserStore() {
  users.set('claudiostocco@gmail.com', {
    password: '123',
    permissions: ['full']
  })

  users.set('teste@teste.com', {
    password: '123456',
    permissions: ['list']
  })
}

export function createRefreshToken(email: string) {
  const currentUserTokens = tokens.get(email) ?? []
  const refreshToken = uuid()

  tokens.set(email, [...currentUserTokens, refreshToken])

  return refreshToken;
}

export function checkRefreshTokenIsValid(email: string, refreshToken: string) {
  const storedRefreshTokens = tokens.get(email) ?? []

  return storedRefreshTokens.some(token => token === refreshToken)
}

export function invalidateRefreshToken(email: string, refreshToken: string) {
  const storedRefreshTokens = tokens.get(email) ?? []

  tokens.set(email, storedRefreshTokens.filter(token => token !== refreshToken));
}