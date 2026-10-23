import {
  ChevronRight,
  Clock,
  FolderOpen,
  History,
  ListVideo,
  Play,
  PlaySquare,
  Sparkles,
  ThumbsUp,
  Trash2,
  Upload,
  UserRound,
  Video as VideoIcon,
} from 'lucide-react'
import { channelById, formatFull, formatViews, plural, videos as allVideos, type Video } from '../data'
import { channelUrl, navigate, watchUrl } from '../router'
import { useApp } from '../store'
import { Avatar } from '../components/Avatar'
import { VideoCard } from '../components/VideoCard'

export const YouPage = () => {
  const { history, watchLater, liked, customVideos, setCreateOpen } = useApp()
  const channel = channelById('you')!
  const all = [...customVideos, ...allVideos]
  const historyVideos = history.map((h) => all.find((v) => v.id === h.id)).filter(Boolean) as Video[]
  const savedVideos = watchLater.map((id) => all.find((v) => v.id === id)).filter(Boolean) as Video[]
  const likedVideos = liked.map((id) => all.find((v) => v.id === id)).filter(Boolean) as Video[]

  const shortcuts = [
    { title: 'History', sub: plural(history.length, 'video'), icon: History, href: '#/feed/history', color: 'blue' },
    { title: 'Watch later', sub: plural(savedVideos.length, 'video'), icon: Clock, href: '#/playlist/watch-later', color: 'violet' },
    { title: 'Liked videos', sub: plural(likedVideos.length, 'video'), icon: ThumbsUp, href: '#/playlist/liked', color: 'rose' },
    { title: 'Your videos', sub: plural(customVideos.length, 'upload'), icon: PlaySquare, href: '#/channel/you', color: 'green' },
  ]

  return (
    <div className="page you-page">
      <div className="you-hero">
        <div className="you-hero-bg" style={{ backgroundImage: `url(${channel.banner})` }} />
        <Avatar src={channel.avatar} name={channel.name} size={88} />
        <div className="you-hero-copy">
          <h1>{channel.name}</h1>
          <p>@{channel.handle.replace('@', '')} · {formatFull(channel.subscribers)} subscribers</p>
          <span>{channel.description}</span>
        </div>
        <div className="you-hero-actions">
          <button className="outline-btn" onClick={() => navigate('/channel/you')}><UserRound size={18} /> View channel</button>
          <button className="primary-btn" onClick={() => setCreateOpen(true)}><Upload size={18} /> Create</button>
        </div>
      </div>

      <div className="shortcut-grid">
        {shortcuts.map((s) => (
          <a className="shortcut-card" href={s.href} key={s.title}>
            <span className={`shortcut-icon ${s.color}`}><s.icon size={22} /></span>
            <span><strong>{s.title}</strong><small>{s.sub}</small></span>
            <ChevronRight size={18} />
          </a>
        ))}
      </div>

      <div className="you-section-head">
        <h2>Continue watching</h2>
        <a href="#/feed/history">View all <ChevronRight size={16} /></a>
      </div>
      {historyVideos.length ? (
        <div className="video-grid">
          {historyVideos.slice(0, 4).map((v) => (
            <VideoCard key={v.id} video={v} progress={history.find((h) => h.id === v.id)?.progress ?? 0} />
          ))}
        </div>
      ) : (
        <div className="empty-state compact horizontal">
          <div className="empty-icon"><History size={26} /></div>
          <div>
            <h2>Keep track of what you watch</h2>
            <p>Your watch history will appear here so you can pick up where you left off.</p>
          </div>
          <a className="primary-btn" href="#/">Start watching</a>
        </div>
      )}

      <div className="you-section-head">
        <h2>Your lists</h2>
      </div>
      <div className="list-preview-grid">
        <a className="list-preview" href="#/playlist/watch-later">
          <div className="list-preview-thumbs">
            {savedVideos.slice(0, 3).map((v) => <img key={v.id} src={v.thumb} alt="" />)}
            {!savedVideos.length && <span className="list-empty"><Clock size={24} /></span>}
          </div>
          <div className="list-preview-info"><strong>Watch later</strong><span>{plural(savedVideos.length, 'video')}</span></div>
        </a>
        <a className="list-preview" href="#/playlist/liked">
          <div className="list-preview-thumbs">
            {likedVideos.slice(0, 3).map((v) => <img key={v.id} src={v.thumb} alt="" />)}
            {!likedVideos.length && <span className="list-empty"><ThumbsUp size={24} /></span>}
          </div>
          <div className="list-preview-info"><strong>Liked videos</strong><span>{plural(likedVideos.length, 'video')}</span></div>
        </a>
        <a className="list-preview" href="#/channel/you">
          <div className="list-preview-thumbs">
            {customVideos.slice(0, 3).map((v) => <img key={v.id} src={v.thumb} alt="" />)}
            {!customVideos.length && <span className="list-empty"><VideoIcon size={24} /></span>}
          </div>
          <div className="list-preview-info"><strong>Your videos</strong><span>{plural(customVideos.length, 'upload')}</span></div>
        </a>
      </div>
    </div>
  )
}

