import { useState, useRef } from "react"
import { numbers } from "./utils"
import { Button } from "loony-ui"

const BubbleSortVisualizer = () => {
  const [array, setArray] = useState(numbers)
  const [swappingIdx, setSwappingIdx] = useState<number[]>([])
  const [isSorting, setIsSorting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const pauseRef = useRef(false)
  const stopRef = useRef(false)

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const waitWhilePaused = async () => {
    while (pauseRef.current) {
      await sleep(50)
    }
  }

  const bubbleSort = async () => {
    setIsSorting(true)
    stopRef.current = false
    pauseRef.current = false

    const arr = [...array]
    const n = arr.length
    let swapped

    for (let i = 0; i < n - 1; i++) {
      swapped = false
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return setIsSorting(false)

        setSwappingIdx([j, j + 1])
        await waitWhilePaused()
        await sleep(100)

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          swapped = true
          setArray([...arr])
          await sleep(150)
        }
      }
      if (!swapped) break
    }

    setSwappingIdx([])
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
    <div className="">
      <div>
        <h2>Bubble Sort</h2>
      </div>
      <div className="flex items-end py-3">
        {array.map((num, idx) => (
          <div
            key={idx}
            style={{ height: num }}
            className={`p-1 mr-2 border border-gray-500 ${swappingIdx.includes(idx) ? "border-white" : ""}`}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="border" onClick={bubbleSort}>
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

export default BubbleSortVisualizer
