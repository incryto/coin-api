const axios = require("axios");
const express = require("express");
var router = express.Router();

const bucket = require("./models/bucket");

router.post("/bucket/create", (req, res) => {});

const coin = require("./models/coin");
const {filterValidator, bucketValidator} = require('./middlewares/validators');
const { validateToken } = require("./middlewares/token");
const { createBucket } = require("./middlewares/bucket");
router.post("/coins/names",filterValidator, async (req, res) => {
    try{
        coin.find(req.body.filter).exec(function(err,coins) {
           if(err){ return res.status(200).json({
                "response_code":500,
                "message":"Internal server error",
                "reponse":null
            })}else{
                return res.status(200).json({
                    "response_code":200,
                    "message":"Fetched successfully",
                    "reponse":coins
                })
            }
         })
    }catch(err){
        console.log(err)
        return res.status(200).json({
            "response_code":500,
            "message":"Internal server error",
            "reponse":null
        })
    }
});

router.post('/buckets/create/',validateToken,bucketValidator,createBucket,(req,res)=>{
    res.status(200).json({
        "response_code":200,
        "message":"Validation successful",
        "response":null
    })
})



module.exports = router;
