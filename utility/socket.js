import {Server} from "socket.io"

const setupSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        callback(null, true); // allow all origins
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("a user connected");

    // Add more event listeners as needed
    app.io = io;
  });

  return io;
};

export default setupSocket;
