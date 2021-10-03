import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import { borders } from '@material-ui/system';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import {setTab} from "CustomComponents/CricDreamTabs.js"

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Avatar from "@material-ui/core/Avatar"
//import validator from 'validator'

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";
import {dynamicModal } from "assets/dynamicModal";


import Switch from "@material-ui/core/Switch";
import Link from '@material-ui/core/Link';

//import Card from "components/Card/Card.js";
//import CardBody from "components/Card/CardBody.js";
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";

import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
DisplayPatientDetails,
} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';

import {WEEKSTR, MONTHSTR, SHORTMONTHSTR, 
str1by4, str1by2,  str3by4,
} from 'views/globals';

// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Cancel';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import EventNoteIcon from '@material-ui/icons/EventNote';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';

//colours 
import { 
red, blue, yellow, orange, pink, green, brown, deepOrange, lightGreen, blueGrey, lime,
} from '@material-ui/core/colors';

import { 
	isMobile, callYesNo,
	disablePastDt, disableFutureDt, disableAllDt,
	validateInteger,
	encrypt, decrypt, 
	left, right,
	intString,
	updatePatientByFilter,
	dispAge, dispEmail, dispMobile,
	ordinalSuffix,
	compareDate, makeTimeString,
} from "views/functions.js";



const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	}, 
	selIndex: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	unselIndex: {
		fontSize: theme.typography.pxToRem(14),
	},
	freeSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		//backgroundColor: blue[300] 
	},
	usedSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		backgroundColor: 'red',
	},
	slotboxStyle: {
		borderColor: 'blue', 
		borderRadius: 7, 
		border: 1,
	},
	dateTime: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		backgroundColor: pink[100],
		align: 'center',
		width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
	}, 
	info: {
			color: blue[700],
	}, 
	filterRadio: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
			color: '#000000',	
	},
	switchText: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	}, 
		orange: {
			backgroundColor: orange[300],
			color: '#000000',
		},
    header: {
			color: '#D84315',
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
		},
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
		},
		NoMedicines: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		medicine: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		modalHeader: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},
		messageText: {
			color: '#4CC417',
			fontSize: 12,
			// backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
			margin: theme.spacing(0, 1, 0),
    },
		title: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		accordianSummary: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			//backgroundColor: pink[100],
		},
		zeroAppt: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		normalAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		selectedAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: yellow[100],
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: "none", 
		},
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[700]
	},  
	newAppt: {
		backgroundColor: pink[100],
	},
	allAppt: {
		backgroundColor: blue[100],
	},
	select: {
		padding: "none", 
		backgroundColor: '#B3E5FC',
		margin: "none",
	},
	table: {
    //minWidth: 750,
  },
  td : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdPending : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdCancel : {
		backgroundColor: pink[100],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdVisit : {
		backgroundColor: lime[300],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	th: { 
		border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA726',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	wd: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#E0E0E0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	we: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#F8BBD0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	today: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: green[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	noday: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: blueGrey[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	ho: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: yellow[400],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
}));

const VISITTYPE = {pending: "pending", cancelled: "cancelled", visit: ""};

const ROWSPERPAGE = 10;
let dense = false;


const DUMMYDAY={date: 0, dayType: "", apptCount: 0};
const HOLIDAYTYPE="HO";
const WEEKDAYTYPE="WD";
const WEEKENDTYPE="WE";
const TODAYTYPE="TD";

const DATESTR = [
"1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
"31"							
];

const DISPMONTH = {
"00": "01", "01": "02", "02": "03", "03": "04",
"04": "05"
}

const ALLHOURSTR = [
"00", 
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23"
];
let HOURSTR=[];
const MINUTESTR = ["00", "15", "30", "45"];


					
let YEARSTR = ["2020", "2021", "2022"];


