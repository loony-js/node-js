import { Routes, Route } from "react-router"

import Home from "Home"
import Crypto from "./aegis/index"
import VoiceStreaming from "VoiceStreaming"
import Navbar from "Navbar"
import { AuthContext, AuthProvider } from "context/AuthContext"

function App() {
  return (
    <>
      <AuthProvider>
        <AuthContext.Consumer>
          {(authContext) => {
            return (
              <>
                <Navbar authContext={authContext} />
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="crypto" element={<Crypto />} />
                  <Route path="voiceStreaming" element={<VoiceStreaming />} />
                </Routes>
              </>
            )
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    </>
  )
}

export default App
