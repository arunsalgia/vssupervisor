var router = express.Router();


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await M_Info.find({cid: cid}, {_id: 0});
	console.log(rec);
	sendok(res, rec);
});

router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid} = req.params;
	
	let rec = await M_Info.findOne({cid: cid, pid: Number(pid)});
	console.log(rec);
	sendok(res, rec);
});

router.get('/update/:cid/:pid/:infoMsg', async function(req, res, next) {
  setHeader(res);
  var {cid, pid, infoMsg} = req.params;

	// just check if already exists
	let myRec = await M_Info.findOne({cid: cid, pid: Number(pid)});
	if (!myRec) {
		// updating 1st time
		myRec = new M_Info();
		myRec.pid = Number(pid);
	};
	myRec.info = infoMsg
	myRec.save();
	
	sendok(res, myRec);
});

router.get('/delete/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {pid} = req.params;
	
	let rec = await M_Info.deleteOne({cid: cid, pid: Number(pid)});
	sendok(res, "done");
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;