export const HistoryPage = () => {
  const { history, clearHistory, removeHistory, customVideos } = useApp()
  const all = [...customVideos, ...allVideos]
  const entries = history
    .map((h) => ({ entry: h, video: all.find((v) => v.id === h.id) }))
    .filter((x): x is { entry: typeof history[number]; video: Video } => Boolean(x.video))

  return (
    <div className="page history-page">
      <div className="page-title-row">
        <div>
          <h1>Watch history</h1>
          <p className="page-subtitle">{plural(entries.length, 'video')} watched · Only you can see this</p>
        </div>
        {entries.length > 0 && (
          <button className="outline-btn danger" onClick={clearHistory}><Trash2 size={17} /> Clear all history</button>
        )}
      </div>

      {entries.length ? (
        <>
          <div className="history-subhead"><h2>Recently watched</h2></div>
          <div className="row-list">
            {entries.map(({ entry, video }) => (
              <VideoCard
                key={video.id}
                video={video}
                layout="row"
                progress={entry.progress}
                onRemove={() => removeHistory(video.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><History size={30} /></div>
          <h2>Your watch history is empty</h2>
          <p>Videos you watch will show up here. You can pause or clear your history at any time.</p>
          <a className="primary-btn" href="#/">Explore videos</a>
        </div>
      )}
    </div>
  )
}

interface CollectionProps {
  kind: 'watch-later' | 'liked'
}

export const CollectionPage = ({ kind }: CollectionProps) => {
  const { watchLater, liked, customVideos, notify } = useApp()
  const all = [...customVideos, ...allVideos]
  const ids = kind === 'watch-later' ? watchLater : liked
  const list = ids.map((id) => all.find((v) => v.id === id)).filter(Boolean) as Video[]
  const title = kind === 'watch-later' ? 'Watch later' : 'Liked videos'
  const Icon = kind === 'watch-later' ? Clock : ThumbsUp
  const total = list.reduce((sum, v) => sum + v.views, 0)

  return (
    <div className="page collection-page">
      <div className="collection-hero">
        <div className="collection-cover">
          {list.length ? (
            <>
              {list.slice(0, 3).map((v, i) => <img key={v.id} src={v.thumb} alt="" style={{ transform: `rotate(${(i - 1) * 3}deg) translateX(${i * 9}px)` }} />)}
              <span className="collection-cover-count"><Play size={14} fill="currentColor" /> {list.length}</span>
            </>
          ) : <Icon size={48} />}
        </div>
        <div className="collection-info">
          <span className="collection-kicker">Playlist</span>
          <h1>{title}</h1>
          <p>Alex Morgan · {plural(list.length, 'video')} · {formatViews(total)} views</p>
          <p className="collection-desc">
            {kind === 'watch-later' ? 'Save videos to watch when you have time. Only you can see this playlist.' : 'Videos you liked. A personal collection of the good stuff.'}
          </p>
          <div className="collection-actions">
            <button className="primary-btn" disabled={!list.length} onClick={() => list[0] && navigate(watchUrl(list[0].id))}>
              <Play size={18} fill="currentColor" /> Play all
            </button>
            <button className="outline-btn" onClick={() => notify('Playlist sharing is a demo only')}>Share</button>
            <button className="outline-btn icon-only" onClick={() => notify('Playlist options are a demo only')} aria-label="More options">···</button>
          </div>
        </div>
      </div>

      {list.length ? (
        <div className="video-grid">{list.map((v) => <VideoCard key={v.id} video={v} />)}</div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Icon size={30} /></div>
          <h2>{kind === 'watch-later' ? 'Save videos for later' : 'Nothing liked yet'}</h2>
          <p>{kind === 'watch-later' ? 'Tap Save on any video and it will appear here.' : 'Like a video and it will be saved to this playlist.'}</p>
          <a className="primary-btn" href="#/">Browse videos</a>
        </div>
      )}
    </div>
  )
}
