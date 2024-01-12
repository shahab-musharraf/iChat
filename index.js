const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require("path");

// srcset

const app = express();
const port = 4500 || process.env.PORT
const users = [{}];

app.use(cors())

app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
    
const server = http.createServer(app);

const io = socketIO(server)

io.on('connection', (socket)=>{
    console.log(`New Connection`);

    
    socket.on('joined', ({user})=>{
        users[socket.id] = user;
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined', {user: 'Admin', message: `${users[socket.id]} has joined`})
        socket.emit('welcome', {user:'Admin', message: `Welcome! to the chat, ${users[socket.id]}`} )
    })

    socket.on('message',({message, id})=> {
        io.emit('sendMessage', {user:users[id], message, id})
    })

    socket.on('disconnnect', ()=> {
        socket.broadcast.emit('leave', {user: "Admin", message:`${users[socket.id]} has left`, id:socket.id})
        console.log(`user left`);
    })


})



server.listen(port, ()=>{
    console.log(`Server is working on http://localhost:${port}`);
})



// timeHr:new Date(Date.now()).getHours(), timeMin: new Date(Date.now()).getMinutes()