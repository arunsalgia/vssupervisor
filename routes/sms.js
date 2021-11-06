var smsRouter = express.Router();
const { akshuGetCustomer, getNextVisit,
 } = require("./functions");

 let headerIdList = [];
 let messageIdList = [];
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


function getBlankSmsLog(cid, month, year) {
	let tmpRec = new M_SmsLog({
		cid: cid,
		month: month,
		year: year,
		bulkSmsCount: 0,
		birthDayCount: 0,
		festivalCount: 0,
	})
	return tmpRec;
}
 
function getSMSIds() {
	if (headerIdList.length === 0) {
		let tmp = process.env.HEADERID;
		headerIdList = tmp.split(",");
	}

	if (messageIdList.length === 0) {
		let tmp = process.env.MESSAGEID;
		tmp = tmp.split(",");
		for(let i=0; i<tmp.length; ++i) {
			messageIdList[i] = Number(tmp[i]);
		}
	}
}



async function fast2SmsSend(senderid, messageid, myParams, destMobile) {
	if (process.env.SENDSMS !== "TRUE") return {status_code: SENDSMSDISABLED};
	//if (messageid === 0) return {status_code: SENDSMSDISABLED+1};

	var f2s = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

	let queryMsg = {
		"authorization": process.env.FAST2SMSKEY,
		"sender_id": senderid,
		"message": Number(messageid),
		"variables_values": myParams,
		"route": "dlt",
		"numbers": destMobile
	};

	f2s.query(queryMsg);


	f2s.headers({
		"cache-control": "no-cache"
	});
	
	return new Promise((resolve, reject) => {
		f2s.end(function (response) {
			if (response.error) {
				return reject(response.body)
			}
			return resolve(response.body);
		});
	});
}

async function fast2SmsSendAppointment(destMobile, docName, clinicName, apptDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${apptDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[0], messageIdList[0], myParams, destMobile);
	return status;
}

async function fast2SmsSendExpiry(destMobile, docName, clinicName, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[1], messageIdList[1], myParams, destMobile);
	return status;
}




async function fast2SmsSendVisit(destMobile, docName, clinicName, visitDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${visitDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[2], messageIdList[2], myParams, destMobile);
	return status;
}

async function fast2SmsCancel(destMobile, docName, clinicName, cancelDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${cancelDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[3], messageIdList[3], myParams, destMobile);
	return status;
}

async function fast2SmsReminder(destMobile, docName, clinicName, cancelDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${cancelDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[4], messageIdList[4], myParams, destMobile);
	return status;
}




function akshuGetSMSLogInternal(cid, month, year)  {
	let retUser = arun_smslog.find(function(post) { if ((post.cid === cid ) && (post.month === month) && (post.year === year)) return true; });
	if (retUser) return retUser;
	retUser =  getBlankSmsLog(cid, month, year)
	retUser.save();
	arun_smslog.push(retUser);
	return retUser
}

async function akshuGetSmsLog(cid, month, year) {
	if (arun_smslog.length === 0) {
    //console.log("A;; sms log  reading frmo database-------------------");
		docs = await M_SmsLog.find({month: month, year: year});
		arun_smslog = docs;
		let retRec = akshuGetSMSLogInternal(cid, month, year);
		return retRec;
	} else {
		return akshuGetSMSLogInternal(cid, month, year);
  }
  
} 

function akshuUpdSmsLog(rec) {
	arun_smslog = arun_smslog.filter(x => x.cid !== rec.cid);
	arun_smslog.push(rec);
	rec.save();
} 


function akshuGetSMSConfigInternal(cid)  {
	let retUser = arun_smsconfig.find(function(post) { if(post.cid === cid) return true; });
	if (retUser) return retUser;
	retUser =  getBlankSmsConfig(cid)
	retUser.save();
	arun_smsconfig.push(retUser);
	return retUser
}

async function akshuGetSMSConfig(cid) {
	if (arun_smsconfig.length === 0) {
    console.log("A;; sms config  reading frmo database-------------------");
		docs = await M_SmsConfig.find({});
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



async function sendAppointmentSms(cid, pid, apptTime) {
	// first find out if pastinet has mobile number
	let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}
	// find out how many sms sent by user this month
	let d = new Date();
	let customerSmsLog = await akshuGetSmsLog(cid, d.getMonth(), d.getFullYear());
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatientSms) {
		// if default count has passed. CHeck if subscribed for bulk sms for patients
		let customerConfig = await akshuGetSMSConfig(cid);
		//console.log(customerConfig);
		if (!customerConfig.bulkSmsPack) {
			console.log("Bulk Sms count Over");
			// How to inform constomer
			return;
		}
	}

	// now prepare to send SMS
	let customerRec = await akshuGetCustomer(cid);
	//console.log("Customer",customerRec);

	fast2SmsSendAppointment(
		patRec.mobile, 
		customerRec.doctorName,
		customerRec.clinicName,
		makeDateTimeString(apptTime),
		customerRec.mobile
		).
		then((body) => {
				++customerSmsLog.bulkSmsCount;
				akshuUpdSmsLog(customerSmsLog);
			}).
		catch((error) => {
			console.log("Error sending message. ", error.status_code);
		})
}

async function sendExpirySms(cid, pid) {
	// first find out if pastinet has mobile number
	let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}

	// find out how many sms sent by user this month
	let t = new Date();
	let customerSmsLog = await akshuGetSmsLog(cid, t.getMonth(), t.getFullYear());
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatientSms) {
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

	fast2SmsSendExpiry(
		patRec.mobile, 
		customerRec.doctorName,
		customerRec.clinicName,
		makeDateTimeString(apptTime),
		customerRec.mobile
	).
	then((body) => {
		if (body.return) {
			// send sms success
			++customerSmsLog.bulkSmsCount;
			akshuUpdSmsLog(customerSmsLog);
		}
	}).
	catch((error) => {
		console.log("Error sending message. ", error.status_code);
	})
}

async function sendVisitSms(cid, pid, nextVisitTime, nextVisitUnit) {
	// first find out if pastinet has mobile number
	let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}

	// find out how many sms sent by user this month
	let t = new Date();
	let customerSmsLog = await akshuGetSmsLog(cid, t.getMonth(), t.getFullYear());
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatientSms) {
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

	let d = getNextVisit(nextVisitTime, nextVisitUnit);
	fast2SmsSendVisit(
		patRec.mobile, 
		customerRec.doctorName,
		customerRec.clinicName,
		makeDateTimeString(d),
		customerRec.mobile
	).
	then((body) => {
		if (body.return) {
			// send sms success
			++customerSmsLog.bulkSmsCount;
			akshuUpdSmsLog(customerSmsLog);
		}
	}).
	catch((error) => {
		console.log("Error sending message. ", error.status_code);
	})
}

async function sendCancelSms(cid, pid, cancelTime) {
	// first find out if pastinet has mobile number
	let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}

	// find out how many sms sent by user this month
	let t = new Date();
	let customerSmsLog = await akshuGetSmsLog(cid, t.getMonth(), t.getFullYear());
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatientSms) {
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

	fast2SmsCancel(
		patRec.mobile, 
		customerRec.doctorName,
		customerRec.clinicName,
		makeDateTimeString(cancelTime),
		customerRec.mobile
	).
	then((body) => {
		++customerSmsLog.bulkSmsCount;
		akshuUpdSmsLog(customerSmsLog);
	}).
	catch((error) => {
		console.log("Error sending message. ", error.status_code);
	})
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
	sendVisitSms,
	sendCancelSms,
}