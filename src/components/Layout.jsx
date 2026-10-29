import { useState, useRef, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import SideDrawer from './SideDrawer'
import CompareBar from './CompareBar'
import EcoBuddy from './EcoBuddy'

export default function Layout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    const handleOpenDrawer = () => setDrawerOpen(true)
    window.addEventListener('ecomart:open-drawer', handleOpenDrawer)
    return () => window.removeEventListener('ecomart:open-drawer', handleOpenDrawer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal relative">
      {/* TopBar mounted on all other pages (Home page renders its own TopBar) */}
      {!isHome && (
        <TopBar
          onOpenMenu={() => setDrawerOpen(true)}
          menuButtonRef={menuButtonRef}
        />
      )}

      {/* Main content with top padding on inner pages to prevent overlap with top bar */}
      <main className={`flex-1 ${!isHome ? 'pt-24 sm:pt-28' : ''}`}>
        {children || <Outlet context={{ onOpenMenu: () => setDrawerOpen(true), menuButtonRef }} />}
      </main>

      {/* Side drawer */}
      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        menuButtonRef={menuButtonRef}
      />

      {/* Floating comparison bar */}
      <CompareBar />

      {/* Offline Eco Buddy assistant */}
      <EcoBuddy />
    </div>
  )
}
