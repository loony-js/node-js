import { useCallback, useContext, useEffect } from "react"
import { getAllCredentialsApi } from "../api/index"
import { AuthContext } from "context/AuthContext"
import { ChevronRight, Globe, Plus } from "lucide-react"
import { Button } from "loony-ui"

export default function Table({ state, setState }: any) {
  const { allCredentials } = state
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      getAllCredentialsApi(user?.uid).then(({ data }) => {
        setState((prevState: any) => ({
          ...prevState,
          allCredentials: data,
        }))
      })
    }
  }, [user, setState])

  const encryptOne = useCallback(() => {
    setState((prevState: any) => ({
      ...prevState,
      activeTab: 2,
    }))
  }, [setState])

  const decryptItem = (e: any, item: any) => {
    e.preventDefault()
    setState((prevState: any) => ({
      ...prevState,
      activeTab: 3,
      activeCredential: item,
    }))
  }

  return (
    <div className="min-h-screen flex flex-col items-center dark:text-white">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Passwords</h1>
          <Button variant="buttonIcon" onClick={encryptOne}>
            <Plus size={18} />
            <span>Add</span>
          </Button>
        </div>

        <p className="text-sm mb-4">
          Create, save, and manage your passwords so you can easily sign in to
          sites and apps.
        </p>

        {/* Password List */}
        <div className="rounded-xl shadow-lg divide-y divide-gray-200">
          {allCredentials &&
            allCredentials.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 hover:bg-[#f4f4f4] dark:hover:bg-[#363636] transition cursor-pointer"
                // onClick={() => setExpanded(expanded === index ? null : index)}
                onClick={(e) => {
                  decryptItem(e, item)
                }}
              >
                <div className="flex items-center gap-3">
                  <Globe className="" size={18} />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {/* {item.accounts > 1 && (
                    <p className="text-gray-500 text-sm">
                      {item.accounts} accounts
                    </p>
                  )} */}
                  </div>
                </div>

                <div>
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
