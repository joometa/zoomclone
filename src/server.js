import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((e) => {
    console.log(`소켓 이벤트 : ${e}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
  });
});

// WebSocket 코드
// const wss = new WebSocket.Server({ httpServer });

// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anonymous";
//   console.log("Connected to Browser ✅");

//   socket.on("close", () => {
//     console.log("Disconnected from Browser ❌");
//   });

//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);

//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) => {
//           aSocket.send(
//             `${socket.nickname} : ${message.payload.toString("utf-8")}`
//           );
//         });
//       case "nickname":
//         socket["nickname"] = message.payload.toString("utf-8");
//     }
//   });
// });

httpServer.listen(3000, handleListen);
