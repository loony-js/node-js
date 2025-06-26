const cleanUrl = (url: string) => (url[0] === "/" ? url.slice(1) : url)

const GET = (url: string, cb: (res: Record<string, string>) => void) => {
  const newUrl = cleanUrl(url)
  fetch(`http://localhost:2000/${newUrl}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res: Record<string, string>) => {
      cb(res)
    })
    .catch((e) => {
      console.log(e)
    })
}

const POST = (
  url: string,
  body: Record<string, any>,
  cb: (res: Record<string, any>) => void,
) => {
  const newUrl = cleanUrl(url)
  fetch(`http://localhost:2000/${newUrl}`, {
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

export { GET, POST }
