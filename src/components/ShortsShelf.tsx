import { ChevronRight, Play } from 'lucide-react'
import { channelById, formatViews, shorts } from '../data'
import { shortsUrl } from '../router'
import { Avatar } from './Avatar'
import { ShortsMark } from './ShortsMark'

export const ShortsShelf = () => (
  <section className="shorts-shelf" aria-labelledby="shorts-heading">
    <div className="shorts-heading-row">
      <h2 id="shorts-heading"><ShortsMark size={25} /> Shorts</h2>
      <a className="shorts-all" href="#/shorts">View all <ChevronRight size={17} /></a>
    </div>
    <div className="shorts-rail">
      {shorts.slice(0, 6).map((short) => {
        const channel = channelById(short.channelId)
        return (
          <a className="short-card" href={shortsUrl(short.id)} key={short.id}>
            <div className="short-thumb">
              <img src={short.thumb} alt="" loading="lazy" />
              <span className="short-gradient" />
              <span className="short-play"><Play size={17} fill="currentColor" /></span>
              <span className="short-views">{formatViews(short.views)} views</span>
              <div className="short-info">
                <span className="short-title">{short.title}</span>
                <span className="short-channel"><Avatar src={channel?.avatar} name={channel?.name ?? ''} size={17} /> {channel?.name}</span>
              </div>
            </div>
          </a>
        )
      })}
    </div>
  </section>
)
