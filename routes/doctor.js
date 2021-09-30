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
	let rec = await M_Doctor.find({});
	sendok(res, rec);
});

/*
name: String,
	type: String,		// dentist, physician, orthopaedic
	clinicName: String,
	email: String,
	mobile: String,
	
	addr1: String,
	addr2: String,
	addr3: String,
	
	enabled:Boolean
*/

router.get('/test', async function(req, res, next) {
  setHeader(res);
	let rec = new M_Doctor();
	rec.name = "Dr. Ankit Salgia";
	rec.type = "Dentist";
	rec.clinicName = "Dr. Ankit Dental Clinic";
	rec.mobile = "9920301805";
	rec.addr1 = "Bonavneture";
	rec.addr2 = "Dahisar West";
	rec.addr3 = "Mumbai";
	rec.enabled = true;
	rec.save();
	
	rec = new M_Doctor();
	rec.name = "Dr. Krati Salgia";
	rec.type = "Dentist";
	rec.clinicName = "Salgia's Dental Clinic";
	rec.mobile = "8149849920";
	rec.addr1 = "Happy Home Society";
	rec.addr2 = "Dahisar West";
	rec.addr3 = "Mumbai";
	rec.enabled = true;
	rec.save();
	
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

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;