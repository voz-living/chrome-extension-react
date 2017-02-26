const PORT = 3030;

const ecstatic = require('ecstatic');
const http = require('http');
const p2pserver = require('socket.io-p2p-server').Server;

const server = http.createServer(
  ecstatic({ root: __dirname, handleError: false })
);

const io = require('socket.io')(server);

server.listen(PORT, () => console.log(`Voz Living Server listen on port ${PORT}`));

io.use(p2pserver);
