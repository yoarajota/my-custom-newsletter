import { updateSession } from '@lib/supabase/middleware'
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import i18nMiddleware from './i18n/middleware';

export async function middleware(request: NextRequest) {
  // return i18nRouter(request, i18nConfig);

  // return await updateSession(request)

  return i18nMiddleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
