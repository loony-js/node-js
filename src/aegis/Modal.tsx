import { useState } from "react"
import { CancelButton, Button } from "../ui/Button"

export default function NewInputModal({
  cancel,
  confirm,
  modalTitle,
  inputTitle,
  buttonTitle,
  value,
}: {
  cancel: () => void
  confirm: (e: any, data: any) => void
  modalTitle?: string
  inputTitle?: string
  buttonTitle?: string
  value?: any
}) {
  const [key, setKey] = useState("")
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {modalTitle}
        </h2>
        <p className="text-blue-600 dark:text-red-300 text-lg mb-6">
          <label className="block text-sm mb-2 text-gray-900 dark:text-white">
            {inputTitle}
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setKey(e.target.value)
            }}
            value={key}
          />
        </p>
        {value ? <p>Value: {value}</p> : null}
        <div className="flex justify-end space-x-2">
          <CancelButton onClick={cancel} />
          <Button
            onClick={(e) => {
              confirm(e, key)
            }}
            title={buttonTitle || ""}
          />
        </div>
      </div>
    </div>
  )
}
