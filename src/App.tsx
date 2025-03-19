import SelectBox from "./react-components/SelectBox"
import data from "./react-components/langs.json"

function App() {
  return <SelectBox options={data} onSelect={() => {}} />
}

export default App
