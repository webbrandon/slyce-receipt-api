let express = require('express')
let router = express.Router()
let fs = require('fs')
let receipt_middleware = require('./lib/receipt')

function beginRequest(req, res, next) {
  console.log("Begin request.")
  next()
}

router.post('/', [beginRequest, receipt_middleware.createReceipt])

router.get('/:receiptId', [beginRequest, receipt_middleware.getReceipt])

router.delete('/:receiptId', [beginRequest, receipt_middleware.deleteReceipt])

router.put('/claim/:receiptId/:receiptItem/:userId', [beginRequest, receipt_middleware.claimReceipt])

router.put('/pay/:receiptId/:userId/:paymentMethod', [beginRequest, receipt_middleware.payReceipt])

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

module.exports = router
