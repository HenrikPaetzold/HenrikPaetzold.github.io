export function HighlightBox({ href, label }: { href: string; label: string }) {
  return (
    <div className="section callout highlight-box">
      <a href={href} rel="noopener noreferrer">
        {label}
      </a>
    </div>
  )
}
