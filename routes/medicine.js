var router = express.Router();
const { 
	ALPHABETSTR,
	getLoginName, getDisplayName,
	getMaster, setMaster,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

// send list of in chunks of blocks.
// Each Block will contain #medicines which is confgired in MEDBLOCK

router.get('/add/:cid/:newMedicine', async function(req, res, next) {
  setHeader(res);
  
  var {cid, newMedicine } = req.params;
	
	let id = getLoginName(newMedicine);
  var tmp = await M_Medicine.findOne({cid: cid, id: id});
  if (!tmp) {
		mRec = new M_Medicine();
		mRec.cid = cid;
		mRec.id = id;
		mRec.name = newMedicine;
		mRec.enabled = true;
		mRec.save();
    sendok(res, mRec);
  }
	else
    senderr(res, 601, 'Medicine already in database.');
});

router.get('/edit/:cid/:oldMedicineName/:newMedicineName', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldMedicineName, newMedicineName} = req.params;
	let id;
	var mRec;
	
	let old_lname = getLoginName(oldMedicineName);
	let new_lname = getLoginName(newMedicineName);
	
	if (old_lname != new_lname) {
		// just check that of new medicine already in database
		mRec = await M_Medicine.findOne({cid: cid, id: new_lname});
		if (mRec) {
			senderr(res, 601, "New Medicine name already in database");
			return;
		}
	} 
	
	// check if old name really exists!!!! Only then we can modify it
	mRec = await M_Medicine.findOne({cid: cid, id: old_lname});
	if (!mRec) {
		senderr(res, 611, "Old Medicine name not found in database");
		return;
	}

	// good. now update the details
	mRec.id = new_lname;
	mRec.name = newMedicineName;
	mRec.enabled = true;
	mRec.save();
	sendok(res, mRec);
});

router.get('/delete/:cid/:delMedicine', async function(req, res, next) {
  setHeader(res);
  
  var { cid, delMedicine } = req.params;
	
	let id = getLoginName(delMedicine);
	console.log(id);
	
	M_Medicine.deleteOne({cid: cid, id: id}).then(function(){
    console.log("Data deleted"); // Success
		sendok(res, "1 document deleted");
	}).catch(function(error){
    console.log(error); // Failure
		senderr(res, 601, `Medicine ${newMedicine} not found in database.`);
	});
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	M_Medicine.find({cid: cid},  {name: 1, _id: 0}, function(err, objs) {
		objs = _.sortBy(objs, 'name');
		sendok(res, objs);
  });
});



router.get('/listonlyname/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	M_Medicine.find({cid: cid},  {name: 1, _id: 0}, function(err, objs) {
		objs = _.sortBy(objs, 'name');
		sendok(res, objs);
  });
});

router.get('/alphabetlist/:cid/:myChar', async function(req, res, next) {
  setHeader(res);
  
  var { cid, myChar } = req.params;

	let myQuery = { name: { $regex: "^"+myChar, $options: "i" }, cid: cid, enabled: true };
	let test = await M_Medicine.find(myQuery).sort({'name': 1});
	sendok(res, test);
});

router.get('/count/:cid', async function(req, res, next) {
  setHeader(res);
	var { cid } = req.params;
	let myQuery, test;
	myQuery = [		//example
		{ $match: { name: /^J/} },
		{ $group: { _id: 'J' , count: { $sum: 1 } } }
  ];
	let allData = [];

	allData=[];
	for(let i=0; i<ALPHABETSTR.length; ++i) {
		myQuery = [
			{ $match: { name: new RegExp('^'+ALPHABETSTR[i], "i"), cid: cid} },
			{ $group: { _id: ALPHABETSTR[i] , count: { $sum: 1 } } }
		];
		test = await M_Medicine.aggregate(myQuery);
		allData = allData.concat(test);
	}
	sendok(res, allData);
});

router.get('/filter/:cid/:partname', async function(req, res, next) { 
  setHeader(res);
  
  var { cid, partname } = req.params;
	
	let myQuery = { name: { $regex: partname, $options: "i" }, cid: cid, enabled: true };		
	let test = await M_Medicine.find(myQuery).sort({'name': 1});
	sendok(res, test);
});

router.get('/filter/:cid', async function(req, res, next) { 
  setHeader(res);
  var { cid } = req.params;
	
	let myQuery = { enabled: true, cid: cid };
	let test = await M_Medicine.find(myQuery).sort({'name': 1});
	sendok(res, test);
});
 
function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;