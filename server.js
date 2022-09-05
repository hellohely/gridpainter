const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// Run when user connects

io.on('connection', socket => {
    socket.emit('message', `Välkommen till Gridpainter`)

    // Broadcast when user connects
    socket.broadcast.emit('message', `En ny användare har anslutit till spelet`);

    // Run when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', `En användare har lämnat spelet`);
    });
})

const PORT = 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));