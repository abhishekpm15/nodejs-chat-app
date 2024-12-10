const socket = io();

const chat_form = document.getElementById("chatForm");
const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("userName");
const serverRoom = urlParams.get("serverRoom");

socket.emit("joinRoom", { userName, serverRoom });

socket.on("user-join", (msg) => {
  Toastify({
    text: `${msg.text}`,
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
});

// socket.on('roomUsers', ({room, users}) => {
//   outputRoomName(room),
//   outputUsers(users)
// })

socket.on("user-disconnect", (msg) => {
  socket.emit("userLeft", msg.username);
  Toastify({
    text: `${msg.text}`,
    className: "info",
    style: {
      background: "linear-gradient(to right, #eb4034, #e67870)",
    },
  }).showToast();
});

socket.on("message", (msg) => {
  messageReceived(msg);
});

chat_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.chatInput.value;
  socket.emit("chatMessage", msg);
  e.target.elements.chatInput.value = "";
  e.target.elements.chatInput.focus();
});

function messageReceived(message) {
  const div = document.createElement("div");

  if (message.text === "Welcome to Node-Chat") {
    div.classList.add("welcome_message");
    div.innerHTML = `
      <span class="welcome_username">${message.username.toUpperCase()}</span>
      <span class="welcome_message">${message.text}</span>`;
  } else {
    div.classList.add("message");
    div.innerHTML = `
      <span class="time">${message.time}</span>
      <br>
      <span class="bot">${message.username}</span>
      <span>${message.text}</span>`;
  }

  document.querySelector(".chat-messages").appendChild(div);
}


// function outputRoomName(room){
//   roomName.innerText = room
// }

// function outputUsers(room){
//   userList.innerHTML = `
//   ${users.map(user => `<li>${user.username}</li>`).join('')}`
// }