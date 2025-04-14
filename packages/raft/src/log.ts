/* eslint-disable @typescript-eslint/no-explicit-any */
// const encode = require("encoding-down")
// const levelup = require("levelup")
// const PromiseQueue = require("promise-queue")
// import { AbstractLevel } from "abstract-level"
import { Level } from "level"
import { KeyStream } from "level-read-stream"

type Entry = {
  term: any
  index: any
  committed: boolean
  responses: {
    address: any
    ack: boolean
  }[]
  command: any
}

const db = new Level<string, Entry>("example", { valueEncoding: "json" })

// const keyEncoding = {
//   decode: function (raw: string) {
//     return parseInt(raw)
//   },
//   encode: function (key: number) {
//     return key.toString(16).padStart(8, "0")
//   },
// }

class PromiseQueue {
  private queue: (() => Promise<any>)[] = []
  private pending = false

  async add(task: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (err) {
          reject(err)
        }
      })

      if (!this.pending) this.next()
    })
  }

  private async next() {
    if (this.queue.length === 0) {
      this.pending = false
      return
    }

    this.pending = true
    const task = this.queue.shift()
    if (task) {
      await task()
      this.next()
    }
  }
}

/**
 * @typedef Entry
 * @property {number} index the key for the entry
 * @property {number} term the term that the entry was saved in
 * @property {boolean} Committed if the entry has been committed
 * @property {array}  responses number of followers that have saved the log entry
 * @property {object}  command The command to be used in the raft state machine
 */
class Log {
  db: Level<string, Entry>
  committedIndex: number
  commandAckQueue: PromiseQueue

  /**
   * @class
   * @param {object} node    The raft node using this log
   * @param {object} Options         Options object
   * @param {object}   Options.[adapter= require('leveldown')] Leveldown adapter, defaults to leveldown
   * @param {string}   Options.[path='./']    Path to save the log db to
   * @return {Log}
   */
  constructor() {
    // this.node = node
    this.committedIndex = 0
    this.db = db
    this.commandAckQueue = new PromiseQueue()
  }

  /**
   * saveCommand - Saves a command to the log
   * Initially the command is uncommitted. Once a majority
   * of follower nodes have saved the log entry it will be
   * committed.
   *
   * A follow node will also use this method to save a received command to
   * its log
   *
   * @async
   * @param {object} command A json object to save to the log
   * @param {number} term    Term to save with the log entry
   * @param {number} [index] Index to save the entry with. This is used by the followers
   * @return {Promise<entry>} Description
   */
  async saveCommand(command: string, term: number, index: number | undefined) {
    if (!index) {
      const { index: lastIndex } = await this.getLastInfo()
      index = lastIndex + 1
    }

    const entry = {
      term: term,
      index,
      committed: false,
      responses: [
        {
          //   address: this.node.address, // start with vote from leader
          address: "",
          ack: true,
        },
      ],
      command,
    }

    await this.put(entry)
    return entry
  }

  /**
   * put - Save entry to database using the index as the key
   *
   * @async
   * @param {Entry} entry entry to save
   * @return {Promise<void>} Resolves once entry is saved
   * @public
   */
  put(entry: Entry) {
    return this.db.put(entry.index, entry)
  }

  /**
   * getEntriesAfter - Get all the entries after a specific index
   *
   * @param {number} index Index that entries must be greater than
   * @return {Promise<Entry[]>} returns all entries
   * @public
   */
  getEntriesAfter(index: number): Promise<Level<string, Entry>> {
    // const entries = []
    return new Promise((resolve) => {
      const strm = new KeyStream(this.db, { gt: index }).db
      resolve(strm)
      //   this.db
      //     .createReadStream({ gt: index })
      //     .on("data", (data) => {
      //       entries.push(data.value)
      //     })
      //     .on("error", (err) => {
      //       reject(err)
      //     })
      //     .on("end", () => {
      //       resolve(entries)
      //     })
    })
  }

  /**
   * removeEntriesAfter - Removes all entries after a given index
   *
   * @async
   * @param {Number} index Index to use to find all entries after
   * @return {Promise<void>} Returns once all antries are removed
   * @public
   */
  async removeEntriesAfter(index: number) {
    const entries = await this.getEntriesAfter(index)
    // new Promise.all(
    //   ,
    // )
    for await (const key of entries.keys()) {
      this.db.del(key)
    }
  }

  /**
   * has - Checks if entry exists at index
   *
   * @async
   * @param {number} index Index position to check if entry exists
   * @return {boolean} Boolean on whether entry exists at index
   * @public
   */
  async has(index: string) {
    try {
      const entry = await this.db.get(index)
      if (entry) return true
      return false
    } catch (err) {
      console.log(err)
      return false
    }
  }

  /**
   * get - Gets an entry at the specified index position
   *
   * @param {type} index Index position of entry
   * @return {Promise<Entry>} Promise of found entry returns NotFoundError if does not exist
   * @public
   */
  get(index: string) {
    return this.db.get(index)
  }

  /**
   * getLastInfo - Returns index, term of the last entry in the long along with
   * the committedIndex
   *
   * @async
   * @return {Promise<Object>} Last entries index, term and committedIndex
   */
  async getLastInfo(): Promise<{
    index: number
    term: number
    committedIndex: number
  }> {
    const entry = await this.getLastEntry()
    let index = -1
    let term = -1

    for await (const ent of entry.values()) {
      index = ent.index
      term = ent.term
    }

    return {
      index,
      term,
      committedIndex: this.committedIndex,
    }
  }

