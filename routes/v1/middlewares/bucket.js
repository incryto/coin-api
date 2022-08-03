const bucket = require("./../models/bucket");
const axios = require('axios')

function createBucket(req, res, next) {
  var newbucket = bucket({
    label: req.body.label,
    min_price: req.body.min_price,
    coins: req.body.coins,
    creator_id: req.user_id,
    description: req.body.description,
  });

  newbucket
    .save()
    .then((data) => {
      console.log(`data is`);
      console.log(data);
      req.bucket_id = data["_id"];
      next();
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return res.status(200).json({
          response_code: 400,
          message: "Data validation error",
          response: null,
        });
      } else {
        console.log(err);
        return res.status(200).json({
          response_code: 500,
          message: "Internal server error",
          response: null,
        });
      }
    });
}


const {getCurrentTotalPrice} = require('../controllers/bucket')

async function getCurrentTotal(req, res, next) {
  try {
     const res =await getCurrentTotalPrice(req.bucket_info["coins"])
     console.log(res)
     req.current_total = res[0]
     req.purchase_time = res[1]
     next()
  } catch (e) {
    console.log("Error in gettotal")
    console.log(e);
    res.status(200).json({
      response_code: 500,
      message: "Internal server error",
      response: null,
    });
  }

}


const purchase = require('./../models/purchase')
function purchaseBucket(req, res, next) {
  try{
  console.log("Entered purchase bucket")
  console.log(req.current_total)
  const quantity = req.body.amount/req.current_total
  req.quantity = quantity
  const body = {
    "user_id": req.user_id,
    "bucket_id": req.body.bucket_id,
    "purchase_time": req.purchase_time,
    "purchase_value": req.current_total,
    "quantity":quantity
  };
  console.log(body)
  const new_purchase = purchase(body);
    new_purchase.save((err,reply)=>{
      if(err){
        throw new Error("Error while creating purchase")
      }else{
        req.purchase_id = reply["_id"]
        next()
      }
    })
  }catch(e){

    console.log(e)
    res.status(200).json({
      "response_code":500,
      "message":"Internal server error",
      "response":null
    })
  }
  
}

function setPurchaseToBuckets(req,res,next){
  try{
    console.log(req.purchase_id)
      bucket.findByIdAndUpdate(
        req.body.bucket_id,{
          $push: { purchases: req.purchase_id }
        },
        (err,reply)=>{
          if(err){
            throw new Error("Error while adding ourchase in bucket")
          }else{
            next()
          }
        }
      )
  }catch(e){
    console.log(e)
    return res.status(200).json({
      "response_code":500,
      "message":"Internal server error",
      "response":null
    })
  }
}

function getBucketById(req, res, next) {
  try {
    bucket.findById(req.body.bucket_id, function (err, reply) {
      if (err) {
        console.log(err);
        throw new Error("Error while getting bucket");
      } else {
        req.bucket_info = reply;
        next();
      }
    });
  } catch (e) {
    console.log(e);
    res.status(200).json({
      response_code: 500,
      message: "Internal server error",
      response: null,
    });
  }
}

async function getBuckets(req,res,next){
    let filter = req.body.filter
    filter??={}
    try {
      bucket.find(filter,async (err, reply)=>{
          if(err){
              throw new Error("Error while gettting all buckets");
          }else{
              // console.log(replyMap)
              reply_list= []
              for(var i = 0;i<reply.length;i++){
                const resp = await getCurrentTotalPrice(reply[i]['coins'])
                console.log(reply[i])
                reply[i].current_price =resp[0]
              }
              console.log("blaa")
              console.log(reply)
              // console.log(`reply map is ${replyMap}`)
              req.fetched_buckets = reply
              next()
          }
      });
    } catch (e) {
      res.status(200).json({
        "response_code":500,
        "message":"Internal server error",
        "response":null
      })
    }
}





module.exports = {
  createBucket,
  getCurrentTotal,
  getBucketById,
  purchaseBucket,
  setPurchaseToBuckets,
  getBuckets
};
