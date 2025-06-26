const run = (data) => {
  let a = data.split("")
  let b = []
  for (let i = 0; i < a.length; i++) {
    if (b.length > 0 && b[b.length - 1] === a[i]) {
      b.pop()
      continue
    }
    if (a[i] !== a[i + 1]) {
      b.push(a[i])
      continue
    }
    i += 1
  }
  return b.join("")
}

console.log(run("abbaca"))
