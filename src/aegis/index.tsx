import { useState } from "react"
import Encrypt from "./Encrypt"
import Decrypt from "./Decrypt"

import Creds from "./Creds"
import Edit from "./Edit"

export default function Aegis() {
  const [state, setState] = useState({
    activeTab: 1,
    allCredentials: [],
    activeCredential: null,
    editCredential: null,
  })

  return (
    <main className="flex-1 min-h-screen ml-64 bg-stone-50 dark:bg-[#212121] pt-16">
      {state.activeTab === 1 && <Creds state={state} setState={setState} />}
      {state.activeTab === 2 && <Encrypt state={state} setState={setState} />}
      {state.activeTab === 3 && <Decrypt state={state} setState={setState} />}
      {state.activeTab === 4 && <Edit state={state} setState={setState} />}
    </main>
  )
}
