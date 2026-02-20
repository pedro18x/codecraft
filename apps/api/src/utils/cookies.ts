import type { CookieOptions, Response } from 'express'
import { env } from '../config/env.js'
import { parseDurationToMs } from './duration.js'

export const ACCESS_COOKIE_NAME = 'access_token'
export const REFRESH_COOKIE_NAME = 'refresh_token'

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/',
    ...(env.AUTH_COOKIE_DOMAIN ? { domain: env.AUTH_COOKIE_DOMAIN } : {}),
  }
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    ...baseCookieOptions(),
    maxAge: parseDurationToMs(env.JWT_ACCESS_EXPIRES_IN),
  })
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
  })
}

export function clearAuthCookies(res: Response) {
  const options = baseCookieOptions()
  res.clearCookie(ACCESS_COOKIE_NAME, options)
  res.clearCookie(REFRESH_COOKIE_NAME, options)
}

export function setCsrfCookie(res: Response, csrfToken: string) {
  res.cookie(env.CSRF_COOKIE_NAME, csrfToken, {
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/',
    httpOnly: false,
    ...(env.AUTH_COOKIE_DOMAIN ? { domain: env.AUTH_COOKIE_DOMAIN } : {}),
  })
}
