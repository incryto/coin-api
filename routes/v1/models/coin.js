const mongoose = require('mongoose');


const coin = new mongoose.Schema({
    label:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Coins',coin)