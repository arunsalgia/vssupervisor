//var smsRouter = express.Router();
const { akshuGetCustomer, getNextVisit,
 } = require("./functions");

 const { getPatientByPid  } = require("./patient");
 const { hasSubscribed  } = require("./addon");

 function makeDateTimeString(dStr) {
	let d = new Date(dStr)
	let retStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()} ${HOURSTR[d.getHours()]}:${MINUTESTR[d.getMinutes()]}`;
	return retStr
}


 let headerIdList = [];
 let messageIdList = [];
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


 let arun_smslog=[];

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

async function loadSmsLog() {
	let hasData = false;
	let t = new Date();

	if (arun_smslog.length > 0) 
	if ((arun_smslog[0].month == t.getMonth()) && (arun_smslog[0].year == t.getFullYear()))
			hasData = true;
	
	if (!hasData)
		arun_smslog = await M_SmsLog.find({month: t.getMonth(), year: t.getFullYear()});
}


 async function generateSMSLogs(cstomerList, month, year) {
	let tmpLIst = [];
	for(let i=0; i<cstomerList.length; ++i) {
		let tmpRec = await M_SmsLog.findOne({cid: cstomerList[i]._id, month: month, year: year});
		if (!tmpRec) {
			tmpRec = getBlankSmsLog(cstomerList[i]._id, month, year);
			tmpRec.save();
		}
		tmpLIst.push(tmpRec);
	}
	arun_smslog = tmpLIst;
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

async function fast2SmsReminder(destMobile, docName, clinicName, apptDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${apptDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[4], messageIdList[4], myParams, destMobile);
	return status;
}


async function fast2SmsSendFestival(destMobile, greeting, clinicName) {
	let myParams = `${greeting}|${clinicName}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[5], messageIdList[5], myParams, destMobile);
	return status;
}

async function fast2SmsSendBirthday(destMobile, greeting, clinicName) {
	let myParams = `${greeting}|${clinicName}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[6], messageIdList[6], myParams, destMobile);
	return status;
}



async function akshuGetSmsLog(cid, month, year) {
	await loadSmsLog()
	let tmpRec = arun_smslog.find(x => x.cid == cid && x.month == month && x.year == year);
	if (!tmpRec) {
		console.log("Should come for new customer only");
		tmpRec = getBlankSmsLog(cid, month, year);
		tmpRec.save();
		arun_smslog.push(tmpRec);
	}
	return tmpRec;
} 

function akshuUpdSmsLog(rec) {
	arun_smslog = arun_smslog.filter(x => x.cid !== rec.cid);
	arun_smslog.push(rec);
	rec.save();
} 



async function sendAppointmentSms(cid, pid, apptTime) {
	// first find out if patinet has mobile number
	//let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	let patRec = await getPatientByPid(cid, pid);
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
		if (!hasSubscribed(cid, AddOnList.bulk)) {
			console.log("Deafult Sms count Over");
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

async function sendExpirySms(cid, pid, apptTime) {
	// first find out if pastinet has mobile number
	//let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	let patRec = await getPatientByPid(cid, pid);
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}

	// find out how many sms sent by user this month
	let t = new Date();
	let customerSmsLog = await akshuGetSmsLog(cid, t.getMonth(), t.getFullYear());
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatientSms) {
		if (!hasSubscribed(cid, AddOnList.bulk)) {
			console.log("Default Sms count Over");
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

async function sendFestivalSms(customerRec, patRec, festRecord) {
	// first find out if pastinet has mobile number
	//let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	//	let patRec = await getPatientByPid(cid, pid);
	
}


async function sendVisitSms(cid, pid, nextVisitTime, nextVisitUnit) {
	// first find out if patinet has mobile number
	//let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	let patRec = await getPatientByPid(cid, pid);
	if (patRec < 1000000000) {
		console.log("Mobile number not configured");
		return;
	}

	// find out how many sms sent by user this month
	let t = new Date();
	let customerSmsLog = await akshuGetSmsLog(cid, t.getMonth(), t.getFullYear());
	//console.log(customerSmsLog);
	if (customerSmsLog.bulkSmsCount >= defaultPatientSms) {
		if (!hasSubscribed(cid, AddOnList.bulk)) {
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
	// first find out if patinet has mobile number
	//let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	let patRec = await getPatientByPid(cid, pid);
	//console.log(patRec);

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
		if (!hasSubscribed(cid, AddOnList.bulk)) {
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

async function sendReminderSms(cid, pid, apptTime) {
	// first find out if patinet has mobile number
	//let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	let patRec = await getPatientByPid(cid, pid);
	//console.log(patRec);

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
		if (!hasSubscribed(cid, AddOnList.bulk)) {
			console.log("Buls Sms count Over");
			return;
		}
	}

	// now prepare to send SMS
	let customerRec = await akshuGetCustomer(cid);
	//console.log(customerRec);

	fast2SmsReminder(
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

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = {
	// smsRouter,
	generateSMSLogs,
	sendAppointmentSms,
	sendExpirySms,
	sendVisitSms,
	sendCancelSms,
	sendReminderSms,
	fast2SmsSendFestival,
	fast2SmsSendBirthday,
	akshuGetSmsLog,
	akshuUpdSmsLog
}