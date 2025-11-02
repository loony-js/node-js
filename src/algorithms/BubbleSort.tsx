import { useState } from "react"

const BubbleSortVisualizer = () => {
  const [array, setArray] = useState([50, 30, 70, 10, 90, 20, 60])
  const [swappingIdx, setSwappingIdx] = useState<number[]>([])

  const bubbleSort = async () => {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setSwappingIdx([j, j + 1]) // Highlight elements being compared

        await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay for animation

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]] // Swap elements
          setArray([...arr]) // Update UI

          await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay after swap
        }
      }
    }
    setSwappingIdx([]) // Reset highlights after sorting
  }

  return (
    <div className="container">
      <h2 className="heading">Bubble Sort</h2>
      <div className="array-container">
        {array.map((num, idx) => (
          <div
            key={idx}
            className={`bar ${swappingIdx.includes(idx) ? "swapping" : ""}`}
          >
            {num}
          </div>
        ))}
      </div>
      <button onClick={bubbleSort} className="sort-btn">
        Start Sorting
      </button>
    </div>
  )
}

export default BubbleSortVisualizer
