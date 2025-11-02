import { ReactNode } from "react"

export const BorderButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4
      py-2
      border
      border-[#cccccc]
      dark:border-[#4d4d4d]
      hover:border-[#666666]
      text-gray-800
      dark:text-white
      rounded"
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
      className="px-4.5
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
  )
}

export const FormSubmitButton = ({ children }: any) => {
  return (
    <button
      className="px-4.5
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
      {children}
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

export const Button = ({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}) => {
  return (
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
      onClick={onClick}
    >
      {children}
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
      data-slot="button"
      className="inline-flex
      items-center
      justify-center
      gap-2
      whitespace-nowrap
      rounded-md
      p-4
      py-2
      border
      border-gray-300
      hover:border-gray-500
      dark:border-[#636363]
      dark:text-white"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
// active:scale-[0.98]
// focus:outline-none
// focus:ring-2
// focus:ring-offset-2
// focus:ring-black
// transition-all
