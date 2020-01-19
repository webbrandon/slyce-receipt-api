# Slyce Receipt API

**0.0.1-mock**

Create, modify or delete receipt records Slyce transactions. This is considered a mock subversion because data doesn't persist past a single running instance.

## Usage

### Build

```bash
npm install
```

### Serve Content

Currently this version only saves to the current running instance in memory.  If the service exits it will loose any receipt data.

Create a dot `.env` and update with your parameters:
```bash
cp sample.env .env
nano .env
```


Start:  
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
                    "price": 14.50,
                    "tax": 1.00,
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
                    "price": 14.50,
                    "tax": 1.00,
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
**PUT /receipt/claim/:receiptId/:itemId/:userId**   
```
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
                    "price": 14.50,
                    "tax": 1.00,
                    "additionalCostPercentage": 0
                }
            ]
        }
    }
}
```


---
**GET /receipt/storage/:userId/:filename**   

Request
```
Accept: application/json
```
Response:
- Success: ``200``
```json
{
    "data": {
        "attributes": {
            "destination": "https://bucket.s3.amazonaws.com/path/to/image.jpg?AWSAccessKeyId=<awsaccesskey>&Expires=1579055186&Signature=<awsaccesssignature>",
            "s3path": "s3://bucket/path/to/image.jpg"
        }
    }
}

---
```
**GET /receipt/pay/:receiptId/:userId**   
```
Accept: application/json
```
Response:
- Success: ``202``
```json
{
    "data": {
        "attributes": {
            "cost": {
              "tax": 1.00,
              "sub_total": 14.50,
              "total": 15.50
            }
        }
    }
}
```
---
**PUT /receipt/pay/:receiptId/:userId/:paymentMethod**   
```
Accept: application/json
```
Response:
- Success: ``202``
```json
{
    "data": {
        "attributes": {
            "cost": {
              "tax": 1.00,
              "sub_total": 14.50,
              "total": 15.50
            },
            "transactionMethod": "apple"
        }
    }
}
```

---
**GET /history/:userId**   
```
Accept: application/json
```
Response:
- Success: ``200``
```json
{
  "data": {
    "attributes": {
      "active": [
        {
            "receiptImage": "s3://bucket/path/to/image.jpg",
            "id": 1,
            "receiptLineItems": [
                {
                    "id": "1-1",
                    "label": "Item Label",
                    "paid": false,
                    "price": 14.50,
                    "tax": 1.00,
                    "additionalCostPercentage": 0
                }
            ]
        }
      ],
      "completed": []
    }
  }
}
```
