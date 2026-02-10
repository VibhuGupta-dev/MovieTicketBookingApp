import { lockSeat, unlockSeat } from "./Seatlockmanager.js";

export function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("lockSeat", ({ seatId, userId }) => {
      const success = lockSeat(seatId, userId, io);
      socket.emit("lockResponse", { seatId, success });
    });

    socket.on("unlockSeat", ({ seatId }) => {
      unlockSeat(seatId, io);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
