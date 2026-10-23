import { Clock, EyeOff, ListPlus, MoreVertical, Share2, UserX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { channelById, formatDuration, formatViews, type Video } from '../data'
import { channelUrl, watchUrl } from '../router'
import { useApp } from '../store'
import { Avatar } from './Avatar'
import { Verified } from './Verified'

interface Props {
  video: Video
  progress?: number
  layout?: 'grid' | 'row'
  showDescription?: boolean
  onRemove?: () => void
}

export const VideoCard = ({ video, progress = 0, layout = 'grid', showDescription = false, onRemove }: Props) => {
  const { toggleWatchLater, isSaved, hideVideo, notify } = useApp()
  const [menu, setMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const channel = channelById(video.channelId)

  useEffect(() => {
    if (!menu) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menu])

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/watch/${video.id}`
    try {
      await navigator.clipboard.writeText(url)
      notify('Link copied to clipboard', 'success')
    } catch {
      notify('Could not copy link')
    }
    setMenu(false)
  }

  const menuMarkup = (
    <div className="card-menu-wrap" ref={menuRef}>
      <button
        className={`card-menu-btn ${layout === 'row' ? 'row-menu-btn' : ''}`}
        aria-label="More actions"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setMenu((v) => !v)
        }}
      >
        <MoreVertical size={19} />
      </button>
      {menu && (
        <div className="card-menu">
          <button onClick={() => { toggleWatchLater(video.id); setMenu(false) }}>
            <Clock size={17} /> {isSaved(video.id) ? 'Remove from Watch later' : 'Save to Watch later'}
          </button>
          <button onClick={() => { notify('Saved to a new playlist', 'success'); setMenu(false) }}>
            <ListPlus size={17} /> Save to playlist
          </button>
          <button onClick={copyLink}><Share2 size={17} /> Share</button>
          <div className="menu-divider" />
          {onRemove ? (
            <button onClick={() => { onRemove(); setMenu(false) }}><EyeOff size={17} /> Remove from list</button>
          ) : (
            <button onClick={() => { hideVideo(video.id); setMenu(false) }}><EyeOff size={17} /> Not interested</button>
          )}
          <button onClick={() => { notify(`You won't see videos from ${channel?.name ?? 'this channel'} as often`); setMenu(false) }}>
            <UserX size={17} /> Don't recommend channel
          </button>
        </div>
      )}
    </div>
  )

  const thumbnail = (
    <a className="thumb-link" href={watchUrl(video.id)} aria-label={video.title}>
      <img src={video.thumb} alt="" loading="lazy" />
      <span className="thumb-shade" />
      {video.thumbText && <span className="thumb-title">{video.thumbText}</span>}
      <span className="duration">{formatDuration(video.duration)}</span>
      {video.badge && <span className="video-badge">{video.badge}</span>}
      {progress > 0.01 && <span className="watch-progress" style={{ width: `${Math.min(progress, 1) * 100}%` }} />}
    </a>
  )

  if (layout === 'row') {
    return (
      <article className="video-row">
        <div className="row-thumb-wrap">{thumbnail}</div>
        <div className="row-body">
          <div className="row-title-line">
            <a className="row-title" href={watchUrl(video.id)}>{video.title}</a>
            {menuMarkup}
          </div>
          <div className="row-stats">{formatViews(video.views)} views · {video.age}</div>
          <a className="row-channel" href={channelUrl(video.channelId)}>
            <Avatar src={channel?.avatar} name={channel?.name ?? 'Channel'} size={24} />
            <span>{channel?.name}</span>
            {channel?.verified && <Verified size={13} />}
          </a>
          {showDescription && <p className="row-description">{video.description.split('\n')[0]}</p>}
          <div className="row-actions">
            <button className="row-action" onClick={() => toggleWatchLater(video.id)}>
              <Clock size={15} /> {isSaved(video.id) ? 'Saved' : 'Watch later'}
            </button>
            <button className="row-action" onClick={copyLink}><Share2 size={15} /> Share</button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="video-card">
      <div className="thumb-wrap">
        {thumbnail}
        {menuMarkup}
      </div>
      <div className="card-meta">
        <a className="card-avatar" href={channelUrl(video.channelId)} aria-label={channel?.name}>
          <Avatar src={channel?.avatar} name={channel?.name ?? 'Channel'} size={36} />
        </a>
        <div className="card-text">
          <a className="card-title" href={watchUrl(video.id)} title={video.title}>{video.title}</a>
          <a className="card-channel" href={channelUrl(video.channelId)}>
            {channel?.name} {channel?.verified && <Verified size={13} />}
          </a>
          <div className="card-stats">{formatViews(video.views)} views · {video.age}</div>
        </div>
      </div>
    </article>
  )
}
