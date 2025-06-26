import { useState } from "react"
import { POST } from "../api/index"
import "../assets/css/desktop.css"

function Encrypt() {
  const [state, setState] = useState({
    name: "",
    username: "",
    password: "",
    master_password: "",
  })

  const makeRequest = () => {
    POST("encrypt", state, () => {})
  }

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="mar-top-1">
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
          placeholder="Password"
          type="password"
          name="password"
          value={state.password}
          onChange={onChangeText}
        />
      </div>
      <div className="form-section">
        <input
          placeholder="Master password"
          type="password"
          name="master_password"
          value={state.master_password}
          onChange={onChangeText}
        />
      </div>
      <div>
        <button onClick={makeRequest}>Submit</button>
      </div>
    </div>
  )
}

export default Encrypt
