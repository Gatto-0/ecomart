import { useState, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import SideDrawer from './SideDrawer'
import CompareBar from './CompareBar'

export default function Layout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButtonRef = useRef(null)

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal relative">
      {/* TopBar mounted on all other pages (Home page renders its own TopBar) */}
      {!isHome && <TopBar />}

      {/* Main content with top padding on inner pages to prevent overlap with top bar */}
      <main className={`flex-1 ${!isHome ? 'pt-24 sm:pt-28' : ''}`}>
        {children || <Outlet />}
      </main>

      {/* Side drawer */}
      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        menuButtonRef={menuButtonRef}
      />

      {/* Floating comparison bar */}
      <CompareBar />
    </div>
  )
}
