import { BadgeCheck } from 'lucide-react'

export const Verified = ({ size = 14 }: { size?: number }) => (
  <BadgeCheck className="verified-icon" size={size} strokeWidth={2.4} aria-label="Verified channel" />
)
