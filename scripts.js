(function() {
  var App;
  var oldX, oldY;
  var x, y;

  App = {};
  /*
  	Init
  */
  App.init = function() {
    App.canvas = document.createElement('canvas');
    App.canvas.height = window.innerHeight - 80;
    App.canvas.width = window.innerWidth - 80;
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";
    App.ctx.strokeStyle = "#ECD018";
    App.ctx.lineWidth = 4;
    App.ctx.lineCap = "round";
    App.socket = io.connect('http://localhost:3000');

    App.socket.emit('login', '');

    App.socket.on('me', function(data) {
      console.log(data);
    });

    App.socket.on('receiveDrawing', function(data) {
      return App.draw(data.coordinates);
    });

    App.draw = function(data) {
      console.log(data);
      App.ctx.beginPath();
      App.ctx.moveTo(data.old.x, data.old.y);
      App.ctx.lineTo(data.new.x, data.new.y);
      App.ctx.stroke();
      return App.ctx.closePath();
    };

  };
  /*
  	Draw Events
  */
  $('canvas').live('drag dragstart dragend', function(e) {
    var offset, type;
    type = e.handleObj.type;
    offset = $(this).offset();
    e.offsetX = e.layerX - offset.left;
    e.offsetY = e.layerY - offset.top;
    oldX = x;
    oldY = y;
    x = e.offsetX;
    y = e.offsetY;

    var objectToSend = {
     "old" : {x:oldX, y:oldY},
     "new" : {x:x, y:y}
   };

    App.socket.emit('drawing', objectToSend);
    App.draw(objectToSend);

  });
  $(function() {
    return App.init();
  });
}).call(this);
