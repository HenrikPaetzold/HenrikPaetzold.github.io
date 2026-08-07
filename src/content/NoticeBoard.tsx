import type { Notice } from './types'
import { TagBadge } from './TagBadge'

export function NoticeBoard({ notices }: { notices: Notice[] }) {
  return (
    <>
      <div className="list-subheader">Mitteilungen</div>
      <li>
        {notices.map((notice) => (
          <div key={notice.date}>
            <span className="callout">{notice.date}</span>
            <ul>
              {notice.items.map((item, i) => (
                <li key={i}>
                  {item.tag && (
                    <>
                      <TagBadge tag={item.tag} />{' '}
                    </>
                  )}
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </li>
    </>
  )
}
