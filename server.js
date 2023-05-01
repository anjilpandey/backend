// import
const { request, response } = require('express')
const express = require('express')
require('dotenv').config()
require('./Database/connection')

//middleware import
const bodyParser=require("body-parser")
const morgan = require('morgan')
const cors=require('cors')


const app = express()

// routes import
const TestRoute = require("./Routes/testroute") 
const CategoryRoute= require("./Routes/categoryRoute")
const ProductRoute=require("./Routes/productRoute")
const UserRoute = require("./Routes/userRoute")
const OrderRoute = require("./Routes/orderRoute")

//middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

    


// use route
app.use('/test',TestRoute)
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use("/api",OrderRoute)



const port = process.env.PORT || 8000


// app.get('/second',(req,res)=>{
//     res.send("Hello this is second page")
// })

app.listen(port,()=>{
    console.log(`Server started successfully at port ${port}`)
})