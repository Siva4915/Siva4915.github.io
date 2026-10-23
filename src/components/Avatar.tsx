import { useState } from 'react'

interface AvatarProps {
  src?: string
  name: string
  size?: number
  className?: string
}

const hue = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return h
}

export const Avatar = ({ src, name, size = 36, className = '' }: AvatarProps) => {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <span
      className={`avatar ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.34), ['--avatar-hue' as string]: hue(name) }}
    >
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="avatar-fallback">{initials}</span>
      )}
    </span>
  )
}
