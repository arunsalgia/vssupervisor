var router = express.Router();
//original import { Document, Packer, Paragraph, TextRun } from "docx";
const { Document, Packer, Paragraph, TextRun, Header, Footer,
	AlignmentType,
 } = require("docx");

const { 
	getLoginName, getDisplayName,
	svrToDbText, dbToSvrText,
	getMaster, setMaster,
	base64ToString,
} = require('./functions'); 

const MYFONT="Arial";
const MYSIZE=12*2;


const str1by4 = String.fromCharCode(188)
const str1by2 = String.fromCharCode(189)
const str3by4 = String.fromCharCode(190)
let medQty=[];

function medStr(qtyNum) {
	if (qtyNum == 0) return "0";
	
	var retStr = (qtyNum >= 2) ? Math.floor(qtyNum / 2).toString() : "";

	switch (qtyNum % 2) 
	{
		case 1: retStr += str1by2; break;
	}
	return retStr;
}

function setMedQty(num) {
	if (medQty.length == 0) {
		for(let i=0; i<=20; ++i) {
			medQty.push({num: i, str: medStr(i)});
		}
	}
	//console.log(medQty);
	return medQty[num].str;
}


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
  next('route');
});


function decodeVisitInfo(jsonData) {
	let myData = JSON.parse(jsonData);

	// convert base64 to string
	for(let i=0; i<myData.visit.medicines.length; ++i) {
		myData.visit.medicines[i].name = base64ToString(myData.visit.medicines[i].name);
	}
	for(let i=0; i<myData.visit.userNotes.length; ++i) {
		myData.visit.userNotes[i].name = base64ToString(myData.visit.userNotes[i].name);
	}
	for(let i=0; i<myData.visit.remarks.length; ++i) {
		myData.visit.remarks[i].name = base64ToString(myData.visit.remarks[i].name);
	}
	return myData;
}

router.get('/printdoc/:cid/:jsonData', async function(req, res, next) {
  setHeader(res);
	var {cid, jsonData } = req.params;
	
	let myData = decodeVisitInfo(jsonData);
	console.log(myData);

	let xxx = myData.visit;
	
	pRec = await getPatient({cid: cid, pid: xxx.pid});
	//console.log(pRec);
	
	// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
	// This simple example will only contain one section
	
	let allPara = [];
	let text = [];
	let pata = [];
	
	// leave initial few lines for header
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());

	// Write date 
	text = [];
	text.push(normalText("Date: "));
	text.push(boldText(dateString(xxx.visitDate)));
	allPara.push(rightAlignedPara(text));
	
	// give 2 blank lines
	allPara.push(blankLine());
	allPara.push(blankLine());

	text = [];
	text.push(normalText("Patient Id:\t\t"));
	text.push(boldText(pRec.pid.toString()));
	allPara.push(normalPara(text));
	allPara.push(blankLine());
	
	text = [];
	text.push(normalText("Patient Name:\t"));
	text.push(boldText(pRec.displayName));
	allPara.push(normalPara(text));	
	allPara.push(blankLine());
	
	text = [];
	text.push(normalText("Age / Gender:\t"));
	if (pRec.age > 0) {
		text.push(boldText(pRec.age.toString()));
		text.push(normalText(" / "));
		text.push(boldText(pRec.gender));
	}
	allPara.push(normalPara(text));
	
		// give blank lines
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	// Medicines start here
	text = [];
	text.push(boldUnderlineText("Medicines:"));
	allPara.push(normalPara(text));
	allPara.push(blankLine());
	
	for(let i=0; i<xxx.medicines.length; ++i) {
		allPara.push(medicinePara(xxx.medicines[i]));
		allPara.push(blankLine());
	}
	
	// medicines over
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	// notes start here
	let allNotes = xxx.userNotes.filter(x => x.name.trim() !== "");
	if (allNotes.length > 0) {
		text = [];
		text.push(boldUnderlineText("Advice:"));
		allPara.push(normalPara(text));
		allPara.push(blankLine());
		
		for(let i=0; i<allNotes.length; ++i) {
			allPara.push(notesPara(allNotes[i]));
			//allPara.push(blankLine());
		}
	}
	// advice over
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	// test to be taken starts here
	let allTest = xxx.remarks.filter(x => x.name.trim() !== "");
	if (allTest.length > 0) {
		text = [];
		text.push(boldUnderlineText("Test to be taken for next visit:"));
		allPara.push(normalPara(text));
		allPara.push(blankLine());
		
		for(let i=0; i<allTest.length; ++i) {
			allPara.push(testPara(allTest[i]));
			//allPara.push(blankLine());
		}
	}
	// test  over
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	//next review
	let reviewDate = new Date();
	
	switch (myData.nextVisit.unit.substr(0,1).toUpperCase()) {
		case "D": reviewDate.setDate(reviewDate.getDate() + myData.nextVisit.after); break;
		case "W": reviewDate.setDate(reviewDate.getDate() + (7*myData.nextVisit.after)); break;
		case "M": reviewDate.setMonth(reviewDate.getMonth() + myData.nextVisit.after); break;
		case "Y": reviewDate.setYear(reviewDate.getFullYear() + myData.nextVisit.after); break;
	}
	//console.log(reviewDate);
	
	let myDate = reviewDate.getDate();
	let myMonth = reviewDate.getMonth();
	++myMonth;	// (change 0-11 to 1-12)
	let myYear = reviewDate.getFullYear();
	
	let dateStr = "";
	dateStr += ((myDate < 10) ? "0" : "") + myDate.toString() + " / ";
	dateStr += ((myMonth < 10) ? "0" : "") + myMonth.toString()+ " / ";
	dateStr += myYear.toString();
	
	text = [];
	text.push(boldText("Next review: "));
	text.push(boldText(dateStr));
	allPara.push(normalPara(text));
	
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	text = [];
	text.push(boldText("Dr. Arun Salgia"+"   "));
	allPara.push(rightAlignedPara(text));
	
	
	const visitDoc = new Document({
		sections: [{
			properties: {}, 
			children: allPara,
			/*
			footers: {
				default: new Footer({ 
						children: [boldText("Arun Salgia"),],
				}),
        },
			*/
		}]
	});
	
	// Used to export the file into a .docx file
	Packer.toBuffer(visitDoc).then((buffer) => {
			fs.writeFileSync("./temp/patientVisit.docx", buffer);
	});
		
	sendok(res, xxx);
});



