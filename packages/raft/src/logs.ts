export type Log = { id: number; data: string }

class NodeLogs {
  logs: Log[]

  constructor() {
    this.logs = []
  }

  push(data: Log) {
    this.logs.push(data)
  }
}

export { NodeLogs }
