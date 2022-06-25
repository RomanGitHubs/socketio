const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { addUser, getUser, exitUser, getRoomUsers } = require('./utils/users');

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, 'public')))

const botName = 'THIS Bot'

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = addUser(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', formatMessage(botName, 'Welcom to chat!'));
        socket.broadcast.to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has joined`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        })
    })


    console.log('New user connected');

    socket.on('disconnect', () => {
        const user = exitUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left.`))
        }
    })

    socket.on('chatMessage', (msg) => {
        console.log(msg);
        const user = getUser(socket.id)
       
        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        })
    })
})

server.listen(PORT, () => {
    console.log(`Server on ${PORT} port`)
})