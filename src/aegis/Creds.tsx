import { useContext, useEffect, useState } from "react"
import { deleteCredential, getAllCredentials } from "../api/index"
import { AuthContext } from "context/AuthContext"

export default function Table() {
  const { user } = useContext(AuthContext)
  const [creds, setCreds] = useState<null | []>(null)
  const [activeRow, setActiveRow] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      getAllCredentials(user?.uid).then(({ data }) => {
        setCreds(data)
      })
    }
  }, [user])

  const handleDelete = (id: number) => {
    setActiveRow(id)
    setIsOpen(true)
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
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Hashed Text</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {creds &&
            creds.map((cred: any) => (
              <tr key={cred.id}>
                <td className="px-4 py-2">{cred.name}</td>
                <td className="px-4 py-2">{cred.username}</td>
                <td className="px-4 py-2">{cred.password}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      handleDelete(cred.id)
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
  )
}
