import { CheckCircle2, Home, Plus, UserRound, ListVideo, Search } from 'lucide-react'
import { useEffect } from 'react'
import { AppProvider, useApp } from './store'
import { useRoute } from './router'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { CreateModal } from './components/CreateModal'
import { ShortsMark } from './components/ShortsMark'
import { Home as HomePage } from './pages/Home'
import { Watch } from './pages/Watch'
import { Search as SearchPage } from './pages/Search'
import { ChannelPage } from './pages/Channel'
import { Subscriptions } from './pages/Subscriptions'
import { CollectionPage, HistoryPage, YouPage } from './pages/Library'
import { Shorts } from './pages/Shorts'
import { InfoPage, NotFound, SettingsPage } from './pages/Info'

const ToastStack = () => {
  const { toasts } = useApp()
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div className={`toast ${toast.kind}`} key={toast.id}>
          {toast.kind === 'success' ? <CheckCircle2 size={19} /> : <span className="toast-dot" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

const MobileNav = () => {
  const route = useRoute()
  const { setCreateOpen } = useApp()
  if (route.path.startsWith('/shorts')) return null
  const is = (path: string) => route.path === path
  const youSection = ['/you', '/feed/history', '/playlist/watch-later', '/playlist/liked', '/channel/you'].includes(route.path)
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <a href="#/" className={is('/') ? 'active' : ''}><Home size={22} /><span>Home</span></a>
      <a href="#/shorts" className={is('/shorts') ? 'active' : ''}><ShortsMark size={22} /><span>Shorts</span></a>
      <button className="mobile-create" onClick={() => setCreateOpen(true)} aria-label="Create"><span><Plus size={26} /></span></button>
      <a href="#/feed/subscriptions" className={is('/feed/subscriptions') ? 'active' : ''}><ListVideo size={22} /><span>Subscriptions</span></a>
      <a href="#/you" className={youSection ? 'active' : ''}><UserRound size={22} /><span>You</span></a>
    </nav>
  )
}

const RouterView = () => {
  const route = useRoute()
  const seg = route.segments
  const first = seg[0]
  const second = seg[1]

  if (route.path === '/') return <HomePage />
  if (first === 'watch') return second ? <Watch key={second} videoId={second} /> : <NotFound />
  if (first === 'results') return <SearchPage query={route.query.get('q') ?? ''} />
  if (first === 'channel') return second ? <ChannelPage key={second} channelId={second} /> : <NotFound />
  if (first === 'feed' && second === 'subscriptions') return <Subscriptions />
  if (first === 'feed' && second === 'history') return <HistoryPage />
  if (first === 'playlist' && second === 'watch-later') return <CollectionPage kind="watch-later" />
  if (first === 'playlist' && second === 'liked') return <CollectionPage kind="liked" />
  if (first === 'you') return <YouPage />
  if (first === 'shorts') return <Shorts key={second ?? 'feed'} shortId={second} />
  if (first === 'settings') return <SettingsPage />
  if (first && ['premium', 'music', 'kids', 'tv', 'help', 'feedback', 'report', 'about', 'press', 'copyright', 'contact', 'creators', 'advertise', 'developers', 'terms', 'privacy', 'policy', 'how'].includes(first)) {
    return <InfoPage slug={first} />
  }
  return <NotFound />
}

const Shell = () => {
  const { sidebarCollapsed } = useApp()
  const route = useRoute()

  useEffect(() => {
    if (!route.path.startsWith('/shorts')) window.scrollTo({ top: 0 })
  }, [route.path])

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
      <TopBar />
      <Sidebar />
      <main className={`main-content ${route.path.startsWith('/shorts') ? 'shorts-content' : ''}`}>
        <RouterView />
      </main>
      <MobileNav />
      <ToastStack />
      <CreateModal />
    </div>
  )
}

const App = () => (
  <AppProvider>
    <Shell />
  </AppProvider>
)

export default App
