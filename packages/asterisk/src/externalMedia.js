import fs from "fs"
import dgram from "dgram"
import { prototype } from "stream"

const pipe = prototype.pipe

class RtpUdpServerSocket {
  constructor(host, swap16, alsoWritePath) {
    this.server = dgram.createSocket("udp4")
    // Add the Stream.pipe() method to the socket
    this.server.pipe = pipe

    this.swap16 = swap16 || false
    this.alsoWritePath = alsoWritePath
    this.address = host.split(":")[0]
    this.port = host.split(":")[1]

    if (this.alsoWritePath) {
      this.fileStream = fs.createWriteStream(this.alsoWritePath, {
        autoClose: true,
      })
    }

    this.server.on("error", (err) => {
      console.log(`server error:\n${err.stack}`)
      this.server.close()
      if (this.fileStream) {
        this.fileStream.close()
      }
    })

    this.server.on("close", () => {
      console.log(`server socket closed`)
      if (this.fileStream) {
        this.fileStream.close()
      }
    })

    this.server.on("message", (msg) => {
      /* Strip the 12 byte RTP header */
      let buf = msg.slice(12)
      if (this.swap16) {
        buf.swap16()
      }
      if (this.fileStream) {
        this.fileStream.write(buf)
      }
      this.server.emit("data", buf)
    })

    this.server.on("listening", () => {
      const address = this.server.address()
      console.log(`server listening ${address.address}:${address.port}`)
    })

    this.server.bind(this.port, this.address)
    return this.server
  }
}

new RtpUdpServerSocket("127.0.0.1:8081", true, "./output.raw")
