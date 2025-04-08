type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  headers?: Record<string, string>
}

class FetchError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
    super(`Fetch failed: ${status} ${statusText}`)
    this.name = "FetchError"
  }
}

export const request = async <T = unknown>(
  url: string,
  options: FetchOptions = {},
): Promise<T> => {
  try {
    const { body, headers = {}, ...rest } = options

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    })

    const contentType = res.headers.get("content-type")
    let responseBody: unknown

    if (contentType?.includes("application/json")) {
      responseBody = await res.json()
    } else {
      responseBody = await res.text()
    }

    if (!res.ok) {
      throw new FetchError(res.status, res.statusText, responseBody)
    }

    return responseBody as T
  } catch (err) {
    if (err instanceof FetchError) {
      console.error("API error:", err.status, err.statusText, err.body)
    } else {
      console.error("Unexpected fetch error:", err)
    }
    throw err
  }
}
