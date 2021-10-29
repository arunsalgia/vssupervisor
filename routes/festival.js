const { 
	numberDate
} = require('./functions'); 
var router = express.Router();


/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
	//console.log("Hi");
  next('route');
});

router.get('/addpack/:desc', async function (req, res) {
  setHeader(res);
  var {desc} = req.params;
	
	
	let hRec = await M_Festival.findOne({desc: desc, date: 0, month: 0, year: 0});
	if (hRec) return senderr(res, 601, "Pack already added");

	let tmp = await M_Festival.find({}).limit(1).sort({pack: -1});
	hRec = new M_Festival();
	hRec.pack = (tmp.length > 0) ? tmp[0].pack + 1 : 1;
	hRec.date = 0;
	hRec.month = 0;
	hRec.year = 0;
	hRec.holidayDate = new Date(1900, 1, 1);
	hRec.desc = desc;
	hRec.save();
	sendok(res, hRec);
});	

router.get('/delpack/:desc', async function (req, res) {
  setHeader(res);
  var { desc} = req.params;
	
	
	await M_Festival.deleteOne({desc: desc, date: 0, month: 0, year: 0});


	sendok(res, "deleted");
});	

router.get('/listpack', async function (req, res) {
	setHeader(res);
	let test = await M_Festival.find({});
	console.log(test);
	let allPacks = await M_Festival.find({date: 0, month: 0, year: 0}).sort({pack: 1}); 
	//console.log(allPacks);
	sendok(res, allPacks);

});

router.get('/list/:packNumber', async function (req, res) {
	setHeader(res);
	var {packNumber } = req.params;
	packNumber = Number(packNumber);

	let allPacks = await M_Festival.find({pack: packNumber}).sort({year: 1, month: 1, date: 1});
	allPacks = allPacks.filter(x => x.date !== 0);		// remove desription 
	console.log(allPacks);
	sendok(res, allPacks);

});


router.get('/list', async function (req, res) {
	setHeader(res);
	var {packNumber } = req.params;
	packNumber = Number(packNumber);

	let allPacks = await M_Festival.find({}).sort({year: 1, month: 1, date: 1});
	//console.log(allPacks);
	sendok(res, allPacks);
});


router.get('/del/:dateStr', async function (req, res) {
  setHeader(res);
  var {dateStr } = req.params;
	
	let myYear = 	Number(dateStr.substr(0, 4));
	let myMonth = Number(dateStr.substr(4,2)) - 1;
	let myDate =  Number(dateStr.substr(6,2));
	await M_Festival.deleteOne({date: myDate, month: myMonth, year: myYear});
	sendok(res, "OK");
});



router.get('/add/:dateStr/:desc/:greeting/:p1/:p2/:p3', async function (req, res) {
  setHeader(res);
  var {dateStr, desc, greeting, p1, p2, p3} = req.params;
	
	let myYear = 	Number(dateStr.substr(0, 4));
	let myMonth = Number(dateStr.substr(4,2)) - 1;
	let myDate =  Number(dateStr.substr(6,2));
	
	let hRec = await M_Festival.findOne({date: myDate, month: myMonth, year: myYear});
	console.log(hRec);
	
	if (!hRec) {
		hRec = new M_Festival();
		hRec.date = myDate;
		hRec.month = myMonth;
		hRec.year = myYear;
		hRec.festivalDate = new Date(Number(myYear), Number(myMonth), Number(myDate));
	}
	hRec.desc = desc;
	hRec.greeting = greeting;
	hRec.pack1 = (p1 === "true");
	hRec.pack2 = (p2 === "true");
	hRec.pack3 = (p3 === "true");

	hRec.save();
	sendok(res, hRec);
});	


router.get('/monthly/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
	
	let hRec = await M_Festival.find({cid: cid, month: month, year: year}).sort({year: 1, month: 1, date: 1});
	//console.log(hRec);
	sendok(res, hRec);
});		


router.get('/yearly/:cid/:year', async function (req, res) {
  setHeader(res);
  var { cid, year } = req.params;
	
	let hRec = await M_Festival.find({cid: cid, year: year});
	sendok(res, hRec);
});		


router.get('/fromtoday/:cid', async function (req, res) {
  setHeader(res);
  var {cid} = req.params;
	let d = new Date();
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
	
	let hRec = await M_Festival.find({cid: cid, holidayDate: {$gte: d} });

	sendok(res, hRec);
});		


router.get('/isholiday/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var { cid, year, month, date } = req.params;
	
	let hRec = await M_Festival.findOne({cid: cid, date: date, month: month, year: year});
	sendok(res, {status: (hRec != null) });
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
	let hRec = await M_Festival.find( {cid: cid, holidayDate: {"$gte": sNum, "$lt": eNum} } );
	sendok(res, hRec);
});		

router.get('/all/:cid', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
		
	let hRec = await M_Festival.find( {cid: cid} );
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
