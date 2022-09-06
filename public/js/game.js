//const socket = io();

var c_canvas = document.getElementById("c");
var context = c_canvas.getContext("2d");

//Drawing grid on canvas
for (var x = 0.5; x < 525; x += 35) {
  context.moveTo(x, 0);
  context.lineTo(x, 525);
}

for (var y = 0.5; y < 525; y += 35) {
  context.moveTo(0, y);
  context.lineTo(525, y);
}

context.strokeStyle = "#ddd";
context.stroke();

// Set color user paints with
let paintColor = ""

if (color === 'green') {
    paintColor = "#6AA84F"
} else if (color === 'blue') {
    paintColor = "#2986CC"
} else if (color === 'yellow') {
    paintColor = "#FFD966"
} else if (color === 'red') {
    paintColor = "#CC0000"
}

console.log(color);
console.log(paintColor);

// Getting users mouse position
 function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

// Getting the right square in the grid
function getNearestSquare(position) {
 var x = position.x;
    var y = position.y;
if (x < 0 || y < 0) return null;
    x = (Math.floor(x / 35) * 35) + 0.5
    y = (Math.floor(y / 35) * 35) + 0.5
    return {x: x, y: y};
}

// Fill square with color
$(c_canvas).click(function(evt) {
    var pos = getNearestSquare(getMousePos(c_canvas, evt));
    if (pos != null) {
        context.fillStyle=paintColor;
        context.fillRect(pos.x,pos.y,35,35);

        // Sends position and color to server
        socket.emit("paintGrid", {pos, paintColor});
    }  
});

// Listens to painted grids from server and paints them
socket.on("paintedGrid", ({pos, paintColor}) => {
    console.log(pos, paintColor);

    if (pos != null) {
        context.fillStyle=paintColor;
        context.fillRect(pos.x,pos.y,35,35);
    }
})