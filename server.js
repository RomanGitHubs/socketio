const fs = require('node:fs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const formatMessage = require('./src/js-client/utils/messages');
const { addUser, getUser, exitUser, getRoomUsers } = require('./src/js-client/utils/users');

const PORT = 2000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, 'src')))
app.use(express.static(path.join(__dirname, 'src/js-client/')))
// app.use(express.static(path.join(__dirname, 'src/react-client/public/')))
// app.use(express.static('http://localhost:3001/'));

const botName = 'Server'

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = addUser(socket.id, username, room);

        socket.join(user.room);
        socket.emit('message', formatMessage(botName, { message: 'Добро пожаловать!'}));
        socket.broadcast.to(user.room)
        .emit('message', formatMessage(botName, {message: `${user.username} присоеденился`}));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        })
    })


    console.log('New user connected');

    socket.on('disconnect', () => {
        const user = exitUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, { message: `${user.username} вышел`}))
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            })
        }
    })

    socket.on('chatMessage', async (msg) => {
        console.log(msg);
        const user = getUser(socket.id)
        let file;
        let fullName;
        if (msg.dataUrl) {
            file = msg.dataUrl;
            
            console.log('TypeOF >> ', typeof(file));
    
            const payload = file.split(',')[1];
    
            const extension = file.split(';')[0].split('/')[1];
            const fileName = uuidv4();
        
            fullName = `${fileName}.${extension}`
        
            await fs.promises.writeFile(`src/public/${fullName}`, payload, 'base64');
            console.log(fullName);

            io.to(user.room).emit('message', formatMessage(`${user.username}`, {message: msg.message, dataUrl: `http://192.168.0.108:2000/public/${fullName}`}));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            })
            return
        }
        
        io.to(user.room).emit('message', formatMessage(`${user.username}`, {message: msg.message}));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        })
    })
})

server.listen(PORT, () => {
    console.log(`Server on ${PORT} port`)
})