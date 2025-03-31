# Raft Algorithm Learning Project

This project is my attempt to understand and implement the Raft consensus algorithm from scratch. The goal is to gain a deeper understanding of distributed systems, consensus mechanisms, and the practical challenges involved in implementing Raft.

## Overview

Raft is a consensus algorithm designed as an alternative to Paxos, aiming to be more understandable while maintaining correctness. It is commonly used in distributed systems to achieve consensus across multiple nodes.

### Key Features of Raft:

- Leader election
- Log replication
- Safety and fault tolerance
- Membership changes

## Project Goals

- **Implement Raft from scratch** in a programming language of choice (likely Rust or TypeScript/Node.js).
- **Understand the inner workings** of leader election, log replication, and state machine safety.
- **Build a simple distributed system** that demonstrates the Raft algorithm in action.
- **Document findings and challenges** encountered during the implementation process.

## Implementation Plan

1. **Research & Design**: Read the [Raft paper](https://raft.github.io/raft.pdf) and break down the algorithm into modular components.
2. **Leader Election**: Implement and test the leader election process.
3. **Log Replication**: Ensure logs are correctly replicated across follower nodes.
4. **Persistence & Recovery**: Implement mechanisms to persist Raft state and recover from failures.
5. **Cluster Membership Changes**: Allow nodes to dynamically join or leave the cluster.
6. **Testing & Simulation**: Simulate network partitions, leader failures, and other edge cases.

## Running the Project

Once the implementation is in a working state, instructions on how to run the project will be added here.

## Resources

- [Raft Consensus Algorithm](https://raft.github.io/)
- [The Secret Lives of Data - Raft Visualization](https://thesecretlivesofdata.com/raft/)
- [MIT 6.824: Distributed Systems](https://pdos.csail.mit.edu/6.824/)

## License

This project is for educational purposes and follows an open-source license (MIT or Apache 2.0).

---

### Notes

If you have any suggestions or improvements, feel free to open an issue or submit a pull request!
