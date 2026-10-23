import {
  Bell,
  ChevronRight,
  Globe2,
  Link as LinkIcon,
  MapPin,
  Play,
  Search,
  Share2,
  Upload,
  Video as VideoIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  channelById,
  formatFull,
  formatViews,
  plural,
  shorts as allShorts,
  videos as allVideos,
  videosForChannel,
} from '../data'
import { navigate, watchUrl } from '../router'
import { useApp } from '../store'
import { Avatar } from '../components/Avatar'
import { SubscribeButton } from '../components/SubscribeButton'
import { ShortsMark } from '../components/ShortsMark'
import { Verified } from '../components/Verified'
import { VideoCard } from '../components/VideoCard'

interface Props {
  channelId: string
}

type Tab = 'Home' | 'Videos' | 'Shorts' | 'Playlists' | 'About'
const tabs: Tab[] = ['Home', 'Videos', 'Shorts', 'Playlists', 'About']

type Sort = 'Latest' | 'Popular' | 'Oldest'

export const ChannelPage = ({ channelId }: Props) => {
  const { customVideos, hidden, setCreateOpen, notify, isSubscribed } = useApp()
  const channel = channelById(channelId)
  const [tab, setTab] = useState<Tab>('Home')
  const [sort, setSort] = useState<Sort>('Latest')

  useEffect(() => {
    setTab('Home')
    setSort('Latest')
    window.scrollTo({ top: 0 })
  }, [channelId])

  const channelVideos = useMemo(() => {
    if (!channel) return []
    const list = videosForChannel(channel.id, customVideos).filter((v) => !hidden.includes(v.id))
    if (sort === 'Popular') return [...list].sort((a, b) => b.views - a.views)
    if (sort === 'Oldest') return [...list].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
    return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }, [channel, customVideos, hidden, sort])

  const channelShorts = useMemo(() => (channel ? allShorts.filter((s) => s.channelId === channel.id) : []), [channel])
  const subscribed = channel ? isSubscribed(channel.id) : false

  if (!channel) {
    return (
      <div className="page not-found">
        <div className="empty-illustration">404</div>
        <h1>Channel not found</h1>
        <p>That channel does not exist or is no longer available.</p>
        <a className="primary-btn" href="#/">Go to home</a>
      </div>
    )
  }

  const featured = channelVideos[0]
  const playlists = [
    { title: `${channel.name} — The essentials`, count: Math.min(8, channelVideos.length), videos: channelVideos.slice(0, 4), desc: 'Start here if you are new.' },
    { title: 'Deep dives & long watches', count: Math.min(6, Math.max(0, channelVideos.length - 1)), videos: channelVideos.slice(1, 5), desc: 'The ones worth making a coffee for.' },
    { title: 'Behind the scenes', count: Math.min(5, Math.max(0, channelVideos.length - 2)), videos: channelVideos.slice(2, 6), desc: 'Process, mistakes and everything between.' },
  ].filter((p) => p.count > 0)

  const shareChannel = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#/channel/${channel.id}`)
      notify('Channel link copied', 'success')
    } catch {
      notify('Could not copy link')
    }
  }

  return (
    <div className="page channel-page">
      <div className="channel-banner">
        <img src={channel.banner} alt="" />
        <span className="channel-banner-shade" />
      </div>

      <div className="channel-header">
        <Avatar src={channel.avatar} name={channel.name} size={160} className="channel-avatar" />
        <div className="channel-header-info">
          <div className="channel-title-line">
            <h1>{channel.name}</h1>
            {channel.verified && <Verified size={20} />}
          </div>
          <p className="channel-meta">
            @{channel.handle.replace('@', '')} · {formatViews(channel.subscribers)} subscribers · {plural(channelVideos.length, 'video')}
          </p>
          <p className="channel-tagline">{channel.description.split('.')[0]}.</p>
          <div className="channel-header-actions">
            {channel.id === 'you' ? (
              <button className="outline-btn" onClick={() => navigate('/you')}><VideoIcon size={18} /> Manage videos</button>
            ) : (
              <SubscribeButton channelId={channel.id} subscribers={channel.subscribers} size="large" />
            )}
            {subscribed && channel.id !== 'you' && (
              <button className="outline-btn bell-btn" onClick={() => notify('Notification settings are a demo only')} aria-label="Subscription notifications">
                <Bell size={18} />
              </button>
            )}
            <button className="outline-btn" onClick={shareChannel}><Share2 size={18} /> Share</button>
            {channel.id === 'you' && (
              <button className="primary-btn" onClick={() => setCreateOpen(true)}><Upload size={18} /> Upload</button>
            )}
          </div>
        </div>
        <button className="channel-search-btn" aria-label="Search channel" onClick={() => navigate(`/results?q=${encodeURIComponent(channel.name)}`)}>
          <Search size={20} />
        </button>
      </div>

      <div className="channel-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t}
            {t === 'Videos' && <span>{channelVideos.length}</span>}
            {t === 'Shorts' && <span>{channelShorts.length}</span>}
          </button>
        ))}
      </div>

      {tab === 'Home' && (
        <div className="channel-home">
          {featured ? (
            <>
              <a className="channel-featured" href={watchUrl(featured.id)}>
                <div className="featured-thumb">
                  <img src={featured.thumb} alt="" />
                  <span className="featured-shade" />
                  <span className="featured-play"><Play size={26} fill="currentColor" /></span>
                </div>
                <div className="featured-copy">
                  <span className="featured-kicker">Featured video</span>
                  <h2>{featured.title}</h2>
                  <p>{formatViews(featured.views)} views · {featured.age}</p>
                  <p className="featured-desc">{featured.description.split('\n')[0]}</p>
                </div>
              </a>
              {channelVideos.length > 1 && (
                <>
                  <div className="channel-section-head"><h2>Latest uploads</h2><button onClick={() => setTab('Videos')}>View all <ChevronRight size={16} /></button></div>
                  <div className="video-grid">
                    {channelVideos.slice(1, 7).map((v) => <VideoCard key={v.id} video={v} />)}
                  </div>
                </>
              )}
              {channelShorts.length > 0 && (
                <>
                  <div className="channel-section-head"><h2><ShortsMark size={22} /> Shorts</h2><button onClick={() => setTab('Shorts')}>View all <ChevronRight size={16} /></button></div>
                  <div className="shorts-rail compact">
                    {channelShorts.slice(0, 5).map((s) => (
                      <a className="short-card" href={`#/shorts/${s.id}`} key={s.id}>
                        <div className="short-thumb"><img src={s.thumb} alt="" /><span className="short-gradient" /><span className="short-views">{formatViews(s.views)} views</span><div className="short-info"><span className="short-title">{s.title}</span></div></div>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="empty-state compact">
              <div className="empty-icon"><VideoIcon size={28} /></div>
              <h2>{channel.id === 'you' ? 'You have not uploaded yet' : 'No videos yet'}</h2>
              <p>{channel.id === 'you' ? 'Your uploads will appear here. Publish your first video to get started.' : 'This channel has not uploaded any videos.'}</p>
              {channel.id === 'you' && <button className="primary-btn" onClick={() => setCreateOpen(true)}><Upload size={18} /> Upload a video</button>}
            </div>
          )}
        </div>
      )}

      {tab === 'Videos' && (
        <>
          <div className="channel-sort-row">
            <div className="filter-chip-row">
              {(['Latest', 'Popular', 'Oldest'] as Sort[]).map((s) => (
                <button key={s} className={`filter-chip ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>{s}</button>
              ))}
            </div>
            <span>{plural(channelVideos.length, 'video')}</span>
          </div>
          {channelVideos.length ? (
            <div className="video-grid">{channelVideos.map((v) => <VideoCard key={v.id} video={v} />)}</div>
          ) : (
            <div className="empty-state compact">
              <div className="empty-icon"><VideoIcon size={28} /></div>
              <h2>No videos to show</h2>
              <p>Upload a video to fill this shelf.</p>
              {channel.id === 'you' && <button className="primary-btn" onClick={() => setCreateOpen(true)}><Upload size={18} /> Upload a video</button>}
            </div>
          )}
        </>
      )}

      {tab === 'Shorts' && (
        channelShorts.length ? (
          <div className="channel-shorts-grid">
            {channelShorts.map((s) => (
              <a className="short-card channel-short" href={`#/shorts/${s.id}`} key={s.id}>
                <div className="short-thumb">
                  <img src={s.thumb} alt="" />
                  <span className="short-gradient" />
                  <span className="short-play"><Play size={17} fill="currentColor" /></span>
                  <span className="short-views">{formatViews(s.views)} views</span>
                  <div className="short-info"><span className="short-title">{s.title}</span></div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty-state compact">
            <div className="empty-icon"><ShortsMark size={28} /></div>
            <h2>No Shorts yet</h2>
            <p>Shorts from this channel will show up here.</p>
          </div>
        )
      )}

      {tab === 'Playlists' && (
        playlists.length ? (
          <div className="playlist-grid">
            {playlists.map((p) => (
              <a className="playlist-card" href={p.videos[0] ? watchUrl(p.videos[0].id) : '#'} key={p.title}>
                <div className="playlist-covers">
                  <img src={p.videos[0]?.thumb} alt="" />
                  <span className="playlist-count"><Play size={12} fill="currentColor" /> {plural(p.count, 'video')}</span>
                  <span className="playlist-stack-edge" />
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span>View playlist</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty-state compact">
            <div className="empty-icon"><VideoIcon size={28} /></div>
            <h2>No playlists</h2>
            <p>Playlists from this channel will appear here.</p>
          </div>
        )
      )}

      {tab === 'About' && (
        <div className="channel-about">
          <div className="about-main">
            <h2>About</h2>
            <p>{channel.description}</p>
          </div>
          <div className="about-stats">
            <div><strong>{formatFull(channel.subscribers)}</strong><span>subscribers</span></div>
            <div><strong>{formatFull(channelVideos.length)}</strong><span>{channelVideos.length === 1 ? 'video' : 'videos'}</span></div>
            <div><strong>{formatViews(channelVideos.reduce((sum, v) => sum + v.views, 0))}</strong><span>total views</span></div>
            <div><strong>{channel.joined}</strong><span>joined</span></div>
          </div>
          <div className="about-details">
            <div><Globe2 size={19} /><span>Country</span><strong>United States</strong></div>
            <div><MapPin size={19} /><span>Location</span><strong>Brooklyn, NY</strong></div>
            <div><LinkIcon size={19} /><span>Links</span><a href="#/about">vuemora.example/{channel.handle.replace('@', '').toLowerCase()}</a></div>
          </div>
          <button className="outline-btn" onClick={shareChannel}><Share2 size={17} /> Share channel</button>
        </div>
      )}
    </div>
  )
}
