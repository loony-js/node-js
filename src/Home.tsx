import DesktopLeftNavbar from "navbar/HomeLeftNavbar"
import { Card } from "loony-ui"

const cards = [
  {
    id: 1,
    title: "Aegis",
    description:
      "Never forget your username and password. We store them securely.",
  },
  {
    id: 2,
    title: "Voice Streaming",
    description: "Stream audio data.",
  },
  {
    id: 3,
    title: "Trading View",
    description: "Stocks and Market trading view.",
  },
  {
    id: 4,
    title: "Algorithms",
    description: "Visual representation of algorithms.",
  },
]
export default function Home({ setApp, appContext, mobileNavOpen }: any) {
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
                navigate={() => setApp(card.title)}
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
