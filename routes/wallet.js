const Instamojo = require("instamojo-payment-nodejs");
const { akshuGetUser, GroupMemberCount, akshuGetGroup,
   dbdecrypt, svrToDbText, 
   getUserBalance, feeBreakup,
   calculateBonus,
	 rechargeCount,
} = require('./functions'); 
var router = express.Router();

const INSTA_API_KEY = "test_122c89dd87b24c3977474e3e82f";
const INSTA_AUTH_KEY = "test_4c814766fd46608724119f04929";

const RAZOR_API_KEY = "rzp_live_PWqtTU1HrN1C5M";
const RAZOR_AUTH_KEY = "jbV2ARMEfXPCNZUZ84GUnQQ9";


//let paymentRequestArray = [];

var instaOptions = {
  purpose: "APL Wallet", // REQUIRED
  amount: '', // REQUIRED and must be > ₹3 (3 INR)
  currency: "INR",
  buyer_name: '',
  email: '',
  phone: 1234567890,
  //expires_at: cTime,
  send_email: false,
  send_sms: false,
  allow_repeated_payments: false,
  webhook: "https://ankitipl.herokuapp.com/wallet/webhook/",
  // redirect_url: "https://happy-home-ipl-2020.herokuapp.com/apl/walletdetails",
};

var razorOptions = {
	"key": RAZOR_API_KEY,
	"amount": 0, 		// Example: 2000 paise = INR 20
	"name": "VRG",
	"description": "Dr. Viraag Wallet",
	//"image": "VS.JPG",    // COMPANY LOGO
	//"handler": handleRazor,
	"prefill": {
		"name": "", 		// pass customer name
		"email": '',		// customer email
		"contact": '' 	//customer phone no.
	},
	"notes": {
		"address": "address" //customer address 
	},
	"theme": {
		"color": "#15b8f3" // screen colour
	}
};


/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});


// given by instamojo on successfull payment
router.post('/instawebhook', async function (req, res) {
  setHeader(res);
  console.log("In WEBHOOK ----------------------------------------");
  console.log(req.body);
  return sendok(res, "Done");
  /***
{
payment_id: 'MOJO1531F05N07589845',
status: 'Credit',
shorturl: '',
longurl: 'https://test.instamojo.com/@arun_salgia/c2b7d39ddfd84bd4aab6469c1c13f431',
purpose: 'APL Wallet',
amount: '81.00',
fees: '1.54',
currency: 'INR',
buyer: 'arunsalgia@gmail.com',
buyer_name: 'Arun Salgia',
buyer_phone: '+911234567890',
payment_request_id: 'c2b7d39ddfd84bd4aab6469c1c13f431',
mac: 'ec891618e4e2b2a23377647065168e5458ca39b4'
}
  ***/

 
  let myPayment = await Payment.findOne({requestId: req.body.payment_request_id});
  myPayment.paymentId = req.body.payment_id;
  myPayment.paymentTime = new Date();
  myPayment.status = req.body.status.toUpperCase();
  myPayment.fee = parseFloat(req.body.fees);
  await myPayment.save();
  
  if (req.body.status.toUpperCase() !== "CREDIT")
    return sendok(res, "failed");


  let myTrans = createWalletTransaction();
  myTrans.isWallet = true;
  myTrans.uid = myPayment.uid;
  myTrans.transType = WalletTransType.refill;
  myTrans.transSubType = myPayment.paymentId;
  myTrans.amount = myPayment.amount;
  await myTrans.save();
  
  let bonusAmount = calculateBonus(myPayment.amount);
  
  myTrans = createWalletTransaction();
  myTrans.isWallet = false;

  myTrans.uid = myPayment.uid;
  myTrans.transType = BonusTransType.refill;
  myTrans.transSubType = myPayment.paymentId;
  myTrans.amount = bonusAmount;
  await myTrans.save();
  
  return sendok(res, "done");
});	
	
