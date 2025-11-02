import { useContext, useState } from "react"
import { encryptText } from "../api/index"
import { Facebook, Instagram, Gmail } from "../Icons/index"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { AuthContext } from "context/AuthContext"
import Modal from "./Modal"
import { Button } from "../ui/Button"
import { ArrowLeft, Plus } from "lucide-react"
import { Input, FormSubmitButton, ButtonIcon } from "loony-ui"

const domains = [
  { name: "Facebook", icon: <Facebook />, url: "https://facebook.com" },
  { name: "Gmail", icon: <Gmail />, url: "https://gmail.com" },
  { name: "Instagram", icon: <Instagram />, url: "https://instagram.com" },
]

function Encrypt({ navigate }: any) {
  const { user } = useContext(AuthContext)
  const [inputs, setInputs] = useState<any>({})
  const [modal, showModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    username: "",
    password: "",
    master_password: "",
  })

  const [state, setState] = useState({
    showPassword: false,
    showMasterPassword: false,
  })

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
    if (validate()) {
      encryptText({ ...formData, inputs, user_id: user?.uid }).then(() => {})
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

  return (
    <div className="min-h-screen flex flex-col px-[30%] text-white">
      <div className="py-4">
        <ButtonIcon
          onClick={() => {
            navigate(1)
          }}
        >
          <ArrowLeft size={18} />
        </ButtonIcon>
        <div className="py-4">
          <h1 className="text-2xl font-semibold">Create</h1>
        </div>
      </div>
      <div className="flex flex-row">
        {domains.map((domain, index) => {
          return (
            <div
              key={index}
              className="w-18 h-18 border border-gray-300 p-2 rounded-xl mr-2"
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
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg">
        <div>
          <label className="block text-sm mb-2">Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your First name"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Username</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter Username"
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
          <div className="border-t border-gray-300 pt-5"></div>
          <div>
            <ButtonIcon onClick={onClickNewInput}>
              <Plus size={16} />
            </ButtonIcon>
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
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )
          })}
        </div>

        <FormSubmitButton>Submit</FormSubmitButton>
      </form>
    </div>
  )
}

export default Encrypt
