import {
  Captions,
  Check,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RectangleHorizontal,
  RotateCcw,
  Settings,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { channelById, formatDuration, type Video } from '../data'
import { navigate, watchUrl } from '../router'
import { useApp } from '../store'

interface Props {
  video: Video
  nextVideo?: Video
  theater: boolean
  onToggleTheater: () => void
}

const demoCaptions = [
  'The best setup starts with what you actually need.',
  'Everything else is just decoration.',
  'So we measured the desk, mapped the cables, and started again.',
  'This is the part nobody shows you.',
  'But it is also the part that makes the biggest difference.',
  'Thanks for watching — see you in the next one.',
]

export const VideoPlayer = ({ video, nextVideo, theater, onToggleTheater }: Props) => {
  const { markWatched, setWatchProgress } = useApp()
  const shellRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<number | null>(null)
  const lastSaved = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [lastVolume, setLastVolume] = useState(1)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [controls, setControls] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [quality, setQuality] = useState('Auto (1080p)')
  const [cc, setCc] = useState(false)
  const [volumeOpen, setVolumeOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState(false)

  const channel = channelById(video.channelId)

  useEffect(() => {
    markWatched(video.id, 0)
    setStarted(false)
    setEnded(false)
    setPlaying(false)
    setCurrent(0)
    setControls(true)
    setError(false)
  }, [video.id, markWatched])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume
    v.muted = muted
    v.playbackRate = speed
  }, [volume, muted, speed])

  const revealControls = useCallback(() => {
    setControls(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    if (playing && !settingsOpen && !volumeOpen) {
      hideTimer.current = window.setTimeout(() => setControls(false), 2800)
    }
  }, [playing, settingsOpen, volumeOpen])

  useEffect(() => {
    revealControls()
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [revealControls])

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setEnded(false)
    } else {
      v.pause()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName) || target.isContentEditable) return
      const v = videoRef.current
      if (!v) return
      if (e.key === ' ' || e.key.toLowerCase() === 'k') {
        e.preventDefault()
        togglePlay()
        revealControls()
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault()
        setMuted((m) => !m)
        revealControls()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 5)
        revealControls()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        v.currentTime = Math.max(0, v.currentTime - 5)
        revealControls()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setVolume((vol) => Math.min(1, vol + 0.1))
        setMuted(false)
        revealControls()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setVolume((vol) => Math.max(0, vol - 0.1))
        revealControls()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, revealControls])

  const toggleFullscreen = () => {
    const el = shellRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.()
  }

  const toggleMute = () => {
    if (muted || volume === 0) {
      setMuted(false)
      setVolume(lastVolume || 1)
    } else {
      setLastVolume(volume)
      setMuted(true)
    }
  }

  const setSeek = (value: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = value
    setCurrent(value)
  }

  const saveProgress = (value: number, total: number) => {
    if (!total) return
    const now = Date.now()
    if (now - lastSaved.current > 4000) {
      lastSaved.current = now
      setWatchProgress(video.id, value / total)
    }
  }

  const progressPct = duration ? (current / duration) * 100 : 0
  const bufferedPct = duration ? (buffered / duration) * 100 : 0
  const volumePct = muted ? 0 : volume * 100
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div
      className={`player ${playing ? 'is-playing' : ''} ${started ? 'has-started' : ''} ${controls ? 'controls-visible' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}
      ref={shellRef}
      onMouseMove={revealControls}
      onMouseLeave={() => playing && !settingsOpen && setControls(false)}
    >
      <div className="player-glow" style={{ backgroundImage: `url(${video.thumb})` }} />
      <video
        ref={videoRef}
        className="player-video"
        src={video.video}
        poster={video.thumb}
        preload="metadata"
        playsInline
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => { setPlaying(true); setStarted(true); setEnded(false) }}
        onPause={() => { setPlaying(false); setControls(true) }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          setCurrent(v.currentTime)
          if (Number.isFinite(v.duration)) setDuration(v.duration)
          if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1))
          saveProgress(v.currentTime, v.duration)
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const v = e.currentTarget
          if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1))
        }}
        onEnded={() => { setPlaying(false); setEnded(true); setControls(true); setWatchProgress(video.id, 1) }}
        onError={() => setError(true)}
      />

      {!started && !error && (
        <div className="player-poster" onClick={() => { setStarted(true); void videoRef.current?.play() }}>
          <div className="poster-scrim" />
          <div className="poster-copy">
            <span className="poster-kicker">Now playing</span>
            <h2>{video.title}</h2>
            <p>{channel?.name}</p>
          </div>
          <button className="poster-play" aria-label="Play video">
            <Play size={34} fill="currentColor" />
          </button>
          <div className="poster-bottom">
            <span className="poster-quality">4K</span>
            <span>{formatDuration(video.duration)}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="player-error">
          <p>This video could not be loaded.</p>
          <button onClick={() => { setError(false); videoRef.current?.load() }}>Try again</button>
        </div>
      )}

      {ended && (
        <div className="end-screen">
          <div className="end-card">
            <span className="end-eyebrow">Up next</span>
            {nextVideo ? (
              <button className="end-next" onClick={() => navigate(watchUrl(nextVideo.id))}>
                <img src={nextVideo.thumb} alt="" />
                <span>
                  <strong>{nextVideo.title}</strong>
                  <small>{channelById(nextVideo.channelId)?.name}</small>
                </span>
                <SkipForward size={20} />
              </button>
            ) : null}
            <button className="end-replay" onClick={() => { const v = videoRef.current; if (v) { v.currentTime = 0; void v.play() } }}>
              <RotateCcw size={17} /> Replay
            </button>
          </div>
        </div>
      )}

      {cc && !ended && (
        <div className="player-captions">
          <span>{demoCaptions[Math.min(demoCaptions.length - 1, Math.floor(current / 5))]}</span>
        </div>
      )}

      <div className={`player-controls ${controls ? 'visible' : ''}`}>
        <div className="player-controls-glow" />
        {settingsOpen && (
          <div className="settings-popover" onClick={(e) => e.stopPropagation()}>
            <div className="settings-section">
              <div className="settings-label">Playback speed</div>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button key={rate} className={`settings-option ${speed === rate ? 'active' : ''}`} onClick={() => setSpeed(rate)}>
                  {rate === 1 ? 'Normal' : `${rate}×`}
                  {speed === rate && <Check size={15} />}
                </button>
              ))}
            </div>
            <div className="settings-section">
              <div className="settings-label">Quality</div>
              {['Auto (1080p)', '1080p', '720p', '480p', '360p'].map((q) => (
                <button key={q} className={`settings-option ${quality === q ? 'active' : ''}`} onClick={() => setQuality(q)}>
                  {q}
                  {quality === q && <Check size={15} />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="seek-wrap">
          <div className="seek-buffer" style={{ width: `${bufferedPct}%` }} />
          <div className="seek-played" style={{ width: `${progressPct}%` }} />
          <input
            className="seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.05}
            value={Math.min(current, duration || 0)}
            aria-label="Seek"
            onChange={(e) => setSeek(Number(e.target.value))}
            style={{ ['--seek' as string]: `${progressPct}%` } as CSSProperties}
          />
        </div>

        <div className="control-row">
          <button className="player-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
          </button>
          <button className="player-btn next-btn" aria-label="Next video" onClick={() => nextVideo && navigate(watchUrl(nextVideo.id))}>
            <SkipForward size={20} fill="currentColor" />
          </button>
          <div className="volume-group" onMouseEnter={() => setVolumeOpen(true)} onMouseLeave={() => setVolumeOpen(false)}>
            <button className="player-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
              <VolumeIcon size={22} />
            </button>
            <div className={`volume-slider-wrap ${volumeOpen ? 'open' : ''}`}>
              <input
                className="volume-slider"
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={muted ? 0 : volume}
                aria-label="Volume"
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setVolume(val)
                  setMuted(val === 0)
                }}
                style={{ ['--volume' as string]: `${volumePct}%` } as CSSProperties}
              />
            </div>
          </div>
          <span className="player-time">{formatDuration(current)} <span>/</span> {formatDuration(duration || video.duration)}</span>
          <div className="control-spacer" />
          <button className={`player-btn text-control ${cc ? 'active' : ''}`} onClick={() => setCc((v) => !v)} aria-label="Subtitles">
            <Captions size={22} />
          </button>
          <button className={`player-btn ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen((v) => !v)} aria-label="Settings">
            <Settings size={20} />
          </button>
          {document.pictureInPictureEnabled && (
            <button
              className="player-btn pip-btn"
              aria-label="Picture in picture"
              onClick={() => {
                const v = videoRef.current
                if (!v) return
                if (document.pictureInPictureElement) void document.exitPictureInPicture()
                else void v.requestPictureInPicture()
              }}
            >
              <PictureInPicture2 size={20} />
            </button>
          )}
          <button className={`player-btn ${theater ? 'active' : ''}`} onClick={onToggleTheater} aria-label="Theater mode">
            <RectangleHorizontal size={21} />
          </button>
          <button className="player-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
            {isFullscreen ? <Minimize size={21} /> : <Maximize size={21} />}
          </button>
        </div>
      </div>
    </div>
  )
}
