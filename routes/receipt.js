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

router.post('/storage/:userId/:filename', [beginRequest, receipt_middleware.storageDestination])

router.put('/claim/:receiptId/:receiptItem/:userId', [beginRequest, receipt_middleware.claimReceipt])

router.put('/pay/:receiptId/:userId/:paymentMethod', [beginRequest, receipt_middleware.payReceipt])

// fully mocked ;p
router.get('/history/:userId', function(req, res, next) {
  let receipts = res.app.get('receipts')
  // looks up user
  let userRecords = {
    "data": {
      "attributes": {
        "active": receipts,
        "completed": []
      }
    }
  }
  res.json(userRecords)
})

module.exports = router
