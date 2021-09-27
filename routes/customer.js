var router = express.Router();


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
	let i;
	
	// all medicine
	let allRecs = await M_Medicine.find({})
	for(i=0; i<allRecs.length; ++i) {
		allRecs[i].cid = "613dd7074e86491f500862e7";
		allRecs[i].save();
	}
	
	// all patient
	allRecs = await M_Patient.find({})
	for(i=0; i<allRecs.length; ++i) {
		allRecs[i].cid = "613dd7074e86491f500862e7";
		allRecs[i].save();
	}
	
	// all visit
	allRecs = await M_Visit.find({})
	for(i=0; i<allRecs.length; ++i) {
		allRecs[i].cid = "613dd7074e86491f500862e7";
		allRecs[i].save();
	}
	
	// all holiday
	allRecs = await M_Holiday.find({})
	for(i=0; i<allRecs.length; ++i) {
		allRecs[i].cid = "613dd7074e86491f500862e7";
		allRecs[i].save();
	}
	
	
	// all appointment
	allRecs = await M_Appointment.find({})
	for(i=0; i<allRecs.length; ++i) {
		allRecs[i].cid = "613dd7074e86491f500862e7";
		allRecs[i].save();
	}
	
	// all info
	allRecs = await M_Info.find({})
	for(i=0; i<allRecs.length; ++i) {
		allRecs[i].cid = "613dd7074e86491f500862e7";
		allRecs[i].save();
	}
	
	sendok(res, "done");
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;