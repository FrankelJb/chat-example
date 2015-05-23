var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

var nicknames = {}

io.on('connection', function(socket){
  io.emit('connection object', { msg: 'a user has connected ', status: 'connected' } );
  socket.on('disconnect', function(){
    io.emit('connection object', { msg: 'a user has disconnected', status: 'disconnected' } );
  });
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', { user: nicknames[socket.id], message: (nicknames[socket.id] ? '<span class="nick">' + nicknames[socket.id] + '</span>' + ': ' : '') + msg });
  });
  socket.on('set nick', function(nick){
    nicknames[socket.id] = nick;
    socket.emit('chat message', { user: nick, message: 'Your nick has been set to <span class="nick">' + nick + '</span>' });
  });
  socket.on('typing', function(){
    socket.broadcast.emit('user typing', { user: nicknames[socket.id], msg: (nicknames[socket.id] ? nicknames[socket.id] : 'Someone') + ' is typing' });
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
