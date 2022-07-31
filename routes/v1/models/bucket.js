const mongoose = require('mongoose');


const bucket = new mongoose.Schema({
    label:{
        type:String,
        required:true
    },
    min_price:{
        type:String,
        default:50,
    },
    creation_date:{
        type:Date,
        default:Date.now()
    },
    creator_id:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    coins:[
        {
           id:{
            type:String,
            required:true
           },
           symbol:{
            type:String,
            required:true
           },
           quantity:{
            type:Number,
            required:true,
           }
        }
    ]

})

module.exports = mongoose.model('Buckets',bucket)