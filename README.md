# Slyce Receipt API

**0.0.1-mock**

Create, modify or delete receipt records Slyce transactions.

## Usage

### Build

```bash
npm install
```

### Serve Content

Currently this version only saves to the current running instance in memory.  If the service exits it will loose any receipt data.
```bash
npm start
```

### API
---
**POST /receipt**   
```
Content-Type: application/json
Accept: application/json
```
Request:
```json
{
  "data": {
    "attributes": {
      "creator": "user_id",
      "receiptImage": "s3://bucket/path/to/image.jpg"
    }
  }
}
```
Response:
- Success: ``201``
```json
{
    "data": {
        "attributes": {
            "receiptImage": "s3://bucket/path/to/image.jpg",
            "id": 1,
            "receiptLineItems": [
                {
                    "id": "1-1",
                    "label": "Item Label",
                    "paid": false,
                    "price": 21.5,
                    "additionalCostPercentage": 0
                }
            ]
        }
    }
}
```

---
**GET /receipt/:receiptId**   
```
Content-Type: application/json
Accept: application/json
```
Response:
- Success: ``200``
```json
{
    "data": {
        "attributes": {
            "receiptImage": "s3://bucket/path/to/image.jpg",
            "id": 1,
            "receiptLineItems": [
                {
                    "id": "1-1",
                    "label": "Item Label",
                    "paid": false,
                    "price": 21.5,
                    "additionalCostPercentage": 0
                }
            ]
        }
    }
}
```

---
**DELETE /receipt/:receiptId**   
Response:
- Success: ``202``
- Failure: ``304``

---
**GET /receipt/claim/:receiptId/:itemId/:userId**   
```
Content-Type: application/json
Accept: application/json
```
Response:
- Success: ``202``
```json
{
    "data": {
        "attributes": {
            "receiptImage": "s3://bucket/path/to/image.jpg",
            "id": 1,
            "receiptLineItems": [
                {
                    "id": "1-1",
                    "label": "Item Label",
                    "paid": false,
                    "price": 21.5,
                    "additionalCostPercentage": 0
                }
            ]
        }
    }
}
```


---
**GET /receipt/pay/:receiptId/:userId/:paymentMethod**   
```
Content-Type: application/json
Accept: application/json
```
Response:
- Success: ``202``
```json
{
    "data": {
        "attributes": {
            "totalCharge": 21.50,
            "transactionMethod": "apple"
        }
    }
}
```
