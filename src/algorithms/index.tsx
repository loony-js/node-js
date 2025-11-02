import { useState } from "react"
import BubbleSort from "./BubbleSort"
import SelectionSort from "./SelectionSort"
import { Button } from "loony-ui"
import MergeSortVisualizer from "./MergeSort"

const sortingNames = ["bubble", "selection", "merge"]

export default function Algorithms() {
  const [sortingName, setSortingName] = useState("bubble")

  return (
    <main className="flex-1 min-h-screen ml-72 bg-stone-50 dark:bg-[#212121] pt-16 text-white">
      <div className="min-h-screen flex flex-col px-[5%] text-white">
        <div className="flex flex-row">
          <div className="w-64 flex flex-col">
            {sortingNames.map((name) => {
              return (
                <div key={name} className="mb-2">
                  <Button
                    onClick={() => {
                      setSortingName(name)
                    }}
                    variant="border"
                  >
                    {name} sort
                  </Button>
                </div>
              )
            })}
          </div>
          <div className="ml-12">
            {sortingName === "bubble" ? <BubbleSort /> : null}
            {sortingName === "selection" ? <SelectionSort /> : null}
            {sortingName === "merge" ? <MergeSortVisualizer /> : null}
          </div>
        </div>
      </div>
    </main>
  )
}
