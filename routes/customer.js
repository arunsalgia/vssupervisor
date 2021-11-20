var router = express.Router();
const { MathDenominator } = require('docx');
const { 
	checkDate,
	dbToSvrText,
	svrToDbText,
	generateOrder,
	akshuClearCustomer,
	akshuGetCustomer,
	akshuAddCustomer,
	akshuUpdateCustomer,
	akshuGetAllCustomer,
	rechargeCount,
} = require('./functions');

const { sendExpirySms, generateSMSLogs, 
	akshuGetSmsLog, akshuUpdSmsLog,
	fast2SmsSendFestival, fast2SmsSendBirthday, sendReminderSms,
} = require("./sms");

const { hasSubscribed  } = require("./addon");
const { getAllPatients  } = require("./patient");


const EARLYMORNINGSCHEDULEAT=0;
const MORNINGSCHEDULEAT=7;
const AFTERNOONSCHEDULEAT=15;

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list', async function(req, res, next) {
  setHeader(res);
	let rec = await akshuGetAllCustomer();
	//console.log(rec);
	sendok(res, rec);
}); 

router.get('/getinfo/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await akshuGetCustomer(cid);
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
	akshuAddCustomer(rec);
	sendok(res, rec);
});

router.get('/update/:custData', async function(req, res, next) {
  setHeader(res);
	var {custData} = req.params;
	
	custData = JSON.parse(custData);
	//console.log(custData);

	let oldName = "";
	let rec = null;

	if (custData.customerNumber > 0) {
		rec = await M_Customer.findOne({customerNumber: custData.customerNumber});
		if (!rec) return senderr(res, 601, "Customer record not found");
		oldName = rec.name;
	} else {
		let tmp = await M_Customer.find({}, {_id: 0, customerNumber: 1}).limit(1).sort({customerNumber: -1});
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

	if (oldName !== "")
		akshuUpdateCustomer(rec);
	else
		akshuAddCustomer(rec); 
	await rec.save();
	
	rec.email = dbToSvrText(rec.email);
	sendok(res, rec);
}); 

 
router.get('/setworkinghours/:cid/:workingHours', async function(req, res, next) {
  setHeader(res);
	var {cid, workingHours} = req.params;
	
	let rec = await akshuGetCustomer(cid);
	rec.workingHours = JSON.parse(workingHours);
	akshuUpdateCustomer(rec);
	sendok(res, rec);
})

router.get('/morning', async function(req, res, next) {
  setHeader(res);
	await doMorningSchedule();
	sendok(res, "Done");
})

router.get('/earlymorning', async function(req, res, next) {
  setHeader(res);
	await doEarlyMorningSchedule();
	sendok(res, "Done");
})

router.get('/afternoon', async function(req, res, next) {
  setHeader(res);
	await doAfternoonSchedule();
	sendok(res, "Done");
})

router.get('/test', async function(req, res, next) {
  setHeader(res);
	await doBirthdayWishes();
	sendok(res, "all birthday wishes");
});

async function doBirthdayWishes() {
	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	
	let allCustomers = await akshuGetAllCustomer();
	for(let ccc=0; ccc <allCustomers.length; ++ccc) {
		customerRec = allCustomers[ccc];
		cid = customerRec._id;
		console.log(cid);

		// find if customer has subscribed birthday  pack
		if (!hasSubscribed(cid, AddOnList.birthday)) continue;
		
		/*
		let allPatients = await M_Patient.find({
			cid: cid,
			"$expr": { 
				"$and": [
					{ "$eq": [ { "$dayOfMonth": "$dob" }, { "$dayOfMonth": today } ] },
					{ "$eq": [ { "$month"     : "$dob" }, { "$month"     : today } ] }
				]
			}
		});
		*/
		
		let allPatients = await M_Patient.find({
			cid: cid,
			"$expr": { 
				"$and": [
					{ "$eq": [ { "$dayOfMonth": "$dob" }, tDate ] },
					{ "$eq": [ { "$month"     : "$dob" }, tMonth+1 ] }
				]
			}
		});
		console.log(allPatients);
		if (allPatients.length === 0) continue;

		let customerSmsLog = await akshuGetSmsLog(cid, tMonth, tYear);
		for(let ppp=0; ppp<allPatients.length; ++ppp) {
			patRec = allPatients[ppp];

			// send sms wishes to patient
			if (patRec < 1000000000) {
				console.log("Mobile number not configured");
				continue;
			}
		
			fast2SmsSendBirthday(
				patRec.mobile, 
				BIRTHDAYGREETING,
				customerRec.clinicName,
			).
			then((body) => {
				if (body.return) {
					// send sms success
					++customerSmsLog.birthDayCount;
				}
			}).
			catch((error) => {
				console.log("Error sending message. ", error.status_code);
			})
		}
		akshuUpdSmsLog(customerSmsLog);
	}
}

async function doFestivalWishes() {
	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	
	let festRecord = await M_Festival.findOne({date: tDate, month: tMonth,  year: tYear});
	if (!festRecord) return;

	// today is festival. So find out all customers who have subscribed festial pack
	let allCustomers = await akshuGetAllCustomer();
	for(let ccc=0; ccc <allCustomers.length; ++ccc) {
		customerRec = allCustomers[ccc];
		cid = customerRec._id;

		// find if customer has subscribed festival pack
		if (!hasSubscribed(cid, AddOnList.Festival1)) continue;

		let customerSmsLog = await akshuGetSmsLog(cid, tMonth, tYear);
		// customer has subscribed. Now get all patient of this customer
		let allPatients = await getAllPatients(cid);
		for(let ppp=0; ppp<allPatients.length; ++ppp) {
			patRec = allPatients[ppp];

			// send sms wishes to patient
			if (patRec < 1000000000) {
				console.log("Mobile number not configured");
				continue;
			}
		
			fast2SmsSendFestival(
				patRec.mobile, 
				festRecord.greeting,
				customerRec.clinicName,
			).
			then((body) => {
				if (body.return) {
					// send sms success
					++customerSmsLog.festivalCount;
				}
			}).
			catch((error) => {
				console.log("Error sending message. ", error.status_code);
			})
		}
		akshuUpdSmsLog(customerSmsLog);
	}
}

async function doEarlyMorningSchedule() {
	/*
	In early monring.
	1) Close all investigation, viist etc. which are opened (i.e. number is MAGICNUMBER)
	2) On 1st of every month generate SMS Logs for all customer
	*/

	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	let allCustomers = await akshuGetAllCustomer();

	// STEP 1 ---> Create sms log records on 1st of every month
	if (tDate === 1) {
		await generateSMSLogs(allCustomers, tMonth, tYear);
	}

	// STEP 2 ---> all visits to be closed
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
	
	// STEP 3 ---> all investigation to be closed
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

	// STEP 4 ---> all treatment to be closed  (1 loop each for doctor type)
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
	if (tDate === 1) {
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

	// all over
}

async function doMorningSchedule() {
	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	//let allCustomers = await akshuGetAllCustomer();

	// early morning. send sms to patients whose appointment has expired
	// calculate Order (which is used for appointments)
	let todayOrder = generateOrder(tYear,  tMonth, tDate, 0, 0)

	// STEP 2 ---> any old pending appointment to be set as expired
	let allOldPendingAppts = await M_Appointment.find({visit: VISITTYPE.pending, order: {$lte: todayOrder} } );	
	//console.log(allOldPendingAppts);

	for(let i=0; i<allOldPendingAppts.length; ++i) {
		//console.log(allOldPendingAppts[i]);
		sendExpirySms(allOldPendingAppts[i].cid, allOldPendingAppts[i].pid, allOldPendingAppts[i].apptTime);
		allOldPendingAppts[i].visit = VISITTYPE.expired;
		allOldPendingAppts[i].save();
	}
	
	// birthday wished
	await doBirthdayWishes();

	// festival wishes
	await doFestivalWishes();
}



async function doAfternoonSchedule() {
	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	let tomorrow = new Date(tYear, tMonth, tDate+1)

	//let allCustomers = await akshuGetAllCustomer();

	// calculate Order (which is used for appointments)
	let todayOrder = await generateOrder(tYear,  tMonth, tDate, 0, 0)
	let tomorrowOrder = await generateOrder(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0);
	console.log(todayOrder, tomorrowOrder);
	
	// Next step. Send reminder those who have appointment today
	let all2morrowAppt = await M_Appointment.find({visit: 'pending', order: { $gte: todayOrder, $lt: tomorrowOrder } });
	//console.log(all2morrowAppt);

	for(let i=0; i<all2morrowAppt.length; ++i) {
		sendReminderSms(all2morrowAppt[i].cid, all2morrowAppt[i].pid, all2morrowAppt[i].apptTime);
	}	


}


cron.schedule('5 * * * *', async () => {	
	let today = new Date();
	console.log(today);
	let tHour = today.getHours();
	if (![EARLYMORNINGSCHEDULEAT, MORNINGSCHEDULEAT, AFTERNOONSCHEDULEAT].includes(tHour))
		return;

	let retry = 30;
	while (retry > 0) {
		if (db_connection) break;
		//await sleep(1000);	// sleep for 1 second
		--retry;
  }
	if (!db_connection) return;
	

	if (tHour === EARLYMORNINGSCHEDULEAT)
		doEarlyMorningSchedule();
	else if (tHour === MORNINGSCHEDULEAT)
		doMorningSchedule()
	else if (tHour === AFTERNOONSCHEDULEAT)
		doAfternoonSchedule();

	return;
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;