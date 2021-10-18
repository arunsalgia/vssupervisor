var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await M_Treattype.find({cid: cid}, {_id: 0}).sort({name: 1});
	//console.log(rec);
	sendok(res, rec);
});


router.post('/add/:cid/:infoMsg', async function(req, res, next) {
  setHeader(res);
  var {cid, infoMsg} = req.params;

	let id = getLoginName(infoMsg);
	// just check if already exists
	let myRec = await M_Treattype.findOne({cid: cid, id: id});
	if (myRec) return senderr(res, 601, "Duplicate entry");
	

	myRec = new M_Treattype();
	myRec.id = id;
	myRec.cid = cid;
	myRec.enable = true;
	myRec.name = infoMsg
	myRec.save();
	
	sendok(res, myRec);
});

router.post('/delete/:cid/:infoMsg', async function(req, res, next) {
  setHeader(res);
	var {cid, infoMsg} = req.params;
	
	let id = getLoginName(infoMsg);
	await M_Treattype.deleteOne({cid: cid, id: id});
	sendok(res, "done");
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;