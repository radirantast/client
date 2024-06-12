const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(cors);


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }) => {
        socket.join(room)

        socket.emit('message', {
            data: { user: { name: 'admin' }, message: 'hey my love' }
        })
    });

    io.on('disconnection', () => {
        console.log('socket disconnect')
    });
});

server.listen(5000, () => console.log('listening'))