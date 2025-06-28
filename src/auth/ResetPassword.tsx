import { useContext, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { NotificationContextProps } from "loony-types"
import { onSendResetPassword } from "loony-api"
import { AuthContext } from "../context/AuthContext.tsx"

const ResetPassword = ({
  isMobile,
  notificationContext,
}: {
  isMobile: boolean
  notificationContext: NotificationContextProps
}) => {
  // const [viewPassword, setViewPassword] = useState(false)
  // const [viewConfirmPassword, setViewConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
  })
  const [formError, setFormError] = useState({
    label: "",
    message: "",
  })

  const navigate = useNavigate()
  const { sessionId } = useParams()

  const authContext = useContext(AuthContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onClickSendResetPassword = () => {
    setFormError({ label: "", message: "" })
    onSendResetPassword({
      sessionId,
      formData,
      setFormError,
      authContext,
      notificationContext,
      navigate,
    })
  }

  return (
    <div className="book-container">
      <div className="login-body">
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
              className="box-shadow-1"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h2>Reset Password</h2>
              </div>

              <div className="input-container">
                <label htmlFor="phone">Email/Username</label>
                <input
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />

                {formError.label === "username" ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: "red" }}>{formError.message}</div>
                  </div>
                ) : null}
              </div>

              <div className="input-container">
                <label htmlFor="password">New Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // onHandleLogin()
                    }
                  }}
                  required
                />

                {formError.label === "password" ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: "red" }}>{formError.message}</div>
                  </div>
                ) : null}
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBlock: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <input
                      style={{ width: 16, height: 16 }}
                      type="checkbox"
                      onChange={() => {
                        setViewPassword(!viewPassword)
                      }}
                    />
                    <span style={{ marginLeft: 10 }}>Show password</span>
                  </div>
                </div> */}
              </div>

              <div className="input-container">
                <label htmlFor="password">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // onHandleLogin()
                    }
                  }}
                  required
                />

                {formError.label === "confirm_password" ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: "red" }}>{formError.message}</div>
                  </div>
                ) : null}
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBlock: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <input
                      style={{ width: 16, height: 16 }}
                      type="checkbox"
                      onChange={() => {
                        setViewConfirmPassword(!viewConfirmPassword)
                      }}
                    />
                    <span style={{ marginLeft: 10 }}>Show password</span>
                  </div>
                </div> */}
              </div>

              <button
                style={{ width: "100%", marginTop: 30 }}
                onClick={onClickSendResetPassword}
                className="shadow black-bg"
              >
                Send Reset Password Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
