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

router.get('/add/:newType', async function(req, res, next) {
  setHeader(res);
  
  var {newType } = req.params;
	
  var tmp = await M_DoctorType.findOne({name: newType});
  if (tmp) return  senderr(res, 601, 'Doctor type already in database.');

	tmp = await M_DoctorType.find({}).limit(1).sort({dtin: -1});

	mRec = new M_DoctorType();
	mRec.dtin = (tmp.length > 0) ? tmp[0].dtin + 1 : 1;
	mRec.name = newType;
	mRec.enabled = true;
	mRec.save();
	sendok(res, mRec);

});

router.get('/edit/:oldType/:newType', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldType, newType } = req.params;

	var mRec;
	
	
	if (oldType === newType) return sendok(res, 'ok');

		// just check that of new medicine already in database
	mRec = await M_DoctorType.findOne({name: newType});
	if (mRec) return senderr(res, 601, "New Doctor type already in database");
			
	// check if old name really exists!!!! Only then we can modify it
	mRec = await M_DoctorType.findOne({name: oldType});
	if (!mRec) return senderr(res, 602, "Old Doctor type not found in database");
	
	mRec.name = newType;
	mRec.enabled = true;
	mRec.save();
	sendok(res, mRec);
});

router.post('/delete/:delType', async function(req, res, next) {
  setHeader(res);
  
  var { delType } = req.params;
	
	await M_DoctorType.deleteOne({name: delType});
    //console.log("Data deleted"); // Success
	sendok(res, "1 doctor type deleted");

});

router.get('/list', async function(req, res, next) {
  setHeader(res);
  
	
	let allTypes = await M_DoctorType.find({}).sort({name: 1});
	sendok(res, allTypes);
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;