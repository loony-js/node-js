/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogEntry<T = any> = {
  index: number
  term: number
  command: T
}

export class RaftLog<T = any> {
  private entries: LogEntry<T>[] = []
  private baseIndex = 0
  private baseTerm = 0

  constructor() {
    // Base log index (before snapshot or first entry)
    this.entries = []
  }

  // Return index of last log entry
  getLastLogIndex(): number {
    return this.baseIndex + this.entries.length
  }

  // Return term of last log entry
  getLastLogTerm(): number {
    if (this.entries.length === 0) return this.baseTerm
    return this.entries[this.entries.length - 1].term
  }

  // Get entry at a specific index
  getEntry(index: number): LogEntry<T> | undefined {
    if (index <= this.baseIndex) return undefined
    const i = index - this.baseIndex - 1
    return this.entries[i]
  }

  // Check if log contains entry at index and term
  matchEntry(index: number, term: number): boolean {
    if (index === this.baseIndex) return term === this.baseTerm
    const entry = this.getEntry(index)
    return !!entry && entry.term === term
  }

  // Append new entries (overwrite conflict entries)
  appendEntries(
    prevLogIndex: number,
    prevLogTerm: number,
    newEntries: LogEntry<T>[],
  ): boolean {
    if (!this.matchEntry(prevLogIndex, prevLogTerm)) {
      return false
    }

    const startIndex = prevLogIndex + 1
    const localIndex = startIndex - this.baseIndex - 1

    // Remove conflicting entries
    for (let i = 0; i < newEntries.length; i++) {
      const existing = this.entries[localIndex + i]
      if (existing && existing.term !== newEntries[i].term) {
        this.entries.splice(localIndex + i)
        break
      }
    }

    // Append new entries
    for (let i = 0; i < newEntries.length; i++) {
      const targetIndex = localIndex + i
      if (!this.entries[targetIndex]) {
        this.entries[targetIndex] = newEntries[i]
      }
    }

    return true
  }

  // Delete all log entries starting from `index`
  deleteFrom(index: number): void {
    if (index <= this.baseIndex) return
    this.entries.splice(index - this.baseIndex - 1)
  }

  // Get entries between two indices (inclusive start, exclusive end)
  getEntries(from: number, to: number): LogEntry<T>[] {
    const start = from - this.baseIndex - 1
    const end = to - this.baseIndex - 1
    return this.entries.slice(start, end)
  }

  // Compact log up to a certain index (snapshot, not implemented)
  compact(upToIndex: number, term: number): void {
    if (upToIndex <= this.baseIndex) return
    const newStart = upToIndex - this.baseIndex
    this.entries = this.entries.slice(newStart)
    this.baseIndex = upToIndex
    this.baseTerm = term
  }

  printLog(): void {
    console.log(
      "Raft Log:",
      this.entries.map((e) => ({ i: e.index, t: e.term })),
    )
  }
}
