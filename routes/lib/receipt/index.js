const ocr = require("./../ocr")
const s3 = require("./../aws")

module.exports = {
  getReceipt: getReceipt,
  getAllReceipt: getAllReceipt,
  createReceipt: createReceipt,
  claimReceipt: claimReceipt,
  payReceipt: payReceipt,
  getUserCost: getUserReceiptCost,
  deleteReceipt: deleteReceipt,
  storageDestination: storageDestination
}

function createReceipt(req, res, next) {
  console.log("Begin: createReceipt()")
  let slyce = {}
  let imageSubmition =
  ocr.submitImage(req.body.data.attributes.receiptImage)
    .then((imageSubmition) => {
      slyce.creator = req.body.data.attributes.creator
      slyce.created = Date.now()
      slyce.receiptImage = req.body.data.attributes.receiptImage
      slyce.id = res.app.get('receipts').length + 1
      ocr.get(imageSubmition.token)
        .then((reponse) => {
          slyce.receiptLineItems = _parseOcrResponse(slyce.id, JSON.parse(reponse))
          slyce.taxes = _getTaxes(JSON.parse(reponse))
          let receipts =  res.app.get('receipts')
          receipts.push(slyce)
          res.app.set('receipts', receipts)
          res.status(201).json({
            data: {
              attributes: slyce
            }
          })
          console.log("Complete: createReceipt()")
        })
        .catch((error) => {
          res.status(304).json({
            data: {
              attributes: {}
            },
            errors: error
          })
        })
    })
    .catch((error) => {
      res.status(304).json({
        data: {
          attributes: {}
        },
        errors: error
      })
    })
}

function getAllReceipt(req, res, next) {
  console.log("Begin: getAllReceipt()")
  const receipts = res.app.get('receipts');
  res.json({
    data: {
      attributes: receipts
    }
  })
  console.log("Complete: getAllReceipt()")
}

function getReceipt(req, res, next) {
  console.log("Begin: getReceipt()")
  const receipt = _readReceipt(res.app.get('receipts'), req.params.receiptId);
  res.json({
    data: {
      attributes: receipt
    }
  })
  console.log("Complete: getReceipt()")
}


function storageDestination(req, res, next) {
  console.log("Begin: storageDestination()")
  res.json({
    data: {
      attributes: {
        destination: s3.getSignedUrl(req.params.userId, req.params.filename),
        s3path: 's3://slyce-receipt-images/' + req.params.userId + '/' + req.params.filename
      }
    }
  })
  console.log("Complete: storageDestination()")
}

function claimReceipt(req, res, next) {
  console.log("Begin: claimReceipt()")
  let receipts = res.app.get('receipts')
  let receipt = _readReceipt(receipts, Number(req.params.receiptId))
  receipt.receiptLineItems.forEach((item, pos) => {
    if (item.id == req.params.receiptItem) {
      let claimer = receipt.receiptLineItems[pos].claim;
      if (claimer != req.params.userId || claimer == undefined) {
        receipt.receiptLineItems[pos].claim = req.params.userId
      } else {
        receipt.receiptLineItems[pos].claim = undefined
      }
    }
  })

  let updatedReceipts = _updateReceipt(receipts, receipt, Number(req.params.receiptId))
  console.log(updatedReceipts)
  res.app.set('receipts', updatedReceipts)
  res.sendStatus(202)
  console.log("Complete: claimReceipt()")
}

function getUserReceiptCost(req, res, next) {
  console.log("Begin: getUserReceiptCost()")
  let receipts = res.app.get('receipts')
  let userCost = _userCost(receipts, req.params.receiptId, req.params.userId)
  let receipt = _readReceipt(receipts, Number(req.params.receiptId))
  let slyces = []

  console.log(userCost,receipt)
  receipt.receiptLineItems.forEach((item, pos) => {
    if (item.claim == req.params.userId) {
      slyces.push(item)
    }
  })
  console.log(slyces,userCost)
  res.status(200).json({
    data: {
      attributes: {
        cost: userCost,
        slyces: slyces
      }
    }
  })
  console.log("Complete: getUserReceiptCost()")
}

