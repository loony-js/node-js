import { Routes, Route } from "react-router"

import Aegis from "./aegis/index"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import VoiceStreaming from "streaming/VoiceStreaming"
import Algorithms from "./algorithms/index"
import Home, { LoginHome } from "./Home"

import Navbar from "navbar/TopNavbar"
import { AuthContext, AuthStatus } from "./context/AuthContext"
import Trading from "Trading"
import { useState } from "react"
import AppContext from "context/AppContext"
import LoginDesktopLeftNavbar from "navbar/LoginLeftNavbar"
import HSLPaletteGenerator from "Colors"

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
        <div className="flex flex-1 overflow-hidden h-screen">
          <LoginDesktopLeftNavbar />
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
          </Routes>
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
