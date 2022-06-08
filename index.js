const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require("socket.io");



if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'))
    })
} else {
    require('dotenv').config();
}
console.log('^^^^^^^^^^^^^^^^', process.env.AUTH0_DOMAIN)

const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

// app.get('/', (req, res) => {
//     res.send('boom')
// });

io.on('connection', (socket) => {
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message)
    })
    socket.on('user-wave', message => {
        socket.broadcast.emit('user-online', message)
    })
    socket.on('user-blocked', message => {
        socket.broadcast.emit('user-settings')
    })
    socket.broadcast.emit('user-online', socket.request._query)
});

io.on('disconnect', socket => {
    console.log('a user disconnected')
})

server.listen(process.env.PORT || 5000, () => {
    console.log('listening on *:5000');
});