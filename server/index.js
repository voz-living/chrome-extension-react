const PORT = 3030;

const ecstatic = require('ecstatic');
const http = require('http');
const p2pserver = require('socket.io-p2p-server').Server;
const path = require('path');

const server = http.createServer(
  ecstatic({ root: path.join(__dirname, './public'), handleError: false })
);

const io = require('socket.io')(server);

server.listen(PORT, () => console.log(`Voz Living Server listen on port ${PORT}`));

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    p2pserver(socket, null, roomId);
  });
});
