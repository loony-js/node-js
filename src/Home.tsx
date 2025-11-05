import DesktopLeftNavbar from "navbar/HomeLeftNavbar"
import { Card } from "loony-ui"
import { useNavigate } from "react-router"

const cards = [
  {
    id: 1,
    title: "Aegis",
    route: "aegis",
    description:
      "Never forget your username and password. We store them securely.",
  },
  {
    id: 2,
    title: "Voice Streaming",
    route: "voiceStreaming",
    description: "Stream audio data.",
  },
  {
    id: 3,
    title: "Trading",
    route: "trading",
    description: "Stocks and Market trading view.",
  },
  {
    id: 4,
    title: "Algorithms",
    route: "algorithms",
    description: "Visual representation of algorithms.",
  },
  {
    id: 4,
    title: "Colors",
    route: "colors",
    description: "Visual representation of css colors.",
  },
]
export default function Home({ appContext, mobileNavOpen }: any) {
  const navigate = useNavigate()
  return (
    <>
      <DesktopLeftNavbar
        appContext={appContext}
        mobileNavOpen={mobileNavOpen}
      />
      <div className="ml-72 p-4 flex-1 bg-stone-50 dark:bg-[#212121] overflow-y-auto mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => {
            return (
              <Card
                key={card.id}
                navigate={() => navigate(`/${card.route}`, { replace: true })}
                image=""
                node={card}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export const LoginHome = () => {
  return (
    <div className="ml-72 p-4 flex-1 bg-stone-50 dark:bg-[#212121] overflow-y-auto mt-16"></div>
  )
}
