/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogEntry<T = any> = {
  term: number
  command: T
}

export class RaftLog<T = any> {
  private data: LogEntry<T>[] = []
  private commitIndex: number = -1
  private lastApplied: number = -1

  constructor(data: LogEntry[] = []) {
    this.data = data
    if (data.length > 0) {
      this.commitIndex = data.length - 1
    }
  }

  status() {
    return {
      entries: this.data.length,
      commitIndex: this.getCommitIndex(),
      lastLogIndex: this.getLastLogIndex(),
      lastApplied: this.getLastApplied(),
    }
  }

  // Add a new log entry
  appendEntry(entry: Omit<LogEntry, "index">): boolean {
    this.data.push(entry)
    return true
  }

  // Last log index
  getLastLogIndex(): number {
    return this.data.length > 0 ? this.data.length - 1 : -1
  }

  // Last log term
  getLastLogTerm(): number {
    return this.data.length > 0 ? this.data[this.data.length - 1].term : -1
  }

  // Prev log index (before appending a new entry)
  getPrevLogIndex(): number {
    return this.getLastLogIndex()
  }

  // Prev log term (term of the entry before the new one)
  getPrevLogTerm(): number {
    const index = this.getPrevLogIndex()
    return index >= 0 ? this.data[index].term : -1
  }

  // Commit index
  getCommitIndex(): number {
    return this.commitIndex
  }

  // Set commit index (only if advancing)
  setCommitIndex(newIndex: number): void {
    this.commitIndex = newIndex
  }

  commit() {
    this.setCommitIndex(this.getLastLogIndex())
  }

  // Last applied
  getLastApplied(): number {
    return this.lastApplied
  }

  // Get entry at a specific index
  getEntry(index: number): LogEntry<T> | undefined {
    return this.data[index]
  }

  // Apply entries to state machine up to commitIndex
  applyEntries(): void {
    while (this.lastApplied < this.commitIndex) {
      this.lastApplied++
      const entry = this.data[this.lastApplied]
      this.applyToStateMachine(entry.command)
    }
  }

  // Placeholder for applying to state machine
  private applyToStateMachine(command: any): void {
    // Implement your application logic here
    console.log(`Applying command at index ${this.lastApplied}:`, command)
  }

  // Append new entries (overwrite conflict entries)
  appendEntries(newEntries: LogEntry<T>[]): boolean {
    this.data.concat(newEntries)
    return true
  }

  // Get entries between two indices (inclusive start, exclusive end)
  getEntries(from: number, length: number): LogEntry<T>[] {
    return this.data.slice(from, length)
  }

  printLog(): void {
    console.log("Raft Log:", this.data)
  }
}
