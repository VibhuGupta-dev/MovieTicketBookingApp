import express from "express"
import userrouter from "./routes/UserRoutes.js"
import cors from "cors"
import connectmongodb from "./utils/MongooseConnect.js"
import cinimaroute from "./routes/ChinemaHallRoutes.js"
import cookieParser from "cookie-parser"
import movierouter from "./routes/MovieRoutes.js"

const PORT = 3000
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors ({
    origin : "*" 
}))

connectmongodb()

app.get("/" , (req , res) => {
    try {
      res.send("hey there")
    }catch(err) {
     console.log(err)
    }
})

app.use('/user' , userrouter)
app.use('/cinemahall' , cinimaroute)
app.use('/movie' , movierouter)

app.listen( PORT , (req , res) => {
    try {
      console.log(`server running on ${PORT}`)
    }catch(err) {
        console.log(err)
    }
})