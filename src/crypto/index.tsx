import { useState } from "react"
import "../assets/css/desktop.css"
import Encrypt from "./Encrypt"
import Decrypt from "./Decrypt"
import Report from "./Report"

function Crypto() {
  const [tab, setTab] = useState(1)

  return (
    <div className="con-sm-12 con-xxl-5 mar-hor-1 mar-top-1">
      <h2>Crypto</h2>

      <div className="tab">
        <div
          className={`tab-item ${tab === 1 && "active-tab"}`}
          onClick={() => {
            setTab(1)
          }}
        >
          Encrypt
        </div>
        <div
          className={`tab-item ${tab === 2 && "active-tab"}`}
          onClick={() => {
            setTab(2)
          }}
        >
          Decrypt
        </div>
        <div
          className={`tab-item ${tab === 3 && "active-tab"}`}
          onClick={() => {
            setTab(3)
          }}
        >
          Report
        </div>
      </div>
      <div>{tab === 1 && <Encrypt />}</div>
      <div>{tab === 2 && <Decrypt />}</div>
      <div>{tab === 3 && <Report />}</div>
    </div>
  )
}

export default Crypto
