import {
  Bell,
  Check,
  CircleHelp,
  Code2,
  Flag,
  Globe2,
  Languages,
  Lock,
  MessageSquare,
  Monitor,
  Moon,
  Music2,
  Play,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Tv,
  Users,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../store'

const pages: Record<string, { title: string; eyebrow: string; body: string; points: string[]; icon: typeof Play }> = {
  premium: {
    title: 'Vuemora Premium',
    eyebrow: 'Watch without limits',
    body: 'Ad-free viewing, background play, downloads and high-bitrate streaming. This is a design demo, but the vision is real.',
    points: ['Ad-free across every device', 'Download videos for offline viewing', 'Background play with picture-in-picture', 'High-bitrate 4K streaming'],
    icon: Sparkles,
  },
  music: {
    title: 'Vuemora Music',
    eyebrow: 'Sound, uninterrupted',
    body: 'A dedicated home for mixes, live sessions and the tracks you keep coming back to.',
    points: ['Curated mixes and radio', 'High-quality audio streams', 'Lyrics and live sessions', 'Follow your favorite artists'],
    icon: Music2,
  },
  kids: {
    title: 'Vuemora Kids',
    eyebrow: 'A safer corner of the internet',
    body: 'A curated space for younger viewers, with parental controls and no targeted ads.',
    points: ['Handpicked channels', 'Parental controls and timers', 'No targeted advertising', 'Age-appropriate recommendations'],
    icon: Users,
  },
  tv: {
    title: 'Vuemora TV',
    eyebrow: 'The big screen experience',
    body: 'Lean back and watch on your TV with a remote-first interface and cinematic playback.',
    points: ['Remote-friendly navigation', 'Up to 4K HDR', 'Casting from your phone', 'Continue watching across devices'],
    icon: Tv,
  },
  help: {
    title: 'Help center',
    eyebrow: 'How can we help?',
    body: 'Find answers about your account, playback, uploads and creator tools. The help center is a demo in this build.',
    points: ['Fix playback issues', 'Manage your account', 'Upload and edit videos', 'Community guidelines'],
    icon: CircleHelp,
  },
  feedback: {
    title: 'Send feedback',
    eyebrow: 'Tell us what you think',
    body: 'We read everything. Tell us what feels right, what feels off, and what you would love to see next.',
    points: ['Report a bug', 'Request a feature', 'Share a design note', 'Rate your experience'],
    icon: MessageSquare,
  },
  report: {
    title: 'Report history',
    eyebrow: 'Keeping the community safe',
    body: 'Reports you submit help us understand what needs attention. You will see updates here.',
    points: ['Review submitted reports', 'Track resolution status', 'Appeal a decision', 'Community guidelines'],
    icon: Flag,
  },
  about: {
    title: 'About Vuemora',
    eyebrow: 'A place for curious people',
    body: 'Vuemora is a YouTube-inspired product study built to explore how video, discovery and creator tools can feel on the open web.',
    points: ['Designed and built as a front-end study', 'Original demo content and media', 'No affiliation with YouTube', 'Made to be explored'],
    icon: Play,
  },
  press: {
    title: 'Press',
    eyebrow: 'Newsroom',
    body: 'Resources, brand assets and the story behind the Vuemora demo.',
    points: ['Brand guidelines', 'Product screenshots', 'Press inquiries', 'Fact sheet'],
    icon: Globe2,
  },
  copyright: {
    title: 'Copyright',
    eyebrow: 'Respect for creators',
    body: 'Learn how copyright works on Vuemora and how to submit a claim. Demo content is used for illustration only.',
    points: ['Copyright basics', 'Submit a claim', 'Counter notifications', 'Creator resources'],
    icon: Shield,
  },
  contact: {
    title: 'Contact us',
    eyebrow: 'Say hello',
    body: 'Questions, ideas, or just want to talk shop? We would love to hear from you.',
    points: ['General inquiries', 'Creator support', 'Press and partnerships', 'Careers'],
    icon: MessageSquare,
  },
  creators: {
    title: 'For creators',
    eyebrow: 'Make something worth watching',
    body: 'Tools to upload, analyze, and grow — all in one place. The creator studio in this demo is a visual preview.',
    points: ['Upload and schedule videos', 'Understand your audience', 'Build a community', 'Monetize your work'],
    icon: Video,
  },
  advertise: {
    title: 'Advertise',
    eyebrow: 'Reach curious audiences',
    body: 'Connect your brand with people who are actively learning, watching, and making.',
    points: ['Audience-first formats', 'Transparent measurement', 'Brand safety controls', 'Creative partnerships'],
    icon: Rocket,
  },
  developers: {
    title: 'Developers',
    eyebrow: 'Build with Vuemora',
    body: 'APIs, embeds and tools for building video experiences on the open web.',
    points: ['Player embeds', 'Data API preview', 'Design tokens', 'Open source experiments'],
    icon: Code2,
  },
  terms: {
    title: 'Terms of service',
    eyebrow: 'The fine print',
    body: 'The rules that keep Vuemora usable and fair for everyone. This is a demo and not a legal document.',
    points: ['Using the service', 'Your content', 'Community rules', 'Changes to these terms'],
    icon: Lock,
  },
  privacy: {
    title: 'Privacy',
    eyebrow: 'Your data, your choice',
    body: 'How a product like Vuemora would handle data. This demo stores preferences only in your browser.',
    points: ['What we store', 'Your controls', 'Cookies and local storage', 'Data deletion'],
    icon: Shield,
  },
  policy: {
    title: 'Policy & safety',
    eyebrow: 'A healthy community',
    body: 'How the platform approaches safety, moderation and creator responsibility.',
    points: ['Community guidelines', 'Content moderation', 'Appeals', 'Transparency reports'],
    icon: Shield,
  },
  how: {
    title: 'How Vuemora works',
    eyebrow: 'Discovery, explained',
    body: 'Recommendations, subscriptions and search — the systems that help you find your next favorite video.',
    points: ['Personalized recommendations', 'Subscriptions and notifications', 'Search and discovery', 'Creator distribution'],
    icon: Settings,
  },
}

export const InfoPage = ({ slug }: { slug: string }) => {
  const page = pages[slug]
  if (!page) return <NotFound />
  const Icon = page.icon
  return (
    <div className="page info-page">
      <div className="info-hero">
        <span className="info-icon"><Icon size={30} /></span>
        <span className="info-eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.body}</p>
        <div className="info-actions">
          <a className="primary-btn" href="#/">Back to Vuemora</a>
          <button className="outline-btn" onClick={() => window.history.back()}>Go back</button>
        </div>
      </div>
      <div className="info-points">
        {page.points.map((point) => <div key={point}><Check size={18} /> {point}</div>)}
      </div>
      <div className="info-note"><Sparkles size={18} /><span>This page is part of a product design study. It is not affiliated with YouTube, and no real account or payment is involved.</span></div>
    </div>
  )
}

export const SettingsPage = () => {
  const { theme, toggleTheme, notify } = useApp()
  const [autoplay, setAutoplay] = useState(true)
  const [restricted, setRestricted] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [quality, setQuality] = useState('Auto')
  const [lang, setLang] = useState('English (US)')

  return (
    <div className="page settings-page">
      <div className="page-title-row">
        <div><h1>Settings</h1><p className="page-subtitle">Personalize how Vuemora looks, sounds and feels.</p></div>
      </div>
      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-head"><span><Monitor size={20} /></span><div><h2>Appearance</h2><p>Choose how Vuemora looks on this device.</p></div></div>
          <div className="theme-options">
            <button className={theme === 'dark' ? 'active' : ''} onClick={() => theme === 'light' && toggleTheme()}>
              <span className="theme-preview dark"><span /><span /></span>
              <span><Moon size={16} /> Dark</span>
              {theme === 'dark' && <Check size={16} />}
            </button>
            <button className={theme === 'light' ? 'active' : ''} onClick={() => theme === 'dark' && toggleTheme()}>
              <span className="theme-preview light"><span /><span /></span>
              <span><Sun size={16} /> Light</span>
              {theme === 'light' && <Check size={16} />}
            </button>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-head"><span><Play size={20} /></span><div><h2>Playback</h2><p>Defaults for every video you watch.</p></div></div>
          <div className="setting-row">
            <div><strong>Autoplay next video</strong><small>Keep playing when the current video ends.</small></div>
            <button className={`switch ${autoplay ? 'on' : ''}`} onClick={() => setAutoplay((v) => !v)} aria-pressed={autoplay}><span /></button>
          </div>
          <div className="setting-row">
            <div><strong>Preferred quality</strong><small>Higher quality uses more data.</small></div>
            <select value={quality} onChange={(e) => setQuality(e.target.value)}><option>Auto</option><option>1080p</option><option>720p</option><option>480p</option></select>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-head"><span><Bell size={20} /></span><div><h2>Notifications</h2><p>What Vuemora should tell you about.</p></div></div>
          <div className="setting-row">
            <div><strong>Subscriptions</strong><small>New uploads from channels you follow.</small></div>
            <button className={`switch ${notifications ? 'on' : ''}`} onClick={() => setNotifications((v) => !v)} aria-pressed={notifications}><span /></button>
          </div>
          <div className="setting-row">
            <div><strong>Email digest</strong><small>A weekly roundup, no more.</small></div>
            <button className="switch" onClick={() => notify('Email preferences are a demo only')}><span /></button>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-head"><span><Languages size={20} /></span><div><h2>Language & region</h2><p>Set your preferred language and location.</p></div></div>
          <div className="setting-row">
            <div><strong>Language</strong><small>Used across the interface.</small></div>
            <select value={lang} onChange={(e) => setLang(e.target.value)}><option>English (US)</option><option>English (UK)</option><option>Español</option><option>日本語</option><option>हिन्दी</option></select>
          </div>
          <div className="setting-row">
            <div><strong>Restricted mode</strong><small>Hide potentially mature content.</small></div>
            <button className={`switch ${restricted ? 'on' : ''}`} onClick={() => setRestricted((v) => !v)} aria-pressed={restricted}><span /></button>
          </div>
        </section>
      </div>

      <section className="settings-card privacy-card">
        <div className="settings-head"><span><Shield size={20} /></span><div><h2>Privacy & data</h2><p>Preferences are stored locally in your browser for this demo.</p></div></div>
        <div className="privacy-actions">
          <button className="outline-btn" onClick={() => notify('Watch history can be cleared from the History page')}>Manage watch history</button>
          <button className="outline-btn danger" onClick={() => { localStorage.removeItem('vuemora-state-v1'); notify('Local preferences cleared — refresh to reset', 'success') }}>Clear local data</button>
        </div>
      </section>
    </div>
  )
}

export const NotFound = () => (
  <div className="page not-found">
    <div className="notfound-art">
      <span className="nf-play"><Play size={40} fill="currentColor" /></span>
      <span className="nf-orbit one" /><span className="nf-orbit two" />
    </div>
    <h1>This page is not available</h1>
    <p>The link may be broken, or the page may have been removed. Try searching for something else.</p>
    <div className="notfound-actions"><a className="primary-btn" href="#/">Go to home</a><a className="outline-btn" href="#/results?q=trending">Explore trending</a></div>
    <div className="notfound-code">404 · Vuemora</div>
  </div>
)
