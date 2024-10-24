import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@lib/supabase/middleware"
import i18nMiddleware from "./i18n/middleware"

export async function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const origin = url.origin
  const pathname = url.pathname
  request.headers.set("x-url", request.url)
  request.headers.set("x-origin", origin)
  request.headers.set("x-pathname", pathname)

  const combinedResponse = NextResponse.next()

  const originalCookies = new Map<string, string>()
  const originalHeaders = new Map<string, string>()

  combinedResponse.cookies.getAll().forEach(({ name, value }) => {
    originalCookies.set(name, value)
  })
  combinedResponse.headers.forEach((value, key) => {
    originalHeaders.set(key, value)
  })

  const i18nResponse = i18nMiddleware(request)

  // console accept-language header
  console.log(request.headers.get("accept-language"))

  if (i18nResponse) {
    if (
      i18nResponse.status === 302 ||
      i18nResponse.status === 301 ||
      i18nResponse.status === 307 ||
      i18nResponse.status === 308
    ) {
      return i18nResponse
    }

    i18nResponse.cookies.getAll().forEach(({ name, value }) => {
      combinedResponse.cookies.set(name, value)
      originalCookies.set(name, value)
    })

    i18nResponse.headers.forEach((value, key) => {
      combinedResponse.headers.set(key, value)
      originalHeaders.set(key, value)
    })
  }

  const updatedSessionResponse = await updateSession(request)

  if (updatedSessionResponse) {
    if (
      updatedSessionResponse.status === 302 ||
      updatedSessionResponse.status === 301 ||
      updatedSessionResponse.status === 307 ||
      updatedSessionResponse.status === 308
    ) {
      return updatedSessionResponse
    }

    updatedSessionResponse.cookies.getAll().forEach(({ name, value }) => {
      if (!originalCookies.has(name) || originalCookies.get(name) !== value) {
        combinedResponse.cookies.set(name, value)
      }
    })
    updatedSessionResponse.headers.forEach((value, key) => {
      if (
        key !== "x-middleware-override-headers" &&
        (!originalHeaders.has(key) || originalHeaders.get(key) !== value)
      ) {
        combinedResponse.headers.set(key, value)
      }
    })
  }

  return combinedResponse
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
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)",
  ],
}
