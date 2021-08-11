const express=require('express');
const socketio=require('socket.io');
const http=require('http');

const {addUser, removeUser, getUser, getUserInRoom}=require('./users');

const router=require('./router');
const PORT=process.env.PORT || 5000;

const app=express();
const server = http.createServer(app);
const corsOptions={
    cors: true,
    origins:["http://localhost:3000"], //chống cors erro;
   }
const io=socketio(server, corsOptions);
io.on('connection', (socket)=>{
    socket.on('join', ({name, room}, callback)=>{
        const {user, error} = addUser({id: socket.id, name, room});
        if(error) return callback(error);
        socket.emit('message', {user: 'admin', text: `${user.name}, well come to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message',{user: 'admin', text: `${user.name} has join!!`})
        socket.join(user.room);
        io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)})

        callback();
    });

    socket.on('sendMessage', (message, callback)=>{
        const user=getUser(socket.id);
        user && io.to(user.room).emit('message', {user: user.name, text: message});
        user && io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
        callback();
    });

    socket.on('disconnect', ()=>{
        const user=removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left!!`})
        }
    })
})

app.use(router)
server.listen(PORT, ()=>console.log(`server has start on port ${PORT}`));
