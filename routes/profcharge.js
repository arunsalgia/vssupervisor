var router = express.Router();

const { 
	getLoginName, base64ToString,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let allRecs = await M_ProfCharge.find({cid: cid}).sort({tid: -1});
	sendok(res, allRecs);
});

router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid} = req.params;
	pid = Number(pid);
	
	let allRecs = await M_ProfCharge.find({cid: cid, pid: pid}).sort({tid: -1});
	sendok(res, allRecs);
});

router.get('/balance/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid} = req.params;
	pid = Number(pid);

	let paymentQuery = [
		{$match: { cid: cid, pid: pid, amount: {$gt: 0} }},
		{ $group: { _id: '$cid', totalMoney: { $sum: '$amount' } } }
  ];
	let billingQuery = [
		{$match: { cid: cid, pid: pid, amount: {$lt: 0} }},
		{$group: { _id: '$cid', totalMoney: { $sum: '$amount' } }}
  ];
	
	let payRec = await M_ProfCharge.aggregate(paymentQuery);
	let billRec = await M_ProfCharge.aggregate(billingQuery);
	//console.log(billRec);
	//console.log(payRec);
	let payAmount = (payRec.length > 0) ? payRec[0].totalMoney : 0;
	let billAmount = (billRec.length > 0) ? Math.abs(billRec[0].totalMoney) : 0;
	let retValue = {billing: billAmount, payment: payAmount, due: (billAmount-payAmount)};
	console.log(retValue)
	sendok(res, retValue);
});

// this entry is only for the payment done by patients
router.get('/add/:cid/:pid/:payInfo', async function(req, res, next) {
  setHeader(res);
  var {cid, pid, payInfo} = req.params;
	payInfo = JSON.parse(payInfo);
	
	let myRec = new M_ProfCharge();
	myRec.cid = cid;
	myRec.pid = Number(pid);
	let tmp = await M_ProfCharge.find({}).limit(1).sort({tid: -1});
	myRec.tid = (tmp.length > 0) ? tmp[0].tid + 1 : "1";
	myRec.treatment = "";			// this is for treatment entry
	myRec.enabled = true;
	myRec.treatmentDetails = [];
	
	myRec.description = payInfo.description;
	myRec.date = payInfo.date;
	myRec.amount = payInfo.amount;
	myRec.paymentMode = payInfo.paymentMode;
	
	//console.log(myRec);
	myRec.save();
	
	sendok(res, myRec);
});


// this entry is only for the payment done by patients
router.get('/update/:cid/:pid/:tid/:payInfo', async function(req, res, next) {
  setHeader(res);
  var {cid, pid, tid, payInfo} = req.params;
	
	let myRec = await M_ProfCharge.findOne({cid: cid, pid: Number(pid), tid: Number(tid)});
	if (!myRec) return senderr(res, 601, "Record not found");

	payInfo = JSON.parse(payInfo);
	myRec.description = payInfo.description;
	//myRec.date = payInfo.date;
	myRec.amount = payInfo.amount;
	myRec.paymentMode = payInfo.paymentMode;
	
	myRec.save();
	
	sendok(res, myRec);
});

router.post('/delete/:cid/:pid/:tid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid, tid} = req.params;
	
	await M_ProfCharge.deleteOne({cid: cid, pid: Number(pid), tid: Number(tid)});

	sendok(res, "done");
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;