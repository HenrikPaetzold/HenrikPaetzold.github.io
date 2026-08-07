import type { ReactNode } from 'react'

export type Tag = { label: string; variant: 'green' | 'darker-red' }

export type NoticeItem = { text: ReactNode; tag?: Tag }
export type Notice = { date: string; items: NoticeItem[] }

export type MaterialLink = { href: string; label?: string }
export type MaterialSlot = MaterialLink | { disabled: true; label: string } | { emptyHref: true; label: string }
export type MaterialEntry =
  | { code: string; label?: string; handout?: MaterialSlot; folien?: MaterialSlot }
  | { extra: true; label: string; tagVariant?: Tag['variant']; link: { href: string; label: string } }

export type ResourceLink = { href: string; label: string; sameTab?: boolean }
export type ResourceRow = { label: string; tagVariant?: Tag['variant']; links: ResourceLink[] }

export type WeiteresRow = { label: string; href: string; linkLabel: string }

export type PageContent = {
  titleInitialText: string
  highlightBox?: { href: string; label: string }
  notices: Notice[]
  materials: MaterialEntry[]
  resources: ResourceRow[]
  weiteres: WeiteresRow[]
  kontakt: { href: string; localPart: string; domain: string }
  uebungsstunde?: { day: string; time: string; room: string }
}
