import BubbleSort from "./BubbleSort"
import SelectionSort from "./SelectionSort"
import "./index.css"

export default function Algorithms() {
  return (
    <div className="w-[60%] mx-auto p-4">
      <BubbleSort />
      <SelectionSort />
    </div>
  )
}
