import { useEffect, useState } from "react"
import { GET, POST } from "../api/index"

function Creds() {
  const [creds, setCreds] = useState<null | []>(null)

  useEffect(() => {
    GET("/aegis/all", (res: any) => {
      setCreds(res)
    })
  }, [])

  const onDelete = (id: number) => {
    POST("/aegis/delete/" + id, {}, () => {
      const filter: any = creds?.filter((c: any) => c.id !== id)
      setCreds(filter)
    })
  }

  return (
    <div className="mar-top-1">
      <div>
        <div
          className="flex-row"
          style={{
            width: "100%",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            fontWeight: "bold",
          }}
        >
          <div style={{ width: "10%" }}>Name</div>
          <div style={{ width: "15%" }}>Username</div>
          <div style={{ width: "70%" }}>Password</div>
          <div style={{ width: "10%" }}>Actions</div>
        </div>
        {creds &&
          creds.map((cred: any) => {
            return (
              <div
                key={cred.id}
                className="flex-row"
                style={{
                  width: "100%",
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div style={{ width: "10%" }}>{cred.name}</div>
                <div style={{ width: "15%" }}>{cred.username}</div>
                <div style={{ width: "70%" }}>{cred.password}</div>
                <div style={{ width: "10%" }}>
                  <button
                    onClick={() => {
                      onDelete(cred.id)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Creds
