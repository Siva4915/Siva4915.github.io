export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <a className="logo" href="#/" aria-label="Vuemora home">
    <span className="logo-mark" aria-hidden="true">
      <span className="logo-v">V</span>
    </span>
    {!compact && (
      <span className="logo-word">
        Vue<span>mora</span>
        <sup>IN</sup>
      </span>
    )}
  </a>
)
