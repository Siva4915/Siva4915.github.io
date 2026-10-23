import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Plus,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { channelById, commentsFor, formatFull, formatViews, shorts, type CommentItem, type Short } from '../data'
import { channelUrl } from '../router'
import { useApp } from '../store'
import { Avatar } from '../components/Avatar'
import { Verified } from '../components/Verified'

interface Props {
  shortId?: string
}

const ShortStage = ({
  short,
  active,
  muted,
  setMuted,
  onOpenComments,
}: {
  short: Short
  active: boolean
  muted: boolean
  setMuted: (fn: (m: boolean) => boolean) => void
  onOpenComments: () => void
}) => {
  const { liked, toggleLike, disliked, toggleDislike, isSubscribed, toggleSubscribe, notify } = useApp()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  const channel = channelById(short.channelId)!
  const isLiked = liked.includes(short.id)
  const isDisliked = disliked.includes(short.id)
  const subscribed = isSubscribed(short.channelId)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      v.currentTime = v.currentTime || 0
      void v.play().catch(() => setPaused(true))
      setPaused(false)
    } else {
      v.pause()
      v.currentTime = 0
      setPaused(false)
    }
  }, [active])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  const copyShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/shorts/${short.id}`
    try {
      await navigator.clipboard.writeText(url)
      notify('Short link copied', 'success')
    } catch {
      notify('Could not copy link')
    }
  }

  return (
    <section className={`short-stage ${active ? 'active' : ''}`} data-short={short.id}>
      <div className="short-player">
        <video
          ref={videoRef}
          className="short-video"
          src={short.video}
          poster={short.thumb}
          loop
          muted={muted}
          playsInline
          preload="metadata"
          onClick={toggle}
        />
        <div className="short-overlay" onClick={toggle} />
        {paused && active && (
          <button className="short-pause" aria-label="Play short" onClick={toggle}>
            <Play size={38} fill="currentColor" />
          </button>
        )}
        <div className="short-topline">
          <span className="short-pill"><span className="shorts-mark small"><span className="shorts-mark-play" /></span> Shorts</span>
          <button className="short-round-btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
        </div>

        <div className="short-ui">
          <div className="short-channel">
            <a className="short-channel-link" href={channelUrl(channel.id)}>
              <Avatar src={channel.avatar} name={channel.name} size={34} />
              <span>{channel.name} {channel.verified && <Verified size={12} />}</span>
            </a>
            <button
              className={`short-subscribe ${subscribed ? 'subscribed' : ''}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSubscribe(channel.id) }}
              aria-label={subscribed ? 'Unsubscribe' : 'Subscribe'}
            >
              {subscribed ? <Check size={13} /> : <Plus size={14} />}
            </button>
          </div>
          <h2 className="short-title">{short.title}</h2>
          <p className="short-tags">{short.hashtags.join(' ')}</p>
          <p className="short-audio"><Music2 size={13} /> Original audio · {channel.name}</p>
        </div>

        <div className="short-actions">
          <button className={`short-action ${isLiked ? 'active' : ''}`} onClick={() => toggleLike(short.id)}>
            <span className="short-action-circle"><ThumbsUp size={21} fill={isLiked ? 'currentColor' : 'none'} /></span>
            <small>{formatViews(short.likes + (isLiked ? 1 : 0))}</small>
          </button>
          <button className={`short-action ${isDisliked ? 'active' : ''}`} onClick={() => toggleDislike(short.id)}>
            <span className="short-action-circle"><ThumbsDown size={21} fill={isDisliked ? 'currentColor' : 'none'} /></span>
            <small>Dislike</small>
          </button>
          <button className="short-action" onClick={onOpenComments}>
            <span className="short-action-circle"><MessageCircle size={21} /></span>
            <small>{formatViews(short.comments)}</small>
          </button>
          <button className="short-action" onClick={copyShare}>
            <span className="short-action-circle"><Share2 size={21} /></span>
            <small>Share</small>
          </button>
          <button className="short-action" onClick={() => notify('Short options are a demo only')}>
            <span className="short-action-circle"><MoreHorizontal size={21} /></span>
          </button>
          <button className="short-avatar-action" onClick={() => toggleSubscribe(channel.id)} aria-label={subscribed ? 'Unsubscribe' : 'Subscribe'}>
            <Avatar src={channel.avatar} name={channel.name} size={36} />
            <span className={`short-avatar-badge ${subscribed ? 'subscribed' : ''}`}>{subscribed ? <Check size={11} /> : <Plus size={12} />}</span>
          </button>
        </div>

        <div className="short-sound-pill" onClick={() => setMuted((m) => !m)}>
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {muted ? 'Tap for sound' : 'Sound on'}
        </div>
      </div>
    </section>
  )
}

