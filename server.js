const express = require('express');
const path = require('path');
const http = require('http')
const app = express();

// PASS EXPRESS CONFGURATION
const server = http.createServer(app);

// READ ENVIRONMENT FILES
const dotenv = require('dotenv')


const mailer = require('./mailer')

dotenv.config({ path: './config.env' });

//setting up serveer -- chunk 1
app.use(express.static(path.join(__dirname, 'view')));

const PORT = process.env.PORT || 3000;

//parsing data -- chunk 2\
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.post('/email', mailer.sendEmail);
app.post('/detailed/email', mailer.sendMessage);

//setting up routes -- chunk 1
app.get('/', (req, res) =>{
    res.status(200).sendFile(path.join(__dirname, 'view', 'index.html'))
})


/////////////////////////////////////////////
///////// Payment Gateway

const Razorpay = require("razorpay");
app.use(require("body-parser").json());

var instance = new Razorpay({
    key_id: "rzp_test_b99thg5sLj2zei",  // Unique personal identification id
    key_secret: "GWvz29I1TeVjhUKy23yShEJE", //Danger zone this needs to be kept private😮‍💨
});


app.post('/create/orderId', (req, res) => {
    console.log("create orderId request", req.body);
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit {And also this is editable}
        currency: "INR",
        receipt: "rcpl1"
    };
    instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({
            orderId: order.id,
        })
    });


    app.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'Wok5mJv2F0pa5HKLeXZfUr9r')
                                    .update(body.toString())
                                    .digest('hex');
                                    console.log("sig received " ,req.body.response.razorpay_signature);
                                    console.log("sig generated " ,expectedSignature);
    var response = {"signatureIsValid":"false"}
    if(expectedSignature === req.body.response.razorpay_signature)
    response={"signatureIsValid":"true"}
        res.send(response);
    });
})

server.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})