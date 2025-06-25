import { useState } from "react"
import { callApi } from "../api/index"
import "../assets/css/desktop.css"

function Crypto() {
  const [state, setState] = useState({
    name: "",
    username: "",
    password: "",
  })
  const [res, setRes] = useState("")
  const [tab, setTab] = useState(1)

  const updateRes = (data: Record<string, string>) => {
    setRes(data.data)
  }

  const makeRequest = () => {
    if (tab === 1) {
      callApi("encrypt", state, updateRes)
    }
    if (tab === 2) {
      callApi("decrypt", state, updateRes)
    }
  }

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="con-sm-12 con-xxl-5 mar-hor-1 mar-top-1">
      <h2>Crypto</h2>
      <hr />
      <div>
        <span
          className={`${tab === 1 && "grey-bg"} btn-sm cursor`}
          onClick={() => {
            setTab(1)
          }}
        >
          Encrypt
        </span>
        <span
          className={`${tab === 2 && "grey-bg"} btn-sm cursor`}
          onClick={() => {
            setTab(2)
          }}
        >
          Decrypt
        </span>
      </div>
      <div className="form-section">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={state.name}
          onChange={onChangeText}
        />
      </div>
      <div className="form-section">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={state.username}
          onChange={onChangeText}
        />
      </div>
      <div className="form-section">
        <input
          placeholder="password"
          type="password"
          name="password"
          value={state.password}
          onChange={onChangeText}
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
