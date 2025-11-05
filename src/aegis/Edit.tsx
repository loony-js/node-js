import { useContext, useEffect, useState } from "react"
import { editOneCredentialApi } from "../api/index"
import { Facebook, Instagram, Gmail } from "../Icons/index"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { AuthContext } from "context/AuthContext"
import Modal from "./Modal"
import { ArrowLeft, Plus } from "lucide-react"
import { Input, Button } from "loony-ui"
import React from "react"

const domains = [
  { name: "Facebook", icon: <Facebook />, url: "https://facebook.com" },
  { name: "Gmail", icon: <Gmail />, url: "https://gmail.com" },
  { name: "Instagram", icon: <Instagram />, url: "https://instagram.com" },
]

const createNewFormData = () => ({
  name: "",
  url: "",
  username: "",
  password: "",
  master_password: "",
})

function Edit({ state: aegisState, setState: aegisSetState }: any) {
  const { editCredential } = aegisState
  const { user } = useContext(AuthContext)
  const [inputs, setInputs] = useState<any>({})
  const [modal, showModal] = useState(false)
  const [formData, setFormData] = useState(createNewFormData())

  const [state, setState] = useState({
    showPassword: false,
    showMasterPassword: false,
  })

  useEffect(() => {
    React.startTransition(() => {
      setFormData({ ...formData, ...editCredential })
    })
  }, [])

  const validate = () => {
    if (
      formData.name
      // formData.username &&
      // formData.password &&
      // formData.master_password
    ) {
      return true
    } else {
      return false
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (validate() && editCredential && editCredential.aegis_id && user?.uid) {
      editOneCredentialApi(editCredential.aegis_id, {
        ...formData,
        inputs,
        user_id: user?.uid,
      })
        .then(({ data }) => {
          aegisSetState((prevState: any) => ({
            ...prevState,
            allCredentials: [...prevState.allCredentials, data],
          }))
        })
        .then(() => {
          setFormData(createNewFormData())
        })
        .then(() => {
          goHome()
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log(editCredential, user)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    })
  }

  const onClickNewInput = (e: any) => {
    e.preventDefault()
    showModal(true)
  }

  const goHome = () => {
    aegisSetState((prevState: any) => ({ ...prevState, activeTab: 1 }))
  }

  return (
    <div className="min-h-screen flex flex-col px-[30%] text-white">
      <div className="py-4">
        <Button variant="border" onClick={goHome}>
          <ArrowLeft size={18} />
        </Button>
        <div className="py-4">
          <h1 className="text-2xl font-semibold">Create</h1>
        </div>
      </div>
      <div className="flex flex-row">
        {domains.map((domain, index) => {
          return (
            <div
              key={index}
              className="w-18 h-18 border border-[#4d4d4d] p-2 rounded-xl mr-2"
              onClick={() => {
                setFormData({
                  ...formData,
                  url: domain.url,
                  name: domain.name,
                })
              }}
            >
              {domain.icon}
            </div>
          )
        })}
      </div>
      {modal ? (
        <Modal
          modalTitle="Input Name"
          buttonTitle="Encrypt"
          inputTitle="Key name"
          cancel={() => {
            showModal(false)
          }}
          confirm={(e, data) => {
            e.preventDefault()
            setInputs((prevState: any) => ({
              ...prevState,
              [data]: "",
            }))
            showModal(false)
          }}
        />
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg mt-8">
        <div>
          <label className="block text-sm mb-2">Credential name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Credential name"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Email/Username</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username/email/phone"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Url</label>
          <Input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="Enter Url"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Password</label>
          <div className="relative">
            <Input
              name="password"
              type={state.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            {/* Show eye icon only when typing */}
            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setState({ ...state, showPassword: !state.showPassword })
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {state.showPassword ? (
                  <IoEyeOff className="w-5 h-5" />
                ) : (
                  <IoEye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Master Password</label>
          <div className="relative">
            <Input
              name="master_password"
              type={state.showMasterPassword ? "text" : "password"}
              value={formData.master_password}
              onChange={handleChange}
              placeholder="Enter Master password"
              required={formData.password ? true : false}
            />
            {/* Show eye icon only when typing */}
            {formData.master_password.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setState({
                    ...state,
                    showMasterPassword: !state.showMasterPassword,
                  })
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {state.showMasterPassword ? (
                  <IoEyeOff className="w-5 h-5" />
                ) : (
                  <IoEye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bold">Add new fields</h3>
          <div className="border-t border-[#4d4d4d] pt-5"></div>
          <div>
            <Button variant="border" onClick={onClickNewInput}>
              <Plus size={16} />
            </Button>
          </div>
          {Object.keys(inputs).map((key: any) => {
            return (
              <>
                <label className="block text-sm mb-2">{key}</label>
                <div className="relative">
                  <input
                    type="text"
                    name={key}
                    value={inputs[key]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md border border-[#4d4d4d] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )
          })}
        </div>

        <button
          className="w-full
            py-2.5
            rounded-lg
            font-medium
            duration-200
            bg-black
            text-white
            hover:bg-gray-800
            dark:bg-white
            dark:text-black
            dark:hover:bg-gray-200
            dark:focus:ring-white"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Edit
