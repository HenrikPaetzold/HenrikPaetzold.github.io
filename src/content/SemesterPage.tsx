import { PageShell } from '../components/page-shell/PageShell'
import { TitleBlock } from '../components/page-shell/TitleBlock'
import { Subtitle } from '../components/page-shell/Subtitle'
import { HighlightBox } from './HighlightBox'
import { NoticeBoard } from './NoticeBoard'
import { MaterialList } from './MaterialList'
import { ResourceList } from './ResourceList'
import { Weiteres } from './Weiteres'
import { Kontakt } from './Kontakt'
import { Uebungsstunde } from './Uebungsstunde'
import type { PageContent } from './types'

export function SemesterPage({ content, withAnimator }: { content: PageContent; withAnimator: boolean }) {
  return (
    <PageShell>
      <TitleBlock initialText={content.titleInitialText} withAnimator={withAnimator} />
      <Subtitle />
      {content.highlightBox && <HighlightBox href={content.highlightBox.href} label={content.highlightBox.label} />}
      <NoticeBoard notices={content.notices} />
      <MaterialList materials={content.materials} />
      <ResourceList resources={content.resources} />
      <Weiteres rows={content.weiteres} />
      <Kontakt kontakt={content.kontakt} />
      <Uebungsstunde uebungsstunde={content.uebungsstunde} />
    </PageShell>
  )
}
