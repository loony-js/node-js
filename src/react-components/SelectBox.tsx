import React, { useState, useRef, useEffect } from "react"
import "./index.css"

type Language = {
  label: string
  value: string
}
type CustomSelectProps = {
  options: Language[]
  onSelect: (option: string) => void
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)
  const selectRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLUListElement>(null)

  const filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (option: string) => {
    onSelect(option)
    setSearchTerm(option)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => {
        const newIndex = (prev + 1) % filteredOptions.length
        scrollIntoView(newIndex)
        return newIndex
      })
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => {
        const newIndex =
          (prev - 1 + filteredOptions.length) % filteredOptions.length
        scrollIntoView(newIndex)
        return newIndex
      })
    } else if (e.key === "Enter" && filteredOptions[highlightedIndex]) {
      handleSelect(filteredOptions[highlightedIndex].value)
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const scrollIntoView = (index: number) => {
    if (dropdownRef.current) {
      const listItem = dropdownRef.current.children[index] as HTMLElement
      if (listItem) {
        listItem.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="custom-select" ref={selectRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
          setHighlightedIndex(0)
        }}
        onClick={() => {
          setIsOpen(true)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="custom-input"
      />
      {isOpen && (
        <ul className="custom-dropdown" ref={dropdownRef}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`custom-option ${highlightedIndex === index ? "highlighted" : ""}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(option.value)}
              >
                {option.value}
              </li>
            ))
          ) : (
            <li className="custom-no-results">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default CustomSelect
