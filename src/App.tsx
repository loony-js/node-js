import { Routes, Route } from "react-router"

import Home from "Home"
import Crypto from "./crypto/index"
import VoiceStreaming from "VoiceStreaming"

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="crypto" element={<Crypto />} />
        <Route path="voiceStreaming" element={<VoiceStreaming />} />
      </Routes>
    </>
  )
}

export default App
