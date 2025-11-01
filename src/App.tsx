import { Routes, Route } from "react-router"

import Aegis from "./aegis/index"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import VoiceStreaming from "VoiceStreaming"
import Algorithms from "./algorithms/index"

import Navbar from "TopNavbar"
import { AuthContext, AuthStatus } from "./context/AuthContext"
import Trading from "Trading"
import { useState } from "react"
import DesktopLeftNavbar from "HomeLeftNavbar"
import AppContext from "context/AppContext"

function App() {
  return (
    <>
      <AuthContext.Consumer>
        {(authContext) => {
          return (
            <>
              <AppContext.Consumer>
                {(appContext) => {
                  return (
                    <AppRoute
                      authContext={authContext}
                      appContext={appContext}
                    />
                  )
                }}
              </AppContext.Consumer>
            </>
          )
        }}
      </AuthContext.Consumer>
    </>
  )
}

function Home({ setApp }: any) {
  return (
    <div className="ml-72 p-4 flex-1 bg-stone-50 dark:bg-[#212121] overflow-y-auto mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="bg-white shadow rounded-md p-4 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          onClick={() => {
            setApp("Aegis")
          }}
        >
          <h2 className="text-lg font-semibold">Aegis</h2>
          <p className="text-gray-600">
            Never forget your username and password. We store them securely.
          </p>
        </div>
        <div
          className="bg-white shadow rounded-md p-4 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          onClick={() => {
            setApp("VoiceStreaming")
          }}
        >
          <h2 className="text-lg font-semibold">Voice Streaming</h2>
          <p className="text-gray-600">Stream audio data.</p>
        </div>

        <div
          className="bg-white shadow rounded-md p-4 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          onClick={() => {
            setApp("Trading")
          }}
        >
          <h2 className="text-lg font-semibold">Trading View</h2>
          <p className="text-gray-600">Stocks and Market trading view.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="bg-white shadow rounded-md p-4 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          onClick={() => {
            setApp("Algorithms")
          }}
        >
          <h2 className="text-lg font-semibold">Algoithms</h2>
          <p className="text-gray-600">Visual representation of algorithms.</p>
        </div>
      </div>
    </div>
  )
}
export const AppRoute = ({
  authContext,
  appContext,
}: {
  authContext: any
  appContext: any
}) => {
  const [app, setApp] = useState("")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (authContext.status === AuthStatus.AUTHORIZED) {
    return (
      <>
        <Navbar
          authContext={authContext}
          appContext={appContext}
          setMobileNavOpen={() => {}}
        />
        <DesktopLeftNavbar
          appContext={appContext}
          mobileNavOpen={mobileNavOpen}
        />
        <div className="flex flex-1 overflow-hidden h-screen">
          {app === "Aegis" ? <Aegis /> : null}
          {app === "VoiceStreaming" ? <VoiceStreaming /> : null}
          {app === "Trading" ? <Trading /> : null}
          {app === "Algorithms" ? <Algorithms /> : null}
          {app === "" ? <Home setApp={setApp} /> : null}
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar
        authContext={authContext}
        appContext={appContext}
        setMobileNavOpen={setMobileNavOpen}
      />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login authContext={authContext} />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