// create intamojo payment request when add wallet selected by user with amount
router.get('/instageneratepaymentrequest/:userCid/:amount', async function (req, res, next) {
  setHeader(res);
	let { userCid, amount } = req.params;
	let PAYMENT_REQUEST_URL = '';
	
	let customerRec = await Customer.findOne({_id:userCid });
	instaOptions.amount = amount;
	instaOptions.buyer_name = customerRec.name;
	instaOptions.email = dbdecrypt(customerRec.email);

	Instamojo.setKeys(INSTA_API_KEY, INSTA_AUTH_KEY);	
	Instamojo.isSandboxMode(true); // For testing
	const paymentData = Instamojo.PaymentData(instaOptions);
	console.log(paymentData);
	try {
		const response = await Instamojo.createNewPaymentRequest(paymentData);
		console.log(response);
		PAYMENT_REQUEST_URL = response.payment_request.id;
		
		let myPayment = new Payment();
		myPayment.uid = userRec.uid;
		myPayment.email = userRec.email;
		myPayment.amount = parseFloat(amount);
		myPayment.status = "PENDING";
		myPayment.requestId = response.payment_request.id;
		myPayment.requestTime = new Date();
		await myPayment.save();
	} catch (e) {
		console.log(e);
	}
	console.log(PAYMENT_REQUEST_URL);
	sendok(res, PAYMENT_REQUEST_URL);
}); 

router.get('/instagetpaymentdetails/:requestId', async function (req, res, next) {
  setHeader(res);
	let { requestId } = req.params;
	//console.log(paymentRequestArray);
	
	let myRequest = await Payment.findOne({requestId: requestId});
	//	let myRequest = paymentRequestArray.find(x => x.requestId === requestId);
	if (!myRequest) return senderr(res, 601, 'Invalid request id ' + requestId);
	console.log(myRequest);
	sendok(res, myRequest);
	return;
	
	console.log("All okay");
	Instamojo.setKeys(INSTA_API_KEY, INSTA_AUTH_KEY);	
	Instamojo.isSandboxMode(true); // For testing
	

	try {
		const payStatus = await Instamojo.getPaymentRequestStatus(requestId);
		let status = payStatus.payment_request.status.toUpperCase();
		let details = payStatus.payment_request.payments;
		sendok(res, {status: status, details: details});
	} catch (e) {
		console.log("error found");
		senderr(res, 601, 'Invalid request id ' + requestId);
	}
}); 

// given by instamojo on successfull payment
router.get('/instapaymentok/:paymentRequest/:paymentId', async function (req, res) {
  setHeader(res);
  console.log("In success payment");
  var {paymentRequest, paymentId } = req.params;
	
  let myPayment = await Payment.findOne({requestId: paymentRequest});
  myPayment.paymentId = paymentId;
  myPayment.paymentTime = new Date();
  myPayment.status = "CREDIT";			//req.body.status.toUpperCase();
  myPayment.fee = 0;   //parseFloat(req.body.fees);
  await myPayment.save();
  
  let myTrans = createWalletTransaction();
  myTrans.isWallet = true;
  myTrans.uid = myPayment.uid;
  myTrans.transType = WalletTransType.refill;
  myTrans.transSubType = myPayment.paymentId;
  myTrans.amount = myPayment.amount;
  await myTrans.save();
  
  let bonusAmount = calculateBonus(myPayment.amount);
  
  myTrans = createWalletTransaction();
  myTrans.isWallet = false;

  myTrans.uid = myPayment.uid;
  myTrans.transType = BonusTransType.refill;
  myTrans.transSubType = myPayment.paymentId;
  myTrans.amount = bonusAmount;
  await myTrans.save();
  
  return sendok(res, "done");
});	
	
router.get('/instapaymentfail/:paymentRequest', async function (req, res) {
  setHeader(res);
	var {paymentRequest} = req.params;
	console.log("In failed payment");
	
  let myPayment = await Payment.findOne({requestId: paymentRequest});
  myPayment.paymentId = "";
  myPayment.paymentTime = new Date();
  myPayment.status = "FAILED";			//req.body.status.toUpperCase();
  myPayment.fee = 0;   //parseFloat(req.body.fees);
  await myPayment.save();
  
  return sendok(res, "done");
});	
	
	
router.get('/razorgeneratepaymentrequest/:userCid/:amount', async function (req, res, next) {
  setHeader(res);
	let { userCid, amount } = req.params;
	let PAYMENT_REQUEST_URL = '';
	
	let customerRec = await M_Customer.findOne({_id: userCid});
	//console.log(customerRec);
	razorOptions.amount = Number(amount) * 100;			// convert to paise
	razorOptions.prefill.name = customerRec.name;
	razorOptions.prefill.email = dbdecrypt(customerRec.email);
	razorOptions.prefill.contact = '+91' + customerRec.mobile;
	
	sendok(res, razorOptions);
}); 

