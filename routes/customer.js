var router = express.Router();
const { 
	checkDate,
	dbToSvrText,
	svrToDbText,
} = require('./functions');

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list', async function(req, res, next) {
  setHeader(res);
	let rec = await M_Customer.find({});
	for(let i=0; i<rec.length; ++i) {
		rec[i].email = dbToSvrText(rec[i].email);
	}
	console.log(rec);
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

router.get('/update/:custData', async function(req, res, next) {
  setHeader(res);
	var {custData} = req.params;
	
	custData = JSON.parse(custData);
	console.log(custData);

	let oldName = "";
	let rec = null;
	if (custData.customerNumber > 0) {
		rec = await M_Customer.findOne({customerNumber: custData.customerNumber});
		if (!rec) return senderr(res, 601, "Customer record not found");
		oldName = rec.name;
	} else {
		let tmp = await M_Customer.find({}).limit(1).sort({customerNumber: -1});
		//console.log(tmp);
		rec = new M_Customer();
		rec.customerNumber = (tmp.length > 0) ? tmp[0].customerNumber+1 : 999;
	}

	rec.enabled = true;
	rec.name =  custData.name;
	rec.type = custData.type;
	rec.email = svrToDbText(custData.email)
	rec.mobile = custData.mobile;

	rec.doctorName = custData.doctorName;
	rec.clinicName = custData.clinicName;

	rec.addr1 = custData.addr1;
	rec.addr2 = custData.addr2;
	rec.addr3 = custData.addr3;

	rec.location = custData.location;
	rec.pinCode = custData.pinCode;

	rec.commission = custData.commission;
	rec.referenceCid = custData.referenceCid;

	rec.welcomeMessage = custData.welcomeMessage;
	rec.plan = custData.plan;
	rec.fee = custData.fee;

	//console.log(custData.expiryDate);
	let d = new Date(custData.expiryDate);
	//console.log(d);

	rec.expiryDate = d;

	// now create user

	
	await rec.save();

	rec.email = dbToSvrText(rec.email);
	sendok(res, rec);
});


router.get('/setworkinghours/:cid/:workingHours', async function(req, res, next) {
  setHeader(res);
	var {cid, workingHours} = req.params;
	
	let rec = await M_Customer.findOne({_id: cid});
	rec.workingHours = JSON.parse(workingHours);
	rec.save();
	sendok(res, rec);
})

router.get('/test', async function(req, res, next) {
  setHeader(res);
	let i, cNum;

	let allRecs = await M_Customer.find({})
	for(i=0,cNum=100; i<allRecs.length; ++i, ++cNum) {
		//allRecs[i].customerNumber = cNum;
		//allRecs[i].save();
		//console.log(allRecs[i]);
		allRecs[i].workingHours = [148, 149, 150];
		console.log(allRecs[i]);
		allRecs[i].save();
	}
	sendok(res, "working hours days done");
});

cron.schedule('5 0 * * *', async () => {	
	let retry = 30;
	while (retry > 0) {
		if (db_connection) break;
		//await sleep(1000);	// sleep for 1 second
		--retry;
  }
	if (!db_connection) return;
	
	let today = new Date();
	console.log(today);
		
	// STEP 1 ---> check if  expiry for any customer
	console.log("Check for expiry");
	let allCustomers = await M_Customer.find({});
	for(let i = 0; i < allCustomers.length; ++i) {
		let isExpired = checkDate(allCustomers[i].expiryDate);
		console.log(allCustomers[i].name, isExpired);
	}
	
	// STEP 2 ---> any old pending appointment to be set as expired
	//let myMon = today.getMonth();
	//let myDat = today.getDate();
	
	let chkOrder = ((today.getFullYear() * 100) + today.getMonth())*100 + today.getDate();
	console.log("Chkorder", chkOrder);
	chkOrder *= 100 * 100;
	//console.log(chkOrder);
	
	let allOldPendingAppts = await M_Appointment.find({visit: VISITTYPE.pending, order: {$lte: chkOrder} } );	
	for(let i=0; i<allOldPendingAppts.length; ++i) {
		allOldPendingAppts[i].visit = VISITTYPE.expired;
		allOldPendingAppts[i].save();
		//console.log(allOldPendingAppts[i].apptTime, allOldPendingAppts[i].order);
	}
	
	// STEP 3 ---> all visits to be closed
	let allOpenVisits = await M_Visit.find({visitNumber: MAGICNUMBER});
	for(let i=0; i<allOpenVisits.length; ++i) {
		let visitRec = allOpenVisits[i];
		//console.log(visitRec);
		let countQuery = [
			{ $match: { cid: visitRec.cid, pid: visitRec.pid } },
			{ $group: { _id: '$pid', count: { $sum: 1 } } }
		];
		let countRec = await M_Visit.aggregate(countQuery)
		//console.log(countRec);
		visitRec.visitNumber = countRec[0].count;
		//console.log(visitRec);
		visitRec.save();
	}
	
	// STEP 4 ---> all investigation to be closed
	let allOpenInvest = await M_Investigation.find({investigationNumber: MAGICNUMBER});
	for(let i=0; i<allOpenInvest.length; ++i) {
		let investRec = allOpenInvest[i];
		let countQuery = [
			{ $match: { cid: investRec.cid, pid: investRec.pid } },
			{ $group: { _id: '$pid', count: { $sum: 1 } } }
		];
		let investCount = await M_Investigation.aggregate(countQuery)
		investRec.investigationNumber = investCount[0].count;
		investRec.save();
	}

	// STEP 5 ---> all treatment to be closed
	let allOpenTreat = await M_DentalTreatment.find({treatmentNumber: MAGICNUMBER});
	for(let i=0; i<allOpenTreat.length; ++i) {
		let myRec = allOpenTreat[i];
		let countQuery = [
			{ $match: { cid: myRec.cid, pid: myRec.pid } },
			{ $group: { _id: '$pid', count: { $sum: 1 } } }
		];
		let treatCount = await M_DentalTreatment.aggregate(countQuery)
		myRec.treatmentNumber = treatCount[0].count;
		myRec.save();
	}
	
	
	// Last Step ---> update age based on date of birth
	// will be done of 1st of every month
	if (today.getDate() === 1) {
		let todayTime = today.getTime();
		let allPatients = await M_Patient.find({});
		for(let i=0; i<allPatients.length; ++i) {
			if (allPatients[i].dob.getFullYear() !== 1900) {
				let timeDifference = Math.abs(todayTime - allPatients[i].dob.getTime())
				let differentYears = Math.round(timeDifference / (1000 * 3600 * 24 * 365));
				//console.log(allPatients[i].dob, differentYears);
				allPatients[i].age = differentYears;
			} else
				allPatients[i].age = 0;
			allPatients[i].save();
		}
	}
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;