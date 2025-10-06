const inputsAsArray = [
  { key: "url", value: "http://localhost:3000" },
  { key: "name", value: "Sankar Boro" },
]

const values = []
const aegis_id = 1
const params = inputsAsArray
  .map((entry) => {
    values.push(entry.key)
    values.push(entry.value)
    const x = [aegis_id, entry.key, entry.value]
    return `(${x.join(", ")})`
  })
  .join(", ")

const query = `
      INSERT INTO aegis_key_value (aegis_id, key, value)
      VALUES ${params}
    `
console.log(query)
console.log(params)
console.log(values)
