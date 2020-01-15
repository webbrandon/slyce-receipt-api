const AWS = require("aws-sdk")

module.exports = {
  getImage: getImage
}

function getImage(s3Location) {
  console.log("Begin: getImage()")
  let s3 = _config()
  // need to parse into key path for now just remove what is known.
  let key = s3Location.replace('s3://slyce-receipt-images/', '')
  return new Promise((resolve, reject) => {
    let params = _getParams(key)
    s3.getObject(params, (err, data) => {
     if (err) {
       reject(err)
     } else {
       resolve(data)
       console.log("Complete: getImage()")
     }
   })
 })
}

function _config() {
  AWS.config = new AWS.Config()
  AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
  AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  AWS.config.region = "us-east-1"

  // Create S3 service object
  let s3 = new AWS.S3({apiVersion: '2006-03-01'})

  return s3
}

function _getParams(key) {
  let bucketParams = {}
  bucketParams.Bucket = 'slyce-receipt-images'
  bucketParams.Key = key
  return bucketParams
}
