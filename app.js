var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var colors = ["#E53935","#8E24AA","#D81B60","#00897B","#FDD835","#039BE5"];
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('user connected');
    socket.on('connect', function(){
       socket.emit("color", colors[Math.floor(Math.random()*100)]);
    })

    socket.on('drawing', function(coordinates){
      console.log(coordinates);
      socket.broadcast.emit("receiveDrawing", coordinates);
    });
});
