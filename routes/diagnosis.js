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
	
	let allRecs = await M_Diagnosis.find({cid: cid}, {name: 1, _id: 0}).sort({name: 1});
	//for(let i=0; i<allRecs.length; ++i) {
	//	allRecs[i].name = stringToBase64(allRecs[i].name);
	//}
	//console.log(allRecs);
	sendok(res, allRecs);
});


router.post('/update/:cid/:infoMsg', async function(req, res, next) {
  setHeader(res);
  var {cid, infoMsg} = req.params;
	let lInfo = getLoginName(infoMsg);
	
	let myRec = await M_Diagnosis.findOne({cid: cid, id: lInfo});
	if (!myRec) {
		// updating 1st time
		myRec = new M_Diagnosis();
		myRec.id = lInfo;
		myRec.enabled = true;
		myRec.cid = cid;
	};
	myRec.name = infoMsg
	//console.log(myRec);
	myRec.save();
	
	sendok(res, myRec);
});

router.post('/delete/:cid/:infoMsg', async function(req, res, next) {
  setHeader(res);
	var {cid, infoMsg} = req.params;
	let lInfo = getLoginName(infoMsg);
	
	await M_Diagnosis.deleteOne({cid: cid, id: lInfo});

	sendok(res, "done");
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;