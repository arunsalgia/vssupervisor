const { akshuGetCustomer } = require("./functions");

var smsRouter = express.Router();


async function fast2SmsSendAppointment(destMobile, docName, clinicName, apptDateStr, clinicMobile) {

	let myParams = `${docName}|${clinicName}|${apptDateStr}|${clinicMobile}`;
	
	var f2s = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

	let queryMsg = {
		"authorization": process.env.FAST2SMSKEY,
		"sender_id": process.env.APPTHDR,
		"message": Number(process.env.APPTMSG),
		"variables_values": myParams,
		"route": "dlt",
		"numbers": destMobile
	};

	console.log(queryMsg);
	f2s.query(queryMsg);


	f2s.headers({
		"cache-control": "no-cache"
	});
	
	let retVal;
	
	let resp = await f2s.end();

	console.log(resp, resp.body, resp.status);
	retval = resp;
	

	return retVal;

}

async function fast2SmsSendExpiry(destMobile, docName, clinicName, clinicMobile) {

	let myParams = `${docName}|${clinicName}|${clinicMobile}`;
	
	var f2s = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

	let queryMsg = {
		"authorization": process.env.FAST2SMSKEY,
		"sender_id": process.env.EXPRHDR,
		"message": Number(process.env.EXPRMSG),
		"variables_values": myParams,
		"route": "dlt",
		"numbers": destMobile
	};

	console.log(queryMsg);
	f2s.query(queryMsg);


	f2s.headers({
		"cache-control": "no-cache"
	});
	
	let retVal;
	
	await f2s.end(function (resp) {
		console.log(resp.body);
		retval = resp.body;
	});

	return retVal;

}

let arun_smsconfig=[];
let arun_smslog=[];

