import { useState, useRef } from "react"
import { numbers } from "./utils"
import { Button } from "loony-ui"

const SelectionSortVisualizer = () => {
  const [array, setArray] = useState(numbers)
  const [highlighted, setHighlighted] = useState<number[]>([])
  const [sortedIdx, setSortedIdx] = useState<number[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [isSorting, setIsSorting] = useState(false)

  const pauseRef = useRef(false)
  const stopRef = useRef(false)

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const waitWhilePaused = async () => {
    while (pauseRef.current) {
      await sleep(50)
    }
  }

  const selectionSort = async () => {
    setIsSorting(true)
    stopRef.current = false
    pauseRef.current = false

    const arr = [...array]
    const n = arr.length
    const sorted = []

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i

      for (let j = i + 1; j < n; j++) {
        if (stopRef.current) return setIsSorting(false)

        setHighlighted([minIdx, j]) // Highlight comparison
        await waitWhilePaused()
        await sleep(100)

        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]] // Swap elements
        setArray([...arr]) // Update UI
        await new Promise((resolve) => setTimeout(resolve, 200)) // Delay swap animation
      }

      sorted.push(i)
      setSortedIdx([...sorted])
    }

    setSortedIdx([...sorted, n - 1]) // Mark last element as sorted
    setHighlighted([])
    setIsSorting(false)
  }

  const handlePause = () => {
    pauseRef.current = true
    setIsPaused(true)
  }

  const handleResume = () => {
    pauseRef.current = false
    setIsPaused(false)
  }

  const handleStop = () => {
    stopRef.current = true
    pauseRef.current = false
    setIsPaused(false)
  }

  return (
    <div className="container">
      <h2 className="heading">Selection Sort</h2>

      <div className="flex items-end py-3">
        {array.map((num, idx) => (
          <div
            key={idx}
            style={{ height: num + 25 }}
            className={`p-1 mr-2 border border-gray-500 ${highlighted.includes(idx) ? "border-white" : ""} ${
              sortedIdx.includes(idx) ? "sorted" : ""
            }`}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="border" onClick={selectionSort}>
          Start
        </Button>

        {isSorting && !isPaused && (
          <Button variant="border" onClick={handlePause}>
            Pause
          </Button>
        )}

        {isSorting && isPaused && (
          <Button variant="border" onClick={handleResume}>
            Resume
          </Button>
        )}

        {isSorting && (
          <Button variant="border" onClick={handleStop}>
            Stop
          </Button>
        )}
      </div>
    </div>
  )
}

export default SelectionSortVisualizer
