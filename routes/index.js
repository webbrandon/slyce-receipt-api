let express = require('express')
let router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("slyce: share the receipt for others to pay their portion.")
})

// assume this is being done for now
router.get('/upload-assignment', function(req, res, next) {
  res.send('S3 signed url')
})

// Assume receiptId == 00000002
router.get('/receipt/:receiptId', function(req, res, next) {
  // Create middleware to pull mysql record for receipt #00000002
  let recieptBody = {
    "data": {
      "attributes": {
        "id": 00000002,
        "creator": "brandon_clark",
        "receiptImage": "s3://pa-share-receipts/users/brandon_clark/6734g.jpg",
        "receiptLineItems": [
          {
            "id": "00000002-0001",
            "label": "beef bowl",
            "claim": undefined,
            "payed": false,
            "price": 12.40,
            "additionalCostPercentage": 0
          },
          {
            "id": "00000002-0002",
            "label": "chicken bowl",
            "claim": undefined,
            "payed": false,
            "price": 14.50,
            "additionalCostPercentage": 0
          }
        ]
      }
    }
  }
  res.json(recieptBody)
})

router.get('/history/:userId', function(req, res, next) {
  // looks up user
  let userRecords = [{
    "data": {
      "attributes": {
        "active": [{
          "id": 00000002,
          "userId": "brandon_clark",
          "receiptImage": "s3://pa-share-receipts/users/brandon_clark/6734g.jpg",
          "receiptLineItems": [
            {
              "id": "00000002-0001",
              "label": "beef bowl",
              "claim": "brandon_clark",
              "payed": true,
              "price": 12.40,
              "additionalCostPercentage": 0.15
            },
            {
              "id": "00000002-0002",
              "label": "chicken bowl",
              "claim": "vigen_amirkhanyan",
              "payed": false,
              "price": 14.50,
              "additionalCostPercentage": 0.15
            }
          ]
        }],
        "completed": [{
          "id": 00000001,
          "userId": "brandon_clark",
          "receiptImage": "s3://pa-share-receipts/users/brandon_clark/6734g.jpg",
          "receiptLineItems": [
            {
              "id": "00000001-0001",
              "label": "beef bowl",
              "claim": "brandon_clark",
              "payed": true,
              "price": 12.40,
              "additionalCostPercentage": 0.15
            },
            {
              "id": "00000001-0002",
              "label": "chicken bowl",
              "claim": "vigen_amirkhanyan",
              "payed": false,
              "price": 14.50,
              "additionalCostPercentage": 0.15
            }
          ]
        }]
      }
    }
  }]
  res.json(userRecords)
})


router.put('/reciept/claim/:receiptId/:userId', function(req, res, next) {
  // create middleware to update mysql record by for receiptId with userId for each receiptLineItems -> id in userClaims
  res.sendStatus(201)
})

router.put('/reciept/pay/:receiptId/:userId/:paymentMethod', function(req, res, next) {
  // use braintree api to pay balance assigned from receiptId to user from paymentMethod assigned from "Account Setting".
  res.sendStatus(201)
})

router.post('/create', function(req, res, next) {
  req.paShare = {}
  req.paShare.receiptImage = req.body.data.attributes.userId        /* brandon_clark */
  req.paShare.receiptImage = req.body.data.attributes.receiptImage  /* s3://pa-share-receipts/users/brandon_clark/6734g.jpg */
  // create middleware functions to download and send image to receipt api ocr and parse into readable format.
  req.paShare.id = 00000002  /* sql record */
  req.paShare.receiptLineItems = [
    {
      "id": "00000002-0001",
      "label": "beef bowl",
      "claim": undefined,
      "payed": false,
      "price": 12.40,
      "additionalCostPercentage": 0
    },
    {
      "id": "00000002-0002",
      "label": "chicken bowl",
      "claim": undefined,
      "payed": false,
      "price": 14.50,
      "additionalCostPercentage": 0
    }
  ]
  // create middleware to post to mysql table and either 201 or 500 (client should retry on 500 so many X times)
  res.json({
    "data": {
      "attributes": req.paShare
    }
  })
})

module.exports = router
