import { useState } from "react"
import Encrypt from "./Encrypt"
import Decrypt from "./Decrypt"

import Creds from "./Creds"

export default function Aegis() {
  const [tab, setTab] = useState(1)
  const [data, setData] = useState(null)

  const navigate = (index: number, __data: any) => {
    if (__data) {
      setData(__data)
    }
    setTab(index)
  }

  return (
    <div className="w-[60%] mx-auto p-4">
      {tab === 1 && <Creds navigate={navigate} />}
      {tab === 2 && <Encrypt navigate={navigate} />}
      {tab === 3 && <Decrypt data={data} navigate={navigate} />}
    </div>
  )
}
