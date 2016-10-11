'use strict'
let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'www'))); //static files

io.on('connection', (socket) => {
  console.log('a user connected');
  //Socket Events on server
  socket.on('disconnect', () => console.log('user disconnected'));
  socket.on("move",(data) => socket.broadcast.emit("move",data)); // send a move to other users
});

http.listen(3000, () => console.log('listening on *:3000'));
