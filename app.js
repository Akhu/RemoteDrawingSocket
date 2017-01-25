var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var colors = ["#E53935","#8E24AA","#D81B60","#00897B","#FDD835","#039BE5","#E91E63","#2196F3","#3F51B5","#4CAF50","#FFC107","#FF9800","#FFEB3B"];

var peoples = new Array();
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('user connected');

    //Show me your color
    socket.on("login", function(){
      var id = socket.id;
      var color = colors[Math.floor(Math.random()*5)];

      peoples.push({ "id" : id, "color" : color });

      socket.emit("me", {
        "id" : id,
        "color" : color
      });

      io.emit("userList", peoples);

      console.log(peoples);
    })

    socket.on('clear', function(){
      io.emit("clear");
    })

    //Transfer coordinates
    socket.on('drawing', function(coordinates){

      var objectToSend = {
       "coordinates" : coordinates,
       "drawer" : socket.id
     };
     console.log(objectToSend);
      socket.broadcast.emit("receiveDrawing", objectToSend);
    });

    socket.on("disconnect", function(){
        console.log("bye bye "+socket.id);
        peoples.splice(arrayObjectIndexOf(peoples, socket.id, "id"), 1)
    })
});

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
    	//console.log(myArray[i]);
    	//console.log(myArray[i]);
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
