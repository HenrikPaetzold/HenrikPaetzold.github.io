import type { PageContent } from './types'

export function Uebungsstunde({ uebungsstunde }: { uebungsstunde: PageContent['uebungsstunde'] }) {
  return (
    <>
      <div className="list-subheader">Übungsstunde</div>
      <ul>
        <li>{uebungsstunde.day}</li>
        <li>{uebungsstunde.time}</li>
        <li>{uebungsstunde.room}</li>
      </ul>
    </>
  )
}
