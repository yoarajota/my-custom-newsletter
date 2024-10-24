import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
const locales = ["en", "pt-BR"]

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  const [common] = await Promise.all([import(`dictionaries/${locale}/common.json`)])

  const messages = {
    common: common.default,
  }

  return {
    messages,
  }
})
