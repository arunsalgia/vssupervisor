var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.post('/update/:cid/:pid/:newInfo', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pid, newInfo } = req.params;
	pid = Number(pid);
	newInfo = JSON.parse(newInfo);
	//console.log(newInfo.symptom);
	//console.log(newInfo.diagnosis);
  var iRec = await M_Treatment.findOne({cid: cid, pid: pid, treatmentNumber: 0});
  if (!iRec) {
		iRec = new M_Treatment();
		iRec.cid = cid;
		iRec.pid = pid;
		iRec.treatmentNumber = 0;
		iRec.enabled = true;
		iRec.save();
  }
	iRec.treatmentDate = new Date();
	iRec.treatment = newInfo.treatment;
	console.log(iRec);
	await iRec.save();
	sendok(res, 'Done');
});

router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
  var { cid, pid } = req.params;
	pid = Number(pid);
	
	let allRecs = await M_Treatment.find({cid: cid, pid: pid}).sort({treatmentNumber: -1})
	if (allRecs.length > 0) {
		if (allRecs[allRecs.length-1].treatmentNumber === 0) {	
			allRecs = [allRecs[allRecs.length-1]].concat(allRecs.slice(0, allRecs.length-1));
		}
	}
	console.log(allRecs);
	sendok(res, allRecs);
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;