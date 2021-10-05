require('dotenv').config()
express = require('express');
path = require('path');
cookieParser = require('cookie-parser');
logger = require('morgan');
mongoose = require("mongoose");
cors = require('cors');
fetch = require('node-fetch');
_ = require("lodash");
cron = require('node-cron');
nodemailer = require('nodemailer');
crypto = require('crypto');
Razorpay = require("razorpay");
//docx = require("docx");
fs = require('fs');
axios = require('axios');
multer = require('multer');


app = express();

PRODUCTION=(process.env.PRODUCTION.toUpperCase() === "TRUE");   
WEB=(process.env.WEB.toUpperCase() === "TRUE");   
console.log("Prod", PRODUCTION);
console.log("Web", WEB);

PASSWORDLINKVALIDTIME=10			// Password link valid time in minutes


//
BASELINK='http://localhost:3000';
if (PRODUCTION) {
	console.log("Using cloud  base  link");
  BASELINK='https://viraagdental.herokuapp.com';
} else {
	console.log("Using local base  link");
  BASELINK='http://localhost:3000';
}
console.log(BASELINK);
ARCHIVEDIR= (PRODUCTION) ? "public/" : "public/" ;       // binary will be stored here

PORT = process.env.PORT || 4000;
VISITTYPE = {pending: 'pending', cancelled: 'cancelled', over: 'over'};


http = require('http');
httpServer = http.createServer(app);
io = require('socket.io')(httpServer, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }

});

// Routers
router = express.Router();
indexRouter = require('./routes/index');
usersRouter = require('./routes/user');
medicineRouter = require('./routes/medicine');
patientRouter = require('./routes/patient');
visitRouter = require('./routes/visit');
holidayRouter = require('./routes/holiday');
appointmentRouter = require('./routes/appointment');
infoRouter = require('./routes/info');
quoteRouter = require('./routes/quote');
customerRouter = require('./routes/customer');
imageRouter = require('./routes/image');
walletRouter = require('./routes/wallet');
doctorRouter = require('./routes/doctor');

app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'MED', 'build')));
app.use(express.json());


