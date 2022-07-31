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


module.exports = {
    createBucket,
}