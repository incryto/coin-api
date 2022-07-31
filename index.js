require('dotenv').config()

const express =  require('express')
app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const redis = require('./services/redis')
const mongo = require('./services/mongo-db')

const v1_bucket = require('./routes/v1/bucket')
app.use("/v1",v1_bucket)

app.get("/",(req,res)=>{
    console.log("welcome to coin api")
    res.status(200).send("welcome to coin api")
})



app.listen(process.env.PORT,()=>{
    console.log("started running app on port",process.env.PORT)
    mongo.set_connection()
})