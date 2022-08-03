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

function getCurrentTotal(req, res, next) {
  var bucket_coins = req.bucket_info["coins"];
  var tot = 0;
  console.log("getting coin price");
  const coin_map = new Map();
  coin_list = [];
  for (var coin in bucket_coins) {
    console.log(coin);
    coin_map.set(bucket_coins[coin]["id"], bucket_coins[coin]["quantity"]);
    coin_list.push(bucket_coins[coin]["id"]);
  }
  console.log(bucket_coins);
  console.log(coin_list);
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin_list.join(
    "%2C"
  )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  console.log(url);
  try {
    axios.get(url).then((result) => {
      req.purchase_time= Date.now();
      tot = 0;
      console.log(result);
      for (var i = 0; i < result["data"].length; i++) {
        const key = result["data"][i]["id"];
        tot += coin_map.get(key) * result["data"][i]["current_price"];
      }
      req.current_total = tot
      next();
    });
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
        console.log(reply)
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
            console.log(reply)
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

function getBucket(req, res, next) {
  try {
    bucket.findById(req.body.bucket_id, function (err, reply) {
      if (err) {
        console.log(err);
        throw new Error("Error while getting bucket");
      } else {
        console.log(reply);
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

module.exports = {
  createBucket,
  getCurrentTotal,
  getBucket,
  purchaseBucket,
  setPurchaseToBuckets
};
