"use server"

import { getLocale } from "next-intl/server"

export const getWithLocaleURL = async (path: string) => {
  const locale = await getLocale()

  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"

  url = url.startsWith("http") ? url : `https://${url}`

  url = url.endsWith("/") ? url : `${url}/`

  url += locale + "/"

  if (path) {
    url += path + "/"
  }

  return url
}

export const getApiURL = (path: string) => {
  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"

  url = url.startsWith("http") ? url : `https://${url}`

  url = url.endsWith("/") ? url : `${url}/`

  url = url + "api/"

  if (path) {
    url += path
  }

  return url
}
