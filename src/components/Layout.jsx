import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import CompareBar from './CompareBar'
import EcoBuddy from './EcoBuddy'

export default function Layout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal relative">
      {/* TopBar mounted on all other pages (Home page renders its own TopBar) */}
      {!isHome && (
        <TopBar />
      )}

      {/* Main content with top padding on inner pages to prevent overlap with top bar */}
      <main className={`flex-1 ${!isHome ? 'pt-24 sm:pt-28' : ''}`}>
        {children || <Outlet />}
      </main>

      {/* Floating comparison bar */}
      <CompareBar />

      {/* Offline Eco Buddy assistant */}
      <EcoBuddy />
    </div>
  )
}
