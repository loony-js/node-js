import { Routes, Route } from "react-router"

import Aegis from "./aegis/index"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import VoiceStreaming from "VoiceStreaming"
import Navbar from "Navbar"
import { AuthContext, AuthProvider, AuthStatus } from "./context/AuthContext"
import Trading from "Trading"
import { useState } from "react"

function App() {
  return (
    <>
      <AuthProvider>
        <AuthContext.Consumer>
          {(authContext) => <AppRoute authContext={authContext} />}
        </AuthContext.Consumer>
      </AuthProvider>
    </>
  )
}

function Home({ setApp }: any) {
  return (
    <div className="w-[60%] mx-auto p-4">
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
    </div>
  )
}
export const AppRoute = ({ authContext }: { authContext: any }) => {
  const [app, setApp] = useState("")
  if (authContext.status === AuthStatus.AUTHORIZED) {
    return (
      <>
        <Navbar authContext={authContext} />
        {app === "Aegis" ? <Aegis /> : null}
        {app === "VoiceStreaming" ? <VoiceStreaming /> : null}
        {app === "Trading" ? <Trading /> : null}
        {app === "" ? <Home setApp={setApp} /> : null}
      </>
    )
  }

  return (
    <>
      <Navbar authContext={authContext} />
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
