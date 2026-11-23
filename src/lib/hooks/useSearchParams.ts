'use client'

import { usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation'

export function useSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useNextSearchParams()

  const update = (callback: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())

    callback(params)

    const nextQuery = params.toString()
    const currentQuery = searchParams.toString()

    if (nextQuery === currentQuery) {
      return
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    })
  }

  const get = (name: string) => {
    return searchParams.get(name)
  }

  const getAll = (name: string) => {
    return searchParams.getAll(name)
  }

  const set = (name: string, value: string) => {
    if (searchParams.get(name) === value) {
      return
    }

    update((params) => {
      params.set(name, value)
    })
  }

  const append = (name: string, value: string) => {
    update((params) => {
      params.append(name, value)
    })
  }

  const remove = (name: string) => {
    if (!searchParams.has(name)) {
      return
    }

    update((params) => {
      params.delete(name)
    })
  }

  const removeSpecific = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const values = params.getAll(name)

    if (!values.includes(value)) {
      return
    }

    params.delete(name)

    for (const currentValue of values) {
      if (currentValue !== value) {
        params.append(name, currentValue)
      }
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return {
    searchParams,
    get,
    getAll,
    update,
    set,
    append,
    remove,
    removeSpecific,
  }
}
