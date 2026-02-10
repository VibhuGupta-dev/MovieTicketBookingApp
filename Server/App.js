import express from "express"
import userrouter from "./routes/UserRoutes.js"
import cors from "cors"
import connectmongodb from "./utils/MongooseConnect.js"
import cinimaroute from "./routes/ChinemaHallRoutes.js"
import cookieParser from "cookie-parser"
import movierouter from "./routes/MovieRoutes.js"
import movierateing from "./routes/MovieRatingRoutes.js"
import ticketrouter from "./routes/TicketRoute.js"
import showroute from "./routes/ShowRoute.js"
import { createServer } from "node:http"
import { Server } from "socket.io"
import { socketHandler } from "./controller/TicketBookingController/Lockticket.js"
import paymentrouter from "./routes/PaymentRoutes.js"
const PORT = 3000
const app = express()
export const server = createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id)
})

app.use(cookieParser())
app.use(express.json())

app.use(cors({
  origin: "*"
}))
socketHandler(io)
connectmongodb()

app.get("/" , (req , res) => {
  res.send("hey there")
})

app.use('/user' , userrouter)
app.use('/cinemahall' , cinimaroute)
app.use('/movie' , movierouter)
app.use('/rate' , movierateing)
app.use('/ticket' , ticketrouter)
app.use('/show' , showroute)
app.use('/payment' , paymentrouter)
server.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})
