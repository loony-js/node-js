import { useEffect, useState } from "react"
import {
  getOneCredentialApi,
  decryptOneCredentialApi,
  deleteOneCredentialApi,
} from "../api/index"
import { ArrowLeft } from "lucide-react"
import { Button, Input, Modal } from "loony-ui"
import React from "react"

const DecryptModal = ({
  password,
  cancel,
  setFormData,
  onDecryptFinish,
}: any) => {
  const [master_password, setMasterPassword] = useState("")
  // const [decrypted_password, setDecryptedPassword] = useState("")
  const [error, setError] = useState("")

  const onDecrypt = () => {
    if (master_password) {
      decryptOneCredentialApi({
        password,
        master_password,
      })
        .then((res) => {
          if (res.data && res.data.password) {
            setFormData((prevState: any) => ({
              ...prevState,
              password: res.data.password,
            }))
            setError("")
          }
        })
        .then(() => {
          onDecryptFinish()
        })
        .catch((err) => {
          console.log(err)
          setError("Invalid")
        })
    }
  }
  return (
    <Modal>
      <div>
        <div>
          <h2 className="font-bold py-4">Master password</h2>
        </div>
        <div className="py-2">
          <label>{error}</label>
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

const ConfirmDeleteModal = ({ confirm, cancel }: any) => {
  return (
    <Modal>
      <div>
        <div>
          <h2 className="font-bold py-4">
            Are you sure you want to delete credential?
          </h2>
        </div>

        <div className="py-2 flex space-x-2">
          <Button variant="border" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="delete" onClick={confirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const createNewFormData = () => ({
  name: "",
  url: "",
  username: "",
  password: "",
  master_password: "",
})

export default function Decrypt({
  state: aegisState,
  setState: setAegisState,
}: any) {
  const { activeCredential } = aegisState
  const [formData, setFormData] = useState<any>(null)

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [dec, setDec] = useState(false)

  useEffect(() => {
    React.startTransition(() => {
      getOneCredentialApi(activeCredential.uid).then((res: any) => {
        const r: any = createNewFormData()
        res.data.forEach((x: any) => {
          if (x.value) {
            r[x.key] = x.value
          }
        })
        if (activeCredential.name) {
          r.name = activeCredential.name
        }
        setFormData(r)
      })
    })
  }, [])

  const onDeleteCredential = () => {
    deleteOneCredentialApi(activeCredential.uid)
      .then(() => {
        goHome()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const goHome = () => {
    setConfirmDeleteModal(false)
    setAegisState((prevState: any) => ({ ...prevState, activeTab: 1 }))
  }

  const goEdit = () => {
    if (dec) {
      setModal(true)
      setAegisState((prevState: any) => ({
        ...prevState,
        activeTab: 4,
        editCredential: { ...formData, aegis_id: activeCredential.uid },
      }))
    } else {
      setModal(true)
    }
  }

  const onDecryptFinish = () => {
    setDec(true)
    setModal(false)
  }

  if (!formData) return null

  return (
    <div className="min-h-screen flex flex-col items-center dark:text-white">
      {modal ? (
        <DecryptModal
          password={formData.password}
          cancel={() => {
            setModal(false)
          }}
          setFormData={setFormData}
          onDecryptFinish={onDecryptFinish}
        />
      ) : null}
      {confirmDeleteModal ? (
        <ConfirmDeleteModal
          password={formData.password}
          confirm={onDeleteCredential}
          cancel={() => {
            setConfirmDeleteModal(false)
          }}
        />
      ) : null}
      <div className="max-w-3xl w-full">
        <div className="py-4">
          <Button variant="border" onClick={goHome}>
            <ArrowLeft size={18} />
          </Button>
          <div className="py-4">
            <h1 className="text-2xl font-semibold">{activeCredential.name}</h1>
          </div>
        </div>
        <div className="w-[50%]">
          <div className="mb-5">
            <div className="font-semibold">Name</div>
            <div>{formData.name}</div>
          </div>
          <div className="mb-5">
            <div className="font-semibold">Url</div>
            <div>{formData.url}</div>
          </div>
          <div className="mb-5">
            <div className="font-semibold">Username</div>
            <div>{formData.username}</div>
          </div>
          <div>
            <div className="font-semibold">Password</div>
            <div>{formData.password}</div>
          </div>
          <div className="py-2 mt-8">
            <span className="mr-2">
              <Button
                variant="border"
                onClick={(e) => {
                  e.preventDefault()
                  setModal(true)
                }}
              >
                Decrypt
              </Button>
            </span>
            <span className="mr-2">
              <Button variant="border" onClick={goEdit}>
                Edit
              </Button>
            </span>
            <Button
              variant="border"
              onClick={() => {
                setConfirmDeleteModal(true)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
