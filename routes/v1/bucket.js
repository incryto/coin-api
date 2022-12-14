const axios = require("axios");
const express = require("express");
var router = express.Router();

const bucket = require("./models/bucket");

const coin = require("./models/coin");
const {
  filterValidator,
  bucketValidator,
  bucketPurchaseValidator,
} = require("./middlewares/validators");
const { validateToken } = require("./middlewares/token");
router.post("/coins/names", filterValidator, async (req, res) => {
  try {
    coin.find(req.body.filter).exec(function (err, coins) {
      if (err) {
        return res.status(200).json({
          response_code: 500,
          message: "Internal server error",
          reponse: null,
        });
      } else {
        return res.status(200).json({
          response_code: 200,
          message: "Fetched successfully",
          reponse: coins,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      response_code: 500,
      message: "Internal server error",
      reponse: null,
    });
  }
});

const { addBucketInCreator, setBucketInUser } = require("./middlewares/user");
const {
  createBucket,
  getBucketById,
  getCurrentTotal,
  purchaseBucket,
  setPurchaseToBuckets,
  getBuckets
} = require("./middlewares/bucket");

router.post(
  "/buckets/create/",
  validateToken,
  bucketValidator,
  createBucket,
  addBucketInCreator,
  (req, res) => {
    res.status(200).json({
      response_code: 200,
      message: "Bucket created successfully",
      response: {
        bucket_id: req.bucket_id,
      },
    });
  }
),
  router.post(
    "/buckets/purchase",
    validateToken,
    bucketPurchaseValidator,
    getBucketById,
    getCurrentTotal,
    purchaseBucket,
    setPurchaseToBuckets,
    setBucketInUser,
    (req, res) => {
      res.status(200).json({
        response_code: 200,
        message: "Bucket purchased successfully",
        response: {
          bucket_id: req.body.bucket_id,
          purchase_id: req.purchase_id,
          total_amount: req.body.amount,
          total_buckets: req.quantity,
          purchase_time: req.purchase_time,
        },
      });
    }
  );

router.post("/buckets/all", validateToken, getBuckets,(req, res) => {
    res.status(200).json(
        {
            "response_code":200,
            "message":"Buckets fetched successfully",
            "response":req.fetched_buckets
        }
    )
});

module.exports = router;
