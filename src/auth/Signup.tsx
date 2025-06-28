import { useState } from "react"
import { onSignup } from "loony-api"
import { Link, useNavigate } from "react-router"
import { NotificationContextProps } from "loony-types"

const Signup = ({
  isMobile,
  notificationContext,
}: {
  isMobile: boolean
  notificationContext: NotificationContextProps
}) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    password: "",
  })

  const [state, setState] = useState({
    viewPassword: false,
    state: 1,
  })
  const [formError, setFormError] = useState({
    label: "",
    message: "",
  })
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onHandleSignup = () =>
    onSignup({
      formData,
      notificationContext,
      navigate,
      setFormError,
    })

  return (
    <div className="book-container">
      <div className="signup-body">
        <div
          style={{
            width: "90%",
            height: "90vh",
            display: "flex",
            flexDirection: "row",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {!isMobile ? (
            <div
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                {/* <img src={require('../../assets/images/login.png')} style={{ width: '100%' }} /> */}
              </div>
              <div style={{ marginBlock: 20 }}>
                <div style={{ fontWeight: "bold", fontSize: 32 }}>Loony</div>
              </div>
            </div>
          ) : null}
          <div
            style={{
              width: isMobile ? "94%" : "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 380,
                padding: 20,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h2>Sign Up</h2>
              </div>

              <div className="input-container">
                <label htmlFor="fname">First Name</label>
                <input
                  name="fname"
                  id="fname"
                  type="text"
                  required
                  value={formData.fname}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onHandleSignup()
                    }
                  }}
                  autoFocus
                />

                {formError.label === "fname" ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: "red" }}>{formError.message}</div>
                  </div>
                ) : null}
              </div>

              <div className="input-container">
                <label htmlFor="lname">Last Name</label>
                <input
                  name="lname"
                  id="lname"
                  type="text"
                  required
                  value={formData.lname}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onHandleSignup()
                    }
                  }}
                />
              </div>

              <div className="input-container">
                <label htmlFor="phone">Email or Phone Number</label>
                <input
                  name="username"
                  id="phone"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onHandleSignup()
                    }
                  }}
                />

                {formError.label === "username" ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: "red" }}>{formError.message}</div>
                  </div>
                ) : null}
              </div>

              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  type={state.viewPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onHandleSignup()
                    }
                  }}
                  required
                />

                {formError.label === "password" ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: "red" }}>{formError.message}</div>
                  </div>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBlock: 10,
                  }}
                >
                  <input
                    style={{ width: 16, height: 16 }}
                    type="checkbox"
                    onChange={() => {
                      setState((prevState) => ({
                        ...prevState,
                        viewPassword: !prevState.viewPassword,
                      }))
                    }}
                  />
                  <span style={{ marginLeft: 10 }}>Show password</span>
                </div>
              </div>
              <button
                style={{ width: "100%" }}
                onClick={onHandleSignup}
                className="shadow black-bg"
              >
                Sign Up
              </button>

              <div
                style={{
                  marginBlock: 10,
                  fontSize: 14,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <span style={{ color: "#6d6d6d" }}>
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  style={{ color: "rgb(15, 107, 228)", marginLeft: 5 }}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
