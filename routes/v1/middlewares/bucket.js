const { getBucket } = require('../controllers/bucket');
const bucket = require('./../models/bucket')


function createBucket(req,res,next){

    var newbucket = bucket({
        label:req.body.label,
        min_price:req.body.min_price,
        coins:req.body.coins,
        creator_id:req.user_id,
        description:req.body.description
    })

    newbucket.save().then((data) => {
        console.log(`data is`)
        console.log(data)
        req.bucket_id = data["_id"]
        next();
      })
      .catch((err) => {
        if (err.name == "ValidationError") {
          return res
            .status(200)
            .json({
              response_code: 400,
              message: "Data validation error",
              response: null,
            });
        } else {
          console.log(err);
          return res
            .status(200)
            .json({
              response_code: 500,
              message:"Internal server error",
              response: null,
            });
        }
      });
}

function purchaseBucket(req,res,next){
      getBucket(req.bucket_id)
      next()
}



module.exports = {
    createBucket,
    purchaseBucket
}