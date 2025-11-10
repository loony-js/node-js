import { useState, Suspense, lazy } from "react"
import { Routes, Route } from "react-router"

// import Aegis from "./aegis/index"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
// import VoiceStreaming from "streaming/VoiceStreaming"
// import Algorithms from "./algorithms/index"
// import Home, { LoginHome } from "./Home"

import Navbar from "navbar/TopNavbar"
import { AuthContext, AuthStatus } from "./context/AuthContext"
// import Trading from "Trading"
import AppContext from "context/AppContext"
import LoginDesktopLeftNavbar from "navbar/LoginLeftNavbar"
// import HSLPaletteGenerator from "Colors"
// import WebRTCChat from "./WebRTCChat"

// Lazy-load all your route components
const Home = lazy(() => import("./Home"))
const LoginHome = lazy(() => import("./LoginHome"))
const Aegis = lazy(() => import("./aegis"))
const VoiceStreaming = lazy(() => import("./streaming/VoiceStreaming"))
const Trading = lazy(() => import("./Trading"))
const Algorithms = lazy(() => import("./algorithms"))
const HSLPaletteGenerator = lazy(() => import("./Colors"))
const WebRTCChat = lazy(() => import("./WebRTCChat"))

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

export const AppRoute = ({
  authContext,
  appContext,
}: {
  authContext: any
  appContext: any
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (authContext.status === AuthStatus.AUTHORIZED) {
    return (
      <>
        <Navbar
          authContext={authContext}
          appContext={appContext}
          setMobileNavOpen={() => {}}
        />
        <div className="flex flex-1 overflow-hidden h-screen dark:bg-[#212121]">
          <LoginDesktopLeftNavbar />
          <Suspense
            fallback={
              <div className="ml-72 p-4 flex-1 bg-stone-50 dark:bg-[#212121] overflow-y-auto mt-16">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route
                index
                element={
                  <Home appContext={appContext} mobileNavOpen={mobileNavOpen} />
                }
              />
              <Route
                path="/"
                element={
                  <Home appContext={appContext} mobileNavOpen={mobileNavOpen} />
                }
              />
              <Route path="/aegis" element={<Aegis />} />
              <Route path="/voiceStreaming" element={<VoiceStreaming />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/colors" element={<HSLPaletteGenerator />} />
              <Route path="/videoCall" element={<WebRTCChat />} />
            </Routes>
          </Suspense>
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
      <div className="flex flex-1 overflow-hidden h-screen">
        <LoginDesktopLeftNavbar />
        <Routes>
          <Route index element={<LoginHome />} />
          <Route path="/" element={<LoginHome />} />
          <Route path="/login" element={<Login authContext={authContext} />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </div>
    </>
  )
}

export default App
