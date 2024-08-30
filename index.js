import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import http from "http";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import multer from "multer";
import setupSocket from "./utility/socket.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
process.env.TZ = "Asia/Dhaka";

const date = new Date();

dotenv.config()

const PORT = process.env.PORT || 5001;


// app init
const app = express();

// create HTTP server
const server = http.createServer(app);


// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "/template")));

// if(process.env.DB_HOST && process.env.DB_PORT && process.env.DB_USER && process.env.DB_PASS && process.env.DB_NAME){
//   const dbURL = `mongodb://172.0.0.0:27017/pos-api-v1`
// }

const dbUrl = process.env.DB_URL
  ? process.env.DB_URL 
  : `mongodb://localhost:27017/tcmpos`;
// mongodb://localhost:27017

app.use(express.static(__dirname + "/template"));

console.log("connected to:", "Telepathy DB", dbUrl);


mongoose
  .connect(dbUrl)
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// application router
// app.use(fileUpload());
const routers = [
    "auth",
    "user",
    "rooms",
    "chat",
    "message",
  ];

async function setupRoutes() {
    for (const router of routers) {
      const routeModule = await import(`./routes/${router}Router.js`);
      app.use(`/api/${router}`, routeModule.default);
    }
  }
  
  setupRoutes();

app.use("/uploads", express.static("uploads"));


// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/template/home.html"));
});

// API DOCS
app.get("/api/v1/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "/template/docs.html"));
});



// ACTIVE USER
let activeUsers = []

// SOCKET INIT
// Create a new Socket.io instance
const io = setupSocket(server, app);

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    if(newUserId !== undefined){

      // if user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      } 
      // send all active users to new user
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });


  // send message to a specific user
  socket.on("send-message", (data) => {
    const message = data.chatId

    const { 
      chatId,
      senderId,
      reciverId,
      text } = message;
    // console.log("Message from Sender :", message)
    const receiver = activeUsers.find((user) => user.userId === reciverId);
    // console.log("Sending from socket to :", receiver, currentUserId)
    if (!activeUsers.some((user) => user.userId === senderId)) {
      activeUsers.push({ userId: senderId, socketId: socket.id });
      // console.log("New User Connected", activeUsers);
    } 
    // console.log("receiver :", receiver,reciverId)
    // send all active users to new user
    io.emit("get-users", activeUsers);

    // console.log("Message send to : ", receiver?.socketId)
    // console.log("message", message)
    if (receiver) {
      io.to(receiver?.socketId).emit("recieve-message", message);
    }
  });

});



// error Handle
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  } else { 
    if (err instanceof multer.MulterError) {
      res.status(500).send(err.message);
    } else { 
      res.status(500).json({ err: err });
    }
  }
};

app.use(errorHandler);

// start the server
server.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});