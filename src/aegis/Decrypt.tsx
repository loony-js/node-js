import { useEffect, useState } from "react"
import { getCredentialInfo, decryptText } from "../api/index"
import { ArrowLeft } from "lucide-react"
import { Button, Input, Modal } from "loony-ui"

const DecryptModal = ({ password, cancel }: any) => {
  const [master_password, setMasterPassword] = useState("")
  const [decrypted_password, setDecryptedPassword] = useState("")
  const [error, setError] = useState("")

  const onDecrypt = () => {
    if (master_password) {
      decryptText({
        password,
        master_password,
      })
        .then((res) => {
          console.log(res.data)
          if (res.data && res.data.password) {
            setDecryptedPassword(res.data.password)
          }
        })
        .catch(() => {
          setError("Invalid")
        })
    }
  }

  return (
    <Modal>
      <div>
        <div>
          <h2 className="font-bold py-4">Decrypt text</h2>
        </div>
        <div className="flex flex-wrap whitespace-normal gap-2">
          Password: {password.slice(0, 15)}...
        </div>
        <div className="py-2">
          <label>Enter master password</label>
          <Input
            name="Master password"
            value={master_password}
            type="password"
            placeholder="Enter master password"
            onChange={(e) => {
              setMasterPassword(e.target.value)
            }}
          />
        </div>
        <div className="py-2">
          <label>Decrypted password</label>
          <Input
            name="Decrypted password"
            value={decrypted_password || error}
            type="text"
            placeholder="Decrpyted password"
            onChange={() => {}}
            disabled={true}
          />
        </div>

        <div className="py-2 flex space-x-2">
          <Button variant="border" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="submit" onClick={onDecrypt}>
            Decrypt
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function Decrypt({ navigate, data }: any) {
  const [credInfo, setCredInfo] = useState<any>(null)
  const [modal, setModal] = useState(false)
  const [password, setPassword] = useState("")

  useEffect(() => {
    getCredentialInfo(data.uid).then((res) => {
      setCredInfo(res.data)
    })
  }, [data])

  return (
    <div className="min-h-screen flex flex-col items-center dark:text-white">
      {modal ? (
        <DecryptModal
          password={password}
          cancel={() => {
            setModal(false)
          }}
        />
      ) : null}
      <div className="max-w-3xl w-full">
        <div className="py-4">
          <Button
            variant="border"
            onClick={() => {
              navigate(1)
            }}
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="py-4">
            <h1 className="text-2xl font-semibold">{data.name}</h1>
          </div>
        </div>
        <div className="w-[50%]">
          {credInfo &&
            credInfo.map((cred: any) => {
              return (
                <div key={cred.key} className="mb-5">
                  <div className="font-semibold">{cred.key}</div>
                  <div>{cred.value}</div>
                  {cred.key === "password" ? (
                    <div className="mt-4">
                      <Button
                        variant="border"
                        onClick={(e) => {
                          e.preventDefault()
                          setModal(true)
                          setPassword(cred.value)
                        }}
                      >
                        Decrypt
                      </Button>
                    </div>
                  ) : null}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
