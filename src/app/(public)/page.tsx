import { Hero } from "@/components/home/Hero"
import { LiveFeed } from "@/components/home/LiveFeed"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <LiveFeed />
    </div>
  )
}
