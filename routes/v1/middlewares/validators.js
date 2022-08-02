const Ajv = require('ajv')
const ajv = new Ajv()

// Validate filter for get
const schemaFilter = {
    type: "object",
    properties: {
      filter: { type: "object"},
    },
    required:["filter"],
    additionalProperties: false,
  }
  const validateFilter = ajv.compile(schemaFilter)
  function filterValidator(req, res, next) {
    const valid = validateFilter(req.body)
    if (!valid) {
      return res.status(200).json({ "response_code": 400, "message":"data validation error", "response" : null })
    } else {
      next();
    }
  }


  const bucketSchema = {
    type:"object",
    properties:{
      label:{type:"string"},
      min_price:{type:"number"},
      description:{type:"string"},
      coins:{
        type:"array",
        items:{type:"object",properties:{
          id:{type:"string"},
          symbol:{type:"string"},
          quantity:{type:"number"}
        },
        required:["id","symbol","quantity"]
      }
      }
    },
    required:["label","min_price","coins"]
  }
  const validateBucket = ajv.compile(bucketSchema)
  function bucketValidator(req, res, next) {
    const valid = validateBucket(req.body)
    if (!valid) {
      return res.status(200).json({ "response_code": 400, "message":"data validation error", "response" : null })
    } else {
      next();
    }
  }

const bucketPurchaseSchema = {
  type:"object",
  properties:{
    bucket_id:{type:"string"},
    amount:{type:"number"}
  },
  required:["bucket_id","amount"]
}
const validateBucketPurchase = ajv.compile(bucketPurchaseSchema)
function bucketPurchaseValidator(req, res, next) {
  const valid = validateBucketPurchase(req.body)
  if (!valid) {
    return res.status(200).json({ "response_code": 400, "message":"data validation error", "response" : null })
  } else {
    next();
  }
}
  module.exports = {
    filterValidator,
    bucketValidator,
    bucketPurchaseValidator
  };