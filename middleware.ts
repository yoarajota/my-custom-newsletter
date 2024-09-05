import { updateSession } from "@lib/supabase/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import i18nMiddleware, { locales } from "./i18n/middleware"

export async function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const origin = url.origin
  const pathname = url.pathname
  request.headers.set("x-url", request.url)
  request.headers.set("x-origin", origin)
  request.headers.set("x-pathname", pathname)

  // Cria uma nova resposta combinada
  const combinedResponse = NextResponse.next()

  // Objetos para rastrear cookies e cabeçalhos originais
  const originalCookies = new Map<string, string>()
  const originalHeaders = new Map<string, string>()

  // Armazena os valores originais de cookies e cabeçalhos
  combinedResponse.cookies.getAll().forEach(({ name, value }) => {
    originalCookies.set(name, value)
  })
  combinedResponse.headers.forEach((value, key) => {
    originalHeaders.set(key, value)
  })

  // Executa o middleware de internacionalização
  const i18nResponse = i18nMiddleware(request)
  if (i18nResponse) {
    // Copia os cookies de i18nResponse
    i18nResponse.cookies.getAll().forEach(({ name, value, options }) => {
      combinedResponse.cookies.set(name, value, options)
      originalCookies.set(name, value) // Marca os cookies do i18nMiddleware como originais
    })

    // Copia os cabeçalhos de i18nResponse
    i18nResponse.headers.forEach((value, key) => {
      combinedResponse.headers.set(key, value)
      originalHeaders.set(key, value) // Marca os cabeçalhos do i18nMiddleware como originais
    })
  }

  // Executa o middleware de atualização de sessão
  const updatedSessionResponse = await updateSession(request)

  if (updatedSessionResponse) {
    // Se updatedSessionResponse for um redirecionamento, retorne-o diretamente
    if (
      updatedSessionResponse.status === 302 ||
      updatedSessionResponse.status === 301 ||
      updatedSessionResponse.status === 307 ||
      updatedSessionResponse.status === 308
    ) {
      return updatedSessionResponse
    }

    // Copia os cookies de updatedSessionResponse, sem sobrescrever os cookies do i18nMiddleware
    updatedSessionResponse.cookies.getAll().forEach(({ name, value, options }) => {
      if (!originalCookies.has(name) || originalCookies.get(name) !== value) {
        combinedResponse.cookies.set(name, value, options)
      }
    })
    // Copia os cabeçalhos de updatedSessionResponse, sem sobrescrever os cabeçalhos do i18nMiddleware
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
