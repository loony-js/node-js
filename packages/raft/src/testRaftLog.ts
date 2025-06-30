import { RaftLog } from "./log"

const log = new RaftLog()
console.log(log.status())
console.log(log.appendEntry({ term: 1, command: "select * from users" }))
console.log(log.getLastLogIndex())
