### Advanced Promises in JavaScript

Promises are a core part of modern JavaScript for handling asynchronous operations. While basic usage includes `.then()`, `.catch()`, and `.finally()`, advanced techniques help in optimizing and structuring complex async workflows.

---

## 1. **Chaining and Error Handling**

```js
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data:", data)
    return processData(data) // Returns another promise
  })
  .then((result) => console.log("Processed:", result))
  .catch((error) => console.error("Error:", error))
  .finally(() => console.log("Cleanup or final execution"))
```

- `.catch()` will handle any errors in the chain.
- `.finally()` runs regardless of success or failure.

---

## 2. **Promise.all() - Parallel Execution**

If you need to run multiple independent promises in parallel and wait for all of them to complete:

```js
const p1 = fetch("/api/user").then((res) => res.json())
const p2 = fetch("/api/posts").then((res) => res.json())

Promise.all([p1, p2])
  .then(([user, posts]) => console.log({ user, posts }))
  .catch((error) => console.error("Error in one of the promises", error))
```

- Fails fast: If any promise rejects, `Promise.all()` immediately rejects.

---

## 3. **Promise.allSettled() - Handling Multiple Async Tasks Independently**

When you want all promises to complete, even if some fail:

```js
const promises = [
  fetch("/api/user").then((res) => res.json()),
  fetch("/api/posts").then((res) => res.json()),
  Promise.reject("Some error"),
]

Promise.allSettled(promises).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Promise ${index} fulfilled:`, result.value)
    } else {
      console.warn(`Promise ${index} rejected:`, result.reason)
    }
  })
})
```

- Unlike `Promise.all()`, this will wait for **all** promises to settle.

---

## 4. **Promise.race() - First to Resolve Wins**

Returns the result of the first settled promise (resolved or rejected).

```js
const p1 = new Promise((resolve) => setTimeout(resolve, 100, "Fast"))
const p2 = new Promise((resolve) => setTimeout(resolve, 500, "Slow"))

Promise.race([p1, p2]).then(console.log) // "Fast"
```

- Useful for timeout-based mechanisms.

---

## 5. **Promise.any() - First to Resolve (Ignoring Failures)**

Returns the first **fulfilled** promise, ignoring rejected ones.

```js
const p1 = Promise.reject("Error 1")
const p2 = new Promise((resolve) => setTimeout(resolve, 200, "Success"))
const p3 = Promise.reject("Error 3")

Promise.any([p1, p2, p3])
  .then(console.log) // "Success"
  .catch(console.error) // Only runs if all promises reject
```

- If all promises reject, it throws an `AggregateError`.

---

## 6. **Custom Promise with async/await**

Using `async/await` inside a promise:

```js
function asyncOperation(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value > 10) resolve("Success!")
      else reject("Value too low")
    }, 1000)
  })
}

;(async () => {
  try {
    const result = await asyncOperation(15)
    console.log(result) // "Success!"
  } catch (error) {
    console.error(error)
  }
})()
```

- `async/await` makes code cleaner and avoids `.then()` nesting.

---

## 7. **Timeout Handling with Promise.race()**

```js
function fetchWithTimeout(url, timeout = 5000) {
  const fetchPromise = fetch(url).then((res) => res.json())
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeout),
  )

  return Promise.race([fetchPromise, timeoutPromise])
}

fetchWithTimeout("https://api.example.com/data", 3000)
  .then(console.log)
  .catch(console.error)
```

- If the fetch takes too long, the timeout promise rejects first.

---

## 8. **Sequential Execution of Promises (Reduce)**

Executing promises sequentially:

```js
const tasks = [
  () => Promise.resolve("Task 1 done"),
  () => new Promise((res) => setTimeout(() => res("Task 2 done"), 1000)),
  () => Promise.resolve("Task 3 done"),
]

tasks
  .reduce(
    (prev, task) => prev.then(() => task().then(console.log)),
    Promise.resolve(),
  )
  .then(() => console.log("All tasks complete"))
```

- This runs promises **one after another** instead of parallel execution.

---

## 9. **Retry Mechanism for Unreliable Operations**

```js
async function retryOperation(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed. Retrying...`)
      await new Promise((res) => setTimeout(res, delay))
    }
  }
  throw new Error("All retries failed")
}

retryOperation(() =>
  fetch("https://api.example.com/data").then((res) => res.json()),
)
  .then(console.log)
  .catch(console.error)
```

- Useful for handling flaky API requests.

---

## 10. **Cancelable Promises**

JavaScript does not have native cancelable promises, but you can implement a workaround:

```js
function createCancelablePromise(executor) {
  let cancel
  const promise = new Promise((resolve, reject) => {
    cancel = () => reject(new Error("Promise canceled"))
    executor(resolve, reject)
  })
  return { promise, cancel }
}

const { promise, cancel } = createCancelablePromise((resolve) =>
  setTimeout(() => resolve("Finished"), 2000),
)

setTimeout(() => cancel(), 1000)

promise.then(console.log).catch((err) => console.warn(err.message)) // "Promise canceled"
```

- Used for scenarios where an operation should be aborted if no longer needed.

---

### **Conclusion**

Mastering advanced promise patterns helps in building efficient, scalable, and maintainable asynchronous JavaScript applications. Using techniques like **parallel execution, retries, cancellation, and timeouts**, you can handle various real-world async scenarios effectively.

Would you like a deep dive into a specific case? 🚀