let test=[];
let medQty=[];
const timeArray=[1,2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const unitArray=["Day(s)", "Weeks(s)", "Month(s)"];

const menuModal = (isMobile()) ? dynamicModal('50%') : dynamicModal('20%');
const yesNoModal = dynamicModal('60%');

let defaultDirectoryMode=true;

let searchText = "";
function setSearchText(sss) { searchText = sss;}

let aptDate = new Date();
function setAptDate(d) { aptDate = d; }

let aptTime = new Date(2021, 9, 1, 10, 0);
function setAptTime(d) { aptTime = d; }

var workingHours;
var timeSlots;
const NUMBEROFDAYS = (isMobile()) ? 3 : 5;
var userCid;
var customerData;

export default function Appointment() {
  const classes = useStyles();
	const gClasses = globalStyles();

  const [patientArray, setPatientArray] = useState([])
	const [patientMasterArray, setPatientMasterArray] = useState([]);
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [allPendingAppt, setAllPendingAppt] = useState([])
	const [emurName, setEmurName] = useState("");
	const [modalRegister, setModalRegister] = useState(0)
	const [radioValue, setRadioValue] = useState("all");
	
	const [directoryMode, setDirectoryMode] = useState(defaultDirectoryMode);
	const [monthYearDate, setMonthYearDate] = useState(new Date());
	
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };


	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	const [selectPatient, setSelectPatient] = useState(false);
	const [year, setYear] = useState("2021");
	const [month, setMonth] = useState("September");
	const [lastDayOfMonth, setLastDayOfMonth] = useState(0);
	const [monthlyMode, setMonthlyMode] = useState(true);
	const [beforeToday, setBeforeToday] = useState(true);
	
	const [apptMatrix, setApptMatrix] = useState([]);
	const [holidayArray, setHolidayArray] = useState([]);
	const [menuData, setMenuData] = useState({});
	const [apptCountArray, setApptCountArray] = useState([]);
	
	const [cancelAppt, setCancelAppt] = useState({});
	
	const [registeredPatient, setRegisteredPatient] = useState(true);
	//const [searchText, setSearchText] = useState("");
	const [newErrorMessage, setNewErrorMessage] = useState("");
	const [newAppointment, setNewAppointment] = useState(false);

	
	
	const [apptHour, setApptHour] = useState("");
	const [apptMinute, setApptMinute] = useState(MINUTESTR[0]);
	const [apptArray, setApptArray] = useState([]);
	const [masterApptArray, setMasterApptArray] = useState([]);
	
	//const [dateArray, setDateArray] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [allTimeSlots, setAllTimeSlots] = useState([]);
	
  useEffect(() => {	
		customerData = JSON.parse(sessionStorage.getItem("customerData"));
		userCid = sessionStorage.getItem("cid");
		let holidays;
		const getHolidays  = async () => {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/fromtoday/${userCid}`);
				holidays = resp.data
			} catch(e) {
				holidays = [];
				console.log(e);
			}
			return holidays;
		}
		const checkPatient = async () => {		
			// check if appointment has been called from Patient view
			let newDirMode = defaultDirectoryMode;
			try {
				let dirPatient = JSON.parse(sessionStorage.getItem("shareData"));
				sessionStorage.setItem("shareData", "");		// clean up
				console.log(dirPatient);
				
				newDirMode = false;
				setCurrentPatient(dirPatient.displayName);
				setCurrentPatientData(dirPatient);
				let allPat = [];
				allPat.push(dirPatient);
				setPatientArray(allPat);
				await getAppointmentsByPid(dirPatient.pid)
			} catch {
				let ppp = await getAllPatients();
				setPatientArray(ppp);
				setPatientMasterArray(ppp);
			}
			return newDirMode;
		}
		const getAppointment  = async () => {
			// get all pending apt
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/pendinglist/all/${userCid}`);
				return (resp.data);
			} catch(e) {
				return ([])
				console.log(e);
			}
			setHolidayArray(holidays);
			return holidays;
		}
		
		const makeSlots  = async () => {
			let holidays =  await getHolidays();
			setHolidayArray(holidays);
			let allPendingAppt = await getAppointment();
			console.log(allPendingAppt);
			setAllPendingAppt(allPendingAppt);
			let d;
			let slotData = [];
			for(let i=0; i<NUMBEROFDAYS; ++i) {
				d = (i === 0) ? getFirstDate(holidays) : getNextDate(d, holidays);
				slotData.push(prepareData(d, allPendingAppt));
			}
			setAllTimeSlots(slotData);
			setCurrentIndex(0);
		}
		checkPatient();
		makeSlots();
  }, []);

	// returns true if appointment of given time
	function checkAppt(year, month, date, hr, min, allAppt) {
		let tmp = allAppt.filter( x =>
			x.year === year && x.month === month && x.date === date &&
			x.hour === hr && x.minute === min);
		return (tmp.length > 0);
	}
	
	function prepareData(d, allAppt) {
		let morningSlots = [];
		let afternoonSlots = [];
		let eveningSlots = [];
		let workingHours;
		
		switch (d.getDay()) {
			case 0: workingHours = customerData.day0; break;
			case 1: workingHours = customerData.day1; break;
			case 2: workingHours = customerData.day2; break;
			case 3: workingHours = customerData.day3; break;
			case 4: workingHours = customerData.day4; break;
			case 5: workingHours = customerData.day5; break;
			case 6: workingHours = customerData.day6; break;			
		}
		let myYear = d.getFullYear();
		let myMonth = d.getMonth();
		let myDate = d.getDate();
		let myDay = d.getDay();
		// for morning slots
		for(let hr=9; hr<12; ++hr) {
			if (workingHours.includes(hr)) {
				let t0 = makeTimeString(hr, 0);
				let t1 = makeTimeString(hr, 15);
				let t2 = makeTimeString(hr, 30);
				let t3 = makeTimeString(hr, 45);
				morningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t0, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 0, allAppt)
				});
				morningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t1, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 15, allAppt)
				});
				morningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t2, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 30, allAppt)
				});
				morningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t3, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 45, allAppt)
				});
			}
		}
		// for afternoon slots
		for(let hr=12; hr<16; ++hr) {
			if (workingHours.includes(hr)) {
				let t0 = makeTimeString(hr, 0);
				let t1 = makeTimeString(hr, 15);
				let t2 = makeTimeString(hr, 30);
				let t3 = makeTimeString(hr, 45);

				afternoonSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t0, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 0, allAppt)
				});
				afternoonSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t1, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 15, allAppt)
				});
				afternoonSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t2, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 30, allAppt)
				});
				afternoonSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t3, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 45, allPendingAppt)
				});
			}
		}
		// evening slots
		for(let hr=16; hr<24; ++hr) {
			if (workingHours.includes(hr)) {
				let t0 = makeTimeString(hr, 0);
				let t1 = makeTimeString(hr, 15);
				let t2 = makeTimeString(hr, 30);
				let t3 = makeTimeString(hr, 45);	
				
				eveningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t0, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 0, allAppt)
				});
				eveningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t1, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 15, allAppt)
				});
				eveningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t2, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 30, allAppt)
				});
				eveningSlots.push({year: myYear, month: myMonth, date: myDate,
				dateTime: d, day: myDay,
				slot: t3, 
				available: !checkAppt(myYear, myMonth, myDate, hr, 45, allAppt)
				});
			}
		}
	
		return {dateTime: d, year: myYear, month: myMonth, date: myDate,
			day: myDay, morningSlots: morningSlots, afternoonSlots: afternoonSlots,
			eveningSlots: eveningSlots
		}
	}
	
	function clinicOff(d, myHoildays) {
		let tmp = myHoildays.filter(x => x.date === d.getDate() &&
				x.month === d.getMonth() && x.year === d.getFullYear());
		if (tmp.length > 0) return true;
			
		// check if doctor's weekend on this date
		let isClosed = false;
		switch (d.getDay()) {
			case 0: isClosed = customerData.day0.length === 0; break;
			case 1: isClosed = customerData.day1.length === 0; break;
			case 2: isClosed = customerData.day2.length === 0; break;
			case 3: isClosed = customerData.day3.length === 0; break;
			case 4: isClosed = customerData.day4.length === 0; break;
			case 5: isClosed = customerData.day5.length === 0; break;
			case 6: isClosed = customerData.day6.length === 0; break;
		}
		return isClosed;
	}
	
	function getNextDate(d, myHoildays) {
		let done = false
		//console.log("I",d)
		while (!done) {
			d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0 , 0);
			if (clinicOff(d, myHoildays)) { continue; }
			break;
		}
		//console.log("O",d)
		return d;
	}

	function getPrevDate(d, myHoildays) {
		let today = new Date();
		let done = false
		while (!done) {
			d = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1, 0 , 0);
			if (compareDate(d, today) < 0) return null;
			if (clinicOff(d, myHoildays)) continue;
			break;
		}
		return d;
	}
	
	function getFirstDate(myHoildays) {
		//console.log(myHoildays);
		let d = new Date();
		let firstDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1);
		return getNextDate(d, myHoildays);
	}
	
	async function getAllPatients() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/list/${userCid}`;
			let resp = await axios.get(myUrl);
			return resp.data;
		} catch (e) {
			return [];
		}	
	}
	
	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 100:
        myMsg = "Medicine successfully updated";
				regerr = false;
        break;
      case 101:
        myMsg = `All the doses cannot be 0`;
        break;
      case 102:
        myMsg = `No Medicine selected`;
        break;
      case 200:
        myMsg = "Note successfully updated";
				regerr = false;
        break;
      case 201:
        myMsg = `All notes cannot be 0`;
        break;
      case 202:
        myMsg = `Notes cannot be blank`;
        break;
      case 300:
        myMsg = "Remark successfully updated";
				regerr = false;
        break;
      case 301:
        myMsg = `All notes cannot be 0`;
        break;
      case 302:
        myMsg = `Remark cannot be blank`;
        break;
			case 401:
        myMsg = `Patient name already in database`;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }

	async function selectFilter() {
		//console.log("Filter:", searchText);
		getPatientList(searchText);
		//setRegisterStatus(0);
	}

	async function getPatientList(filter) {
		filter = filter.trim();
		var subcmd = "list"
		if (filter != "") {
			// if it is complete numeric then it must by ID
			subcmd = (validateInteger(filter))	? "listbyid" : subcmd = "listbyname";
		} 
		else {
			subcmd = "list"
		}
		
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/${userCid}/${subcmd}/${userCid}/${filter}`)
			//console.log(resp.data);
			let tmp = resp.data;
			//tmp.forEach(ttt => {
			//	ttt.email = decrypt(ttt.email);
			//});
			//console.log(tmp);
			setPatientArray(tmp);
		} 
		catch (e) {
			console.log(e);
			setPatientArray([]);
		}
	}
	
	//=================
	
	
	
	async function handleSelectPatient(rec) {
		setSelectPatient(false);
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		await getPatientAppt(rec);
	}
	
	async function getPatientAppt(rec) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/pendinglist/pid/${userCid}/${rec.pid}`);
			//console.log(resp.data);
			setApptArray(resp.data);
		} catch (e) {
			console.log(e);
			setApptArray([]);
		}
	}


	// Yes no handler
		
	async function handleAddApptConfirm() {
		
		console.log(currentPatient);
		console.log(currentPatientData);
		
		let myYear = aptDate.getFullYear();
		let myMonth = aptDate.getMonth();
		let myDate =  aptDate.getDate();
		let myHour = aptTime.getHours();
		let myMin = aptTime.getMinutes();
		
		let myOrder = ((myYear * 100 + myMonth) * 100  + myDate)*100;
		myOrder = (myOrder + myHour)*100 + myMin;
		let tmp = {
			cid: userCid,
			//data: currentPatientData,
			year: myYear,
			month: myMonth,
			date: myDate,
			hour: myHour,
			minute: myMin,
			order: myOrder,
			pid: currentPatientData.pid,
			displayName: currentPatientData.displayName,
			visit: VISITTYPE.pending,
			apptTime: new Date(myYear, myMonth, myDate,
								myHour, myMin, 0),
		};
		
		let jTmp = JSON.stringify(tmp);
		
		// add this to database
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/add/${userCid}/${jTmp}`;
			let resp = await axios.get(myUrl);
			
			let tmpArray=[].concat(masterApptArray);
			tmpArray.push(tmp);
			tmpArray.sort((a, b) => {
				return ((directoryMode) ? (a.order - b.order) : (b.order - a.order));
			});
			console.log(tmpArray);
			setMasterApptArray(tmpArray);
			updateRadioFilter(tmpArray, radioValue);
			//	setApptArray(tmpArray);	
			setNewAppointment(false);
		} catch (e) {
			console.log(e);
			return;
		}
		
		if (directoryMode) {
			setCurrentPatient("");
			setCurrentPatientData({});
		}
	}
  
	async function handleCancelApptConfirm() {
		//console.log(cancelAppt);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/cancel/${userCid}/${cancelAppt.pid}/${cancelAppt.order}`;
			let resp = await axios.get(myUrl);
			//let tmpArray = apptArray.find(x => x.pid != cancelAppt.pid ||	x.order != cancelAppt.order);
			//console.log(tmpArray);
			//setApptArray(tmpArray);
			let tmpArray = [].concat(masterApptArray);
			let tmpAppt = tmpArray.find(x => 
				x.pid === cancelAppt.pid && 
				x.order === cancelAppt.order &&
				x.visit === VISITTYPE.pending
				);
			//console.log(tmpAppt);
			tmpAppt.visit = VISITTYPE.cancelled;
			setMasterApptArray(tmpArray);
			updateRadioFilter(tmpArray, radioValue);
		} catch (e) {
			console.log(e);
		}

		
	}
	
	function yesNoHandler(id, action) {
		closeModal();
		console.log("Id is " + id + "  Action is " + action);
		
		if ((id === "cancel") && (action === "YES"))	{
			handleCancelApptConfirm();
			return;
		}
	}
	//==================================
	
	async function prevDate() {
		let d = getPrevDate(allTimeSlots[0].dateTime, holidayArray);
		if (d !== null) {
			let x = [prepareData(d, allPendingAppt)];
			for (let i=0; i<(NUMBEROFDAYS-1); ++i) {
				x.push(allTimeSlots[i]);
			}
			setAllTimeSlots(x);
			let index = currentIndex + 1;
			if (index === NUMBEROFDAYS) index = NUMBEROFDAYS - 1;
			setCurrentIndex(index);
		}
	}
	
	async function nextDate() {
		let x = [];
		for (let i=1; i<NUMBEROFDAYS; ++i) {
			x.push(allTimeSlots[i]);
		}
		let d = getNextDate(allTimeSlots[NUMBEROFDAYS-1].dateTime, holidayArray);
		let newData = prepareData(d, allPendingAppt);
		x.push(newData);
		//console.log(x);
		setAllTimeSlots(x);
		let index = currentIndex - 1;
		if (index < 0) index = 0;
		setCurrentIndex(index);

	}
	
	async function setAppointment(slot) {
		alert("Appointment selected");
	}
	
	function DisplayAppointments() {
	let tStr = ((allTimeSlots[currentIndex].date < 10) ? "0" : "") + allTimeSlots[currentIndex].date;
	tStr += "/";
	tStr += (((allTimeSlots[currentIndex].month + 1) < 10) ? "0" : "") + (allTimeSlots[currentIndex].month+1);
	tStr += "/";
	tStr += allTimeSlots[currentIndex].year;

	return (
	<div>
	<Box className={gClasses.boxStyle} borderColor="blue" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="ALLDATE" container alignItems="center" >
		<Grid item xs={1} sm={1} md={1} lg={1} >
			<IconButton color={'primary'} onClick={prevDate}  >
					<LeftIcon />
				</IconButton>
		</Grid>
		{allTimeSlots.map( (t, index) => {
			let dStr = (compareDate(t.dateTime, new Date()) !== 0) 
				? t.date + "/" + (t.month + 1) + "/" + t.year
				: "Today";
			let freeSlots = t.morningSlots.filter(x => x.available === true).length + 
				t.afternoonSlots.filter(x => x.available === true).length +
				t.eveningSlots.filter(x => x.available === true).length;
			let myClass = (index === currentIndex) ? classes.selIndex : classes.unselIndex;
		return (
		<Grid item xs={3} sm={3} md={2} lg={2} >
			<div>
			<Typography className={myClass} onClick={() => {setCurrentIndex(index)}}>{dStr}</Typography>
			<Typography className={myClass} onClick={() => {setCurrentIndex(index)}}>{WEEKSTR[t.day]}</Typography>
			<Typography className={myClass} onClick={() => {setCurrentIndex(index)}}>{freeSlots+" free Slots"}</Typography>
			</div>
		</Grid>
		)}
		)}
		<Grid item xs={1} sm={1} md={1} lg={1} >
			<IconButton color={'primary'} onClick={nextDate}  >
			<RightIcon />
			</IconButton>
		</Grid>
	</Grid>	
	</Box>
	<BlankArea />
	{/*  Show morningSlots slots */}
	{(allTimeSlots[currentIndex].morningSlots.length > 0) &&
	<Grid className={gClasses.noPadding} key="MORNING" container alignItems="center" >
	<Grid item xs={12} sm={12} md={12} lg={12} >
	<Typography className={classes.slotTitle} >{"Morning Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].morningSlots.map( (t, index) => {
		return (
			<Grid item xs={4} sm={4} md={2} lg={2} >
					{t.available &&
						<Box className={classes.freeSlot} borderColor="blue" borderRadius={7} border={1} >
						<Typography onClick={() => {setAppointment(t)}}>{t.slot}</Typography>
						</Box>
					}
					{!t.available &&
						<Box className={classes.usedSlot} borderColor="blue" borderRadius={7} border={1} >
						<Typography className={gClasses.bgRed}>{"Booked"}</Typography>
						</Box>
					}
			</Grid>
		)}
	)}
	</Grid>
	}
	{/*  Show afternoon  slots */}
	{(allTimeSlots[currentIndex].afternoonSlots.length > 0) &&
	<Grid key="AFTERNOON" container alignItems="center" >
	<Grid item xs={12} sm={12} md={12} lg={12} >
	<Typography className={classes.slotTitle} >{"Afternoon Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].afternoonSlots.map( (t, index) => {
		return (
			<Grid item xs={4} sm={4} md={2} lg={2} >
				{t.available &&
					<Box className={classes.freeSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {setAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
				{!t.available &&
					<Box className={classes.usedSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography className={gClasses.bgRed}>{"Booked"}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>	
	}
	{/*  Show evening  slots */}
	{(allTimeSlots[currentIndex].eveningSlots.length > 0) &&
	<Grid className={gClasses.noPadding} key="EVENING" container alignItems="center" >
	<Grid item xs={12} sm={12} md={12} lg={12} >
	<Typography className={classes.slotTitle} >{"Evening Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].eveningSlots.map( (t, index) => {
		return (
			<Grid item xs={4} sm={4} md={2} lg={2} >
					{t.available &&
						<Box className={classes.freeSlot} borderColor="blue" borderRadius={7} border={1} >
						<Typography onClick={() => {setAppointment(t)}}>{t.slot}</Typography>
						</Box>
					}
					{!t.available &&
						<Box className={classes.usedSlot} borderColor="blue" borderRadius={7} border={1} >
						<Typography>{"Booked"}</Typography>
						</Box>
					}
			</Grid>
		)}
	)}
	</Grid>	
	}
	</div>
	)}
	
	function DisplayAllPatients() {
	return (
	<Grid className={gClasses.noPadding} key="DATESEL" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientDetails 
			patient={m} 
			button1={
				<IconButton color={'primary'} size="small" onClick={() => { handleSelectPatient(m)}}  >
					<EventNoteIcon />
				</IconButton>
			}
		/>
		</Grid>
	)}
	</Grid>	
	)}
	
	function setFilter(myArray, filterStr) {
		filterStr = filterStr.trim().toLowerCase();
		let tmpArray;
		if (validateInteger(filterStr)) {
			// it is integer. Thus has to be Id
			tmpArray = patientMasterArray.filter(x => x.pidStr.includes(filterStr));
		} else {
			tmpArray = patientMasterArray.filter(x => x.displayName.toLowerCase().includes(filterStr));
		}
		setPatientArray(tmpArray);
	}
	
	function filterPatients(filterStr) {
		setSearchText(filterStr);
		setFilter(patientMasterArray, filterStr);
	}

	async function getAppointmentsByPid(myPid) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/pendinglist/pid/${userCid}/${myPid}`);
			setApptArray(resp.data);

		} catch (e) {
			console.log(e);

			setApptArray([]);
		}
	}

	async function handleSelectPatient(rec) {
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		setSelectPatient(false);
		await getAppointmentsByPid(rec.pid);
	}
	

	return (
		<div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Patient Appointment" groupName="" tournament=""/>
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		{(currentPatient === "") && 
			<div>
			<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
			<Grid key={"F1"} item xs={false} sm={false} md={2} lg={2} />
			<Grid key={"F2"} item xs={12} sm={12} md={4} lg={4} >
				<TextField id="filter"  padding={5} fullWidth label="Search Patient by name or Id" 
					defaultValue={searchText}
					onChange={(event) => filterPatients(event.target.value)}
					InputProps={{endAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>)}}
				/>
			</Grid>
			<Grid key={"F4"} item xs={8} sm={8} md={3} lg={3} >
				<Typography>Click button to add new patient</Typography>
			</Grid>
			<Grid key={"F5"} item xs={4} sm={4} md={1} lg={1} >
				<VsButton name="New Patient" /> 
			</Grid>
			<Grid key={"F6"} item xs={false} sm={false} md={2} lg={2} />
			</Grid>
			<DisplayAllPatients />
			</div>
		}
		{(currentPatient !== "") &&
			<VsButton align="right" name="Select Patient" onClick={() => { setCurrentPatient("")}} />	
		}
		{(currentPatient !== "") &&
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Typography align="center" className={classes.modalHeader}>
			{currentPatientData.displayName+" ( Id: "+currentPatientData.pid+" ) "}
			</Typography>	
			<BlankArea />
			{(apptArray.length > 0) &&
				<Typography>Aree!!! appoint already ahi. Cancel karo bhai</Typography>
			}
			{(apptArray.length === 0) &&
				<DisplayAppointments />
			}
			</Box>
		}
		</Container>	
		<Modal
			isOpen={modalIsOpen == "YESNO"}
			shouldCloseOnOverlayClick={false}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={yesNoModal}
			contentLabel="Example Modal"
			aria-labelledby="modalTitle"
			aria-describedby="modalDescription"
			ariaHideApp={false}
		>
			<DisplayYesNo close={closeModal} func={yesNoHandler} />
		</Modal>			
  </div>
  );    
}