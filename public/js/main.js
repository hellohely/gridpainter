const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const userList = document.getElementById("users");

// Get username and color from URL
const { username, color } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Get users
socket.on("activeUsers", (users) => {
  outputUsers(users);
});

// Set color to user
socket.emit("setUser", { username, color });

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);

  // Clear msg input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class "meta"> ${message.username} <span> ${message.time} </span></p>
  <p> ${message.text} </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
