import {
  Bell,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Facebook,
  Flag,
  Link2,
  Mail,
  MessageCircle,
  MoreHorizontal,
  PlaySquare,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Twitter,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  channelById,
  commentsFor,
  formatDuration,
  formatFull,
  formatPublished,
  formatViews,
  relatedVideos,
  videoById,
  type CommentItem,
  type Video,
} from '../data'
import { channelUrl, navigate, watchUrl } from '../router'
import { useApp } from '../store'
import { Avatar } from '../components/Avatar'
import { SubscribeButton } from '../components/SubscribeButton'
import { Verified } from '../components/Verified'
import { VideoPlayer } from '../components/VideoPlayer'

interface Props {
  videoId: string
}

const UpNextCard = ({ video }: { video: Video }) => {
  const channel = channelById(video.channelId)
  return (
    <a className="up-next-card" href={watchUrl(video.id)}>
      <div className="up-next-thumb">
        <img src={video.thumb} alt="" loading="lazy" />
        <span className="duration small">{formatDuration(video.duration)}</span>
      </div>
      <div className="up-next-info">
        <h4>{video.title}</h4>
        <p>{channel?.name} {channel?.verified && <Verified size={12} />}</p>
        <p>{formatViews(video.views)} views · {video.age}</p>
      </div>
    </a>
  )
}

