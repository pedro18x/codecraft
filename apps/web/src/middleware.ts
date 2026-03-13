import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_portal'
const COOKIE_MAX_AGE = 60 * 60 // 1 hour

export function middleware(request: NextRequest) {
  const secret = process.env.ADMIN_LOGIN_SECRET
  const { searchParams, pathname } = request.nextUrl

  const keyParam = searchParams.get('key')
  const portalCookie = request.cookies.get(COOKIE_NAME)?.value

  // Valid if the URL carries the correct key OR the portal cookie is set
  const hasValidKey = secret && keyParam === secret
  const hasValidCookie = secret && portalCookie === '1'

  if (!hasValidKey && !hasValidCookie) {
    // Page simply doesn't exist without authorization
    return NextResponse.redirect(new URL('/404', request.url))
  }

  if (hasValidKey) {
    // Strip the key from the URL so it doesn't linger in browser history
    const cleanUrl = new URL(pathname, request.url)
    searchParams.forEach((value, key) => {
      if (key !== 'key') cleanUrl.searchParams.set(key, value)
    })
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.set(COOKIE_NAME, '1', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/admin/login',
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/login'],
}
