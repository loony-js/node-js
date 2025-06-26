import { useState } from "react"
import { POST } from "../api/index"
import "../assets/css/desktop.css"

function Decrypt() {
  const [state, setState] = useState({
    password: "",
    master_password: "",
  })
  const [res, setRes] = useState("")

  const makeRequest = () => {
    POST("decrypt", state, (res) => {
      setRes(res.password)
    })
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

      <hr />
      {res}
    </div>
  )
}

export default Decrypt
