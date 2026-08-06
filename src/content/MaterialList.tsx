import type { MaterialEntry, MaterialSlot } from './types'

function Slot({ slot, fallback }: { slot: MaterialSlot; fallback: string }) {
  if ('disabled' in slot) return <span>{slot.label}</span>
  if ('emptyHref' in slot) return <a target="_blank" rel="noopener noreferrer">{slot.label}</a>
  return (
    <a target="_blank" rel="noopener noreferrer" href={slot.href}>
      {slot.label ?? fallback}
    </a>
  )
}

export function MaterialList({ materials }: { materials: MaterialEntry[] }) {
  return (
    <>
      <div className="list-subheader">Unterlagen</div>
      <ul>
        {materials.map((entry, i) => {
          if ('extra' in entry) {
            return (
              <li key={i}>
                {entry.tagVariant ? (
                  <span className={`pulsating-text ${entry.tagVariant}`}>{entry.label}</span>
                ) : (
                  <span>{entry.label}</span>
                )}{' '}
                <a target="_blank" href={entry.link.href} rel="noopener noreferrer">
                  {entry.link.label}
                </a>
                <br />
              </li>
            )
          }
          return (
            <li key={entry.code}>
              [{entry.code}]{' '}
              {entry.label ? (
                entry.label
              ) : (
                <>
                  {entry.handout && <Slot slot={entry.handout} fallback="Handout" />}
                  {entry.handout && entry.folien && ' | '}
                  {entry.folien && <Slot slot={entry.folien} fallback="Folien" />}
                </>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
