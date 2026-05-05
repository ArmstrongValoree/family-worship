import { type ReactNode } from 'react'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { ParadiseBackground } from '../paradise/ParadiseBackground'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <ParadiseBackground />
      <TopBar />
      <main
        className="overflow-y-auto"
        style={{
          paddingTop: 'var(--nav-height)',
          paddingBottom: 'var(--bottom-nav-height)',
          minHeight: '100dvh',
        }}
      >
        {children}
      </main>
      <BottomNav />
    </>
  )
}
