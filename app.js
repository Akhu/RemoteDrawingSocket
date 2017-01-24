var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var colors = ["#E53935","#8E24AA","#D81B60","#00897B","#FDD835","#039BE5"];

var peoples = {};
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('user connected');

     var id = socket.id;
     var color = colors[Math.floor(Math.random()*5)];

     peoples[id] = color;

     socket.emit("me", {
       "id" : id,
       "color" : color
     });

     socket.broadcast.emit("newGuy", {
       "id" : id,
       "color" : color
     });

     console.log(peoples);

    socket.on('clear', function(){
      io.emit("clear");
    })

    socket.on('drawing', function(coordinates){

      var objectToSend = {
       "coordinates" : coordinates,
       "drawer" : socket.id
     };
     console.log(objectToSend);
      socket.broadcast.emit("receiveDrawing", objectToSend);

    });
});
