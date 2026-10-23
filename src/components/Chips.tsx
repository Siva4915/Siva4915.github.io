import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Props {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export const Chips = ({ categories, active, onChange }: Props) => {
  const scroller = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = () => {
    const el = scroller.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    update()
    const el = scroller.current
    if (!el) return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [categories.length])

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 420, behavior: 'smooth' })
  }

  return (
    <div className="chips-wrap">
      {canLeft && (
        <button className="chip-arrow chip-arrow-left" onClick={() => scroll(-1)} aria-label="Scroll categories left">
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="chips" ref={scroller} onScroll={update}>
        {categories.map((category) => (
          <button
            key={category}
            className={`chip ${active === category ? 'active' : ''}`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        ))}
        <button className="chip chip-icon" aria-label="Filter categories" title="Filter">
          <SlidersHorizontal size={16} />
        </button>
      </div>
      {canRight && (
        <button className="chip-arrow chip-arrow-right" onClick={() => scroll(1)} aria-label="Scroll categories right">
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )
}
