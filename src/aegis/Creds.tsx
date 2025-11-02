import { useContext, useEffect, useState } from "react"
import { getAllCredentials } from "../api/index"
import { AuthContext } from "context/AuthContext"
import { ChevronRight, Globe, Plus } from "lucide-react"

export default function Table({ navigate }: any) {
  const { user } = useContext(AuthContext)
  const [creds, setCreds] = useState<null | any[]>(null)

  useEffect(() => {
    if (user) {
      getAllCredentials(user?.uid).then(({ data }) => {
        setCreds(data)
      })
    }
  }, [user])

  return (
    <div className="min-h-screen flex flex-col items-center dark:text-white">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Passwords</h1>
          <button
            className="bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              navigate(2)
            }}
          >
            <Plus size={18} className="dark:text-gray-900" />
            <span className="dark:text-gray-900">Add</span>
          </button>
        </div>

        <p className="text-sm mb-4">
          Create, save, and manage your passwords so you can easily sign in to
          sites and apps.
        </p>

        {/* Password List */}
        <div className="rounded-xl shadow-lg divide-y divide-gray-200">
          {creds &&
            creds.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 hover:bg-[#f4f4f4] transition cursor-pointer"
                // onClick={() => setExpanded(expanded === index ? null : index)}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(3, item)
                }}
              >
                <div className="flex items-center gap-3">
                  <Globe className="text-gray-900" size={18} />
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
