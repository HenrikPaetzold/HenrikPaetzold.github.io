import type { Tag } from './types'

export function TagBadge({ tag }: { tag: Tag }) {
  return <span className={`pulsating-text ${tag.variant}`}>{tag.label}</span>
}