// given by razor pay on successful payment
router.get('/razorpaymentok/:userCid/:amount/:paymentId', async function (req, res) {
  setHeader(res);
  console.log("In success payment");
  var {userCid, amount, paymentId } = req.params;
	
	let customerRec = await M_Customer.findOne({_id: userCid});
	
	/*
	cid: Number,
  email: String,
  amount: Number,
  status: String,
  requestId: String,
  requestTime: Date,
  paymentId: String,
  paymentTime: Date,
  fee: Number,
	*/
	
	let myPayment = new M_Payment();
	myPayment.cid = customerRec.cid;
	myPayment.email = customerRec.email;
	myPayment.amount = parseFloat(amount);
  myPayment.status = "CREDIT";			//req.body.status.toUpperCase();
	myPayment.requestId = 'NA';   		//response.payment_request.id;
	myPayment.requestTime = new Date();
	myPayment.paymentId = paymentId;
  myPayment.paymentTime = new Date();
  myPayment.fee = 0; 
	await myPayment.save();
  
  let myTrans = createWalletTransaction(userCid);
  myTrans.transType = 'Recharge';
  myTrans.transSubType = myPayment.paymentId;
  myTrans.amount = myPayment.amount;
  await myTrans.save();
  
  return sendok(res, "done");
});	

// given by razorpay on failed payment
router.get('/razorpaymentfail/:userId/:paymentRequest', async function (req, res) {
  setHeader(res);
	var {userId, paymentRequest} = req.params;
	console.log("In failed payment");
  // never called for razor
  return sendok(res, "done");
});	
	

function getDate(x) {
	let y = ("0" + x.getDate()).slice(-2) + "/" +
		("0" + (x.getMonth()+1)).slice(-2) + "/" +
		x.getFullYear();
	return y;
}

router.get('/details/:userid', async function (req, res, next) {
  // WalletRes = res;
  setHeader(res);
    let { userid } = req.params;
    
    let userTrans=[];
    let myTrans = await M_Wallet.find({cid: userid}).sort({ "transNumber": -1 });
		/*
			myTrans.forEach(tRec => {
      if (tRec.amount != 0) {
        let tDate = new Date(tRec.transNumber);
        userTrans.push({
					isWallet: tRec.isWallet,
          date: getDate(tDate),			//cricDate(tDate), 
          amount: tRec.amount,
          type: tRec.transType,
        });
      }
    });
		*/
		
  //console.log(myTrans);
  sendok(res, myTrans);
}); 


router.get('/accountopen/:userid', async function (req, res, next) {
  // WalletRes = res;
  setHeader(res);

  var { userid } = req.params;

  let userRec = await User.findOne({uid: userid});
  if (!userRec) { senderr(res, 613, `Invalid user ${userid}`); return; }
  await WalletAccountOpen(userid, 0)
  sendok(res, "ok");
}); 

router.get('/offer/:userid/:myAmount', async function (req, res, next) {
  // WalletRes = res;
  setHeader(res);

  var { userid,  myAmount} = req.params;

  let userRec = await User.findOne({uid: userid});
  if (!userRec) { senderr(res, 613, `Invalid user ${userid}`); return; }
  await WalletAccountOffer(userid, myAmount)
  sendok(res, "ok");
}); 

router.get('/membercount/:groupid', async function (req, res, next) {
  // WalletRes = res;
  setHeader(res); 

  var { groupid } = req.params;
  var tmp = await GroupMemberCount(groupid);
  // console.log(tmp);  
  sendok(res, {memberCount: tmp});
}); 
 
router.get('/feebreakup/:memberfee', async function (req, res, next) {
  var { memberfee } = req.params; 
  sendok(res, feeBreakup(Number(memberfee)));
});

router.get('/groupfeebreakup/:groupId', async function (req, res, next) {
  var { groupId } = req.params; 
  let myGroup = await IPLGroup.findOne({_id: groupId});
  if (!myGroup) return senderr(res, 611, "Invalid Group code");

  let myFees = feeBreakup(myGroup.memberFee)
  myFees["name"] = myGroup.name;
  sendok(res, myFees);
});


