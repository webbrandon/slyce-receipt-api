let express = require('express')
let router = express.Router()
let fs = require('fs')

/* GET home ascii */
router.get('/', function(req, res, next) {
  res.set('Content-Type', 'text/html')
  fs.readFile( __dirname + '/art.txt', function (err, data) {
    if (err) {
      throw err
    }
    res.send(data)
  })
})

/* GET health check. */
router.get('/healthz', function(req, res, next) {
  res.sendStatus(200)
})

module.exports = router
