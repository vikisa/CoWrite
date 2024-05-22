export const createWebSocketPlugin = (socket) => {
  return (store) => {
    store.$socket = socket;

    store.$socket.on('connect', () => console.log('socket connected'));

    store.$socket.on('disconnect', () => console.log('socket disconnected'));
  };
}

