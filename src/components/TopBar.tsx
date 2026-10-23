import {
  ArrowLeft,
  Bell,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  Clock,
  FileVideo,
  Keyboard,
  LogOut,
  Menu,
  Mic,
  Moon,
  Search,
  Settings,
  Sun,
  TrendingUp,
  UserRound,
  Video,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { channels, notifications, searchSuggestions, videos } from '../data'
import { channelUrl, navigate, useRoute } from '../router'
import { useApp } from '../store'
import { Avatar } from './Avatar'
import { Logo } from './Logo'

const SEARCH_KEY = 'vuemora-recent-searches'

const loadRecent = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SEARCH_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.slice(0, 6) : []
  } catch {
    return []
  }
}

export const TopBar = () => {
  const { toggleSidebar, setCreateOpen, notificationsRead, markNotificationsRead, notify, theme, toggleTheme } = useApp()
  const route = useRoute()
  const [query, setQuery] = useState(route.path === '/results' ? route.query.get('q') ?? '' : '')
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const [panel, setPanel] = useState<'bell' | 'profile' | null>(null)
  const [recent, setRecent] = useState<string[]>(loadRecent)
  const searchRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (route.path === '/results') setQuery(route.query.get('q') ?? '')
  }, [route.path, route.query.toString()])

  useEffect(() => {
    setPanel(null)
    setSearchOpen(false)
    setMobileSearch(false)
  }, [route.hash])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setPanel(null)
        setMobileSearch(false)
        inputRef.current?.blur()
      }
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (searchRef.current && !searchRef.current.contains(t)) setSearchOpen(false)
      if (bellRef.current && !bellRef.current.contains(t)) setPanel((p) => (p === 'bell' ? null : p))
      if (profileRef.current && !profileRef.current.contains(t)) setPanel((p) => (p === 'profile' ? null : p))
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const titles = videos
      .map((v) => v.title)
      .filter((title) => title.toLowerCase().includes(q))
      .slice(0, 5)
    const tags = [...new Set(videos.flatMap((v) => v.tags))]
      .filter((tag) => tag.toLowerCase().includes(q) && !titles.some((title) => title.toLowerCase().includes(tag)))
      .slice(0, 3)
    const channelNames = channels
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => c.name)
      .slice(0, 2)
    return [...new Set([...titles, ...channelNames, ...tags])].slice(0, 8)
  }, [query])

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r.toLowerCase() !== term.toLowerCase())].slice(0, 6)
    setRecent(next)
    try {
      localStorage.setItem(SEARCH_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  const submitSearch = (term: string) => {
    const clean = term.trim()
    if (!clean) return
    saveRecent(clean)
    setQuery(clean)
    setSearchOpen(false)
    setMobileSearch(false)
    inputRef.current?.blur()
    navigate(`/results?q=${encodeURIComponent(clean)}`)
  }

  const startVoice = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string
        interimResults: boolean
        onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null
        onerror: (() => void) | null
        onend: (() => void) | null
        start: () => void
      }
      webkitSpeechRecognition?: new () => {
        lang: string
        interimResults: boolean
        onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null
        onerror: (() => void) | null
        onend: (() => void) | null
        start: () => void
      }
    }
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Recognition) {
      notify('Voice search is not supported in this browser')
      return
    }
    try {
      const recognition = new Recognition()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      notify('Listening…')
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        submitSearch(transcript)
      }
      recognition.onerror = () => notify('Could not hear you — try again')
      recognition.start()
    } catch {
      notify('Microphone access is unavailable')
    }
  }

  const unread = notificationsRead ? 0 : notifications.filter((n) => !n.read).length

  return (
    <header className={`topbar ${mobileSearch ? 'mobile-search-open' : ''}`}>
      <div className="topbar-left">
        <button className="icon-btn menu-btn" onClick={toggleSidebar} aria-label="Toggle guide">
          <Menu size={24} />
        </button>
        <Logo />
      </div>

      <div className="topbar-center" ref={searchRef}>
        <button
          className="icon-btn mobile-back"
          aria-label="Close search"
          onClick={() => {
            setMobileSearch(false)
            setSearchOpen(false)
          }}
        >
          <ArrowLeft size={22} />
        </button>
        <form
          className={`search-box ${searchOpen ? 'is-focused' : ''}`}
          onSubmit={(e) => {
            e.preventDefault()
            submitSearch(query)
          }}
        >
          {searchOpen && <Search size={19} className="search-leading" />}
          <input
            ref={inputRef}
            value={query}
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => {
              setSearchOpen(true)
              setMobileSearch(true)
            }}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
            >
              <X size={17} />
            </button>
          )}
          <button className="search-submit" type="submit" aria-label="Search">
            <Search size={20} />
          </button>
        </form>
        <button className="mic-btn" aria-label="Search with your voice" title="Search with your voice" onClick={startVoice}>
          <Mic size={19} />
        </button>

        {searchOpen && (
          <div className="search-panel">
            {query.trim() ? (
              suggestions.length ? (
                <>
                  <div className="panel-caption">Suggestions</div>
                  {suggestions.map((s) => (
                    <div
                      key={s}
                      className="suggestion"
                      role="button"
                      tabIndex={0}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => submitSearch(s)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          submitSearch(s)
                        }
                      }}
                    >
                      <Search size={16} />
                      <span>{s}</span>
                      <TrendingUp size={15} className="suggestion-trend" />
                    </div>
                  ))}
                </>
              ) : (
                <div className="panel-empty">No suggestions — press Enter to search anyway.</div>
              )
            ) : (
              <>
                <div className="panel-caption">{recent.length ? 'Recent searches' : 'Trending searches'}</div>
                {(recent.length ? recent : searchSuggestions.slice(0, 6)).map((s) => (
                  <div
                    key={s}
                    className="suggestion"
                    role="button"
                    tabIndex={0}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => submitSearch(s)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        submitSearch(s)
                      }
                    }}
                  >
                    {recent.length ? <Clock size={16} /> : <TrendingUp size={16} />}
                    <span>{s}</span>
                    <button
                      className="suggestion-remove"
                      aria-label={`Remove ${s}`}
                      onKeyDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        const next = recent.filter((r) => r !== s)
                        setRecent(next)
                        localStorage.setItem(SEARCH_KEY, JSON.stringify(next))
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </>
            )}
            <div className="search-panel-footer">
              <span><Keyboard size={14} /> Press <kbd>/</kbd> to search</span>
              <span>Vuemora Search</span>
            </div>
          </div>
        )}
      </div>

      <div className="topbar-right">
        <button className="icon-btn search-trigger" aria-label="Search" onClick={() => { setMobileSearch(true); setTimeout(() => inputRef.current?.focus(), 50) }}>
          <Search size={22} />
        </button>
        <button className="create-btn" onClick={() => setCreateOpen(true)}>
          <Video size={19} />
          <span>Create</span>
        </button>
        <div className="popover-wrap" ref={bellRef}>
          <button
            className={`icon-btn ${panel === 'bell' ? 'is-active' : ''}`}
            aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
            onClick={() => setPanel((p) => (p === 'bell' ? null : 'bell'))}
          >
            <Bell size={22} />
            {unread > 0 && <span className="notification-dot" />}
          </button>
          {panel === 'bell' && (
            <div className="popover notifications-panel">
              <div className="popover-head">
                <h3>Notifications</h3>
                <button className="text-btn" onClick={markNotificationsRead}>
                  <CheckCheck size={15} /> Mark all read
                </button>
              </div>
              <div className="notification-list">
                {notifications.map((n) => (
                  <a
                    className={`notification-item ${!notificationsRead && !n.read ? 'is-unread' : ''}`}
                    href={n.href}
                    key={n.id}
                    onClick={() => setPanel(null)}
                  >
                    <Avatar src={n.avatar} name={n.title} size={36} />
                    <div className="notification-copy">
                      <p>{n.title}</p>
                      <span>{n.time}</span>
                    </div>
                    {n.thumb ? <img className="notification-thumb" src={n.thumb} alt="" /> : <span className="notification-dot small" />}
                  </a>
                ))}
              </div>
              <a href="#/feed/subscriptions" className="popover-footer-link" onClick={() => setPanel(null)}>
                View all subscriptions <ChevronRight size={16} />
              </a>
            </div>
          )}
        </div>
        <div className="popover-wrap" ref={profileRef}>
          <button
            className={`avatar-btn ${panel === 'profile' ? 'is-active' : ''}`}
            aria-label="Account menu"
            onClick={() => setPanel((p) => (p === 'profile' ? null : 'profile'))}
          >
            <Avatar src="/avatars/a8.jpg" name="Alex Morgan" size={32} />
          </button>
          {panel === 'profile' && (
            <div className="popover profile-panel">
              <div className="profile-head">
                <Avatar src="/avatars/a8.jpg" name="Alex Morgan" size={44} />
                <div>
                  <h3>Alex Morgan</h3>
                  <p>@alexmorgan</p>
                  <a href="#/channel/you" onClick={() => setPanel(null)}>View your channel</a>
                </div>
              </div>
              <div className="menu-divider" />
              <button className="menu-item" onClick={() => { notify('Account switching is a demo only') }}>
                <UserRound size={19} /> Switch account
              </button>
              <button className="menu-item" onClick={() => { setPanel(null); navigate('/you') }}>
                <Video size={19} /> Vuemora Studio
              </button>
              <div className="menu-divider" />
              <div className="appearance-row">
                <span>Appearance</span>
                <button className="appearance-toggle" onClick={toggleTheme} aria-label="Toggle appearance">
                  <span className={theme === 'dark' ? 'selected' : ''}><Moon size={15} /> Dark</span>
                  <span className={theme === 'light' ? 'selected' : ''}><Sun size={15} /> Light</span>
                </button>
              </div>
              <button className="menu-item" onClick={() => notify('Settings are a demo only')}>
                <Settings size={19} /> Settings
              </button>
              <button className="menu-item" onClick={() => notify('Keyboard shortcuts: / search, K play, F fullscreen, M mute')}>
                <Keyboard size={19} /> Keyboard shortcuts
              </button>
              <button className="menu-item" onClick={() => notify('Help center is a demo only')}>
                <CircleHelp size={19} /> Help
              </button>
              <div className="menu-divider" />
              <button className="menu-item" onClick={() => notify('Signed out (demo)')}>
                <LogOut size={19} /> Sign out
              </button>
              <div className="profile-foot">Vuemora · Made for the web</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
