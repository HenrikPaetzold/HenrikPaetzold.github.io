import type { ReactNode } from 'react'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="section prevent-select" id="border">
      <div className="section" id="all-of-it">
        {children}
      </div>
    </div>
  )
}
