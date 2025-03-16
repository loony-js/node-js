import { useState } from "react"
import { callApi } from "../api/index"
import "../assets/css/desktop.css"

function Crypto() {
  const [text, setText] = useState("")
  const [password, setPassword] = useState("")
  const [res, setRes] = useState("")
  const [state, setState] = useState(1)

  const updateRes = (data: Record<string, string>) => {
    setRes(data.data)
  }

  const makeRequest = () => {
    if (state === 1) {
      callApi("encrypt", { text, password }, updateRes)
    }
    if (state === 2) {
      callApi("decrypt", { text, password }, updateRes)
    }
  }

  return (
    <div className="con-sm-12 con-xxl-5 mar-hor-1 mar-top-1">
      <h2>Crypto</h2>
      <hr />
      <div>
        <span
          className={`${state === 1 && "grey-bg"} btn-sm cursor`}
          onClick={() => {
            setState(1)
          }}
        >
          Encrypt
        </span>
        <span
          className={`${state === 2 && "grey-bg"} btn-sm cursor`}
          onClick={() => {
            setState(2)
          }}
        >
          Decrypt
        </span>
      </div>
      <div className="form-section">
        <input
          type="text"
          placeholder="Text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
      </div>
      <div className="form-section">
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
      <div>
        <button onClick={makeRequest}>Submit</button>
      </div>
      <hr />
      <h4>Results</h4>
      <div>{res}</div>
    </div>
  )
}

export default Crypto