function payReceipt(req, res, next) {
  console.log("Begin: payReceipt()")
  let receipts = res.app.get('receipts')
  let userCost = _userCost(receipts, req.params.receiptId, req.params.userId)
  let receipt = _readReceipt(receipts, Number(req.params.receiptId))
  receipt.receiptLineItems.forEach((item, pos) => {
    if (item.claim == req.params.userId) {
      receipt.receiptLineItems[pos].paid = true
      receipt.receiptLineItems[pos].transactionMethod = req.params.paymentMethod
    }
  })

  let updatedReceipts = _updateReceipt(receipts, receipt, Number(req.params.receiptId))
  res.app.set('receipts', updatedReceipts)
  res.status(202).json({
    data: {
      attributes: {
        cost: userCost,
        transactionMethod: req.params.paymentMethod
      }
    }
  })
  console.log("Complete: payReceipt()")
}

function deleteReceipt(req, res, next) {
  console.log("Begin: deleteReceipt()")
  let receipts = res.app.get('receipts')
  let before = receipts.length
  receipts = _deleteReceipt(receipts, Number(req.params.receiptId))
  res.app.set('receipts', receipts)
  if (before > receipts.length) {
    res.sendStatus(202)
  } else {
    res.sendStatus(304)
  }
  console.log("Complete: deleteReceipt()")
}

function _parseOcrResponse(id, res) {
  let lineItems = []
  if (res.success == true ){
    res.result.lineItems.forEach(line => {
      if (line.qty > 1) {
        for (i = 0; i < line.qty; i++) {
          lineItems.push(_newItem(
            String(id) + "-" + (lineItems.length + 1),
            line.descClean,
            (Number(line.lineTotal)/line.qty),
            getTax(res.result.taxes, (Number(line.lineTotal)/line.qty))
          ))
        }
      } else if(Number(line.lineTotal) > 0.00) {
        lineItems.push(_newItem(
          String(id) + "-" + (lineItems.length + 1),
          line.descClean,
          line.lineTotal,
          getTax(res.result.taxes, Number(line.lineTotal))
        ))
      }
    })
  }
  return lineItems
}

function _getTaxes(res) {
  let taxes = 0
  res.result.taxes.forEach((tax, pos) => {
    taxes += Number(tax)
  })
  return taxes
}

function _userCost(receipts, receiptId, userId) {
  let charge = 0
  let tax = 0
  let receipt = _readReceipt(receipts, Number(receiptId))
  receipt.receiptLineItems.forEach((item, pos) => {
    if (item.claim == userId && item.paid == false) {
      charge += item.price
      tax += item.tax
    }
  })

  return {
    tax: tax,
    sub_total: charge,
    total: charge + tax
  }
}

function _newItem(id, label, price, tax) {
  return {
    "id": id,
    "label": label,
    "claim": undefined,
    "paid": false,
    "transactionMethod": undefined,
    "price": price,
    "tax": tax,
    "apply_tax": true,
    "additionalCharges": 0
  }
}

function getTax(taxes, price) {
  let total = 0
  for (tax in taxes) {
    total += price * (tax/100)
  }
  return total
}

//////////////////////////////////////////////////////////////////////////////
// function below are used for mocking purposes so they can replaced easily later

function _createReceipt(receipts, receipt) {
  return receipts.push(receipt)
}

function _readReceipt(receipts, receiptID) {
  let searchItem = {}
  receipts.forEach(receipt => {
    if (receipt.id == Number(receiptID)) {
      searchItem = receipt
    }
  })

  return searchItem
}

function _updateReceipt(receipts, receipt, receiptID) {
  receipts.forEach((receipt, pos) => {
    if (receipt.id == receiptID) {
      receipts[pos] = receipt
    }
  })
  return receipts
}

function _deleteReceipt(receipts, receiptID) {
  return receipts.filter(item => item.id !== receiptID)
}
