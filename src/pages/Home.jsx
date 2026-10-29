import { useOutletContext } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import CategoryGrid from '../components/CategoryGrid'
import TopPicks from '../components/TopPicks'
import LearnTeasers from '../components/LearnTeasers'

export default function Home() {
  const { onOpenMenu, menuButtonRef } = useOutletContext() || {}

  return (
    <>
      <TopBar onOpenMenu={onOpenMenu} menuButtonRef={menuButtonRef} />
      <Hero />
      <Marquee />
      <CategoryGrid />
      <TopPicks />
      <LearnTeasers />
    </>
  )
}
