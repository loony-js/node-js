import { ReactNode } from "react"

export const CancelButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border border-[#cccccc] dark:border-[#4d4d4d] hover:border-[#666666] text-gray-800 dark:text-white rounded"
    >
      Cancel
    </button>
  )
}

export const SubmitButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-[#f0f0f0] hover:bg-[#dedede] text-gray-800 rounded"
    >
      Submit
    </button>
  )
}

export const Button = ({
  onClick,
  title,
  icon = undefined,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  title: string
  icon?: any
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center px-4 py-2 bg-[#f0f0f0] hover:bg-[#dedede] text-gray-800 rounded"
    >
      {icon ? <span className="mr-2">{icon}</span> : null} {title}
    </button>
  )
}

export const DeleteButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Delete
    </button>
  )
}

export const ButtonIcon = ({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}) => {
  return (
    <button
      className="p-2 rounded-md text-[#2d2d2d] dark:text-white hover:bg-[#ececec] dark:hover:bg-[#333333] transition"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
