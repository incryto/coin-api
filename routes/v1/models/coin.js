const mongoose = require('mongoose');


const coin = new mongoose.Schema({
   id:{
    type:String,
    required:true
   },
   name:{
    type:String,
    required:true
   },
   symbol:{
    type:String,
    required:true
   },
})

module.exports = mongoose.model('Coins',coin)