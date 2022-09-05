const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  setUser,
  getCurrentUser,
  userLeave,
  getUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatBot";

// Run when user connects

io.on("connection", (socket) => {
  socket.on("setUser", ({ username, color }) => {
    const user = setUser(socket.id, username, color);

    io.emit("activeUsers", {
      users: getUsers(),
  });

    // Broadcast when user connects
    socket.broadcast.emit(
      "message",
      formatMessage(botName, `${user.username} har anslutit till spelet`)
    );

    socket.emit(
      "message",
      formatMessage(botName, `Hej ${user.username}, välkommen till Gridpainter`)
    );
  });

  // Run when user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.emit(
        "message",
        formatMessage(botName, `${user.username} har lämnat spelet`),

        io.emit("activeUsers", {
          users: getUsers(),
        })
      );
    }

   
  });

   // Listen for chat messages
   socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, msg));
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
