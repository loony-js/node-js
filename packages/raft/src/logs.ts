type Log = { id: number; data: string }
class NodeLogs {
  logs: Log[]

  constructor() {
    this.logs = []
  }
}

export { NodeLogs }
