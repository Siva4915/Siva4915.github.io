import { Compass, ListVideo, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { channels, plural, videos as allVideos } from '../data'
import { channelUrl } from '../router'
import { useApp } from '../store'
import { Avatar } from '../components/Avatar'
import { Chips } from '../components/Chips'
import { SubscribeButton } from '../components/SubscribeButton'
import { VideoCard } from '../components/VideoCard'
import { Verified } from '../components/Verified'

const filters = ['All', 'Today', 'Continue watching', 'Unwatched', 'Live']

export const Subscriptions = () => {
  const { subscribed, customVideos, hidden, history, notify } = useApp()
  const [filter, setFilter] = useState('All')
  const subscribedChannels = channels.filter((c) => subscribed.includes(c.id))

  const feed = useMemo(() => {
    const items = [...customVideos, ...allVideos].filter((v) => subscribed.includes(v.channelId) && !hidden.includes(v.id))
    if (filter === 'Unwatched') return items.filter((v) => !history.some((h) => h.id === v.id))
    if (filter === 'Continue watching') return items.filter((v) => history.some((h) => h.id === v.id && h.progress > 0.02 && h.progress < 0.95))
    return items
  }, [subscribed, customVideos, hidden, history, filter])

  return (
    <div className="page subscriptions-page">
      <div className="page-title-row">
        <div>
          <h1>Subscriptions</h1>
          <p className="page-subtitle">{plural(subscribedChannels.length, 'channel')} · Fresh uploads from the creators you follow</p>
        </div>
        <button className="outline-btn" onClick={() => notify('Subscription settings are a demo only')}>
          <Settings2 size={18} /> Manage
        </button>
      </div>

      {subscribedChannels.length > 0 && (
        <div className="sub-avatars">
          {subscribedChannels.map((c) => (
            <a className="sub-avatar" href={channelUrl(c.id)} key={c.id}>
              <span className="sub-avatar-ring"><Avatar src={c.avatar} name={c.name} size={58} /></span>
              <span>{c.name}</span>
            </a>
          ))}
          <a className="sub-avatar manage" href="#/results?q=channels">
            <span className="sub-avatar-ring manage-ring"><ListVideo size={24} /></span>
            <span>Browse channels</span>
          </a>
        </div>
      )}

      <Chips categories={filters} active={filter} onChange={setFilter} />

      {subscribedChannels.length === 0 ? (
        <div className="empty-state discover">
          <div className="empty-icon"><Compass size={30} /></div>
          <h2>Bring your favorite creators here</h2>
          <p>Subscribe to channels and their newest videos will show up in this feed.</p>
          <div className="discover-grid">
            {channels.filter((c) => c.id !== 'you').slice(0, 6).map((c) => (
              <div className="discover-card" key={c.id}>
                <a href={channelUrl(c.id)} className="discover-banner">
                  <img src={c.banner} alt="" />
                </a>
                <div className="discover-body">
                  <a href={channelUrl(c.id)}><Avatar src={c.avatar} name={c.name} size={48} /></a>
                  <a className="discover-name" href={channelUrl(c.id)}>{c.name} {c.verified && <Verified size={13} />}</a>
                  <p>{c.description.split('.')[0]}.</p>
                  <SubscribeButton channelId={c.id} subscribers={c.subscribers} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : feed.length ? (
        <div className={filter === 'Continue watching' ? 'history-list' : 'video-grid'}>
          {feed.map((video) => {
            const p = history.find((h) => h.id === video.id)?.progress ?? 0
            return <VideoCard key={video.id} video={video} progress={p} />
          })}
        </div>
      ) : (
        <div className="empty-state compact">
          <div className="empty-icon"><ListVideo size={26} /></div>
          <h2>No videos in this filter</h2>
          <p>Try another filter to see more from your subscriptions.</p>
          <button className="primary-btn" onClick={() => setFilter('All')}>Show all</button>
        </div>
      )}
    </div>
  )
}
