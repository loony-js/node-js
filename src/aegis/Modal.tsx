import { useState } from "react"
import { Button, Input } from "loony-ui"

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
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {modalTitle}
        </h2>
        <p className="text-blue-600 dark:text-red-300 text-lg mb-6">
          <label className="block text-sm mb-2 text-gray-900 dark:text-white">
            {inputTitle}
          </label>
          <Input
            name="New Input"
            type="text"
            onChange={(e) => {
              setKey(e.target.value)
            }}
            value={key}
            placeholder="New Input name"
          />
        </p>
        {value ? <p>Value: {value}</p> : null}
        <div className="flex justify-end space-x-2">
          <Button variant="border" onClick={cancel}>
            Cancel
          </Button>
          <Button
            variant="submit"
            onClick={(e) => {
              confirm(e, key)
            }}
          >
            {buttonTitle}
          </Button>
        </div>
      </div>
    </div>
  )
}
