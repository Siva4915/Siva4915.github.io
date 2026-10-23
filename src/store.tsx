import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { channelById, type Video } from './data'

type Theme = 'dark' | 'light'

interface HistoryEntry {
  id: string
  progress: number
  watchedAt: number
}

interface Persisted {
  theme: Theme
  liked: string[]
  disliked: string[]
  subscribed: string[]
  watchLater: string[]
  history: HistoryEntry[]
  hidden: string[]
  notificationsRead: boolean
  sidebarCollapsed: boolean
}

interface Toast {
  id: number
  message: string
  kind: 'default' | 'success'
}

interface AppContextValue extends Persisted {
  customVideos: Video[]
  toasts: Toast[]
  mobileSidebarOpen: boolean
  createOpen: boolean
  setCreateOpen: (open: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  toggleTheme: () => void
  toggleLike: (id: string) => void
  toggleDislike: (id: string) => void
  toggleSubscribe: (channelId: string) => void
  toggleWatchLater: (id: string) => void
  markWatched: (id: string, progress?: number) => void
  setWatchProgress: (id: string, progress: number) => void
  removeHistory: (id: string) => void
  clearHistory: () => void
  hideVideo: (id: string) => void
  markNotificationsRead: () => void
  addCustomVideo: (video: Video) => void
  notify: (message: string, kind?: 'default' | 'success') => void
  isSubscribed: (channelId: string) => boolean
  isLiked: (id: string) => boolean
  isDisliked: (id: string) => boolean
  isSaved: (id: string) => boolean
}

const STORAGE_KEY = 'vuemora-state-v1'

const defaults: Persisted = {
  theme: 'dark',
  liked: [],
  disliked: [],
  subscribed: ['techtonic', 'framebyframe', 'studionorth'],
  watchLater: [],
  history: [],
  hidden: [],
  notificationsRead: false,
  sidebarCollapsed: false,
}

const loadState = (): Persisted => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw)
    return {
      ...defaults,
      ...parsed,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      liked: Array.isArray(parsed.liked) ? parsed.liked : [],
      disliked: Array.isArray(parsed.disliked) ? parsed.disliked : [],
      subscribed: Array.isArray(parsed.subscribed) ? parsed.subscribed : defaults.subscribed,
      watchLater: Array.isArray(parsed.watchLater) ? parsed.watchLater : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      hidden: Array.isArray(parsed.hidden) ? parsed.hidden : [],
    }
  } catch {
    return defaults
  }
}

