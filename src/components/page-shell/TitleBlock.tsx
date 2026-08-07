import { useEffect, useRef } from 'react'
import { TitleAnimator } from '../../lib/title-animator'

export function TitleBlock({ initialText, withAnimator }: { initialText: string; withAnimator: boolean }) {
  const titleRef = useRef<HTMLAnchorElement>(null)
  const selRef = useRef<HTMLAnchorElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!withAnimator) return
    const animator = new TitleAnimator(titleRef.current!, selRef.current!, cursorRef.current!)
    animator.init()
    return () => animator.destroy()
  }, [withAnimator])

  return (
    <div className="section callout" id="title">
      <a ref={titleRef} id={withAnimator ? 'title_text' : undefined} className="nolink">
        {initialText}
      </a>
      <a ref={selRef} className="nolink" id="sel" />
      <span ref={cursorRef} id="t1" className="typing">
        _
      </span>
    </div>
  )
}
