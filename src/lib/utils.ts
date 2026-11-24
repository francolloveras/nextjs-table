import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args))
}

export const parse = {
  removeAccents(value: string) {
    const accents: Record<string, string> = {
      á: 'a',
      à: 'a',
      ä: 'a',
      â: 'a',
      ã: 'a',
      é: 'e',
      è: 'e',
      ë: 'e',
      ê: 'e',
      í: 'i',
      ì: 'i',
      ï: 'i',
      î: 'i',
      ó: 'o',
      ò: 'o',
      ö: 'o',
      ô: 'o',
      õ: 'o',
      ú: 'u',
      ù: 'u',
      ü: 'u',
      û: 'u',
    }

    return value.replace(/[áàäâãéèëêíìïîóòöôõúùüû]/g, (match) => accents[match])
  },

  toDate(date: string | undefined) {
    if (date === undefined || date === '') return undefined

    const [year, month, day] = date.split('-').map(Number)
    const newDate = new Date(year, month - 1, day)

    if (isNaN(newDate.getTime())) return undefined

    return newDate
  },

  toISOString(date: Date | undefined | null) {
    if (!date) return undefined

    return date.toISOString().split('T')[0]
  },

  parseCents(value: string) {
    const amount = Number(value)

    return Number.isFinite(amount) ? Math.round(amount * 100) : -1
  },

  formatCents(cents: number) {
    const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

    return currency.format(cents / 100)
  },
}
