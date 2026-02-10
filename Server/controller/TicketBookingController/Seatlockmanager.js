const lockedSeats = new Map(); 

export function lockSeat(seatId, userId, io) {
  if (lockedSeats.has(seatId)) return false;

  const timer = setTimeout(() => {
    lockedSeats.delete(seatId);
    io.emit("seatUnlocked", seatId);
  }, 10 * 60 * 1000);

  lockedSeats.set(seatId, { userId, timer });
  io.emit("seatLocked", seatId);

  return true;
}

export function unlockSeat(seatId, io) {
  if (lockedSeats.has(seatId)) {
    clearTimeout(lockedSeats.get(seatId).timer);
    lockedSeats.delete(seatId);
    io.emit("seatUnlocked", seatId);
  }
}

export function isSeatLocked(seatId) {
  return lockedSeats.has(seatId);
}
