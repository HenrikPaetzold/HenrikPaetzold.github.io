import type { WeiteresRow } from './types'

export function Weiteres({ rows }: { rows: WeiteresRow[] }) {
  if (rows.length === 0) return null
  return (
    <>
      <div className="list-subheader">Weiteres</div>
      <ul>
        {rows.map((row) => (
          <li key={row.href}>
            {row.label}{' '}
            <a target="_blank" rel="noopener noreferrer" href={row.href}>
              {row.linkLabel}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