function makeDateTimeString(dStr) {
	let d = new Date(dStr)
	let retStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()} ${HOURSTR[d.getHours()]}:${MINUTESTR[d.getMinutes()]}`;
	return retStr
}

function akshuClearSmsConfig() {
  arun_smsconfig = [];
}


function getBlankSmsLog(cid, month, year) {
	let tmpRec = new M_SmsLog({
		cid: cid,
		month: month,
		year: year,
		bulkSmsCount: 0,
		birthDayCount: 0,
		festivalCount: 0,
	})
	console.log("Rec is", tmpRec);
	return tmpRec;
}

function akshuGetSMSLogInternal(cid, month, year)  {
	let retUser = arun_smslog.find(function(post) { if ((post.cid === cid ) && (post.month === month) && (post.year === year)) return true; });
	if (retUser) return retUser;
	retUser =  getBlankSmsLog(cid, month, year)
	retUser.save();
	arun_smslog.push(retUser);
	//console.log("in internal");
	return retUser
}

async function akshuGetSmsLog(cid, month, year) {
	if (arun_smslog.length === 0) {
    //console.log("A;; sms log  reading frmo database-------------------");
		docs = await M_SmsLog.find({month: month, year: year});
		//console.log(docs)
		//console.log("Cry Log babay");
		arun_smslog = docs;
		let retRec = akshuGetSMSLogInternal(cid, month, year);
		//console.log(retRec);
		return retRec;
	} else {
		return akshuGetSMSLogInternal(cid, month, year);
  }
  
} 


function getBlankSmsConfig(cid) {
	let tmpRec = new M_SmsConfig({
		cid: cid,
		bulkSmsPack: false,
		birthDayPack: false,
		festivalPack1: false,
		festivalPack2: false,
		festivalPack3: false
		})
	return tmpRec;
}


function akshuGetSMSConfigInternal(cid)  {
	let retUser = arun_smsconfig.find(function(post) { if(post.cid === cid) return true; });
	if (retUser) return retUser;
	retUser =  getBlankSmsConfig(cid)
	retUser.save();
	arun_smsconfig.push(retUser);
	//console.log("in internal");
	return retUser
}

async function akshuGetSMSConfig(cid) {
	if (arun_smsconfig.length === 0) {
    console.log("A;; sms config  reading frmo database-------------------");
		docs = await M_SmsConfig.find({});
		//console.log(docs)
		//console.log("Cry ---- babay");
		arun_smsconfig = docs;
		let retRec = akshuGetSMSConfigInternal(cid);
		//console.log(retRec);
		return retRec;
	} else {
		return akshuGetSMSConfigInternal(cid);
  }
  
} 


function akshuAddSmsConfig(cidData) {
  arun_smsconfig.push(cidData);
  cidData.save();;
} 

async function bulkBulkSmsSubscribed(cid) {
	let rec = await akshuGetSMSConfig(cid);
	return rec.bulkSmsPack;
}

async function birthdayPackSubscribed(cid) {
	let rec = await akshuGetSMSConfig(cid);
	return rec.birthDayPack;
}

async function birthdayFestivalPackSubscribed(cid) {
	let rec = await akshuGetSMSConfig(cid);
	return {pack1: rec.festivalPack1, pack2: festivalPack2, pack3: festivalPack3};
}

async function sendBirthdayGreeting(cid, patientRec) {
	if (await birthdayPackSubscribed(cid)) {
		console.log("birthday wish to "+patientRec.displayName);
	}
}

async function sendFestialGreeting(cid, patientRec) {
	let sts = await birthdayPackSubscribed(cid);

}

smsRouter.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

smsRouter.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await M_Info.find({cid: cid}, {_id: 0});
	console.log(rec);
	sendok(res, rec);
});

smsRouter.get('/getconfig/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await akshuGetSMSConfig(cid);
	console.log(rec);
	sendok(res, rec);
});

smsRouter.get('/setconfig/:cid/:smsData', async function(req, res, next) {
  setHeader(res);
	var {cid, smsData} = req.params;
	smsData = JSON.parse(smsData);

	let rec = await M_SmsConfig.findOne({cid: cid});
	if (!rec) {
		rec = new M_SmsConfig();
		rec.cid = cid;
	}
	rec.bulkSmsPack = smsData.bulkSmsPack;
	rec.birthDayPack = smsData.birthDayPack;
	rec.festivalPack1 = smsData.festivalPack1;
	rec.festivalPack2 = smsData.festivalPack2;
	rec.festivalPack3 = smsData.festivalPack3;
	rec.save();
	console.log(rec);
	akshuClearSmsConfig();

	sendok(res, rec);
});


smsRouter.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid} = req.params;
	
	let rec = await M_Info.findOne({cid: cid, pid: Number(pid)});
	console.log(rec);
	sendok(res, rec);
});

smsRouter.get('/update/:cid/:pid/:infoMsg', async function(req, res, next) {
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

smsRouter.get('/test/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
		let configrec = await sendAppointmentSms(cid, 'Arun', new Date());
		sendok(res, "ok");	
}); 

smsRouter.get('/delete/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {pid} = req.params;
	
	let rec = await M_Info.deleteOne({cid: cid, pid: Number(pid)});
	sendok(res, "done");
});

const defaultPatinetSms = 500;

async function sendAppointmentSms(cid, pid, apptTime) {
	// first find out if pastinet has mobile number
	let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}

	// find out how many sms sent by user this month
	let customerSmsLog = await akshuGetSmsLog(cid, todayMonth, todayYear);
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatinetSms) {
		// if default count has passed. CHeck if subscribed for bulk sms for patients
		let customerConfig = await akshuGetSMSConfig(cid);
		//console.log(customerConfig);
		if (!customerConfig.bulkSmsPack) {
			console.log("Buls Sms count Over");
			return;
		}
	}

	// now prepare to send SMS
	let customerRec = await akshuGetCustomer(cid);
	//console.log(customerRec);

	let resp = await fast2SmsSendAppointment(
		patRec.mobile, 
		customerRec.doctorName,
		customerRec.clinicName,
		makeDateTimeString(apptTime),
		customerRec.mobile
		);
	
	console.log("Output",resp);

	if (false) {
		++customerSmsLog.bulkSmsCount

	}
}


async function sendExpirySms(cid, pid) {
	// first find out if pastinet has mobile number
	let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}

	// find out how many sms sent by user this month
	let customerSmsLog = await akshuGetSmsLog(cid, todayMonth, todayYear);
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatinetSms) {
		// if default count has passed. CHeck if subscribed for bulk sms for patients
		let customerConfig = await akshuGetSMSConfig(cid);
		//console.log(customerConfig);
		if (!customerConfig.bulkSmsPack) {
			console.log("Buls Sms count Over");
			return;
		}
	}

	// now prepare to send SMS
	let customerRec = await akshuGetCustomer(cid);
	//console.log(customerRec);

	let resp = await fast2SmsSendExpiry(
		patRec.mobile, 
		customerRec.doctorName,
		customerRec.clinicName,
		customerRec.mobile
		);
	
	console.log("Output",resp);

	if (false) {
		++customerSmsLog.bulkSmsCount

	}
}



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.sendStatus(errcode).send(errmsg); }
function setHeader(res) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = {
	smsRouter,
	sendAppointmentSms,
	sendExpirySms,
}