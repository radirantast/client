const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('./src/usersDb');

const User = require('./src/User');
const { addUser } = require('./src/RoomUsers');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

app.post('/join', async (req, res) => {
    const { username, room } = req.body;

    if (!username || !room) {
        return res.status(400).send('Username and room are required');
    }

    try {
        const user = new User({ username, room });
        await user.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

io.on('connection', (socket) => {
  socket.on('join', async ({ username, room }) => {
    socket.join(room);
    console.log(`User ${username} is trying to join room ${room}`);


    try {
      const user = await User.findOne({ username, room });
      console.log('Found user:', user);

      socket.emit('message', {
        data: { data: { username: 'admin' }, message: `Hey my love ${user.username}` }
      })

      if (user) {
        socket.broadcast.to(user.room).emit('message', {
          data: { data: { username: 'admin' }, message: `${user.username} has joined! ${user.room}` }
        });

      socket.on('sendMessage', ({ message, params }) => {
        if (user) {
          io.to(user.room).emit('message', { data: { user, message }})
        }
      });
      } else {
        console.log(`User ${username} not found in room ${room}`);
      }
    } catch (error) {
      console.error('Error finding user:', error);
    }

    socket.on('disconnect', () => {
      console.log('disconected')
    })
  });
});

server.listen(5000, () => console.log('listening on port 5000'));
