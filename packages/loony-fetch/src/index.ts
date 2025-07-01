type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface AxiosRequestConfig {
  method?: Method
  url: string
  headers?: Record<string, string>
  data?: any
  timeout?: number
  cancelToken?: CancelToken
}

interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: AxiosRequestConfig
  request: XMLHttpRequest
}

type Interceptor<T> = (value: T) => T | void

class CancelToken {
  private isCancelled = false
  private cancelMessage = "Request canceled"

  cancel(message?: string) {
    this.isCancelled = true
    if (message) this.cancelMessage = message
  }

  throwIfRequested() {
    if (this.isCancelled) {
      throw new Error(this.cancelMessage)
    }
  }
}

class MiniAxios {
  private defaultConfig: AxiosRequestConfig
  private requestInterceptors: Interceptor<AxiosRequestConfig>[] = []
  private responseInterceptors: Interceptor<AxiosResponse>[] = []

  constructor(defaultConfig: AxiosRequestConfig = {}) {
    this.defaultConfig = defaultConfig
  }

  useRequestInterceptor(interceptor: Interceptor<AxiosRequestConfig>) {
    this.requestInterceptors.push(interceptor)
  }

  useResponseInterceptor(interceptor: Interceptor<AxiosResponse>) {
    this.responseInterceptors.push(interceptor)
  }

  create(instanceConfig: AxiosRequestConfig) {
    return new MiniAxios({ ...this.defaultConfig, ...instanceConfig })
  }

  request<T = any>(userConfig: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    let config = { ...this.defaultConfig, ...userConfig }

    for (const interceptor of this.requestInterceptors) {
      const modified = interceptor(config)
      if (modified) config = modified
    }

    return new Promise((resolve, reject) => {
      try {
        if (config.cancelToken) {
          config.cancelToken.throwIfRequested()
        }

        const xhr = new XMLHttpRequest()
        xhr.open(config.method || "GET", config.url)

        if (config.timeout) {
          xhr.timeout = config.timeout
        }

        if (config.headers) {
          for (const key in config.headers) {
            xhr.setRequestHeader(key, config.headers[key])
          }
        }

        xhr.onload = () => {
          const response: AxiosResponse<T> = {
            data: tryParseJSON<T>(xhr.responseText),
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders()),
            config,
            request: xhr,
          }

          for (const interceptor of this.responseInterceptors) {
            const modified = interceptor(response)
            if (modified) Object.assign(response, modified)
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response)
          } else {
            reject(response)
          }
        }

        xhr.onerror = () => {
          reject({ message: "Network Error", config, request: xhr })
        }

        xhr.ontimeout = () => {
          reject({ message: "Request timed out", config, request: xhr })
        }

        const payload = config.data ? JSON.stringify(config.data) : null
        xhr.send(payload)
      } catch (err: any) {
        reject({ message: err.message || "Unexpected error", config })
      }
    })
  }

  get<T = any>(url: string, config: AxiosRequestConfig = {}) {
    return this.request<T>({ ...config, method: "GET", url })
  }

  post<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.request<T>({ ...config, method: "POST", url, data })
  }
}

// Helpers
function parseHeaders(headerStr: string): Record<string, string> {
  const headers: Record<string, string> = {}
  headerStr
    .trim()
    .split(/[\r\n]+/)
    .forEach((line) => {
      const parts = line.split(": ")
      const key = parts.shift()
      const value = parts.join(": ")
      if (key) headers[key] = value
    })
  return headers
}

function tryParseJSON<T = any>(data: string): T {
  try {
    return JSON.parse(data)
  } catch {
    return data as unknown as T
  }
}

export { MiniAxios, CancelToken }
