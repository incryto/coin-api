const bucket = require("./../models/bucket");
const axios = require("axios");

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

const { getCurrentPrice,getCurrentTotalPrice } = require("../controllers/bucket");

async function getCurrentTotal(req, res, next) {
  try {
    const res = await getCurrentTotalPrice(req.bucket_info["coins"]);

    req.current_total = res[0];
    req.purchase_time = res[1];
    next();
  } catch (e) {
    console.log("Error in gettotal");
    console.log(e);
    res.status(200).json({
      response_code: 500,
      message: "Internal server error",
      response: null,
    });
  }
}

const purchase = require("./../models/purchase");
function purchaseBucket(req, res, next) {
  try {
    console.log("Entered purchase bucket");
    console.log(req.current_total);
    const quantity = req.body.amount / req.current_total;
    req.quantity = quantity;
    const body = {
      user_id: req.user_id,
      bucket_id: req.body.bucket_id,
      purchase_time: req.purchase_time,
      purchase_value: req.current_total,
      quantity: quantity,
    };
    console.log(body);
    const new_purchase = purchase(body);
    new_purchase.save((err, reply) => {
      if (err) {
        throw new Error("Error while creating purchase");
      } else {
        req.purchase_id = reply["_id"];
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

function setPurchaseToBuckets(req, res, next) {
  try {
    console.log(req.purchase_id);
    bucket.findByIdAndUpdate(
      req.body.bucket_id,
      {
        $push: { purchases: req.purchase_id },
      },
      (err, reply) => {
        if (err) {
          throw new Error("Error while adding ourchase in bucket");
        } else {
          next();
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      response_code: 500,
      message: "Internal server error",
      response: null,
    });
  }
}

function getBucketById(req, res, next) {
  try {
    bucket.findById(req.body.bucket_id, function (err, reply) {
      if (err) {
        console.log(err);
        throw new Error("Error while getting bucket");
      } else {
        if (reply == null) {
          return res.status(200).json({
            response_code: 404,
            message: "No bucket found",
            response: null,
          });
        }
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

async function getBuckets(req, res, next) {
  let filter = req.body.filter;
  filter ??= {};
  try {
    bucket.find(filter, async (err, buckets_fetched) => {
      if (err) {
        return res.status(200).json({
          response_code: 500,
          message: "Internal server error",
          response: null,
        });
      } else {
        console.log("requested here");
        console.log(buckets_fetched)
        reply_list = [];
        bucket_list = [];
        for (var i = 0; i < buckets_fetched.length; i++) {
          bucket_list.push.apply(buckets_fetched[i]["coins"]);
        }
        bucket_list = Array.from(new Set(bucket_list));
        const coin_price_info = await getCurrentPrice(bucket_list);
        for (var i = 0; i < buckets_fetched.length; i++) {
          tot = 0;
          for(var k = 0;k<buckets_fetched[i].coins.length;k++){
            for (var j = 0; j < coin_price_info.length; j++) {
              if (coin_price_info[j].id == buckets_fetched[i].coins[k].id) {
                tot+=coin_price_info[j].current_price*buckets_fetched[i].coins[k].quantity;
              }
            }
          }
          buckets_fetched[i].current_price = tot;
        }
        req.fetched_buckets = buckets_fetched;
        next();
      }
    });
  } catch (e) {
    console.log("error", e);
    return res.status(200).json({
      response_code: 500,
      message: "Internal server error",
      response: null,
    });
  }
}

module.exports = {
  createBucket,
  getCurrentTotal,
  getBucketById,
  purchaseBucket,
  setPurchaseToBuckets,
  getBuckets,
};