router.get('/updatenewvisit/:cid/:visitNumber/:visitInfo', async function(req, res, next) {
  setHeader(res);
  var {cid, visitNumber, visitInfo} = req.params;
	let updatefirstTime = false;
	
	console.log(visitNumber);
	let tmp = JSON.parse(visitInfo);
	let info = tmp.visit;
	//let apptRec = tmp.appointment;
	let nextVisitInfo =  tmp.nextVisit;
	console.log(Number(visitNumber));

	// just check if already exists
	let myRec = await M_Visit.findOne({cid: cid, pid: info.pid, visitNumber: Number(visitNumber)});
	console.log(myRec);
	if (!myRec) {
		updatefirstTime = true;
		console.log("1st time update");
		// updating 1st time
		myRec = new M_Visit({ 
		enabled: true,
		cid: cid,
		pid: info.pid,
		displayName: info.displayName,
		visitDate: '',
		visitNumber: 0,
		medicines: [],
		remarks: [],
		userNotes: [],
		appointment: '',
		});
	} else {
		console.log("Already there");
	}
	
	// common update
	myRec.pid = info.pid;
	myRec.visitDate = info.visitDate;
	myRec.visitNumber = Number(visitNumber);	
	myRec.medicines = info.medicines;
	myRec.remarks = info.remarks;
	myRec.userNotes = info.userNotes;

	console.log(myRec);
	
	// now check for appt
	let apptRec;
	if (updatefirstTime) {
		let allPending = await M_Appointment.find({cid: cid, pid: info.pid, visit: VISITTYPE.pending}).sort({order: 1}).limit(1);
		if (allPending.length === 0) {
			let today = new Date();
			let myYear = today.getFullYear();
			let myMonth = today.getMonth();
			let myDate = today.getDate();
			let myHour = today.getHours();
			let myMin = today.getMinutes();
			
			let myOrder = ((myYear * 100) + myMonth)*100 + myDate;
			myOrder = (myOrder*100 + myHour) * 100 + myMin;
			console.log("myOrder", myOrder);
			
			apptRec =  new M_Appointment();
			apptRec.cid = cid;
			//apptRec.data = newData.data;
			apptRec.apptTime  = today;
			apptRec.order = myOrder;
			
			//apptRec.pid = newData.data.pid;
			apptRec.pid = myRec.pid;
			apptRec.displayName = myRec.displayName
			
			apptRec.date = myDate;
			apptRec.month = myMonth;
			apptRec.year = myYear;	
			apptRec.hour = myHour;
			apptRec.minute = myMin;
			
		} else {
			//apptRec = await M_Appointment.findOne({_id: apptRec._id});
			apptRec = allPending[0];
		}
		apptRec.visit = myRec._id;
		await apptRec.save();
		myRec.appointment = apptRec._id;
		await myRec.save();
	} 
	
	
	
	
	// now save both appt and visit. now update next visit
	
	// next visit date 
	let myNextVisit = new Date();
	console.log(myNextVisit);
	switch (nextVisitInfo.unit.substr(0, 1).toUpperCase()) {
		case 'D' : myNextVisit.setDate(myNextVisit.getDate()+nextVisitInfo.after);  break;
		case 'W' : myNextVisit.setDate(myNextVisit.getDate()+(7*nextVisitInfo.after));  break;
		case 'M' : myNextVisit.setMonth(myNextVisit.getMonth()+nextVisitInfo.after);  break;
		case 'Y' : myNextVisit.setYear(myNextVisit.getFullYear()+nextVisitInfo.after);  break;
	}
	console.log(myNextVisit);
	console.log(myNextVisit);
	
	// update next visit 
	let newNext;
	if (updatefirstTime) {
		// update previous pending visit to over with new time
		let prevVisit = await M_NextVisit.findOne({cid: myRec.cid, pid: myRec.pid, status: VISITTYPE.pending});
		if (prevVisit) {
			prevVisit.visitDate = new Date(myRec.visitDate);
			prevVisit.status = VISITTYPE.over;
			prevVisit.save()
		}
		newNext = new M_NextVisit();
		newNext.cid = myRec.cid;
		newNext.pid = myRec.pid;
		newNext.displayName = myRec.displayName;
		newNext.status = VISITTYPE.pending;
		newNext.nextVisit = myNextVisit;
		await newNext.save();
	} else {
		newNext = await M_NextVisit.findOne({cid: myRec.cid, pid: myRec.pid, status: VISITTYPE.pending});
		newNext.nextVisit = myNextVisit;
		await newNext.save();
	}
	sendok(res, myRec);
});


