import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Admin login page is accessible by anyone — authentication and admin-role
 * enforcement is handled entirely by the API (JWT + role check).
 * Non-admins who successfully log in will see an "admin accounts only" error
 * from the login page UI itself.
 *
 * The previous ?key= URL secret was removed because query params are logged
 * by servers, stored in browser history, and shared in Referer headers —
 * making it weaker than having no guard at all.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/login'],
}
