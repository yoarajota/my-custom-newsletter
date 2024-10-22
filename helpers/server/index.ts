"use server"

import { getLocale } from "next-intl/server"
import env from "env.mjs"

export const getWithLocaleURL = async (path: string) => {
  const locale = await getLocale()

  let url = env?.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  url = url.startsWith("http") ? url : `https://${url}`

  url = url.endsWith("/") ? url : `${url}/`

  url += locale + "/"

  if (path) {
    url += path + "/"
  }

  return url
}

export const getApiURL = (path: string) => {
  let url = env?.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  url = url.startsWith("http") ? url : `https://${url}`

  url = url.endsWith("/") ? url : `${url}/`

  url = url + "api/"

  if (path) {
    url += path
  }

  return url
}
