import type { ResourceRow } from './types'

export function ResourceList({ resources }: { resources: ResourceRow[] }) {
  if (resources.length === 0) return null
  return (
    <>
      <br />
      <ul>
        {resources.map((row) => (
          <li key={row.label}>
            {row.tagVariant ? (
              <span className={`pulsating-text ${row.tagVariant}`}>{row.label}</span>
            ) : (
              <span>{row.label}</span>
            )}{' '}
            {row.links.map((link, i) => (
              <span key={link.href}>
                {i > 0 && ' | '}
                {link.sameTab ? (
                  <a href={link.href}>{link.label}</a>
                ) : (
                  <a target="_blank" rel="noopener noreferrer" href={link.href}>
                    {link.label}
                  </a>
                )}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </>
  )
}