router.get('/balance/:userCid', async function (req, res, next) {
  // WalletRes = res;
  setHeader(res);

  var { userCid } = req.params;
  var tmp = await getUserBalance(userCid);
  // console.log(tmp);  
  sendok(res, tmp);
}); 

router.get('/allopen', async function (req, res, next) {
  // WalletRes = res;
  setHeader(res);

  // var { userid } = req.params;
  let alluserRec = await User.find({});
  for(i=0; i<alluserRec.length; ++i) {
    await WalletAccountOpen(alluserRec[i].uid, 0);
  };
  sendok(res, "ok");
}); 

// WalletTransType = {
//   accountOpen: "accountOpen",
//   refill: "refill",
//   withdrawl: "withdrawal",
//   offer: "offer",
//   bonus: "bonus",
//   prize: "prize",
//   groupJoin: "groupJoin",
//   groupCancel: "groupCancel",
//   feeChange: "feeChange",
//   pending: "pending",			// refund pending
//   refundDone: "refundOk",
// };
router.get('/alloffer', async function (req, res, next) {
  // WalletRes = res;
  setHeader(res);
  let allTrans = await Wallet.find({});
  for(let i=0; i<allTrans.length; ++i) {
    switch(allTrans[i].transType) {
      //case "offer":
      case "bonus":
      case "accountOpen": 
        allTrans[i].isWallet = false;
      break;
      default:
        allTrans[i].isWallet = true;
      break;
    }
    allTrans[i].save();
  }
  sendok(res, "ok");
}); 

router.get('/refill/:userId/:amount/:paymentId', async function (req, res, next) {
  setHeader(res);
  var {userId, amount, paymentId} = req.params;
	
	// find out if this is the first recharge by user. If yes then count will be 0
	let count = await rechargeCount(userId);
	
  let myTrans = createWalletTransaction();
  myTrans.transType = WalletTransType.refill;
  myTrans.uid = userId;
  myTrans.transSubType = paymentId;
  myTrans.amount = amount;
  await myTrans.save();
  // console.log(myTrans);

	// if user is 1st recharge. Find if it registered using reference
	if (count === 0) {
		let refRec = await Reference.findOne({uid: userId, pending: true, scheme: "NEWUSER"});
		if (refRec) {
			let refTrans = createWalletTransaction();
			refTrans.isWallet = false;			// it is bonus and not wallet
			refTrans.transType = BonusTransType.referral;
			refTrans.uid = refRec.referenceUid;
			//refTrans.transSubType = "";
			refTrans.amount = refRec.offer;
			await refTrans.save();
			
			refRec.pending = false;			// job done. Bonus given
			await refRec.save();
		}
	}
	
  sendok(res, myTrans);
}); 

router.get('/refillcount/:userId', async function (req, res, next) {
  setHeader(res);
  var {userId} = req.params;
	
	// find out if this is the first recharge by user
	let count = await rechargeCount(userId);
  
  sendok(res, {count: count});
}); 

router.get('/withdraw/:userId/:amount/:details', async function (req, res, next) {
  setHeader(res);
  var {userId, amount, details} = req.params;
	

  let myTrans = createWalletTransaction();
  myTrans.transType = WalletTransType.pending;
  myTrans.uid = userId;
  myTrans.transSubType = svrToDbText(details);
  myTrans.amount = -amount;
  myTrans.save();
  
  sendok(res, myTrans);
}); 

router.get('/test', async function (req, res, next) {
  setHeader(res);
   /*
	  cid: String,
  isWallet: Boolean,
  transNumber: Number,
  transDate: String,
  transType: String,
  transSubType: String,
  transLink: Number,
  amount: Number,
  transStatus: Boolean,
	 */
	 
	let myRec = new M_Wallet();
	myRec.cid = '613dd7074e86491f500862e7';
	myRec.isWallet = false;
	myRec.transNumber = 202109301123345;
	myRec.transDate = new Date();
	myRec.transType = 'bonus';
	myRec.amount = 100;
	transStatus = true;
	myRec.save();
	
	myRec = new M_Wallet();
	myRec.cid = '613dd7074e86491f500862e7';
	myRec.isWallet = true;
	myRec.transNumber = 202109301123346;
	myRec.transDate = new Date();
	myRec.transType = 'wallet';
	myRec.amount = 1890;
	transStatus = true;
	myRec.save();
	
	sendok(res, "Done");
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
