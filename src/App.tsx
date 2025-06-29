import { Routes, Route } from "react-router"

import Home from "Home"
import Crypto from "./aegis/index"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import VoiceStreaming from "VoiceStreaming"
import Navbar from "Navbar"
import { AuthContext, AuthProvider, AuthStatus } from "./context/AuthContext"

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

export const AppRoute = ({ authContext }: { authContext: any }) => {
  if (authContext.status === AuthStatus.AUTHORIZED) {
    return (
      <>
        <Navbar authContext={authContext} />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="crypto" element={<Crypto />} />
          <Route path="voiceStreaming" element={<VoiceStreaming />} />
        </Routes>
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
