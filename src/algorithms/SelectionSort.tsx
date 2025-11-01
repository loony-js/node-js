import { useState } from "react"

const SelectionSortVisualizer = () => {
  const [array, setArray] = useState([50, 30, 70, 10, 90, 20, 60])
  const [highlighted, setHighlighted] = useState<number[]>([])
  const [sortedIdx, setSortedIdx] = useState<number[]>([])

  const selectionSort = async () => {
    const arr = [...array]
    const n = arr.length
    const sorted = []

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i

      for (let j = i + 1; j < n; j++) {
        setHighlighted([minIdx, j]) // Highlight comparison
        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]] // Swap elements
        setArray([...arr]) // Update UI
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Delay swap animation
      }

      sorted.push(i)
      setSortedIdx([...sorted])
    }

    setSortedIdx([...sorted, n - 1]) // Mark last element as sorted
    setHighlighted([])
  }

  return (
    <div className="container">
      <h2 className="heading">Selection Sort</h2>

      <div className="array-container">
        {array.map((num, idx) => (
          <div
            key={idx}
            className={`bar ${highlighted.includes(idx) ? "highlight" : ""} ${
              sortedIdx.includes(idx) ? "sorted" : ""
            }`}
          >
            {num}
          </div>
        ))}
      </div>
      <button onClick={selectionSort} className="sort-btn">
        Start Sorting
      </button>
    </div>
  )
}

export default SelectionSortVisualizer
