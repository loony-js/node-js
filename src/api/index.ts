const cleanUrl = (url: string) => (url[0] === "/" ? url.slice(1) : url)

const GET = <R>(url: string, cb: (res: R | null, err: any) => void) => {
  const newUrl = cleanUrl(url)
  fetch(`http://localhost:2000/${newUrl}`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: R) => {
      cb(res, null)
    })
    .catch((e) => {
      cb(null, e)
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
    credentials: "include",
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
