'use strict'
let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let io = require('socket.io')(http);

// ROUTES FOR API
var router = express.Router();

let moves = {}, usersConnection = {};

app.use(express.static(path.join(__dirname, 'www'))); //static files

router.route('/moves')
    .get((req,res) =>{
      res.json(JSON.stringify(moves));
      console.log(JSON.stringify(moves));
    });

app.use('/api', router);



io.on('connection', (socket) => {
  console.log('a user connected');
  //Socket Events on server
  socket.on('disconnect', () => {
    socket.broadcast.emit("user_disconnect",{'username': usersConnection[socket.id]}); 
    moves[usersConnection[socket.id]] = undefined;
  });
  socket.on("move",(data) => {
    usersConnection[socket.id] = data.name;
    moves[data.name] = data;
    socket.broadcast.emit("move",data);
  }); // send a move to other users
});

http.listen(3000, () => console.log('listening on *:3000'));