const CommentsDrawer = ({ short, onClose }: { short: Short; onClose: () => void }) => {
  const { notify } = useApp()
  const [comments, setComments] = useState<CommentItem[]>(commentsFor(short.id))
  const [text, setText] = useState('')
  const channel = channelById(short.channelId)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => {
    if (!text.trim()) return
    setComments((prev) => [{
      id: `sc-${Date.now()}`,
      author: 'Alex Morgan',
      avatar: '/avatars/a8.jpg',
      text: text.trim(),
      likes: 0,
      age: 'Just now',
      replies: 0,
    }, ...prev])
    setText('')
    notify('Comment posted', 'success')
  }

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="comments-drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div><h2>{formatFull(short.comments)} comments</h2><p>@{channel?.handle.replace('@', '')}</p></div>
          <button className="icon-btn" onClick={onClose} aria-label="Close comments"><X size={21} /></button>
        </div>
        <div className="drawer-comments">
          {comments.map((c) => (
            <div className="drawer-comment" key={c.id}>
              <Avatar src={c.avatar} name={c.author} size={32} />
              <div>
                <strong>{c.author}</strong>
                <p>{c.text}</p>
                <div className="comment-toolbar"><button><ThumbsUp size={13} /> {c.likes}</button><button>Reply</button></div>
              </div>
            </div>
          ))}
        </div>
        <div className="drawer-compose">
          <Avatar src="/avatars/a8.jpg" name="Alex Morgan" size={30} />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." onKeyDown={(e) => { if (e.key === 'Enter') submit() }} />
          <button disabled={!text.trim()} onClick={submit}>Post</button>
        </div>
      </aside>
    </div>
  )
}

export const Shorts = ({ shortId }: Props) => {
  const initial = shorts.find((s) => s.id === shortId)?.id ?? shorts[0].id
  const [activeId, setActiveId] = useState(initial)
  const [muted, setMuted] = useState(true)
  const [commentsForShort, setCommentsForShort] = useState<Short | null>(null)
  const stageRefs = useRef<Record<string, HTMLElement | null>>({})
  const initialRef = useRef(initial)

  useEffect(() => {
    const target = stageRefs.current[initialRef.current]
    if (target) {
      window.setTimeout(() => target.scrollIntoView({ block: 'start' }), 40)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const id = (entry.target as HTMLElement).dataset.short
            if (id) setActiveId(id)
          }
        })
      },
      { threshold: [0.55, 0.75] },
    )
    Object.values(stageRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT'].includes(target.tagName) || target.isContentEditable) return
      const index = shorts.findIndex((s) => s.id === activeId)
      let next = index
      if (e.key === 'ArrowDown') next = Math.min(shorts.length - 1, index + 1)
      else if (e.key === 'ArrowUp') next = Math.max(0, index - 1)
      else return
      e.preventDefault()
      const el = stageRefs.current[shorts[next].id]
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId])

  const activeShort = useMemo(() => shorts.find((s) => s.id === activeId), [activeId])

  return (
    <div className="shorts-page">
      <div className="shorts-top-note">
        <a href="#/" className="short-back"><ArrowLeft size={18} /> Back</a>
        <span><span className="shorts-mark small"><span className="shorts-mark-play" /></span> Shorts</span>
        <div className="short-updown">
          <button
            aria-label="Previous short"
            onClick={() => {
              const i = shorts.findIndex((s) => s.id === activeId)
              if (i > 0) stageRefs.current[shorts[i - 1].id]?.scrollIntoView({ behavior: 'smooth' })
            }}
          ><ChevronUp size={18} /></button>
          <button
            aria-label="Next short"
            onClick={() => {
              const i = shorts.findIndex((s) => s.id === activeId)
              if (i < shorts.length - 1) stageRefs.current[shorts[i + 1].id]?.scrollIntoView({ behavior: 'smooth' })
            }}
          ><ChevronDown size={18} /></button>
        </div>
      </div>

      {shorts.map((short) => (
        <div className="short-stage-wrap" key={short.id} data-short={short.id} ref={(el) => { stageRefs.current[short.id] = el }}>
          <ShortStage
            short={short}
            active={activeId === short.id}
            muted={muted}
            setMuted={setMuted}
            onOpenComments={() => setCommentsForShort(short)}
          />
        </div>
      ))}

      {activeShort && <div className="short-scroll-hint"><ChevronDown size={16} /> Scroll for more</div>}
      {commentsForShort && <CommentsDrawer short={commentsForShort} onClose={() => setCommentsForShort(null)} />}
    </div>
  )
}
