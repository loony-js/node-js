import { useState, useRef } from "react"
import { numbers } from "./utils"
import { Button } from "loony-ui"

const animationDelay = 300

const MergeSortVisualizer = () => {
  const [array, setArray] = useState(numbers)
  const [highlightRange, setHighlightRange] = useState<[number, number] | null>(
    null,
  )
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

  const mergeSort = async (
    arr: number[],
    start: number,
    end: number,
  ): Promise<number[]> => {
    if (stopRef.current) return arr
    await waitWhilePaused()

    if (end - start <= 1) return arr.slice(start, end)

    const mid = Math.floor((start + end) / 2)
    const left = await mergeSort(arr, start, mid)
    const right = await mergeSort(arr, mid, end)

    const merged: number[] = []
    let i = 0,
      j = 0

    setHighlightRange([start, end])
    await sleep(animationDelay)

    while (i < left.length && j < right.length) {
      await waitWhilePaused()
      if (stopRef.current) return arr

      if (left[i] < right[j]) merged.push(left[i++])
      else merged.push(right[j++])

      // Update array partially as we merge
      const newArr = [...arr]
      for (let k = 0; k < merged.length; k++) {
        newArr[start + k] = merged[k]
      }
      setArray(newArr)
      await sleep(animationDelay)
    }

    // Copy remaining elements
    while (i < left.length) {
      merged.push(left[i++])
      const newArr = [...arr]
      for (let k = 0; k < merged.length; k++) {
        newArr[start + k] = merged[k]
      }
      setArray(newArr)
      await sleep(animationDelay)
    }

    while (j < right.length) {
      merged.push(right[j++])
      const newArr = [...arr]
      for (let k = 0; k < merged.length; k++) {
        newArr[start + k] = merged[k]
      }
      setArray(newArr)
      await sleep(animationDelay)
    }

    return merged
  }

  const startMergeSort = async () => {
    setIsSorting(true)
    stopRef.current = false
    pauseRef.current = false

    const arrCopy = [...array]
    await mergeSort(arrCopy, 0, arrCopy.length)
    setHighlightRange(null)
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
    <div>
      <h2>Merge Sort</h2>

      <div className="flex items-end py-3">
        {array.map((num, idx) => (
          <div
            key={idx}
            style={{ height: num }}
            className={`p-1 mr-1 border border-gray-500 ${
              highlightRange &&
              idx >= highlightRange[0] &&
              idx < highlightRange[1]
                ? "border-white"
                : ""
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="border" onClick={startMergeSort}>
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

export default MergeSortVisualizer