router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
	var {cid, pid} = req.params;
	
	//console.log(cid, pid)
	let allRecs = await M_Visit.find({cid: cid, pid: Number(pid)}).sort({visitNumber: -1});
	//console.log(allRecs);
	sendok(res, allRecs);
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  
	var {cid} = req.params;
	
	let allRecs = await M_Visit.find({cid: cid}).sort({visitNumber: -1});
	//_.sortBy(allRecs, 'visitNumber');
	//console.log(allRecs);
	sendok(res, allRecs);
});



router.get('/nextVisit/list/:cid', async function(req, res, next) {
  setHeader(res);
  var {cid,} = req.params;
	let allRecs = await M_NextVisit.find({cid: cid}).sort({nextVisit: 1});
	sendok(res, allRecs);

});

router.get('/downloadvisit', async function (req, res) {
  setHeader(res);
  console.log("in downloaf");
  
  let myFile = process.cwd() + "/temp/patientVisit.docx";		// getFileName(pname, myProduct[0].versionNumber, ptype);
  console.log(myFile);

  if (fs.existsSync(myFile)) {
    res.contentType("application/docx");
    await res.status(200).sendFile(myFile);
  } else
    senderr(res, 601, "Doc not found");  
})

async function getPatient(filter) {
	var pRec =  await M_Patient.findOne(filter);
	return pRec;
}

function digit2(num) {
	let tmp = "00"+num;
	return tmp.substr(tmp.length-2, 2);
}

const SPACE = "                                                                                        ";

function fixedString(xxx, num) {
	let bal= num - xxx.length;
	if (bal > 0 )
		xxx += SPACE.substr(0, bal);
	return xxx;
}

function dateString(dddstr) {
	let xxx = dddstr.split(" ");
	return xxx[2] + " / " + xxx[1] + " / " + xxx[3];
}

function normalText(txt) {
	let tmp = new TextRun({font: MYFONT, size: MYSIZE, text: txt });
	return tmp;
}

function boldText(txt) {
	let tmp = new TextRun({font: MYFONT, size: MYSIZE, text: txt, bold: true, });
	return tmp;
}

function boldUnderlineText(txt) {
	let tmp = new TextRun({font: MYFONT, size: MYSIZE, text: txt, bold: true, underline: {type: "single",}});
	return tmp;
}


function blankLine() {
	let para = new Paragraph({children: [new TextRun(""),],});
	return para;				
}

function normalPara(text) {
	let para = new Paragraph({children: text});
	return para;
}
						
function boldBulletPara(text) {
	//console.log(text);
	let para = new Paragraph({
		children: [boldText(text), ],
		//text: text,
		//font: MYFONT, 
		//size: MYSIZE,
		//bold: true,
		bullet: {level: 0 }, //How deep you want the bullet to be 
	})
	return para;
}

function normalBulletPara(text) {
	//console.log(text);
	let para = new Paragraph({
		children: [normalText(text), ],
		//text: text,
		//font: MYFONT, 
		//size: MYSIZE,
		//bold: true,
		bullet: {level: 0 }, //How deep you want the bullet to be 
	})
	return para;
}

function rightAlignedPara(text) {
	let para = new Paragraph({children: text, alignment: AlignmentType.RIGHT,});
	return para;
}

//{name: 'Crocin',  dose1: 3, dose2: 2, dose3: 4, time: 7, unit: "Day(s)"}
function medicinePara(med) {
	//console.log(med);
	let tmp = 	med.name + "  ";			// fixedString(med.name,30);
	tmp += setMedQty(med.dose1)+" -- "+setMedQty(med.dose2)+" -- "+setMedQty(med.dose3)+"  ";
	tmp += "for "+med.time+" "+med.unit + "(s)";
	return normalBulletPara(tmp);
}

function notesPara(note) {
	let tmp = note.name;			// fixedString(note.name,30);
	return normalBulletPara(tmp);
}

function testPara(test) {
	let tmp = test.name;			// fixedString(note.name,30);
	return normalBulletPara(tmp);
}

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;