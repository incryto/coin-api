const user = require('./../models/user')
const bucket = require('./../models/bucket')
function addBucketInCreator(req,res,next){
    try{
        console.log("entered user \nbucket id is")
        console.log(req.user_id)
    
        user.findByIdAndUpdate(req.user_id,{ $addToSet: {created:req.bucket_id } },(err,reply)=>{
            if(err){
                console.log(err);
                try{
                    bucket.findByIdAndDelete(req.bucket_id,(err,reply)=>{
                        if(err){
                            throw new Error("Error while deleting bucket")
                        }else{
                            console.log(reply)
                            next()
                        }
                    })
                }catch(e){
                    console.log(e)

                }finally{
                    return res.status(200).send({"reponse_code":500,"nessage":"Internal server error","response":null});
                }
            }else{
                console.log("added to user")
                console.log(reply)
                next()
            }
        })
    }catch(e){
        console.log(e)
        try{
            bucket.findByIdAndDelete(user.bucket_id)
        }catch(e){
            console.log(e)
        }finally{
            return res.status(200).send({"reponse_code":500,"nessage":"Internal server error","response":null});
        }
    }

}

module.exports = {
    addBucketInCreator
}