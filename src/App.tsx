import { Routes, Route } from "react-router"

import Home from "Home"
import Crypto from "./crypto/index"
import VoiceStreaming from "VoiceStreaming"
import Navbar from "Navbar"

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="crypto" element={<Crypto />} />
          <Route path="voiceStreaming" element={<VoiceStreaming />} />
        </Routes>
      </div>
    </>
  )
}

export default App
