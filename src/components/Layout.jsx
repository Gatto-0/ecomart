import { useState, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Navbar from './Navbar'
import SideDrawer from './SideDrawer'
import UtilityCluster from './UtilityCluster'

export default function Layout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButtonRef = useRef(null)

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal relative">
      {isHome ? (
        <Navbar />
      ) : (
        <>
          {/* Round menu button fixed at top left */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 w-11 h-11 rounded-full bg-forest text-cream flex items-center justify-center shadow-md hover:bg-forest/90 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf cursor-pointer transition-transform motion-safe:active:scale-95"
          >
            <Menu size={22} className="text-cream" aria-hidden="true" />
          </button>

          {/* Utility cluster fixed at top right */}
          <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40">
            <UtilityCluster />
          </div>

          {/* Side drawer */}
          <SideDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            menuButtonRef={menuButtonRef}
          />
        </>
      )}

      {/* Main content with top padding on inner pages to prevent overlap with floating controls */}
      <main className={`flex-1 ${!isHome ? 'pt-20 sm:pt-24' : ''}`}>
        {children || <Outlet />}
      </main>
    </div>
  )
}
