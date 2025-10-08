import { useEffect, useState } from "react"
import { getCredentialInfo } from "../api/index"
import { ArrowLeft } from "lucide-react"

export default function Decrypt({ navigate, data }: any) {
  const [credInfo, setCredInfo] = useState<any>(null)

  useEffect(() => {
    getCredentialInfo(data.uid).then((res) => {
      setCredInfo(res.data)
    })
  }, [data])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="py-4">
          <button
            className="bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              navigate(1)
            }}
          >
            <ArrowLeft size={18} />
          </button>
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
                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          // showModal({
                          //   showModal: true,
                          //   data: cred,
                          // })
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
