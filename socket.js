class SocketManager {
  #io;
  nb = 0;
  pool = []

  init(io) {
    this.#io = io;

    io.on('connection', async socket => {
      if (socket.handshake?.query?.uuid !== undefined) {
        this.pool.push({
          id: socket.id,
          uuid: socket.handshake?.query?.uuid,
          ip: socket.conn.remoteAddress
        })
      }

      const sok = (await io.fetchSockets()).map(i => i.id)

      this.pool = this.pool.filter(i => sok.indexOf(i.id) !== -1)

      socket.on('volume', data => {
        const target = this.pool.find(i => i.uuid === data.target) || null
        if (target !== null) {
          io.emit('volume', data)
        }
      })

      socket.on('skip', data => {
        const target = this.pool.find(i => i.uuid === data.target) || null
        if (target !== null) {
          io.emit('skip', data)
        }
      })

    })
    io.on('close', socket => {
      console.log(socket)
    })
  }

  emit(channel, data) {
    this.#io?.emit?.(channel, data);
  }
}

const socketManager = new SocketManager();

module.exports = socketManager;
