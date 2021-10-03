var router = express.Router();
const { 
	checkDate,
} = require('./functions');

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list', async function(req, res, next) {
  setHeader(res);
	let rec = await M_Customer.find({});
	sendok(res, rec);
});

router.get('/getinfo/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await M_Customer.findOne({_id: cid});
	if (rec)	sendok(res, rec);
	else      senderr(res, 601, "Invalid cid");
})

router.get('/add/:userName', async function(req, res, next) {
  setHeader(res);
	var {userName} = req.params;
	
	let rec = new M_Customer();
	rec.name = userName;
	rec.plan = "YEARLY"
	rec.expiryDate = new Date(2030, 12, 31);
	rec.enabled = true;
	rec.save();
	sendok(res, "done");
});

router.get('/test', async function(req, res, next) {
  setHeader(res);
	let i, cNum;

	let allRecs = await M_Customer.find({})
	for(i=0,cNum=100; i<allRecs.length; ++i, ++cNum) {
		//allRecs[i].customerNumber = cNum;
		//allRecs[i].save();
		//console.log(allRecs[i]);
		allRecs[i].day0 = [];
		allRecs[i].day1 = [9, 10, 11, 12, 13, 16, 17, 18, 19];
		allRecs[i].day2 = [9, 10, 11, 12, 13, 16, 17, 18, 19];
		allRecs[i].day3 = [9, 10, 11, 12, 13, 16, 17, 18, 19];
		allRecs[i].day4 = [9, 10, 11, 12, 13, 16, 17, 18, 19];
		allRecs[i].day5 = [9, 10, 11, 12, 13];
		allRecs[i].day6 =  (allRecs[i].customerNumber === 100) ? [] : [9, 10, 11, 12, 13, 16, 17, 18, 19];
		allRecs[i].save();
	}
	sendok(res, "all days done");
});

cron.schedule('15,57 0,9,13 * * *', async () => {	
  if (!db_connection) {
    return;
  }
	// check for expiry
	console.log("Check for expiry");
	let allCustomers = await M_Customer.find({});
	for(let i = 0; i < allCustomers.length; ++i) {
		let isExpired = checkDate(allCustomers[i].expiryDate);
		console.log(allCustomers[i].name, isExpired);
	}
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;