export const ShortsMark = ({ size = 22 }: { size?: number }) => (
  <span className="shorts-mark" style={{ width: size, height: size }} aria-hidden="true">
    <span className="shorts-mark-play" />
  </span>
)
