import type { PageContent } from './types'

export function Kontakt({ kontakt }: { kontakt: PageContent['kontakt'] }) {
  return (
    <>
      <div className="list-subheader">Kontakt</div>
      <ul>
        <li>
          <a href={kontakt.href}>
            {kontakt.localPart}
            <span className="emph">@</span>
            {kontakt.domain}
          </a>
        </li>
      </ul>
    </>
  )
}
