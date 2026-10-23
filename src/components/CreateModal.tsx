import {
  Check,
  ChevronDown,
  FileVideo,
  Globe2,
  Image as ImageIcon,
  Link2,
  Lock,
  Radio,
  Sparkles,
  UploadCloud,
  Users,
  Video as VideoIcon,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatViews, type Video } from '../data'
import { navigate, watchUrl } from '../router'
import { useApp } from '../store'

type Tab = 'upload' | 'live' | 'post'

const thumbChoices = [
  { src: '/thumbs/desk.jpg', label: 'Desk' },
  { src: '/thumbs/ai.jpg', label: 'Abstract' },
  { src: '/thumbs/camera.jpg', label: 'Camera' },
  { src: '/thumbs/studio.jpg', label: 'Studio' },
  { src: '/thumbs/tokyo.jpg', label: 'City' },
  { src: '/thumbs/mountainlake.jpg', label: 'Landscape' },
]

const cleanTitle = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase())

const sizeLabel = (bytes: number) => {
  if (bytes > 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return Math.round(bytes / 1024) + ' KB'
}

export const CreateModal = () => {
  const { createOpen, setCreateOpen, addCustomVideo, notify } = useApp()
  const [tab, setTab] = useState<Tab>('upload')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('Public')
  const [category, setCategory] = useState('Technology')
  const [thumb, setThumb] = useState(thumbChoices[0].src)
  const [videoFile, setVideoFile] = useState<{ url: string; name: string; size: number } | null>(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [madeForKids, setMadeForKids] = useState(false)
  const [postText, setPostText] = useState('')
  const [visibilityOpen, setVisibilityOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const videoInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const previewVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!createOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCreateOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [createOpen, setCreateOpen])

  useEffect(() => {
    if (createOpen) {
      const t = window.setTimeout(() => titleRef.current?.focus(), 180)
      return () => window.clearTimeout(t)
    }
  }, [createOpen])

  useEffect(() => {
    if (!createOpen) return
    setTab('upload')
    setPublishing(false)
  }, [createOpen])

  if (!createOpen) return null

  const takeVideo = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      notify('Please choose a video file')
      return
    }
    const url = URL.createObjectURL(file)
    setVideoFile({ url, name: file.name, size: file.size })
    setVideoDuration(0)
    if (!title.trim()) setTitle(cleanTitle(file.name).slice(0, 90))
    notify('Video added — ready to publish', 'success')
  }

  const takeImage = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      notify('Please choose an image file')
      return
    }
    setThumb(URL.createObjectURL(file))
  }

  const publish = () => {
    if (!title.trim()) {
      notify('Add a title before publishing')
      titleRef.current?.focus()
      return
    }
    setPublishing(true)
    const id = `upload-${Date.now()}`
    const today = new Date().toISOString().slice(0, 10)
    const tags = title.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 5)
    const video: Video = {
      id,
      title: title.trim(),
      channelId: 'you',
      category,
      duration: Math.round(videoDuration) || 60,
      views: 0,
      likes: 0,
      comments: 0,
      age: 'Just now',
      publishedAt: today,
      thumb,
      video: videoFile?.url ?? '/videos/flower.mp4',
      badge: 'NEW',
      thumbText: title.trim().split(/\s+/).slice(0, 3).join(' ').toUpperCase(),
      description: description.trim() || `${title.trim()}\n\nUploaded to Vuemora. Thanks for watching!`,
      tags: tags.length ? tags : ['new', 'upload'],
      custom: true,
    }
    window.setTimeout(() => {
      addCustomVideo(video)
      setPublishing(false)
      setCreateOpen(false)
      setTitle('')
      setDescription('')
      setVideoFile(null)
      setVideoDuration(0)
      setThumb(thumbChoices[0].src)
      notify('Video published to your channel', 'success')
      navigate(watchUrl(id))
    }, 1100)
  }

  const publishPost = () => {
    if (!postText.trim()) {
      notify('Write something first')
      return
    }
    setCreateOpen(false)
    setPostText('')
    notify('Post shared with your subscribers', 'success')
  }

  return (
    <div className="modal-backdrop create-backdrop" onMouseDown={() => !publishing && setCreateOpen(false)}>
      <div className="create-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Create">
        <div className="create-head">
          <div className="create-brand"><span className="logo-mark small"><span className="logo-v">V</span></span><span>Create</span></div>
          <div className="create-tabs">
            <button className={tab === 'upload' ? 'active' : ''} onClick={() => setTab('upload')}><UploadCloud size={17} /> Upload video</button>
            <button className={tab === 'live' ? 'active' : ''} onClick={() => setTab('live')}><Radio size={17} /> Go live</button>
            <button className={tab === 'post' ? 'active' : ''} onClick={() => setTab('post')}><Sparkles size={17} /> Create post</button>
          </div>
          <button className="icon-btn" onClick={() => setCreateOpen(false)} aria-label="Close create dialog"><X size={21} /></button>
        </div>

        {tab === 'upload' && (
          <div className="create-body">
            <div className="upload-column">
              <div
                className={`drop-zone ${dragging ? 'dragging' : ''} ${videoFile ? 'has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); takeVideo(e.dataTransfer.files[0]) }}
                onClick={() => !videoFile && videoInput.current?.click()}
              >
                <input
                  ref={videoInput}
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => { takeVideo(e.target.files?.[0]); e.currentTarget.value = '' }}
                />
                {videoFile ? (
                  <>
                    <video
                      ref={previewVideo}
                      src={videoFile.url}
                      className="upload-preview"
                      controls
                      preload="metadata"
                      onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
                    />
                    <div className="upload-file-bar">
                      <FileVideo size={18} />
                      <span>{videoFile.name}</span>
                      <small>{sizeLabel(videoFile.size)}</small>
                      <button onClick={(e) => { e.stopPropagation(); setVideoFile(null) }} aria-label="Remove file"><X size={16} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="drop-icon"><UploadCloud size={38} /></div>
                    <h3>Drag and drop a video file</h3>
                    <p>Your video will be private until you publish it. MP4, MOV or WebM up to 2 GB.</p>
                    <button className="primary-btn" type="button" onClick={(e) => { e.stopPropagation(); videoInput.current?.click() }}>
                      <UploadCloud size={18} /> Select file
                    </button>
                    <span className="drop-hint">Or drag and drop it here</span>
                  </>
                )}
              </div>

              <div className="upload-thumb-picker">
                <div className="field-label-row">
                  <span className="field-label">Thumbnail</span>
                  <button className="text-btn" onClick={() => imageInput.current?.click()}><ImageIcon size={15} /> Upload custom</button>
                  <input ref={imageInput} type="file" accept="image/*" hidden onChange={(e) => { takeImage(e.target.files?.[0]); e.currentTarget.value = '' }} />
                </div>
                <div className="thumb-options">
                  {thumbChoices.map((t) => (
                    <button key={t.src} className={`thumb-choice ${thumb === t.src ? 'active' : ''}`} onClick={() => setThumb(t.src)} aria-label={`Use ${t.label} thumbnail`}>
                      <img src={t.src} alt="" />
                      {thumb === t.src && <span className="thumb-check"><Check size={14} /></span>}
                    </button>
                  ))}
                  {thumb.startsWith('blob:') && (
                    <button className="thumb-choice active">
                      <img src={thumb} alt="" />
                      <span className="thumb-check"><Check size={14} /></span>
                    </button>
                  )}
                </div>
                <p className="field-help">Choose a frame that makes people want to click. Custom thumbnails can be uploaded as JPG, PNG or WebP.</p>
              </div>
            </div>

            <div className="form-column">
              <label className="field">
                <span>Title <em>Required</em></span>
                <input ref={titleRef} value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} placeholder="Add a title that describes your video" />
                <small>{title.length}/100</small>
              </label>

              <label className="field">
                <span>Description</span>
                <textarea value={description} rows={5} maxLength={5000} onChange={(e) => setDescription(e.target.value)} placeholder="Tell viewers about your video. Add chapters, links, or a little context." />
                <small>{description.length}/5000</small>
              </label>

              <div className="field-row">
                <div className="field">
                  <span>Category</span>
                  <div className="select-wrap">
                    <button className="select-button" onClick={() => { setCategoryOpen((v) => !v); setVisibilityOpen(false) }}>
                      {category} <ChevronDown size={16} />
                    </button>
                    {categoryOpen && (
                      <div className="select-menu">
                        {['Technology', 'Music', 'Gaming', 'Film', 'Travel', 'Food', 'Photography', 'Science', 'Design', 'Outdoors', 'DIY', 'News'].map((c) => (
                          <button key={c} className={category === c ? 'active' : ''} onClick={() => { setCategory(c); setCategoryOpen(false) }}>{c} {category === c && <Check size={14} />}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="field">
                  <span>Visibility</span>
                  <div className="select-wrap">
                    <button className="select-button" onClick={() => { setVisibilityOpen((v) => !v); setCategoryOpen(false) }}>
                      {visibility === 'Public' ? <Globe2 size={16} /> : visibility === 'Unlisted' ? <Link2 size={16} /> : <Lock size={16} />}
                      {visibility} <ChevronDown size={16} />
                    </button>
                    {visibilityOpen && (
                      <div className="select-menu visibility-menu">
                        <button className={visibility === 'Public' ? 'active' : ''} onClick={() => { setVisibility('Public'); setVisibilityOpen(false) }}><Globe2 size={16} /> Public <small>Everyone can watch</small></button>
                        <button className={visibility === 'Unlisted' ? 'active' : ''} onClick={() => { setVisibility('Unlisted'); setVisibilityOpen(false) }}><Link2 size={16} /> Unlisted <small>Anyone with the link</small></button>
                        <button className={visibility === 'Private' ? 'active' : ''} onClick={() => { setVisibility('Private'); setVisibilityOpen(false) }}><Lock size={16} /> Private <small>Only you</small></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="field-inline">
                <label className="check-line"><input type="checkbox" checked={madeForKids} onChange={(e) => setMadeForKids(e.target.checked)} /><span>Made for kids</span></label>
                <span className="field-help">You still have to comply with children's privacy laws.</span>
              </div>

              <div className="upload-notes">
                <div><Users size={17} /><span>This video will be published to <strong>Alex Morgan</strong>.</span></div>
                <div><ShieldNote /> Your upload is processed locally in this demo — no data leaves your browser.</div>
              </div>

              <div className="create-footer">
                <button className="text-btn" onClick={() => setCreateOpen(false)}>Cancel</button>
                <button className="primary-btn publish-btn" onClick={publish} disabled={publishing || !title.trim()}>
                  {publishing ? <><span className="spinner" /> Publishing…</> : <><UploadCloud size={18} /> Publish video</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'live' && (
          <div className="live-panel">
            <div className="live-visual">
              <div className="live-camera"><VideoIcon size={52} /><span>Camera preview</span></div>
              <div className="live-badge"><span /> Ready to go live</div>
            </div>
            <div className="live-form">
              <h2>Go live</h2>
              <p>Start a live stream with your audience. Streaming is a visual demo in this build.</p>
              <label className="field"><span>Stream title</span><input placeholder="e.g. Friday build session — come hang out" /></label>
              <label className="field"><span>Visibility</span><button className="select-button"><Globe2 size={16} /> Public <ChevronDown size={16} /></button></label>
              <div className="stream-settings"><Users size={18} /><div><strong>Stream settings</strong><span>1080p · 60fps · Stereo audio</span></div><button className="text-btn">Edit</button></div>
              <div className="create-footer">
                <button className="text-btn" onClick={() => setCreateOpen(false)}>Cancel</button>
                <button className="primary-btn" onClick={() => { setCreateOpen(false); notify('Live streaming is a visual demo only') }}><Radio size={18} /> Go live</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'post' && (
          <div className="post-panel">
            <div className="post-compose">
              <div className="post-author"><span className="avatar" style={{ width: 42, height: 42 }}><img src="/avatars/a8.jpg" alt="" /></span><div><strong>Alex Morgan</strong><span>Post to subscribers</span></div></div>
              <textarea value={postText} onChange={(e) => setPostText(e.target.value)} rows={6} placeholder="Share an update, a poll idea, or something you're working on..." />
              <div className="post-actions">
                <span>{postText.length}/500</span>
                <div>
                  <button className="text-btn" onClick={() => setCreateOpen(false)}>Cancel</button>
                  <button className="primary-btn" onClick={publishPost}>Post</button>
                </div>
              </div>
            </div>
            <div className="post-side">
              <ImageIcon size={30} />
              <h3>Create a post</h3>
              <p>Share updates with your subscribers without uploading a video. Posts appear in the community tab of your channel.</p>
              <span className="post-tip">Good posts are short, personal and start a conversation.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ShieldNote = () => <span className="shield-note">✓</span>
