const callApi = (
  url: string,
  body: Record<string, string>,
  cb: (res: Record<string, string>) => void,
) => {
  fetch(`http://localhost:2000/${url}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: Record<string, string>) => {
      cb(res)
    })
    .catch((e) => {
      console.log(e)
    })
}

export { callApi }
