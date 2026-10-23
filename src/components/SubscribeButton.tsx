import { Bell, Check } from 'lucide-react'
import { useApp } from '../store'
import { formatViews } from '../data'

interface Props {
  channelId: string
  subscribers: number
  size?: 'default' | 'large'
}

export const SubscribeButton = ({ channelId, subscribers, size = 'default' }: Props) => {
  const { isSubscribed, toggleSubscribe } = useApp()
  const subscribed = isSubscribed(channelId)

  return (
    <button
      className={`subscribe-btn ${subscribed ? 'is-subscribed' : ''} ${size === 'large' ? 'is-large' : ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleSubscribe(channelId)
      }}
      aria-pressed={subscribed}
      title={subscribed ? 'Unsubscribe' : `Subscribe to channel · ${formatViews(subscribers)} subscribers`}
    >
      {subscribed ? <Check size={17} strokeWidth={2.4} /> : null}
      <span>{subscribed ? 'Subscribed' : 'Subscribe'}</span>
      {subscribed && <Bell size={16} className="subscribe-bell" />}
    </button>
  )
}
