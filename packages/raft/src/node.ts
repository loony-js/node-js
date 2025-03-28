type Follower = 1
type Candidate = 2
type Leader = 3

type NodeType = Follower | Candidate | Leader

export class InnerNode {
  id: number
  peers: InnerNode[]
  term: number
  nodeType: NodeType

  constructor(id: number, peers: InnerNode[]) {
    this.id = id
    this.peers = peers
    this.term = 0
    this.nodeType = 1
  }

  addNode(node: InnerNode) {
    this.peers.push(node)
  }

  addNodes(node: InnerNode[]) {
    this.peers.concat(node)
  }

  getPeers() {
    return this.peers
  }
}
