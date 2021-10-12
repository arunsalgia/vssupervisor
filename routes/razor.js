//const Instamojo = require("instamojo-payment-nodejs");
const crypto = require("crypto");
const Razorpay = require("razorpay");

var router = express.Router();

const {
	encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
} = require('./functions'); 



router.use('/', function(req, res, next) {
  setHeader(res);
  next('route');
});

var params = {
	amount: 0,
	currency: "INR",
	receipt: "wthcoding001",
	payment_capture: '1'
};

var razorOptions = {
	"key": process.env.RazorKey,
	//"amount": 0, 		// Example: 2000 paise = INR 20
	//"currency": "INR",
	"order_id": "",
	"name": "Dr. Viraag",
	"description": "for Doctor Viraag",
	"image": "DV.JPG", 
	//"handler": handleRazor,
	"prefill": {
		"name": "Arun", 		// pass customer name
		"email": 'xxx',		// customer email
		"contact": '0' 	//customer phone no.
	},
	"notes": { 
		"address": "address" //customer address 
	},
	"theme": {
		"color": "#15b8f3" // screen color
	}
};
			
router.get('/order/:userCid/:amount', async function( req, res) {
	console.log("Hello");

	var {userCid, amount} = req.params;
	
	let customerRec = await M_Customer.findOne({_id: userCid});
	if (!customerRec) return senderr(res, 601, "Invalid Customer Id");
	//console.log(customerRec);
	
	params.amount = Number(amount)*100;
	//console.log(`Amount ${params.amount}`);
	
	let instance = new Razorpay({
		key_id: process.env.RazorKey,
		key_secret: process.env.RazorSecret,
	});
	//console.log(process.env.RazorKey, process.env.RazorSecret);
	//console.log(instance);
	
  instance.orders
    .create(params)
    .then((data) => {
			//console.log(data);
			//console.log(razorOptions);
			// update order id and user details
			razorOptions.order_id = data.id;
			razorOptions.name = customerRec.name;
			razorOptions.prefill.email = dbdecrypt(customerRec.email);
			razorOptions.prefill.contact = customerRec.mobile;
      sendok(res, razorOptions);
    })
    .catch((error) => {
			console.log(`Failed`);
      senderr(res, 602, { sub: error, status: "razor failed" });
    });
});

router.get("/verify/:razorpay_order_id/:razorpay_payment_id/:razorpay_signature", async (req, res) => {
	var {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.params;
	
  body = razorpay_order_id + "|" + razorpay_payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", process.env.RazorKey)
    .update(body.toString())
    .digest("hex");
		
  console.log("sig:" + razorpay_signature);
  console.log("sig:" + expectedSignature);
	
	if (expectedSignature === razorpay_signature)
		sendok(res, { status: "success" });
	else 
		senderr(res, 601, { status: "success" });
  var response = { status: "failure" };
  
});





function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
