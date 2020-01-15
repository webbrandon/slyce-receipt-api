const rp = require("request-promise")
const s3 = require("./../aws")
const fs = require('fs')

module.exports = {
  submitImage: submitImage,
  get: getResponse
}

function submitImage(imageLocation) {
  console.log("Begin: submitImage()")
  return new Promise((resolve, reject) => {
    s3.getImage(imageLocation)
      .then((s3Object) => {
        let filename = imageLocation.split('/')[imageLocation.split('/').length - 1] + '.jpg'
        _submitToOcr(s3Object.Body, filename)
          .then((resp) => {
            resolve(JSON.parse(resp))
            console.log("Complete: submitImage()")
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function getResponse(token) {
  sleep(10)
  return _getOcrResponse(token)
}

function _submitToOcr(file, filename) {
  let formData = {
    file: []
  }

  formData.file.push({
    value: file,
    options: {
      filename: filename,
      contentType: 'image/jpg'
    }
  })
  formData = Object.assign({}, formData, {})
  const apiKey = process.env.TAB_SCANNER_TOKEN;
  const options = {
    method: 'POST',
    formData: formData,
    uri: 'https://api.tabscanner.com/api/2/process',
    headers: {
      'apikey': apiKey,
      'content-type': 'multipart/form-data'
    }
  }

  return rp(options)
}

function _getOcrResponse(token) {
  const apiKey = process.env.TAB_SCANNER_TOKEN;
  const options = {
    method: 'GET',
    uri: 'https://api.tabscanner.com/api/result/' + token,
    headers: {
      'apikey': apiKey
    }
  }
  console.log(options)

  return rp(options)
}

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
  msleep(n*1000);
}