const ShareModal = ({ video, onClose }: { video: Video; onClose: () => void }) => {
  const { notify } = useApp()
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}${window.location.pathname}#/watch/${video.id}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      notify('Link copied to clipboard', 'success')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      notify('Could not copy link')
    }
  }

  const shareTo = (name: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=620,height=560')
    notify(`Opening ${name}…`)
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="share-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Share video">
        <div className="modal-head">
          <h2>Share</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={21} /></button>
        </div>
        <div className="share-preview">
          <img src={video.thumb} alt="" />
          <div>
            <h3>{video.title}</h3>
            <p>{channelById(video.channelId)?.name}</p>
          </div>
        </div>
        <div className="share-targets">
          <button onClick={copy}><span className="share-target-icon"><Copy size={21} /></span>Copy link</button>
          <button onClick={() => shareTo('WhatsApp', `https://wa.me/?text=${encodeURIComponent(video.title + ' ' + link)}`)}>
            <span className="share-target-icon green"><MessageCircle size={21} /></span>WhatsApp
          </button>
          <button onClick={() => shareTo('X', `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(video.title)}`)}>
            <span className="share-target-icon dark"><Twitter size={20} /></span>X
          </button>
          <button onClick={() => shareTo('Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`)}>
            <span className="share-target-icon blue"><Facebook size={20} /></span>Facebook
          </button>
          <button onClick={() => shareTo('Email', `mailto:?subject=${encodeURIComponent(video.title)}&body=${encodeURIComponent(link)}`)}>
            <span className="share-target-icon slate"><Mail size={20} /></span>Email
          </button>
        </div>
        <div className="share-link-row">
          <Link2 size={17} />
          <input value={link} readOnly aria-label="Video link" onFocus={(e) => e.currentTarget.select()} />
          <button onClick={copy}>{copied ? <><Check size={16} /> Copied</> : 'Copy'}</button>
        </div>
        <label className="share-start"><input type="checkbox" /> Start at 0:00</label>
      </div>
    </div>
  )
}

export const Watch = ({ videoId }: Props) => {
  const { customVideos, liked, disliked, toggleLike, toggleDislike, toggleWatchLater, isSaved, isSubscribed, hideVideo, notify } = useApp()
  const video = videoById(videoId, customVideos)
  const [expanded, setExpanded] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [theater, setTheater] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [sort, setSort] = useState<'top' | 'newest'>('top')
  const [userComments, setUserComments] = useState<CommentItem[]>([])
  const [commentText, setCommentText] = useState('')
  const [likedComments, setLikedComments] = useState<string[]>([])
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  const comments = useMemo(() => (video?.custom ? [] : commentsFor(videoId)), [videoId, video?.custom])

  useEffect(() => {
    setExpanded(false)
    setShareOpen(false)
    setTheater(false)
    setUserComments([])
    setCommentText('')
    window.scrollTo({ top: 0 })
  }, [videoId])

  useEffect(() => {
    if (!moreOpen) return
    const close = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [moreOpen])

  if (!video) {
    return (
      <div className="page not-found">
        <div className="empty-illustration">404</div>
        <h1>Video not found</h1>
        <p>This video may have been removed, or the link is incorrect.</p>
        <a className="primary-btn" href="#/">Go to home</a>
      </div>
    )
  }

  const channel = channelById(video.channelId)!
  const upNext = relatedVideos(video, customVideos)
  const isLiked = liked.includes(video.id)
  const isDisliked = disliked.includes(video.id)
  const saved = isSaved(video.id)
  const allComments = [...userComments, ...comments]
  const sortedComments = sort === 'top' ? [...allComments].sort((a, b) => b.likes - a.likes) : allComments
  const likeCount = video.likes + (isLiked ? 1 : 0)
  const descriptionLines = video.description.split('\n')

  const addComment = () => {
    const text = commentText.trim()
    if (!text) {
      commentInputRef.current?.focus()
      return
    }
    const comment: CommentItem = {
      id: `user-${Date.now()}`,
      author: 'Alex Morgan',
      avatar: '/avatars/a8.jpg',
      text,
      likes: 0,
      age: 'Just now',
      replies: 0,
    }
    setUserComments((prev) => [comment, ...prev])
    setCommentText('')
    notify('Comment posted', 'success')
  }

  return (
    <div className={`watch-page ${theater ? 'theater' : ''}`}>
      <div className="watch-main">
        <VideoPlayer video={video} nextVideo={upNext[0]} theater={theater} onToggleTheater={() => setTheater((v) => !v)} />

        <h1 className="watch-title">{video.title}</h1>

        <div className="watch-meta">
          <div className="watch-channel">
            <a href={channelUrl(channel.id)}><Avatar src={channel.avatar} name={channel.name} size={40} /></a>
            <div className="watch-channel-text">
              <a href={channelUrl(channel.id)} className="watch-channel-name">
                {channel.name} {channel.verified && <Verified size={14} />}
              </a>
              <span>{formatViews(channel.subscribers)} subscribers</span>
            </div>
            <SubscribeButton channelId={channel.id} subscribers={channel.subscribers} />
          </div>

          <div className="watch-actions">
            <div className={`action-pill like-pill ${isLiked ? 'active' : ''}`}>
              <button onClick={() => toggleLike(video.id)} aria-label="Like" aria-pressed={isLiked}>
                <ThumbsUp size={19} fill={isLiked ? 'currentColor' : 'none'} /> {formatViews(likeCount)}
              </button>
              <span className="action-divider" />
              <button onClick={() => toggleDislike(video.id)} aria-label="Dislike" aria-pressed={isDisliked} className={isDisliked ? 'active' : ''}>
                <ThumbsDown size={19} fill={isDisliked ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button className="action-pill" onClick={() => setShareOpen(true)}><Share2 size={19} /> Share</button>
            <button className={`action-pill ${saved ? 'active' : ''}`} onClick={() => toggleWatchLater(video.id)}>
              {saved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />} {saved ? 'Saved' : 'Save'}
            </button>
            <button className="action-pill icon-only" onClick={() => notify('Download is not available in this demo')} aria-label="Download">
              <Download size={19} />
            </button>
            <div className="popover-wrap" ref={moreRef}>
              <button className="action-pill icon-only" aria-label="More actions" onClick={() => setMoreOpen((v) => !v)}>
                <MoreHorizontal size={19} />
              </button>
              {moreOpen && (
                <div className="card-menu watch-more-menu">
                  <button onClick={() => { setMoreOpen(false); notify('Transcript is a demo only') }}>
                    <PlaySquare size={17} /> Show transcript
                  </button>
                  <button onClick={() => { setMoreOpen(false); notify('Report submitted (demo)') }}>
                    <Flag size={17} /> Report
                  </button>
                  <div className="menu-divider" />
                  <button onClick={() => { setMoreOpen(false); hideVideo(video.id); navigate('/') }}>
                    <X size={17} /> Not interested
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`watch-description ${expanded ? 'expanded' : ''}`}>
          <div className="description-stats">
            <strong>{formatFull(video.views)} views</strong>
            <span>{formatPublished(video.publishedAt)}</span>
            <div className="description-tags">
              {video.tags.slice(0, 3).map((tag) => <a key={tag} href={`#/results?q=${encodeURIComponent(tag)}`}>#{tag.replace(/\s+/g, '')}</a>)}
            </div>
          </div>
          <div className="description-text">
            {descriptionLines.map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>
          {video.chapters && (
            <div className="chapters">
              {video.chapters.map((ch) => (
                <button key={ch.time} onClick={() => notify(`Chapters are a visual demo — seek to ${ch.time}`)}>
                  <span>{ch.time}</span>{ch.title}
                </button>
              ))}
            </div>
          )}
          <button className="show-more-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? <>Show less <ChevronUp size={16} /></> : <>Show more <ChevronDown size={16} /></>}
          </button>
        </div>

        <section className="comments-section" aria-label="Comments">
          <div className="comments-head">
            <h2>{formatFull((video.custom ? 0 : video.comments) + userComments.length)} Comments</h2>
            <button className="sort-btn" onClick={() => setSort((s) => (s === 'top' ? 'newest' : 'top'))}>
              <span className="sort-lines"><i /><i /></span> Sort by {sort === 'top' ? 'top' : 'newest'}
            </button>
          </div>

          <div className="add-comment">
            <Avatar src="/avatars/a8.jpg" name="Alex Morgan" size={40} />
            <div className="add-comment-body">
              <textarea
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={commentText ? 3 : 1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addComment()
                }}
              />
              <div className={`comment-actions ${commentText ? 'show' : ''}`}>
                <button className="text-btn" onClick={() => setCommentText('')}>Cancel</button>
                <button className="comment-submit" disabled={!commentText.trim()} onClick={addComment}>Comment</button>
              </div>
            </div>
          </div>

          <div className="comment-list">
            {sortedComments.map((comment) => {
              const commentLiked = likedComments.includes(comment.id)
              return (
                <article className="comment" key={comment.id}>
                  <Avatar src={comment.avatar} name={comment.author} size={40} />
                  <div className="comment-body">
                    <div className="comment-author-line">
                      <strong>{comment.author}</strong>
                      <span>{comment.age}</span>
                      {comment.pinned && <span className="pinned-badge">Pinned by creator</span>}
                    </div>
                    <p>{comment.text}</p>
                    <div className="comment-toolbar">
                      <button
                        className={commentLiked ? 'active' : ''}
                        onClick={() => setLikedComments((prev) => commentLiked ? prev.filter((id) => id !== comment.id) : [...prev, comment.id])}
                      >
                        <ThumbsUp size={15} fill={commentLiked ? 'currentColor' : 'none'} /> {comment.likes + (commentLiked ? 1 : 0)}
                      </button>
                      <button onClick={() => notify('Comment disliked')}><ThumbsDown size={15} /></button>
                      <button onClick={() => commentInputRef.current?.focus()}>Reply</button>
                      {comment.hearted && <span className="creator-heart" title="Hearted by creator">❤</span>}
                    </div>
                    {comment.replies > 0 && (
                      <button className="replies-btn" onClick={() => notify(`${comment.replies} replies — reply threads are a demo`)}>
                        <ChevronDown size={15} /> {comment.replies} replies
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
            {allComments.length === 0 && (
              <div className="no-comments">
                <MessageCircle size={22} />
                <div><strong>No comments yet</strong><span>Start the conversation — be the first to comment.</span></div>
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="watch-aside">
        <div className="up-next-head">
          <h2>Up next</h2>
          <label className="autoplay-toggle">
            Autoplay
            <button className={`switch ${autoplay ? 'on' : ''}`} onClick={() => setAutoplay((v) => !v)} aria-pressed={autoplay} aria-label="Autoplay">
              <span />
            </button>
          </label>
        </div>
        <div className="up-next-list">
          {upNext.map((v) => <UpNextCard key={v.id} video={v} />)}
        </div>
        <a className="show-more-upnext" href="#/">Show more</a>
      </aside>

      {shareOpen && <ShareModal video={video} onClose={() => setShareOpen(false)} />}
    </div>
  )
}
