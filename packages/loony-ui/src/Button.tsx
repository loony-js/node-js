import { ReactNode } from "react"

const buttonVariant: any = {
  default: `w-full
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
    dark:focus:ring-white`,
  border: `px-4
    py-2
    border
    border-[#cccccc]
    dark:border-[#4d4d4d]
    hover:border-[#666666]
    text-gray-800
    dark:text-white
    rounded`,
  submit: `px-4.5
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
    dark:focus:ring-white`,
  delete: `px-4
    py-2
    bg-red-600
    text-white
    rounded
    hover:bg-red-700`,
  buttonIcon: `inline-flex
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
    dark:text-white`,
}

type Variant = "default" | "border" | "submit" | "delete" | "buttonIcon"

export const Button = ({
  variant,
  onClick,
  children,
}: {
  variant: Variant
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}) => {
  return (
    <button onClick={onClick} className={buttonVariant[variant]}>
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
