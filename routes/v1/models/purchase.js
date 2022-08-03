const mongoose = require('mongoose');


const purchase = new mongoose.Schema({
    "user_id":{
        type:String,
        required :true
    },
    "bucket_id":{
        type:String ,
        required : true
    },
    "purchase_time":{
        type:Date,
        required:true,
    },
    "purchase_value":{
        type:Number,
        required:true
    },
    "quantity":{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Purchase',purchase)