import { Compass, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { homeChips, videos as allVideos } from '../data'
import { useApp } from '../store'
import { Chips } from '../components/Chips'
import { ShortsShelf } from '../components/ShortsShelf'
import { VideoCard } from '../components/VideoCard'

export const Home = () => {
  const { customVideos, hidden, history } = useApp()
  const [category, setCategory] = useState('All')
  const [columns, setColumns] = useState(4)
  const gridRef = useRef<HTMLDivElement>(null)

  const all = useMemo(() => [...customVideos, ...allVideos], [customVideos])
  const visible = useMemo(() => {
    const filtered = all.filter((v) => !hidden.includes(v.id) && (category === 'All' || v.category === category))
    return filtered
  }, [all, hidden, category])

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const measure = () => {
      const count = getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length
      if (count > 0) setColumns(count)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [category, visible.length])

  const progressFor = (id: string) => history.find((h) => h.id === id)?.progress ?? 0
  const firstCount = Math.max(1, columns === 1 ? 4 : columns * 2)
  const firstRow = visible.slice(0, firstCount)
  const rest = visible.slice(firstCount)

  return (
    <div className="page home-page">
      <Chips categories={homeChips} active={category} onChange={setCategory} />

      {visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Compass size={30} /></div>
          <h2>Nothing here yet</h2>
          <p>Try a different category or reset your filters to see more videos.</p>
          <button className="primary-btn" onClick={() => setCategory('All')}>Browse all videos</button>
        </div>
      ) : (
        <>
          <div className="video-grid" ref={gridRef}>
            {firstRow.map((video) => (
              <VideoCard key={video.id} video={video} progress={progressFor(video.id)} />
            ))}
          </div>

          {category === 'All' && rest.length > 0 && (
            <>
              <ShortsShelf />
              <div className="section-label"><Sparkles size={18} /> Recommended for you</div>
              <div className="video-grid">
                {rest.map((video) => (
                  <VideoCard key={video.id} video={video} progress={progressFor(video.id)} />
                ))}
              </div>
            </>
          )}

          {category !== 'All' && (
            <div className="page-end">
              <span>You reached the end of {category}</span>
              <button onClick={() => setCategory('All')}>Explore everything</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
