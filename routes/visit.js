var router = express.Router();
//original import { Document, Packer, Paragraph, TextRun } from "docx";
const { Document, Packer, Paragraph, TextRun, Header, Footer,
	AlignmentType,
 } = require("docx");

const { 
	getLoginName, getDisplayName,
	svrToDbText, dbToSvrText,
	getMaster, setMaster,
} = require('./functions'); 

const MYFONT="Arial";
const MYSIZE=12*2;
const str1by4 = String.fromCharCode(188)
const str1by2 = String.fromCharCode(189)
const str3by4 = String.fromCharCode(190)
let medQty=[];

function medStr(qtyNum) {
	if (qtyNum == 0) return "0";
	
	var retStr = (qtyNum >= 4) ? Math.floor(qtyNum / 4).toString() : "";

	switch (qtyNum % 4) 
	{
		case 1: retStr += str1by4; break;
		case 2: retStr += str1by2; break;
		case 3: retStr += str3by4; break;
	}
	return retStr;
}

function setMedQty(num) {
	if (medQty.length == 0) {
		for(let i=0; i<=20; ++i) {
			medQty.push({num: i, str: medStr(i)});
		}
	}
	return medQty[num].str;
}


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});


router.get('/doc', async function(req, res, next) {
  setHeader(res);
	let xxx = new M_Visit();
	xxx.pid = 20210830001; 
	xxx.visitNumber = 1;
	xxx.visitDate = new Date();
	xxx.medicines = [
		{name: 'Crocin',  dose1: 3, dose2: 2, dose3: 4, time: 7, unit: "Day(s)"}, 
		{name: 'Gelucil', dose1: 5, dose2: 0, dose3: 6, time: 2, unit: "Weeks(s)"}];
	xxx.userNotes = ["Note1", "Note2"];
	xxx.remarks = ["Rem1", "Rem2"];
	xxx.enabled = true;
	
	pRec = await getPatient({pid: xxx.pid});
	//console.log(pRec);
	
	// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
	// This simple example will only contain one section
	let allPara = [];
	let text = [];
	let pata = [];
	
	// Write date 
	text = [];
	text.push(normalText("Date: "));
	text.push(boldText(dateString(xxx.visitDate)));
	allPara.push(rightAlignedPara(text));
	
	// give 2 blank lines
	allPara.push(blankLine());
	allPara.push(blankLine());

	text = [];
	text.push(normalText("Patient: "));
	text.push(boldText(pRec.displayName));
	text.push(normalText("    "+pRec.age+pRec.gender.substr(0,1)));
	allPara.push(normalPara(text));
	
	
	// give 2 blank lines
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	for(let i=0; i<xxx.medicines.length; ++i) {
			allPara.push(medicinePara(xxx.medicines[i]));
	}
	
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
	
	console.log(visitNumber);
	let tmp = JSON.parse(visitInfo);
	let info = tmp.visit;
	let apptRec = tmp.appointment;
	console.log(Number(visitNumber));

	// just check if already exists
	let myRec = await M_Visit.findOne({cid: cid, pid: info.pid, visitNumber: info.visitNumber});
	console.log(myRec);
	if (!myRec) {
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
	if (apptRec === null) {
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
		apptRec = await M_Appointment.findOne({_id: apptRec._id});
	}
	
	myRec.appointment = apptRec._id;
	apptRec.visit = myRec._id;
	
	myRec.save();
	apptRec.save();
	
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
	return xxx[2]+"/"+xxx[1]+"/"+xxx[3];
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
//underline({type="single", color=null})

function blankLine() {
	let para = new Paragraph({children: [new TextRun(""),],});
	return para;				
}

function normalPara(text) {
	let para = new Paragraph({children: text});
	return para;
}
						
function bulletPara(text) {
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

function rightAlignedPara(text) {
	let para = new Paragraph({children: text, alignment: AlignmentType.RIGHT,});
	return para;
}

//{name: 'Crocin',  dose1: 3, dose2: 2, dose3: 4, time: 7, unit: "Day(s)"}
function medicinePara(med) {
	let tmp = fixedString(med.name,30);
	tmp += setMedQty(med.dose1)+"-"+setMedQty(med.dose1)+"-"+setMedQty(med.dose1)+"\t\t";
	tmp += "for "+med.time+" "+med.unit;
	return bulletPara(tmp);
}

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;