  /**
   * getLastEntry - Returns last entry in the log
   *
   * @return {Promise<Entry>} returns {index: 0, term: node.term} if there are no entries in the log
   */
  getLastEntry(): Promise<Level<string, Entry>> {
    return new Promise((resolve) => {
      //   let hasResolved = false
      //   let entry = {
      //     index: 0,
      //     term: this.node.term,
      //   }
      const strm = new KeyStream(this.db, { reverse: true, limit: 1 }).db
      resolve(strm)
      //   this.db
      //     .createReadStream({ reverse: true, limit: 1 })
      //     .on("data", (data) => {
      //       hasResolved = true
      //       entry = data.value
      //     })
      //     .on("error", (err) => {
      //       hasResolved = true
      //       reject(err)
      //     })
      //     .on("end", () => {
      //       resolve(entry)
      //     })
    })
  }

  /**
   * getEntryInfoBefore - Gets the index and term of the previous entry along with the log's committedIndex
   * If there is no item before it returns {index: 0}
   *
   *
   * @async
   * @param {Entry} entry
   * @return {Promise<object>} {index, term, committedIndex}
   */
  async getEntryInfoBefore(entry: Entry) {
    const getEntry = await this.getEntryBefore(entry)
    let index = null
    let term = null

    for await (const ent of getEntry.values()) {
      index = ent.index
      term = ent.term
    }
    return {
      index,
      term,
      committedIndex: this.committedIndex,
    }
  }

  /**
   * getEntryBefore - Get entry before the specified entry
   * If there is no item before it returns {index: 0}
   *
   * @async
   * @param {Entry} entry
   *
   * @return {Promise<Entry>}
   */
  getEntryBefore(entry: Entry): Promise<Level<string, Entry>> {
    // const defaultInfo = {
    //   index: 0,
    //   term: this.node.term,
    // }
    // // We know it is the first entry, so save the query time
    // if (entry.index === 1) {
    //   return Promise.resolve(defaultInfo)
    // }

    return new Promise((resolve) => {
      //   let hasResolved = false
      const strm = new KeyStream(this.db, {
        reverse: true,
        limit: 1,
        lt: entry.index,
      }).db
      resolve(strm)
      //   this.db
      //     .createReadStream({
      //       reverse: true,
      //       limit: 1,
      //       lt: entry.index,
      //     })
      //     .on("data", (data) => {
      //       hasResolved = true
      //       resolve(data.value)
      //     })
      //     .on("error", (err) => {
      //       hasResolved = true
      //       reject(err)
      //     })
      //     .on("end", () => {
      //       if (!hasResolved) {
      //         // Returns empty index if there is no items
      //         // before entry or log is empty
      //         resolve(defaultInfo)
      //       }
      //     })
    })
  }

  /**
   * commandAck - acknowledges a follow with address has stored entry at index
   * This is used to determine if a quorom has been met for a log entry and
   * if enough followers have stored it so that it can be committed
   *
   * @async
   * @param {number} index   Index of entry that follow has stored
   * @param {string} address Address of follower that has stored log
   * @return {Promise<Entry>}
   */
  async commandAck(index: string, address: string) {
    return this.commandAckQueue.add(async () => {
      let entry
      try {
        entry = await this.get(index)
      } catch (err) {
        console.log(err)
        return {
          responses: [],
        }
      }

      const entryIndex = await entry.responses.findIndex(
        (resp) => resp.address === address,
      )

      // node hasn't voted yet. Add response
      if (entryIndex === -1) {
        entry.responses.push({
          address,
          ack: true,
        })
      }

      await this.put(entry)

      return entry
    })
  }

  /**
   * commit - Set the entry to committed
   *
   * @async
   * @param {number} Index index
   *
   * @return {Promise<entry>}
   */
  async commit(index: string) {
    const entry = await this.db.get(index)

    entry.committed = true
    this.committedIndex = entry.index

    return this.put(entry)
  }

  /**
   * getUncommittedEntriesUpToIndex - Returns all entries before index that have not been committed yet
   *
   * @param {number} index Index value to find all entries up to
   * @return {Promise<Entry[]}
   * @private
   */
  getUncommittedEntriesUpToIndex(index: number): Promise<Entry[]> {
    return new Promise((resolve) => {
      const strm = new KeyStream(this.db, {
        gt: this.committedIndex,
        lte: index,
      }).db

      ;(async () => {
        const entries = []
        for await (const data of strm.values()) {
          if (!data.committed) {
            entries.push(data)
          }
        }
        resolve(entries)
      })()
    })
  }

  /**
   * end - Log end
   * Called when the node is shutting down
   *
   * @return {boolean} Successful close.
   * @private
   */
  end() {
    return this.db.close()
  }
}

export { Log, Entry, PromiseQueue }
// module.exports = Log

// const log = new Log()
// log.put({
//   term: 1,
//   index: 1,
//   committed: false,
//   responses: [
//     {
//       address: "",
//       ack: false,
//     },
//   ],
//   command: "select * from users",
// })

// log.get("1").then((res) => {
//   console.log(res)
// })