app.use((req, res, next) => {
  if (req.url.includes("admin") || 
      req.url.includes("signIn") ||
      req.url.includes("Logout") ||
      req.url.includes("viraagdental")
    ){
    //req.url = "/";
    //res.redirect('/');
    console.log("Path is ", req.url);
    res.sendFile(path.resolve(__dirname, 'MED', 'build', 'index.html'));
  }
  else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/medicine', medicineRouter);
app.use('/patient', patientRouter);
app.use('/visit', visitRouter);
app.use('/holiday', holidayRouter);
app.use('/appointment', appointmentRouter);
app.use('/info', infoRouter);
app.use('/quote', quoteRouter);
app.use('/customer', customerRouter);
app.use('/image', imageRouter);
app.use('/wallet', walletRouter);
app.use('/doctor', doctorRouter); 

//Schema

UserSchema = mongoose.Schema({
  uid: Number,
  userName: String,
  displayName: String,
  password: String,
  status: Boolean,
  email: String,
  userType: String,
  mobile: String,
	cid: String,
});

//--- Medicine structure

MasterSettingsSchema = mongoose.Schema ({
  msId: Number,
  msKey: String,
  msValue: String
  //trialExpiry: String,
})

MedicineSchema = mongoose.Schema({
	name: String,
	description: String,
	precaution: String,
	enabled: Boolean,
	cid: String,
});

PatientSchema = mongoose.Schema({
  pid: Number,
	pidStr: String,
  name: String,
  displayName: String,
  email: String,
  mobile: String,
	gender: String,
	age: Number,
	dob: Date,
	enabled: Boolean,
	cid: String,
});

VisitSchema = mongoose.Schema({
  pid: Number,
	displayName: String,
	visitNumber: Number,
	visitDate: String,
	medicines: [{name: String, dose1: Number, dose2: Number, dose3: Number, time: Number, unit: String}],
	userNotes: [{name: String}],
	remarks: [{name: String}],
	enabled: Boolean,
	appointment: String,	// store appointment _id. If unscheduled visit then it is blank
	cid: String,
});

NextVisitSchema = mongoose.Schema({
  pid: Number,
	displayName: String,
	visitDate: Date,
	nextVisit: Date,
	status: String,
	cid: String,
});


HolidaySchema = mongoose.Schema({
  date: Number,
	month: Number,
	year: Number,
	holidayDate: Date,
	desc: String,
	cid: String,
});

AppointmentSchema = mongoose.Schema({
	//data: {},
	year: Number,
	month: Number,
	date: Number,
	hour: Number,
	minute: Number,
	order: Number,
	pid: Number,
	displayName: String,
	apptTime: Date,
	visit: String,	// be be visit Id. Else it will be pending cancelled.
	cid: String,
});

// 1 info record per person
InfoSchema = mongoose.Schema({
	pid: Number,
	info: String,	// Patient info. Will have to preserve blanks, tabs, CR, LF etc.
	cid: String,
});

QuoteSchema = mongoose.Schema({
	sequence: Number,
	qid: String,
	author: String,
	category: String,
	quote: String,
});

CustomerSchema = mongoose.Schema({
	customerNumber: Number,
	name: String,
	clinicName: String,
	welcomeMessage: String,
	plan: String,
	workingHours: [Number],
	email: String,
	mobile: String,
	fee: Number,
	expiryDate: Date,
	enabled:Boolean,
});

DoctorSchema = mongoose.Schema({
	cid: String,
	name: String,
	type: String,		// dentist, physician, orthopaedic
	clinicName: String,
	email: String,
	mobile: String,
	
	addr1: String,
	addr2: String,
	addr3: String,
	location: String,
	pinCode: String,
	enabled:Boolean
});

ImageSchema = mongoose.Schema({
	cid: 		String,
	pid:		Number,
	displayName: String,
	title: 	String,
	name:		String,
	desc: 	String,
	type:		String,
	date:		Date,
	image: 	{ data: Buffer, contentType: String }
});

WalletSchema = mongoose.Schema({
  cid: String,
  isWallet: Boolean,
  transNumber: Number,
  transDate: String,
  transType: String,
  transSubType: String,
  transLink: Number,
  amount: Number,
  transStatus: Boolean,
})

// models
User = mongoose.model("user", UserSchema);
M_Medicine = mongoose.model('Medicine', MedicineSchema);
M_MasterSetting = mongoose.model("MasterSetting", MasterSettingsSchema)
M_Patient = mongoose.model('Patient', PatientSchema);
M_Visit = mongoose.model('Visit', VisitSchema);
M_Holiday = mongoose.model('Holiday', HolidaySchema);
M_Appointment = mongoose.model('Appointment', AppointmentSchema);
M_Info = mongoose.model('Info', InfoSchema);
M_Quote = mongoose.model('Quote', QuoteSchema);
M_Customer = mongoose.model('Customer', CustomerSchema);
M_NextVisit = mongoose.model('NextVisit', NextVisitSchema);
M_Image = mongoose.model('image', ImageSchema);
M_Wallet = mongoose.model('wallet', WalletSchema);
M_Doctor = mongoose.model('doctor', DoctorSchema);

router = express.Router();

db_connection = false;      // status of mongoose connection
connectRequest = true;

// constant used by routers
minutesIST = 330;    // IST time zone in minutes 330 i.e. GMT+5:30
minutesDay = 1440;   // minutes in a day 24*60 = 1440
MONTHNAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
weekDays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
weekShortDays = new Array("Sun", "Mon", "Tue", "Wedn", "Thu", "Fri", "Sat");


SENDRES = 1;        // send OK response
SENDSOCKET = 2;     // send data on socket

// Error messages
DBERROR = 990;
DBFETCHERR = 991;
CRICFETCHERR = 992;
ERR_NODB = "No connection to CricDream database";

allUSER = 99999999;
serverTimer = 0;
CUSTMF=100000000;
// make mongoose connection

// Create the database connection 
if (WEB) {
	mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
	db_connection = true;
  connectRequest = true;
}
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  //console.log('Mongoose default connection open to ' + process.env.MONGOCONNECTION);
	console.log('Mongoose connection success');
  db_connection = true;
  connectRequest = true;
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error');
  console.log(err);
  db_connection = false;
  connectRequest = false;   // connect request refused
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
  db_connection = false;
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  // close mongoose connection
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
  });
  process.exit(0);
});

// schedule task
if (WEB) {
  cron.schedule('*/15 * * * * *', () => {
    // console.log('running every 15 second');
    // console.log(`db_connection: ${db_connection}    connectREquest: ${connectRequest}`);
    if (!connectRequest)
      mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
  });
}


// start app to listen on specified port
httpServer.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});


// global functions

const AMPM = [
  "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM",
  "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM"
];
  /**
 * @param {Date} d The date
 */
const TZ_IST={hours: 5, minutes: 30};
cricDate = function (d)  {
  var xxx = new Date(d.getTime());
  xxx.setHours(xxx.getHours()+TZ_IST.hours);
  xxx.setMinutes(xxx.getMinutes()+TZ_IST.minutes);
  var myHour = xxx.getHours();
  var myampm = AMPM[myHour];
  if (myHour > 12) myHour -= 12;
  var tmp = `${MONTHNAME[xxx.getMonth()]} ${("0" + xxx.getDate()).slice(-2)} ${("0" + myHour).slice(-2)}:${("0" +  xxx.getMinutes()).slice(-2)}${myampm}`
  return tmp;
}


EMAILERROR="";
APLEMAILID='cricketpwd@gmail.com';


// module.exports = app;