const AppContext = createContext<AppContextValue | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Persisted>(loadState)
  const [customVideos, setCustomVideos] = useState<Video[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const toastId = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage can be unavailable */
    }
  }, [state])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', state.theme === 'dark' ? '#0f0f0f' : '#ffffff')
  }, [state.theme])

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen || createOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileSidebarOpen, createOpen])

  const notify = useCallback((message: string, kind: 'default' | 'success' = 'default') => {
    const id = ++toastId.current
    setToasts((prev) => [...prev.slice(-2), { id, message, kind }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const patch = useCallback((updater: (prev: Persisted) => Persisted) => {
    setState((prev) => updater(prev))
  }, [])

  const toggleArray = (key: 'liked' | 'disliked' | 'watchLater' | 'subscribed' | 'hidden', id: string) => {
    patch((prev) => {
      const list = prev[key]
      return { ...prev, [key]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] }
    })
  }

  const toggleLike = useCallback((id: string) => {
    patch((prev) => {
      const liked = prev.liked.includes(id)
      return {
        ...prev,
        liked: liked ? prev.liked.filter((x) => x !== id) : [...prev.liked, id],
        disliked: liked ? prev.disliked : prev.disliked.filter((x) => x !== id),
      }
    })
  }, [patch])

  const toggleDislike = useCallback((id: string) => {
    patch((prev) => {
      const disliked = prev.disliked.includes(id)
      return {
        ...prev,
        disliked: disliked ? prev.disliked.filter((x) => x !== id) : [...prev.disliked, id],
        liked: disliked ? prev.liked : prev.liked.filter((x) => x !== id),
      }
    })
  }, [patch])

  const toggleSubscribe = useCallback((channelId: string) => {
    toggleArray('subscribed', channelId)
    const channel = channelById(channelId)
    if (channel) {
      notify(`${channel.name} ${state.subscribed.includes(channelId) ? 'unsubscribed' : 'subscribed'}`)
    }
  }, [state.subscribed, notify])

  const toggleWatchLater = useCallback((id: string) => {
    const saved = state.watchLater.includes(id)
    toggleArray('watchLater', id)
    notify(saved ? 'Removed from Watch later' : 'Saved to Watch later', saved ? 'default' : 'success')
  }, [state.watchLater, toggleArray, notify])

  const markWatched = useCallback((id: string, progress = 0) => {
    patch((prev) => {
      const existing = prev.history.find((h) => h.id === id)
      const entry: HistoryEntry = {
        id,
        progress: Math.max(existing?.progress ?? 0, progress),
        watchedAt: Date.now(),
      }
      return {
        ...prev,
        history: [entry, ...prev.history.filter((h) => h.id !== id)].slice(0, 100),
      }
    })
  }, [patch])

  const setWatchProgress = useCallback((id: string, progress: number) => {
    patch((prev) => {
      if (!prev.history.some((h) => h.id === id)) return prev
      return {
        ...prev,
        history: prev.history.map((h) => (h.id === id ? { ...h, progress: Math.max(h.progress, progress) } : h)),
      }
    })
  }, [patch])

  const removeHistory = useCallback((id: string) => {
    patch((prev) => ({ ...prev, history: prev.history.filter((h) => h.id !== id) }))
    notify('Removed from watch history')
  }, [patch, notify])

  const clearHistory = useCallback(() => {
    patch((prev) => ({ ...prev, history: [] }))
    notify('Watch history cleared', 'success')
  }, [patch, notify])

  const hideVideo = useCallback((id: string) => {
    patch((prev) => ({ ...prev, hidden: [...new Set([...prev.hidden, id])] }))
    notify('Video hidden from your recommendations')
  }, [patch, notify])

  const markNotificationsRead = useCallback(() => {
    patch((prev) => ({ ...prev, notificationsRead: true }))
  }, [patch])

  const toggleTheme = useCallback(() => {
    patch((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))
  }, [patch])

  const toggleSidebar = useCallback(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches
    if (isMobile) setMobileSidebarOpen((v) => !v)
    else patch((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }, [patch])

  const addCustomVideo = useCallback((video: Video) => {
    setCustomVideos((prev) => [video, ...prev])
  }, [])

  const value = useMemo<AppContextValue>(() => ({
    ...state,
    customVideos,
    toasts,
    mobileSidebarOpen,
    createOpen,
    setCreateOpen,
    setMobileSidebarOpen,
    toggleSidebar,
    toggleTheme,
    toggleLike,
    toggleDislike,
    toggleSubscribe,
    toggleWatchLater,
    markWatched,
    setWatchProgress,
    removeHistory,
    clearHistory,
    hideVideo,
    markNotificationsRead,
    addCustomVideo,
    notify,
    isSubscribed: (channelId: string) => state.subscribed.includes(channelId),
    isLiked: (id: string) => state.liked.includes(id),
    isDisliked: (id: string) => state.disliked.includes(id),
    isSaved: (id: string) => state.watchLater.includes(id),
  }), [
    state, customVideos, toasts, mobileSidebarOpen, createOpen, toggleSidebar, toggleTheme,
    toggleLike, toggleDislike, toggleSubscribe, toggleWatchLater, markWatched, setWatchProgress,
    removeHistory, clearHistory, hideVideo, markNotificationsRead, addCustomVideo, notify,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
