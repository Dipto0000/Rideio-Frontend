import { Hero } from "@/components/home/Hero"
import { ActivityFeed } from "@/components/home/ActivityFeed"

export const dynamic = 'force-static'

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <ActivityFeed />
    </div>
  )
}
