import { SemesterPage } from '../../content/SemesterPage'
import { indexContent } from '../../content-data/index'

export function IndexPage() {
  return <SemesterPage content={indexContent} withAnimator />
}
