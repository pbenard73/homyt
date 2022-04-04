class SocketManager {
  #io;
  nb = 0;

  init(io) {
    this.#io = io;
  }

  emit(channel, data) {
    this.#io?.emit?.(channel, data);
  }
}

const socketManager = new SocketManager();

module.exports = socketManager;
