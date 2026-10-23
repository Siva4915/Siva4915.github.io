import {
  Baby,
  CircleHelp,
  Clock,
  Flame,
  Flag,
  Gamepad2,
  GraduationCap,
  History,
  Home,
  ListVideo,
  MessageSquare,
  Music2,
  Newspaper,
  PlaySquare,
  Podcast,
  Settings,
  Sparkles,
  ThumbsUp,
  Trophy,
  Tv,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useEffect } from 'react'
import { channels } from '../data'
import { channelUrl, useRoute } from '../router'
import { useApp } from '../store'
import { Avatar } from './Avatar'

const ShortsMark = ({ size = 22 }: { size?: number }) => (
  <span className="shorts-mark" style={{ width: size, height: size }} aria-hidden="true">
    <span className="shorts-mark-play" />
  </span>
)

interface ItemProps {
  icon: LucideIcon | typeof ShortsMark
  label: string
  href: string
  active?: boolean
  trailing?: string
}

const NavItem = ({ icon: Icon, label, href, active, trailing }: ItemProps) => (
  <a className={`guide-item ${active ? 'active' : ''}`} href={href} aria-current={active ? 'page' : undefined}>
    <span className="guide-icon"><Icon size={22} /></span>
    <span className="guide-label">{label}</span>
    {trailing && <span className="guide-trailing">{trailing}</span>}
  </a>
)

export const Sidebar = () => {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, subscribed, customVideos } = useApp()
  const route = useRoute()
  const path = route.path

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [route.hash, setMobileSidebarOpen])

  useEffect(() => {
    if (!mobileSidebarOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileSidebarOpen, setMobileSidebarOpen])

  const is = (p: string) => path === p
  const subscribedChannels = channels.filter((c) => subscribed.includes(c.id)).slice(0, 7)
  const youActive = path === '/you'

  return (
    <>
      {mobileSidebarOpen && <button className="guide-backdrop" aria-label="Close guide" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className={`guide ${sidebarCollapsed ? 'is-collapsed' : ''} ${mobileSidebarOpen ? 'is-open' : ''}`} aria-label="Guide">
        <nav className="guide-scroll">
          <div className="guide-section guide-primary">
            <NavItem icon={Home} label="Home" href="#/" active={is('/')} />
            <NavItem icon={ShortsMark} label="Shorts" href="#/shorts" active={path.startsWith('/shorts')} />
            <NavItem icon={ListVideo} label="Subscriptions" href="#/feed/subscriptions" active={is('/feed/subscriptions')} />
            <NavItem icon={UserRound} label="You" href="#/you" active={youActive} />
          </div>

          <div className="menu-divider" />
          <div className="guide-section">
            <div className="guide-heading">You <span className="guide-chevron">›</span></div>
            <NavItem icon={History} label="History" href="#/feed/history" active={is('/feed/history')} />
            <NavItem icon={ListVideo} label="Playlists" href="#/you" active={false} />
            <NavItem icon={PlaySquare} label="Your videos" href="#/channel/you" active={path === '/channel/you'} trailing={customVideos.length ? String(customVideos.length) : undefined} />
            <NavItem icon={Clock} label="Watch later" href="#/playlist/watch-later" active={is('/playlist/watch-later')} />
            <NavItem icon={ThumbsUp} label="Liked videos" href="#/playlist/liked" active={is('/playlist/liked')} />
          </div>

          <div className="menu-divider" />
          <div className="guide-section">
            <div className="guide-heading">Subscriptions</div>
            {subscribedChannels.length ? (
              subscribedChannels.map((c) => (
                <a className={`guide-item channel-item ${path === `/channel/${c.id}` ? 'active' : ''}`} href={channelUrl(c.id)} key={c.id}>
                  <Avatar src={c.avatar} name={c.name} size={24} />
                  <span className="guide-label">{c.name}</span>
                  <span className="live-pip" title="Channel" />
                </a>
              ))
            ) : (
              <p className="guide-note">Channels you subscribe to will appear here.</p>
            )}
            <a className="guide-item" href="#/feed/subscriptions">
              <span className="guide-icon"><ListVideo size={22} /></span>
              <span className="guide-label">All subscriptions</span>
            </a>
          </div>

          <div className="menu-divider" />
          <div className="guide-section">
            <div className="guide-heading">Explore</div>
            <NavItem icon={Flame} label="Trending" href="#/results?q=trending" active={false} />
            <NavItem icon={Music2} label="Music" href="#/results?q=music" active={false} />
            <NavItem icon={Gamepad2} label="Gaming" href="#/results?q=gaming" active={false} />
            <NavItem icon={Newspaper} label="News" href="#/results?q=news" active={false} />
            <NavItem icon={Trophy} label="Sport" href="#/results?q=sport" active={false} />
            <NavItem icon={GraduationCap} label="Learning" href="#/results?q=learning" active={false} />
            <NavItem icon={Podcast} label="Podcasts" href="#/results?q=podcast" active={false} />
          </div>

          <div className="menu-divider" />
          <div className="guide-section">
            <div className="guide-heading">More from Vuemora</div>
            <NavItem icon={Sparkles} label="Vuemora Premium" href="#/premium" active={is('/premium')} />
            <NavItem icon={Music2} label="Vuemora Music" href="#/music" active={is('/music')} />
            <NavItem icon={Baby} label="Vuemora Kids" href="#/kids" active={is('/kids')} />
            <NavItem icon={Tv} label="Vuemora TV" href="#/tv" active={is('/tv')} />
          </div>

          <div className="menu-divider" />
          <div className="guide-section">
            <NavItem icon={Settings} label="Settings" href="#/settings" active={is('/settings')} />
            <NavItem icon={Flag} label="Report history" href="#/report" active={is('/report')} />
            <NavItem icon={CircleHelp} label="Help" href="#/help" active={is('/help')} />
            <NavItem icon={MessageSquare} label="Send feedback" href="#/feedback" active={is('/feedback')} />
          </div>

          <div className="guide-footer">
            <p className="footer-links">
              <a href="#/about">About</a><a href="#/press">Press</a><a href="#/copyright">Copyright</a>
              <a href="#/contact">Contact us</a><a href="#/creators">Creators</a><a href="#/advertise">Advertise</a>
              <a href="#/developers">Developers</a>
            </p>
            <p className="footer-links"><a href="#/terms">Terms</a><a href="#/privacy">Privacy</a><a href="#/policy">Policy &amp; Safety</a><a href="#/how">How Vuemora works</a></p>
            <p className="copyright">© 2026 Chukka Siva · <a href="/credits.txt" target="_blank" rel="noreferrer">Media credits</a></p>
            <p className="footer-note">Built as a YouTube-inspired product study. Not affiliated with YouTube.</p>
          </div>
        </nav>
      </aside>
    </>
  )
}
