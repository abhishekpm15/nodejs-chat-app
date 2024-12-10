const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages.js");
const { joinUser, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users.js");

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  const userName = "abhishek";

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if(user){
      io.to(user.room).emit("message", formatMessage(userName, ` has left the chat`));
    }
  });


  socket.on("joinRoom", ({ userName, serverRoom }) => {
    const user = joinUser(socket.id, userName, serverRoom);
    socket.join(user.room);
    socket.emit("message", formatMessage(userName, "Welcome to Node-Chat"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(user.username, ` has joined the chat`)
      );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  });

  socket.on("chatMessage", (chatMessage) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, chatMessage));
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
