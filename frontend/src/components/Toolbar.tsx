import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Toolbar({ children }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3 mb-6">
      {children}
    </div>
  )
}
