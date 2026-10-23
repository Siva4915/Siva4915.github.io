import { useEffect, useState } from 'react'

export interface Route {
  hash: string
  path: string
  segments: string[]
  query: URLSearchParams
}

const parse = (): Route => {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [pathPart, queryPart = ''] = raw.split('?')
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`
  return {
    hash: raw,
    path,
    segments: path.split('/').filter(Boolean),
    query: new URLSearchParams(queryPart),
  }
}

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(parse)

  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export const navigate = (to: string) => {
  const target = to.startsWith('#') ? to : `#${to}`
  if (window.location.hash === target) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.location.hash = target
  }
}

export const watchUrl = (id: string) => `#/watch/${id}`
export const channelUrl = (id: string) => `#/channel/${id}`
export const shortsUrl = (id?: string) => (id ? `#/shorts/${id}` : '#/shorts')
