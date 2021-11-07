const {  akshuGetUser, GroupMemberCount,  
  encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
	numberDate
} = require('./functions'); 
var router = express.Router();

let arun_holiday = {};

function clearHoliday(cid)  {arun_holiday[cid] = []};

async function loadHoliday(cid) {
	let hasData = false;
	if (arun_holiday[cid]) 
	if (arun_holiday[cid].length > 0)
		hasData = true;

	//console.log(hasData);

	if (!hasData) {
		console.log("Reading holidays for ", cid);
		let d = new Date();
		d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
		//console.log(d)
		let hRec = await M_Holiday.find({cid: cid, holidayDate: {$gte: d} });
		arun_holiday[cid] = hRec;
		//console.log(arun_holiday[cid]);
	}
}

async function isHoliday(cid, year, month, date) {
	await loadHoliday(cid);
	let tmp = arun_holiday[cid].filter(x => x.date == date && x.month == month && x.year == year);
	return tmp.length > 0;
}

async function monthlyHoliday(cid, year, month) {
	await loadHoliday(cid);
	//console.log("Monthly", year, month);
	//console.log(arun_holiday[cid]);
	let tmp = arun_holiday[cid].filter(x => (x.month == month) && (x.year == year));
	//console.log("res", tmp)
	return tmp;
}

async function fromTodayHoliday(cid) {
	await loadHoliday(cid);
	let d = new Date();
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
	let tmp = arun_holiday[cid].filter(x => x.holidayDate.getTime() >= d.getTime());
	return tmp;
}

/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
	//console.log("Hi");
  next('route');
});


router.get('/delete/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year } = req.params;
	
	clearHoliday(cid)
	let hRec = await M_Holiday.deleteOne({cid: cid, date: Number(date), month: Number(month), year: Number(year)});
	sendok(res, "OK");
});


router.get('/oldset/:year/:month/:date/:desc', async function (req, res) {
  setHeader(res);
  var {date, month, year, desc} = req.params;
	
	let hRec = await M_Holiday.findOne({date: date, month: month, year: year});
	//console.log(hRec);
	
	let imonth = Number(month);
	let iyear = Number(year);
	
	++imonth;
	if (imonth > 12) { ++iyear; imonth = 1; }
	
	if (!hRec) {
		hRec = new M_Holiday();
		hRec.date = date;
		hRec.month = imonth;
		hRec.year = iyear;
		hRec.holidayDate = numberDate(iyear, imonth, Number(date));
	}
	hRec.desc = desc;
	hRec.save();
	sendok(res, hRec);
});	


router.get('/set/:cid/:year/:month/:date/:desc', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year, desc} = req.params;
	
	clearHoliday(cid);

	let hRec = await M_Holiday.findOne({cid: cid, date: date, month: month, year: year});
	console.log(hRec);
	
	if (!hRec) {
		hRec = new M_Holiday();
		hRec.cid = cid
		hRec.date = date;
		hRec.month = month;
		hRec.year = year;
		hRec.holidayDate = new Date(Number(year), Number(month), Number(date));
	}
	hRec.desc = desc;
	hRec.save();
	sendok(res, hRec);
});	


router.get('/monthly/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, year, month } = req.params;
	
	//let hRec = await M_Holiday.find({cid: cid, month: month, year: year}).sort({year: 1, month: 1, date: 1});
	let hRec = await monthlyHoliday(cid, year, month);
	//console.log(hRec);
	sendok(res, hRec);
});		


router.get('/yearly/:cid/:year', async function (req, res) {
  setHeader(res);
  var { cid, year } = req.params;
	
	let hRec = await M_Holiday.find({cid: cid, year: year});
	sendok(res, hRec);
});		


router.get('/fromtoday/:cid', async function (req, res) {
  setHeader(res);
  var {cid} = req.params;
//	let d = new Date();
	//d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
	
	//let hRec = await M_Holiday.find({cid: cid, holidayDate: {$gte: d} });
	let hRec = fromTodayHoliday(cid);
	sendok(res, hRec);
});		


router.get('/isholiday/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var { cid, year, month, date } = req.params;
	
	//let hRec = await M_Holiday.findOne({cid: cid, date: date, month: month, year: year});
	sendok(res, {status: await isHoliday(cid, year, month, date) });
});		

router.get('/test/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;

	let iyear = Number(year);
	let imonth = Number(month);
	
	let sNum = new Date(iyear, imonth, 1);
	let eNum = new Date(iyear, imonth+1, 1);
		
	//price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 }
	//console.log(sNum, eNum);
	let hRec = await M_Holiday.find( {cid: cid, holidayDate: {"$gte": sNum, "$lt": eNum} } );
	sendok(res, hRec);
});		

router.get('/all/:cid', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
		
	let hRec = await M_Holiday.find( {cid: cid} );
	sendok(res, hRec);
});		

function getDate(x) {
	let y = ("0" + x.getDate()).slice(-2) + "/" +
		("0" + (x.getMonth()+1)).slice(-2) + "/" +
		x.getFullYear();
	return y;
}



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
