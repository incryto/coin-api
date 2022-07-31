require('dotenv').config()

const express =  require('express')
app = express()

const {setCoinPrices, getCoins} = require('./services/coin-fetch')
const schedule = require('node-schedule');
const j = schedule.scheduleJob({hour: 00, minute: 30}, () => {
  setCoinPrices()
});


app.get("/",(req,res)=>{
    console.log("welcome to coin api")
    res.status(200).send("welcome to coin api")
})



app.listen(process.env.PORT,()=>{
    console.log("started running app on port",process.env.PORT)
})