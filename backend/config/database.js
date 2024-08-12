const mongoose = require('mongoose')
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {

            console.log(`Mongodb connected with server: ${data.connection.host}`)
        })
}

module.exports = connectDatabase;

// {
//     "itemsPrice":200,
//     "taxPrice":36,
//     "shippingPrice":336,
//     "orderItems":[
//         {
//             "product":"64576db79e8dd18082aaa91f",
//             "name":"Dell",
//             "price":1200,
//             "image":"Sample image",
//             "quantity":1
//         }
//     ],
//     "shippingInfo": {
//         "address":"619 los Angles",
//         "city":"LA",
//         "state":"odisha",
//         "country":"India",
//         "pinCode":761106,
//         "phoneNo":1234567890
//     },
//     "paymentInfo":{
//         "id":"sample paymentInfo",
//         "status":"succeeded"

//     }
