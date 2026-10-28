import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  )
}

