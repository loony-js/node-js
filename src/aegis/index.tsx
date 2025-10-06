import { useState } from "react"
import Encrypt from "./Encrypt"
import Creds from "./Creds"

const tabs = ["List", "Encrypt"]

export default function Aegis() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="w-[60%] mx-auto p-4">
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-2 text-center font-medium transition-all ${
              activeTab === index
                ? "bg-gray-200 rounded-t-lg p-4"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === 0 && <Creds />}
      {activeTab === 1 && <Encrypt />}
    </div>
  )
}
