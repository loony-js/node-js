export const Input = ({
  value,
  onChange,
  type,
  placeholder,
  name,
  disabled,
  required,
}: {
  name: string
  value: string
  type: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
  required?: boolean
}) => {
  return (
    <input
      type={type}
      className="
        w-full
        px-4
        py-2 
        border
        border-gray-300
        dark:border-[#4d4d4d]
        rounded-md
        bg-gray-50
        dark:bg-[#292929]
        text-gray-900
        dark:text-white
        focus:outline-none
        focus:ring-1
        focus:ring-[#4d4d4d]"
      value={value}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required ? true : false}
      disabled={disabled}
    />
  )
}

export const PasswordInput = ({
  value,
  onChange,
  type,
  placeholder,
  name,
}: {
  name: string
  value: string
  type: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) => {
  return (
    <input
      type={type}
      className="
        w-full
        px-4
        py-2 
        border
        border-gray-300
        dark:border-[#4d4d4d]
        rounded-md
        bg-gray-50
        dark:bg-[#292929]
        text-gray-900
        dark:text-white
        focus:outline-none
        focus:ring-1
        focus:ring-[#4d4d4d]"
      value={value}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required
      autoComplete="password"
    />
  )
}

// focus:outline-none focus:ring-1 focus:ring-[#4d4d4d]
