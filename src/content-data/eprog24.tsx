import type { PageContent } from '../content/types'

export const eprog24: PageContent = {
  titleInitialText: 'EProg24 - Archiv',
  highlightBox: { href: 'https://henrikpaetzold.de', label: 'Zurück zum aktuellen Inhalt (HS26)' },
  notices: [
    {
      date: '[16.09.2025]',
      items: [
        {
          tag: { label: '[Disclaimer]', variant: 'darker-red' },
          text: (
            <>
              Diese Seite enthält alle Slides für die Repetentenübung aus dem HS24.{' '}
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
      tagVariant: 'green',
      link: { href: '/downloads/eprog24/additional_material/How_to_Graphenaufgaben.pdf', label: 'How To Graphenaufgaben' },
    },
    { code: 'U01', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog24/Woche1.pdf' } },
    { code: 'U02', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog24/Woche2.pdf' } },
    {
      code: 'U03',
      handout: { href: '/downloads/eprog24/additional_material/Woche3_Material.zip' },
      folien: { href: '/downloads/eprog24/Woche3.pdf' },
    },
    {
      code: 'U04',
      handout: { href: '/downloads/eprog24/additional_material/Woche4_Material.zip' },
      folien: { href: '/downloads/eprog24/Woche4.pdf' },
    },
    {
      code: 'U05',
      handout: { href: '/downloads/eprog24/additional_material/Woche5_Material.zip' },
      folien: { href: '/downloads/eprog24/Woche5.pdf' },
    },
    { code: 'U06', label: 'entfällt' },
    {
      code: 'U07',
      handout: { href: '/downloads/eprog24/additional_material/Woche7_Material.zip' },
      folien: { href: '/downloads/eprog24/Woche7.pdf' },
    },
    { code: 'U08', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog24/Woche8.pdf' } },
    {
      code: 'U09',
      handout: { href: '/downloads/eprog24/additional_material/Biomes.zip' },
      folien: { disabled: true, label: 'Folien' },
    },
    {
      code: 'U10',
      handout: { href: '/downloads/eprog24/additional_material/Woche10_Material.zip' },
      folien: { href: '/downloads/eprog24/Woche10.pdf' },
    },
    {
      code: 'U11',
      handout: { href: '/downloads/eprog24/additional_material/Handout11.pdf' },
      folien: { href: '/downloads/eprog24/Woche11.pdf' },
    },
    {
      code: 'U12',
      handout: { href: '/downloads/eprog24/additional_material/Handout12.pdf' },
      folien: { href: '/downloads/eprog24/Woche12.pdf' },
    },
    {
      code: 'U13',
      handout: { href: '/downloads/eprog24/additional_material/Pyramid.java' },
      folien: { href: '/downloads/eprog24/Woche13.pdf' },
    },
    { code: 'U14', handout: { disabled: true, label: 'Handout' }, folien: { href: '/downloads/eprog24/Woche14.pdf' } },
  ],
  resources: [],
  weiteres: [{ label: '[🔒NETHZ-Login]', href: 'https://lec.inf.ethz.ch/infk/eprog/2024/', linkLabel: 'Vorlesungswebsite HS24' }],
  kontakt: {
    href: 'mailto:hpaetzold@student.ethz.ch?subject=[EProg24] Mein Betreff',
    localPart: 'hpaetzold',
    domain: 'student.ethz.ch',
  },
  uebungsstunde: { day: 'Mittwochs', time: '16:15 - 18:00', room: 'ML H 41.1' },
}
