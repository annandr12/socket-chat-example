
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = {};

// provides access to files in public directory
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.on("join", (name) => {
    users[socket.id] = name;

    socket.emit("update", "You have joined the chat.");
    socket.broadcast.emit("update", name + " has joined the chat.")
    io.sockets.emit("update-users", users);
  });

  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', users[socket.id], msg);
  });

  socket.on('typing', function(msg){
    socket.broadcast.emit('typing', users[socket.id], msg);
  });

  socket.on('disconnect', function() {
    if (users[socket.id]) {
      socket.broadcast.emit("update", users[socket.id] + " has left the chat.")
      delete users[socket.id];
      io.sockets.emit("update-users", users);
    }
  })
});


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});