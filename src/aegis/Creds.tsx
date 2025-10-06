import { useCallback, useContext, useEffect, useState } from "react"
import {
  decryptText,
  deleteCredential,
  getAllCredentials,
  getCredentialInfo,
} from "../api/index"
import { AuthContext } from "context/AuthContext"
import Modal from "./Modal"

export default function Table() {
  const { user } = useContext(AuthContext)
  const [creds, setCreds] = useState<null | []>(null)
  const [activeRow, setActiveRow] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [credInfo, setCredInfo] = useState<any>(null)
  const [state, setState] = useState({
    decryptedValue: "",
    showPassword: false,
  })
  const [modal, showModal] = useState<any>({
    showModal: false,
    data: null,
  })

  useEffect(() => {
    if (user) {
      getAllCredentials(user?.uid).then(({ data }) => {
        setCreds(data)
      })
    }
  }, [user])

  const fetchInfo = useCallback((data: any) => {
    getCredentialInfo(data.uid).then((res) => {
      setCredInfo(res.data)
    })
  }, [])

  const handleDelete = (id: number) => {
    setActiveRow(id)
    setIsOpen(true)
  }

  const handleDecrypt = (e: any, v: any) => {
    e.preventDefault()
    if (modal.data && modal.data.value) {
      decryptText({
        password: modal.data.value,
        master_password: v,
      }).then(({ data }: any) => {
        setState({
          ...state,
          decryptedValue: data.password,
        })
      })
    }
  }

  const confirmDelete = () => {
    deleteCredential(activeRow).then(() => {
      const filter: any = creds?.filter((c: any) => c.id !== activeRow)
      setCreds(filter)
      setActiveRow(0)
      setIsOpen(false)
    })
  }

  const onCancel = () => {
    setActiveRow(0)
    setIsOpen(false)
  }

  return (
    <div className="overflow-x-auto p-4">
      {isOpen && activeRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {modal.showModal ? (
        <Modal
          inputTitle="Enter master password"
          buttonTitle="Decrypt"
          modalTitle="Decrypt Text"
          cancel={() => {
            showModal({
              showModal: false,
              data: null,
            })
            setState({
              decryptedValue: "",
              showPassword: false,
            })
          }}
          confirm={(e, data) => {
            handleDecrypt(e, data)
          }}
          value={state.decryptedValue}
        />
      ) : null}
      <div className="flex flex-row">
        <div className="w-[50%]">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {creds &&
                creds.map((cred: any) => (
                  <tr key={cred.name}>
                    <td
                      className="px-4 py-2"
                      onClick={(e) => {
                        e.preventDefault()
                        fetchInfo(cred)
                      }}
                    >
                      {cred.name}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          handleDelete(cred.uid)
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="w-[50%] pl-10">
          {credInfo &&
            credInfo.map((cred: any) => {
              return (
                <div key={cred.key} className="mb-5">
                  <div className="font-semibold">{cred.key}</div>
                  <div>{cred.value}</div>
                  {cred.key === "password" ? (
                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          showModal({
                            showModal: true,
                            data: cred,
                          })
                        }}
                      >
                        Decrypt
                      </button>
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
