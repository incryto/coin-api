require('dotenv').config()
const mongoose = require('mongoose');

const connect_mongo =async function(){
    console.log(process.env.MONGO_CONNECT)
    await mongoose.connect(process.env.MONGO_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {
        console.log("connected")
    }).catch((err) => {
        console.log("Error while connecting to mongodb ",err)
    });
}

const set_connection = async function(){
    var time = 1000
    connect_mongo()
    while (true){
        await sleep(time)
        time+=1000
        if(mongoose.connection.readyState==1){
            console.log("successfully connected with mongodb")
            return
        }else  if(mongoose.connection.readyState==2){
            console.log("waiting to connect")
        }else{
            console.log("retrying mongo connection in ",time/1000," seconds")
            connect_mongo()
        }
    }
 
}


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports ={set_connection}
