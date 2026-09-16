import type { PageContent } from '../content/types'

export const eprog25: PageContent = {
  titleInitialText: 'EProg25 - Archiv',
  highlightBox: { href: 'https://henrikpaetzold.de', label: 'Zurück zum aktuellen Inhalt (HS26)' },
  notices: [
    {
      date: '[15.09.2026]',
      items: [
        {
          tag: { label: '[Disclaimer]', variant: 'darker-red' },
          text: (
            <>
              Diese Seite enthält alle Slides für die Repetentenübung aus dem HS25.{' '}
              <span className="darker-red">
                Sie wird nicht mehr gepflegt und wurde nicht auf Korrektheit durch das Head-TA- oder Vorlesungsteam
                überprüft.
              </span>{' '}
              Die Slides und Übungsaufgaben des aktuellen Jahres können sich gegenüber dem HS24 durchaus ändern, um
              besser an einen möglicherweise veränderten Vorlesungsablauf angepasst zu werden.
            </>
          ),
        },
      ],
    },
  ],
  materials: [
    {
      extra: true,
      label: '[v0.1]',
      link: { href: '/downloads/eprog24/additional_material/How_to_Graphenaufgaben.pdf', label: 'How To Graphenaufgaben' },
    },
    { code: 'U01', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog25/u01.pdf' } },
    { code: 'U02', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog25/u02.pdf' } },
    {
      code: 'U03',
      handout: { href: '/downloads/eprog25/additional_material/Handout3.zip' },
      folien: { href: '/downloads/eprog25/u03.pdf' },
    },
    {
      code: 'U04',
      handout: { href: '/downloads/eprog25/additional_material/Handout4.zip' },
      folien: { href: '/downloads/eprog25/u04.pdf' },
    },
    {
      code: 'U05',
      handout: { href: '/downloads/eprog25/additional_material/Handout5.zip' },
      folien: { href: '/downloads/eprog25/u05.pdf' },
    },
    { code: 'U06', label: 'ProgSim1' },
    { code: 'U07', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog25/u07.pdf' } },
    { code: 'U08', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog25/u08.pdf' } },
    {
      code: 'U09',
      handout: { href: '/downloads/eprog25/additional_material/Handout9.zip' },
      folien: { href: '/downloads/eprog25/u09.pdf' },
    },
    {
      code: 'U10',
      handout: { href: '/downloads/eprog25/additional_material/Handout10.pdf' },
      folien: { href: '/downloads/eprog25/u10.pdf' },
    },
    {
      code: 'U11',
      handout: { href: '/downloads/eprog25/additional_material/Handout11.pdf' },
      folien: { href: '/downloads/eprog25/u11.pdf' },
    },
    { code: 'U12', label: 'TheoSim1' },
    {
      code: 'U13',
      handout: { href: '/downloads/eprog25/additional_material/Handout13.zip' },
      folien: { href: '/downloads/eprog25/u13.pdf' },
    },
    { code: 'U14', handout: { emptyHref: true, label: 'Handout' }, folien: { href: '/downloads/eprog25/u14.pdf' } },
  ],
  resources: [],
  weiteres: [
    { label: '[🔒NETHZ-Login]', href: 'https://lec.inf.ethz.ch/infk/eprog/2025/', linkLabel: 'Vorlesungswebsite' },
  ],
  kontakt: {
    href: 'mailto:hpaetzold@student.ethz.ch?subject=[EProg25] Mein Betreff',
    localPart: 'hpaetzold',
    domain: 'student.ethz.ch',
  },
  uebungsstunde: { day: 'Mittwochs', time: '16:15 - 18:00', room: 'ML H 41.1' },
}
