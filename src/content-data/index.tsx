import type { PageContent } from '../content/types'

export const indexContent: PageContent = {
  titleInitialText: 'Willkommen',
  notices: [
    { date: '[15.09.2026]', items: [{ text: 'Website & u01 online', tag: { label: '[Aktuell]', variant: 'green' } } ] },
  ],
  materials: [
    {
      code: 'U01',
      folien: { href: '/downloads/eprog26/u01.pdf' },
    },
  ],
  resources: [],
  weiteres: [
    { label: '[🔒NETHZ-Login]', href: 'https://lec.inf.ethz.ch/infk/eprog/2026/', linkLabel: 'Vorlesungswebsite' },
    { label: '[🗃️Archiviert]', href: 'eprog25.html', linkLabel: 'EProg25' },
    { label: '[🗃️Archiviert]', href: 'eprog24.html', linkLabel: 'EProg24' },
  ],
  kontakt: {
    href: 'mailto:hpaetzold@student.ethz.ch',
    localPart: 'hpaetzold',
    domain: 'student.ethz.ch',
  },
  uebungsstunde: { day: 'Mittwochs', time: '16:15 - 18:00', room: 'ML H 41.1' },
}
