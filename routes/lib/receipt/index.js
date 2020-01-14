const ocr = require("./../ocr")

module.exports = {
  getReceipt: getReceipt,
  createReceipt: createReceipt,
  claimReceipt: claimReceipt,
  payReceipt: payReceipt,
  deleteReceipt: deleteReceipt
}

function createReceipt(req, res, next) {
  console.log("Begin: createReceipt()")
  let slyce = {}
  let imageSubmition = ocr.submitImage(req.body.data.attributes.receiptImage)

  slyce.receiptImage = req.body.data.attributes.userId
  slyce.receiptImage = req.body.data.attributes.receiptImage
  slyce.id = res.app.get('receipts').length + 1
  slyce.receiptLineItems = _parseOcrResponse(slyce.id, ocr.get(imageSubmition.token))
  let receipts =  res.app.get('receipts')
  receipts.push(slyce)
  console.log(receipts)
  res.app.set('receipts', receipts)
  res.json({
    data: {
      attributes: slyce
    }
  })
  console.log("Complete: createReceipt()")
}

function getReceipt(req, res, next) {
  console.log("Begin: getReceipt()")
  const receipt = _readReceipt(res.app.get('receipts'), req.params.receiptId);
  console.log(receipt)
  res.json({
    data: {
      attributes: receipt
    }
  })
  console.log("Complete: getReceipt()")
}

function claimReceipt(req, res, next) {
  console.log("Begin: claimReceipt()")
  let receipts = res.app.get('receipts')
  let receipt = _readReceipt(receipts, Number(req.params.receiptId))
  receipt.receiptLineItems.forEach((item, pos) => {
    console.log(item.id, req.params.receiptItem)
    if (item.id == req.params.receiptItem) {
      receipt.receiptLineItems[pos].claim = req.params.userId
    }
  })

  let updatedReceipts = _updateReceipt(receipts, receipt, Number(req.params.receiptId))
  console.log(updatedReceipts)
  res.app.set('receipts', updatedReceipts)
  res.sendStatus(201)
  console.log("Complete: claimReceipt()")
}

function payReceipt(req, res, next) {
  console.log("Begin: payReceipt()")
  let totalCharge = 0
  let receipts = res.app.get('receipts')
  let receipt = _readReceipt(receipts, Number(req.params.receiptId))
  console.log(receipt);
  receipt.receiptLineItems.forEach((item, pos) => {
    if (item.claim == req.params.userId) {
      totalCharge += item.price
      receipt.receiptLineItems[pos].paid = true
      receipt.receiptLineItems[pos].transactionMethod = req.params.paymentMethod
    }
  })

  let updatedReceipts = _updateReceipt(receipts, receipt, Number(req.params.receiptId))
  console.log(updatedReceipts)
  res.app.set('receipts', updatedReceipts)
  res.json({
    data: {
      attributes: {
        "totalCharge": totalCharge,
        "transactionMethod": req.params.paymentMethod
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
    res.sendStatus(201)
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
            _addTaxes(res.result.taxes, (Number(line.lineTotal)/line.qty))
          ))
        }
      } else if(Number(line.lineTotal) > 0.00) {
        lineItems.push(_newItem(
          String(id) + "-" + (lineItems.length + 1),
          line.descClean,
          _addTaxes(res.result.taxes, Number(line.lineTotal))
        ))
      }
    })
  }
  return lineItems
}

function _newItem(id, label, price) {
  return {
    "id": id,
    "label": label,
    "claim": undefined,
    "paid": false,
    "transactionMethod": undefined,
    "price": price,
    "additionalCostPercentage": 0
  }
}

function _addTaxes(taxes, price) {
  let total = price
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
