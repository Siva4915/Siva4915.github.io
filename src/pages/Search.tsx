import { Compass, PlaySquare, SearchX, SlidersHorizontal, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { channels, searchVideos, videos as allVideos } from '../data'
import { channelUrl, watchUrl } from '../router'
import { useApp } from '../store'
import { Avatar } from '../components/Avatar'
import { SubscribeButton } from '../components/SubscribeButton'
import { Verified } from '../components/Verified'
import { VideoCard } from '../components/VideoCard'

interface Props {
  query: string
}

const filters = ['All', 'Videos', 'Channels', 'Playlists', 'Live']

const exploreMap: Record<string, string | null> = {
  trending: null,
  music: 'Music',
  gaming: 'Gaming',
  news: 'News',
  sport: 'Outdoors',
  learning: 'Science',
  podcast: 'Film',
  channels: '__channels__',
}

export const Search = ({ query }: Props) => {
  const { customVideos, hidden, history, notify } = useApp()
  const [filter, setFilter] = useState('All')
  const q = query.trim()

  useEffect(() => {
    setFilter('All')
    window.scrollTo({ top: 0 })
  }, [query])

  const explore = exploreMap[q.toLowerCase()]
  const isChannelExplore = explore === '__channels__'

  const results = useMemo(() => {
    if (!q) return []
    if (q.toLowerCase() === 'trending') {
      return [...customVideos, ...allVideos].filter((v) => !hidden.includes(v.id)).sort((a, b) => b.views - a.views)
    }
    if (explore && explore !== '__channels__') {
      return [...customVideos, ...allVideos].filter((v) => !hidden.includes(v.id) && v.category === explore)
    }
    return searchVideos(q, customVideos).filter((v) => !hidden.includes(v.id))
  }, [q, customVideos, hidden, explore])

  const channelResults = useMemo(() => {
    if (!q || q.toLowerCase() === 'trending') return []
    const needle = q.toLowerCase()
    return channels.filter((c) =>
      c.id !== 'you' && (c.name.toLowerCase().includes(needle) || c.handle.toLowerCase().includes(needle) || c.description.toLowerCase().includes(needle) || isChannelExplore),
    )
  }, [q, isChannelExplore])

  const showVideos = filter === 'All' || filter === 'Videos' || filter === 'Live'
  const showChannels = filter === 'All' || filter === 'Channels'
  const showPlaylists = filter === 'All' || filter === 'Playlists'
  const visibleVideos = filter === 'Live' ? [] : results

  const heading = q.toLowerCase() === 'trending' ? 'Trending now' : q ? `Search results for “${q}”` : 'Search'

  if (!q) {
    return (
      <div className="page search-page">
        <div className="empty-state">
          <div className="empty-icon"><SearchX size={30} /></div>
          <h2>Search Vuemora</h2>
          <p>Find videos, channels, playlists and more.</p>
          <a className="primary-btn" href="#/">Browse the home feed</a>
        </div>
      </div>
    )
  }

  return (
    <div className="page search-page">
      <div className="search-head">
        <div>
          <h1>{heading}</h1>
          <p className="page-subtitle">About {results.length + channelResults.length} results · 0.34 seconds</p>
        </div>
        <button className="filter-button" onClick={() => notify('Advanced filters are a demo only')}><SlidersHorizontal size={17} /> Filters</button>
      </div>

      <div className="search-filter-row">
        {filters.map((f) => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {showChannels && channelResults.length > 0 && (
        <div className="channel-results">
          {channelResults.slice(0, 3).map((c) => (
            <div className="channel-result" key={c.id}>
              <a href={channelUrl(c.id)}><Avatar src={c.avatar} name={c.name} size={96} /></a>
              <div className="channel-result-body">
                <a className="channel-result-name" href={channelUrl(c.id)}>{c.name} {c.verified && <Verified size={15} />}</a>
                <p className="channel-result-meta">@{c.handle.replace('@', '')} · {Intl.NumberFormat('en-US', { notation: 'compact' }).format(c.subscribers)} subscribers · {c.category}</p>
                <p className="channel-result-desc">{c.description}</p>
                <SubscribeButton channelId={c.id} subscribers={c.subscribers} />
              </div>
            </div>
          ))}
        </div>
      )}

      {showPlaylists && results.length > 0 && (
        <div className="playlist-result">
          <div className="playlist-stack">
            <img src={allVideos[0].thumb} alt="" />
            <img src={allVideos[1].thumb} alt="" />
          </div>
          <div>
            <h3>Vuemora picks · {q}</h3>
            <p>A collection of standout videos to get you started.</p>
            <a href={watchUrl(allVideos[0].id)}>Start playlist</a>
          </div>
        </div>
      )}

      {showVideos && visibleVideos.length > 0 && (
        <div className="search-results-list">
          {visibleVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              layout="row"
              showDescription
              progress={history.find((h) => h.id === video.id)?.progress ?? 0}
            />
          ))}
        </div>
      )}

      {showVideos && filter === 'Live' && (
        <div className="empty-state compact">
          <div className="empty-icon"><PlaySquare size={26} /></div>
          <h2>No live streams right now</h2>
          <p>Check back later or explore videos from this search.</p>
          <button className="primary-btn" onClick={() => setFilter('All')}>View all results</button>
        </div>
      )}

      {((showVideos && visibleVideos.length === 0 && filter !== 'Live' && !(showChannels && channelResults.length > 0)) || (filter === 'Channels' && channelResults.length === 0)) && (
        <div className="empty-state">
          <div className="empty-icon"><SearchX size={30} /></div>
          <h2>No results found</h2>
          <p>Try different keywords or remove search filters.</p>
          <div className="no-results-tips">
            <span><UserRound size={15} /> Check your spelling</span>
            <span><Compass size={15} /> Try more general keywords</span>
            <span><PlaySquare size={15} /> Search for a channel name</span>
          </div>
          <a className="primary-btn" href="#/">Explore the home feed</a>
        </div>
      )}
    </div>
  )
}
