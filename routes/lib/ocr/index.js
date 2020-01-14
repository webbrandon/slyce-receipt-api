const rp = require("request-promise")

module.exports = {
  submitImage: submitImage,
  get: getResponse
}


function submitImage(imageLocation) {
  console.log("Begin: submitImage()")
  return {
    token: "488015",
    duplicate: false,
    duplicateToken: undefined,
    message: "",
    status: 'success',
    status_code: true,
    code: 200
  }
}

function getResponse (token) {
  return {
     message: "SUCCESS: Result available",
     status: "done",
     status_code: 3,
     result: {
        establishment: "Teishokuya of lok 20012",
        validatedEstablishment: false,
        date: "2020-01-13 12:28:49",
        total: "86.510",
        url: "littletokyorestaurant.com",
        phoneNumber: "",
        paymentMethod: "",
        address: "",
        cash: "0.000",
        change: "0.000",
        validatedTotal: true,
        subTotal: "79.000",
        validatedSubTotal: true,
        tax: "7.510",
        taxes: [
           7.51
        ],
        discount: "0.000",
        rounding: "0.000",
        discounts: [],
        lineItems: [
           {
              qty: 1,
              desc: "1 SASHIMI GOZEN *",
              unit: "",
              price: "0.000",
              symbols: [
                 "$",
                 "*"
              ],
              discount: "0.000",
              lineType: "",
              descClean: "SASHIMI GOZEN *",
              lineTotal: "21.500",
              productCode: "",
              customFields: []
           },
           {
              qty: 1,
              desc: "1 SALMON TERIYAKI GOZEN *",
              unit: "",
              price: "0.000",
              symbols: [
                 "$",
                 "*"
              ],
              discount: "0.000",
              lineType: "",
              descClean: "SALMON TERIYAKI GOZEN *",
              lineTotal: "15.500",
              productCode: "",
              customFields: []
           },
           {
              qty: 0,
              desc: "W / BROWN RICE",
              unit: "",
              price: "0.000",
              symbols: [
                 "$"
              ],
              discount: "0.000",
              lineType: "",
              descClean: "W / BROWN RICE",
              lineTotal: "1.000",
              productCode: "",
              customFields: []
           },
           {
              qty: 1,
              desc: "1 SALMON TERIYAKI GOZEN *",
              unit: "",
              price: "0.000",
              symbols: [
                 "$",
                 "*"
              ],
              discount: "0.000",
              lineType: "",
              descClean: "SALMON TERIYAKI GOZEN *",
              lineTotal: "15.500",
              productCode: "",
              customFields: []
           },
           {
              qty: 2,
              desc: "2 BEEF TERIYAKI DONBURI *",
              unit: "",
              price: "0.000",
              symbols: [
                 "$",
                 "*"
              ],
              discount: "0.000",
              lineType: "",
              descClean: "BEEF TERIYAKI DONBURI *",
              lineTotal: "25.500",
              productCode: "",
              customFields: []
           }
        ],
        summaryItems: [
           {
              qty: 0,
              desc: "Subtotal",
              unit: "",
              price: "0.000",
              symbols: [
                 "$"
              ],
              discount: "0.000",
              lineType: "SubTotal",
              descClean: "Subtotal",
              lineTotal: "79.000",
              productCode: "",
              customFields: []
           },
           {
              qty: 0,
              desc: "Tax",
              unit: "",
              price: "0.000",
              symbols: [
                 "$"
              ],
              discount: "0.000",
              lineType: "Tax",
              descClean: "Tax",
              lineTotal: "7.510",
              productCode: "",
              customFields: []
           },
           {
              qty: 0,
              desc: "GRAND TOTAL",
              unit: "",
              price: "0.000",
              symbols: [
                 "$"
              ],
              discount: "0.000",
              lineType: "Total",
              descClean: "GRAND TOTAL",
              lineTotal: "86.510",
              productCode: "",
              customFields: []
           }
        ],
        subTotalConfidence: 0.99,
        taxesConfidence: [
           0.99
        ],
        discountConfidences: [],
        totalConfidence: 0.99,
        dateConfidence: 0.99,
        establishmentConfidence: 0.8,
        cashConfidence: 0,
        changeConfidence: 0,
        roundingConfidence: 0,
        customFields: {
           URL: "littletokyorestaurant.com",
           Country: "",
           Currency: "",
           VATNumber: "",
           ExpenseType: "",
           PaymentMethod: "",
           CardLast4Digits: ""
        },
        documentType: "receipt",
        currency: "",
        barcodes: [],
        dateISO: "2020-01-13T12:28:49",
        addressNorm: {
           city: "",
           state: "",
           number: "",
           street: "",
           suburb: "",
           country: "",
           building: "",
           postcode: ""
        },
        expenseType: "None",
        otherData: []
     },
     success: true,
     code: 202
  }
}
