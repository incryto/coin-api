const {bucket} = require('./../models/bucket')


function getBucket(bucket_id){
    try{
      bucket.findById(bucket_id,(err,reply)=>{
          if(err){
            throw new Error("Error while getting bucket")
          }else{
            console.log(reply)
          }
      })
  
    }catch(e){
      console.log(e)}
  }

  module.exports = {
    getBucket
  }