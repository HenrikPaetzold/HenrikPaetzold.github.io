import type { PageContent } from '../content/types'

export const eprog25: PageContent = {
  titleInitialText: 'Viel Glück 🍀🍀',
  notices: [
    {
      date: '[06.08.2026]',
      items: [
        {
          tag: { label: '[Disclaimer]', variant: 'darker-red' },
          text: (
            <>
              Diese Seite enthält meine privaten Notizen und Materialien zur Übung.{' '}
              <span className="darker-red">
                Sie wird nicht offiziell durch das Vorlesungs- oder Head-TA-Team geprüft.
              </span>{' '}
              Inhalte können daher Fehler enthalten oder vom tatsächlichen Übungsablauf abweichen.
            </>
          ),
        },
      ],
    },
    {
      date: '[10.12.2025]',
      items: [{ text: 'Lösung für ItemFactory online', tag: { label: '[Aktuell]', variant: 'green' } }],
    },
    {
      date: '[03.12.2025]',
      items: [
        {
          text: 'Die Musterlösung für TheoSim1 entspricht von der Bewertung einem früher üblichen Worst-Case-Erwartungshorizont. Zwar wurde nach dem Dozierendenwechsel in den letzten Jahren nachsichtiger korrigiert, eine verlässliche Aussage über die diesjährige Bewertung ist jedoch nicht möglich.',
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
  resources: [
    {
      label: '[ProgSim1]',
      links: [
        { href: '/downloads/eprog25/additional_material/ProgSim1.zip', label: 'IntelliJ Projekt' },
        { href: '/downloads/eprog25/additional_material/ProgSim1.pdf', label: 'Aufgabenstellung' },
        { href: '/downloads/eprog25/additional_material/GradingTests.zip', label: 'Grading-Tests' },
        { href: '/downloads/eprog25/additional_material/ProgSim1Sol.zip', label: 'Musterlösung' },
      ],
    },
    {
      label: '[TheoSim1]',
      links: [
        { href: '/downloads/eprog25/additional_material/TheoSim1.pdf', label: 'Aufgabenstellung' },
        { href: '/downloads/eprog25/additional_material/TheoSim1Sol.pdf', label: 'Musterlösung', sameTab: true },
      ],
    },
    {
      label: '[NodeTree]',
      links: [
        { href: '/downloads/eprog25/additional_material/NodeTree.zip', label: 'IntelliJ Projekt' },
        { href: '/downloads/eprog25/additional_material/NodeTree.pdf', label: 'Aufgabenstellung' },
      ],
    },
    {
      label: '[TimedBo1]',
      links: [{ href: '/downloads/eprog25/additional_material/hpaetzold_[Game].zip', label: 'Meine Lösung' }],
    },
    {
      label: '[ItemFactory]',
      links: [{ href: '/downloads/eprog25/additional_material/ItemFactorySol.zip', label: 'Meine Lösung' }],
    },
    {
      label: '[🎄🎄Weihnachtskahoot🎄🎄]',
      tagVariant: 'green',
      links: [{ href: 'https://create.kahoot.it/details/19c77801-a62d-4aad-bcb5-9cc9fa47b38f?drawer=', label: 'Link' }],
    },
    {
      label: '[Bonus13]',
      tagVariant: 'green',
      links: [{ href: '/downloads/eprog25/additional_material/u13-bonus.zip', label: 'Meine Lösung' }],
    },
  ],
  weiteres: [
    { label: '[🔒NETHZ-Login]', href: 'https://lec.inf.ethz.ch/infk/eprog/2025/', linkLabel: 'Vorlesungswebsite' },
    { label: '[🗃️Archiviert]', href: 'eprog24.html', linkLabel: 'EProg24' },
  ],
  kontakt: {
    href: 'mailto:hpaetzold@student.ethz.ch?subject=[EProg25] Mein Betreff',
    localPart: 'hpaetzold',
    domain: 'student.ethz.ch',
  },
  uebungsstunde: { day: 'Mittwochs', time: '16:15 - 18:00', room: 'ML H 41.1' },
}
