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
import VsTextSearch from "CustomComponents/VsTextSearch";
import VsImageButton from "CustomComponents/VsImageButton";

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
import { useAlert } from 'react-alert'
import Drawer from '@material-ui/core/Drawer';
import _ from 'lodash'


import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Avatar from "@material-ui/core/Avatar"
//import validator from 'validator'

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";
import {dynamicModal } from "assets/dynamicModal";


import Switch from "@material-ui/core/Switch";
import Link from '@material-ui/core/Link';

import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
DisplayPatientDetails,
DisplayPatientBox,
DisplayAppointmentDetails, DisplayAppointmentBox,
} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';

import {
WEEKSTR, SHORTMONTHSTR, 
HOURSTR, MINUTESTR,
MONTHSTR, DATESTR, MONTHNUMBERSTR,
VISITTYPE,
str1by4, str1by2,  str3by4,
BLOCKNUMBER,
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
import CancelIcon from '@material-ui/icons/Cancel';

//colours 
import { 
red, blue, grey, yellow, orange, pink, green, brown, deepOrange, lightGreen, blueGrey, lime,
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
	getAllPatients,
	vsDialog,
	generateOrder, generateOrderByDate,
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
	availableSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		//backgroundColor: blue[300] 
	},
	pendingSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		//backgroundColor: blue[300] 
	},
	expiredSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		backgroundColor: grey[500],
	},
	visitSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		backgroundColor: lightGreen["A400"],
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
		backgroundColor: grey[500],
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
			color: 'blue',
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


const ROWSPERPAGE = 10;
let dense = false;


let test=[];
let medQty=[];
const timeArray=[1,2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const unitArray=["Day(s)", "Weeks(s)", "Month(s)"];

const MINUTEBLOCK = [0, 15, 30, 45];

const menuModal = (isMobile()) ? dynamicModal('50%') : dynamicModal('20%');
const yesNoModal = dynamicModal('60%');

let defaultDirectoryMode=true;

let aptDate = new Date();
function setAptDate(d) { aptDate = d; }

var workingHours;
var timeSlots;
const NUMBEROFDAYS = (isMobile()) ? 3 : 5;
var userCid;
var customerData;

export default function Appointment() {
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [searchText, setSearchText] = useState("");
	
	const [currSlotMessage, setCurrSlotMessage] = useState("");
	const [currSlotData, setCurrSlotData] = useState([]);
	const [currSlotDate, setCurrSlotDate] = useState("");
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
  const [patientArray, setPatientArray] = useState([])
	const [patientMasterArray, setPatientMasterArray] = useState([]);
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [allPendingAppt, setAllPendingAppt] = useState([])
	const [emurName, setEmurName] = useState("");
	const [modalRegister, setModalRegister] = useState(0)
	const [radioValue, setRadioValue] = useState("Male");
	const [isDrawerOpened, setIsDrawerOpened] = useState(false);
	
	const	[patientName, setPatientName] = useState("");
	const	[patientAge, setPatientAge] = useState(0);
	const	[patientGender, setPatientGender] = useState("Male");
	const	[patientEmail, setPatientEmail] = useState("");
	const	[patientMobile, setPatientMobile] = useState(0);
	const [patientDob, setPatientDob] = useState(new Date(2000, 1, 1));
	
	const [directoryMode, setDirectoryMode] = useState(defaultDirectoryMode);
	const [monthYearDate, setMonthYearDate] = useState(new Date());

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
	

	const [newErrorMessage, setNewErrorMessage] = useState("");
	const [newAppointment, setNewAppointment] = useState(false);

	
	
	const [apptHour, setApptHour] = useState("");
	//const [apptMinute, setApptMinute] = useState(MINUTESTR[0]);
	const [apptArray, setApptArray] = useState([]);
	const [masterApptArray, setMasterApptArray] = useState([]);
	
	//const [dateArray, setDateArray] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [allTimeSlots, setAllTimeSlots] = useState([]);
	
  useEffect(() => {	
		let PgetAllHolidays;
		let PgetAllPendingAppointment;
		let PgetAllMyPatients;
		let PcheckFromPatient;
		
		customerData = JSON.parse(sessionStorage.getItem("customerData"));
		userCid = sessionStorage.getItem("cid");
		
		const getAllPendingAppointment  = async () => {
			allPending = await reloadAppointmentDetails();
		}
		const getAllHolidays  = async () => {
			let allHolidays;
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/fromtoday/${userCid}`);
				allHolidays = resp.data;
			} catch(e) {
				allHolidays = [];
				console.log(e);
			}
			finally {
				setHolidayArray(allHolidays);
				return allHolidays;
			}
		}
		const getAllMyPatients  = async () => {
			let ppp = await getAllPatients(userCid);
			return ppp;				
		}
		const makeSlots  = async () => {
			let allHolidays = await PgetAllHolidays;
			let allPendingAppt = await PgetAllPendingAppointment;
			generateSlots(allPendingAppt, allHolidays);			
		}
		const checkFromPatient = async () => {
			let ppp = await PgetAllMyPatients;	
			setPatientMasterArray(ppp);
			setSearchText("");
			setPatientFilter(ppp, "");
			/*** Now directly called form button and not from patient etc.			
			try {
				// check if has come from patient view.
				let dirPatient = JSON.parse(sessionStorage.getItem("shareData"));
				sessionStorage.setItem("shareData", "");		// clean up
				//console.log(dirPatient);
				
				await getAppointmentsByPid(dirPatient.pid)
				setSearchText(dirPatient.displayName);
				setPatientFilter(ppp, dirPatient.displayName);
				setCurrentPatientData(dirPatient);
				setCurrentPatient(dirPatient.displayName);
			} catch {
				// nothing to be done
				console.log("direct");
				setSearchText("");
				setPatientFilter(ppp, "");
				//setCurrentPatientData({});
				//setCurrentPatient("");
			} 
			***/
		}	
		
		// fetch data 1 by 1 
		PgetAllMyPatients = getAllMyPatients();
		PgetAllHolidays = getAllHolidays();
		PgetAllPendingAppointment = reloadAppointmentDetails();
		makeSlots();
		PcheckFromPatient = checkFromPatient();
		//handleMyAppt();
  }, []);

	async function reloadAppointmentDetails() {
		// get all pending apt
		let allPending;
		try {
			//let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/pendinglist/all/${userCid}`);
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/list/all/fromtoday/${userCid}`);
			allPending = resp.data;
		} catch(e) {
			allPending = [];
			console.log(e);
		}
		finally {
			setAllPendingAppt(allPending);	
			return	allPending;
		}		
	}
	
	function generateSlots(allPendingAppt, allHolidays) {
		let d;
		let slotData = [];
		for(let i=0; i<NUMBEROFDAYS; ++i) {
			d = (i === 0) ? getFirstDate(allHolidays) : getNextDate(d, allHolidays);
			//console.log(d);
			slotData.push(prepareData(d, allPendingAppt));
		}
		setAllTimeSlots(slotData);
		setCurrentIndex(0);
	}
	
	function setNewCurrentIndex(idx) {
		let currentSlot = [].concat(allTimeSlots);
		let itIsToday = false;
		let today = new Date();
		if (idx === 0) {
			//console.log(idx, allTimeSlots[idx].date, allTimeSlots[idx].month, allTimeSlots[idx].year);
			if ((allTimeSlots[idx].date === today.getDate()) &&
				(allTimeSlots[idx].month === today.getMonth()) &&
				(allTimeSlots[idx].year === today.getFullYear())) {
				itIsToday = true;
				
			}
		}
		
		if (itIsToday) {
			//console.log("It is today", itIsToday);
			let currentSlot = [].concat(allTimeSlots);
			let currentOrder = generateOrderByDate(today);
			// update morning slots
			for(let i=0; i<currentSlot[idx].morningSlots.length; ++i) {
				if (currentSlot[idx].morningSlots[i].visit !== "available") continue;
				//console.log(currentSlot[idx].morningSlots[i]);
				let requestedOrder = generateOrder(
					currentSlot[idx].morningSlots[i].year,
					currentSlot[idx].morningSlots[i].month,
					currentSlot[idx].morningSlots[i].date,
					currentSlot[idx].morningSlots[i].hour,
					currentSlot[idx].morningSlots[i].minute);
					
					//console.log(requestedOrder, currentOrder); 
					if (requestedOrder > currentOrder) break;
					currentSlot[idx].morningSlots[i].name = "-"
					currentSlot[idx].morningSlots[i].visit = 'expired';
			}
			// update afternoon slots
			for(let i=0; i<currentSlot[idx].afternoonSlots.length; ++i) {
				if (currentSlot[idx].afternoonSlots[i].visit !== "available") continue;
				let requestedOrder = generateOrder(
					currentSlot[idx].afternoonSlots[i].year,
					currentSlot[idx].afternoonSlots[i].month,
					currentSlot[idx].afternoonSlots[i].date,
					currentSlot[idx].afternoonSlots[i].hour,
					currentSlot[idx].afternoonSlots[i].minute);
					
					if (requestedOrder > currentOrder) break;
					currentSlot[idx].afternoonSlots[i].name = "-"
					currentSlot[idx].afternoonSlots[i].visit = 'expired';
			}
			// update evening slots
			for(let i=0; i<currentSlot[idx].eveningSlots.length; ++i) {
				if (currentSlot[idx].eveningSlots[i].visit !== "available") continue;
				let requestedOrder = generateOrder(
					currentSlot[idx].eveningSlots[i].year,
					currentSlot[idx].eveningSlots[i].month,
					currentSlot[idx].eveningSlots[i].date,
					currentSlot[idx].eveningSlots[i].hour,
					currentSlot[idx].eveningSlots[i].minute);
					
					if (requestedOrder > currentOrder) break;
					currentSlot[idx].eveningSlots[i].name = "-"
					currentSlot[idx].eveningSlots[i].visit = 'expired';
			}
		
			// now all done. Update all time slots
			setAllTimeSlots(currentSlot);
		}
		handleSlotSelection("MORNING", currentSlot[idx]);
		setCurrentIndex(idx);
	}
	
	// returns true if appointment of given time
	function checkAppt(year, month, date, hr, min, allAppt) {
		//console.log(allAppt);
		let tmp = allAppt.find( x =>
			x.year === year && x.month === month && x.date === date &&
			x.hour === hr && x.minute === min);
		//console.log(date, hr, min, tmp);
		let retStr = {name: `$HOURSTR[hr]}:${MINUTESTR[min]}`, visit: 'available'};
		if (tmp) {
			retStr.name = tmp.displayName;
			retStr.visit = (tmp.visit === 'pending') ? 'pending' : 'visit';
		} else {
			// if not appointment, then check if appointment of old date time
			let currentOrder = generateOrderByDate(new Date());
			let requestedOrder = generateOrder(year, month, date, hr, min);
			if (requestedOrder < currentOrder) {
				retStr.name = "-"
				retStr.visit = 'expired';
			}
		}
		return (retStr);
	}
	
	function prepareData(d, allAppt) {
		let morningSlots = [];
		let afternoonSlots = [];
		let eveningSlots = [];
		let workingHours = customerData.workingHours;
		
		let myYear = d.getFullYear();
		let myMonth = d.getMonth();
		let myDate = d.getDate();
		let myDay = d.getDay();
		// for morning slots
		for(let blk=BLOCKNUMBER.morningBlockStart; blk<=BLOCKNUMBER.morningBlockEnd; ++blk) {
			if (workingHours.includes(myDay*100+blk)) {
				let hour = Math.floor(blk / 4);
				let minute = MINUTEBLOCK[blk % 4];
				let apptSts = checkAppt(myYear, myMonth, myDate, hour, minute, allAppt);
				morningSlots.push({year: myYear, month: myMonth, date: myDate,
					hour: hour,
					minute: minute,
					dateTime: d, 
					day: myDay,
					slot: HOURSTR[hour] + ":" + MINUTESTR[minute],
					name: apptSts.name,
					visit: apptSts.visit
				});
			}
		}
		// for afternoon slots
		for(let blk=BLOCKNUMBER.afternoonBlockStart; blk<=BLOCKNUMBER.afternoonBlockEnd; ++blk) {
			if (workingHours.includes(myDay*100+blk)) {
				let hour = Math.floor(blk / 4);
				let minute = MINUTEBLOCK[blk % 4];
				let apptSts = checkAppt(myYear, myMonth, myDate, hour, minute, allAppt);
				afternoonSlots.push({year: myYear, month: myMonth, date: myDate,
					hour: hour,
					minute: minute,
					dateTime: d, 
					day: myDay,
					slot: HOURSTR[hour] + ":" + MINUTESTR[minute],
					name: apptSts.name,
					visit: apptSts.visit
				});
			}
		}
		// evening slots
		for(let blk=BLOCKNUMBER.eveningBlockStart; blk<=BLOCKNUMBER.eveningBlockEnd; ++blk) {
			if (workingHours.includes(myDay*100+blk)) {
				let hour = Math.floor(blk / 4);
				let minute = MINUTEBLOCK[blk % 4];
				let apptSts = checkAppt(myYear, myMonth, myDate, hour, minute, allAppt);
				eveningSlots.push({year: myYear, month: myMonth, date: myDate,
					hour: hour,
					minute: minute,
					dateTime: d, 
					day: myDay,
					slot: HOURSTR[hour] + ":" + MINUTESTR[minute],
					name: apptSts.name,
					visit: apptSts.visit
				});
			}
		}
	
		let retValue = {dateTime: d, year: myYear, month: myMonth, date: myDate,
			day: myDay, morningSlots: morningSlots, afternoonSlots: afternoonSlots,
			eveningSlots: eveningSlots
		};
		//console.log(retValue);
		return retValue;
	}
	
	function clinicOff(d, myHoildays) {
		let tmp = myHoildays.filter(x => x.date === d.getDate() &&
				x.month === d.getMonth() && x.year === d.getFullYear());
		if (tmp.length > 0) return true;
			
		// check if doctor's weekend on this date
		tmp = customerData.workingHours.filter(x => 
			x >= (d.getDay()*100 + BLOCKNUMBER.allBlockStart) &&
			x <= (d.getDay()*100 + BLOCKNUMBER.allBlockEnd)
		);
		let isClosed = (tmp.length === 0);
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


	function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 621:
        myMsg = "Invalid patient age";
        break;
			case 1001:
        myMsg = "Invalid date of birth";
        break;
      case 601:
        myMsg = "Patient name already in database";
        break;
      case 611:
        myMsg = "Patient name not found in database";
        break;
    }
    return(
      <div>
        <Typography className={gClasses.error}>{myMsg}</Typography>
      </div>
    )
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
		return getNextDate(firstDate, myHoildays);
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

/*
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
		} else {
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
		} catch (e) {
			console.log(e);
			setPatientArray([]);
		}
	}
	
*/
	
	
	
	async function junkandleSelectPatient_junk(rec) {
		let tmpArray = await reloadAppointmentDetails();
		generateSlots(tmpArray, holidayArray);
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
	

	async function handleAddAppointment(slot) {	
		// check if appoint time before current time. If yes then do not allow.
		let myOrder = generateOrder(slot.year, slot.month, slot.date, slot.hour, slot.minute)
		let currentValidOrder = generateOrderByDate(new Date());
		if (myOrder < currentValidOrder) {
			return alert.error("Appointment of past date/time is not permitted");
		}
			
		let tmp = {
			cid: userCid,
			//data: currentPatientData,
			year: slot.year,
			month: slot.month,
			date: slot.date,
			hour: slot.hour,
			minute: slot.minute,
			order: myOrder,
			pid: currentPatientData.pid,
			displayName: currentPatientData.displayName,
			visit: VISITTYPE.pending,
			apptTime: new Date(slot.year, slot.month, slot.date,
								slot.hour, slot.minute, 0),
		};
		
		let jTmp = JSON.stringify(tmp);
		// add this to database
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/add/${userCid}/${jTmp}`;
			let resp = await axios.get(myUrl);
			alert.success("Appointment set of "+currentPatientData.displayName);
			// update patient appointment
			let tmpArray=[resp.data].concat(apptArray);
			tmpArray = _.sortBy(tmpArray, ['order']);
			setApptArray(tmpArray);
			
			// now update all pending appointment
			tmpArray=[resp.data].concat(allPendingAppt);
			tmpArray = _.sortBy(tmpArray, ['order']);
			setAllPendingAppt(tmpArray);

			// update slot as pending
			if (true) {
				//console.log(currentIndex);
				
				let myTmpSlots = [].concat(allTimeSlots);
				// check if add apt is in morning
				let ttt = myTmpSlots[currentIndex].morningSlots.find(x => x.hour === slot.hour &&
					x.minute === slot.minute);
				//console.log("morning",ttt);
				if (ttt) {
					ttt.name = currentPatientData.displayName
					ttt.visit = 'pending';
				}

				ttt = myTmpSlots[currentIndex].afternoonSlots.find(x => x.hour === slot.hour &&
					x.minute === slot.minute);
				//console.log("afternoon",ttt);
				if (ttt) {
					ttt.name = currentPatientData.displayName
					ttt.visit = 'pending';
				}
				
				ttt = myTmpSlots[currentIndex].eveningSlots.find(x => x.hour === slot.hour &&
					x.minute === slot.minute);
				//console.log("evening",ttt);
				if (ttt) {
					ttt.name = currentPatientData.displayName
					ttt.visit = 'pending';
				}	
				setAllTimeSlots(myTmpSlots);
			}	
		} catch (e) {
			console.log(e);
			alert.error("Error setting appointment of "+currentPatientData.displayName);
			return;
		}
	}
  
	function DisplayAvailableAppointments() {
	if (allTimeSlots.length === 0) return null;
	
	let tStr = ((allTimeSlots[currentIndex].date < 10) ? "0" : "") + allTimeSlots[currentIndex].date;
	tStr += "/";
	tStr += (((allTimeSlots[currentIndex].month + 1) < 10) ? "0" : "") + (allTimeSlots[currentIndex].month+1);
	tStr += "/";
	tStr += allTimeSlots[currentIndex].year;

	return (
	<div>
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="ALLDATE" container alignItems="center" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<Typography className={classes.slotTitle} >{"Appointment Date"}</Typography>
		</Grid>
		<Grid key="LEFT" item xs={1} sm={1} md={1} lg={1} >
			<IconButton color={'primary'} onClick={prevDate}  >
					<LeftIcon />
				</IconButton>
		</Grid>
		{allTimeSlots.map( (t, index) => {
			let dStr = (compareDate(t.dateTime, new Date()) !== 0) 
				? DATESTR[t.date] + "/" + MONTHNUMBERSTR[t.month] + "/" + t.year
				: "Today";
			let freeSlots = t.morningSlots.filter(x => x.visit === "available").length + 
				t.afternoonSlots.filter(x => x.visit === "available").length +
				t.eveningSlots.filter(x => x.visit === "available").length;
			let myClass = (index === currentIndex) ? classes.selIndex : classes.unselIndex;
		return (
		<Grid key={"TIME"+index} item xs={3} sm={3} md={2} lg={2} >
			<div>
			<Typography className={myClass} onClick={() => {setNewCurrentIndex(index)}}>{dStr}</Typography>
			<Typography className={myClass} onClick={() => {setNewCurrentIndex(index)}}>{WEEKSTR[t.day]}</Typography>
			<Typography className={myClass} onClick={() => {setNewCurrentIndex(index)}}>{freeSlots+" free Slots"}</Typography>
			</div>
		</Grid>
		)}
		)}
		<Grid key="RIGHT" item xs={1} sm={1} md={1} lg={1} >
			<IconButton color={'primary'} onClick={nextDate}  >
			<RightIcon />
			</IconButton>
		</Grid>
	</Grid>	
	</Box>
	<BlankArea />
	{/*  Show morningSlots slots */}
	{(allTimeSlots[currentIndex].morningSlots.length > 0) &&
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="MORNING" container alignItems="center" >
	<Grid key="MORNINGITEM" item xs={12} sm={12} md={12} lg={12} >
	<Typography className={classes.slotTitle} >{"Morning (till 12PM) Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].morningSlots.map( (t, index) => {
		return (
			<Grid key={"MOR"+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={classes.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={classes.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={classes.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	}
	{/*  Show afternoon  slots */}
	{(allTimeSlots[currentIndex].afternoonSlots.length > 0) &&
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid key="AFTERNOON" container alignItems="center" >
	<Grid key="AFTERNOONITEM" item xs={12} sm={12} md={12} lg={12} >
	<Typography className={classes.slotTitle} >{"Afternoon (12PM to 4PM) Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].afternoonSlots.map( (t, index) => {
		//console.log("Afternoon slots---------------");
		//console.log(allTimeSlots[currentIndex].afternoonSlots);
		return (
			<Grid key={"AFETR"+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={classes.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={classes.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={classes.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>	
	</Box>
	}
	{/*  Show evening  slots */}
	{(allTimeSlots[currentIndex].eveningSlots.length > 0) &&
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="EVENING" container alignItems="center" >
	<Grid key="EVENINGITEM" item xs={12} sm={12} md={12} lg={12} >
	<Typography className={classes.slotTitle} >{"Evening (from 4PM) Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].eveningSlots.map( (t, index) => {
		return (
			<Grid key={"EVE"+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={classes.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={classes.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={classes.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	}
	</div>
	)}
	
	function DisplayAvailableSlotAppointments() {
	if (allTimeSlots.length === 0) return null;
	
	let tStr = DATESTR[currSlotData.date];
	tStr += "/";
	tStr += MONTHNUMBERSTR[currSlotData.month];
	tStr += "/";
	tStr += currSlotData.year;

	return (
	<div>
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="ALLDATE" container alignItems="center" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
		<Typography className={classes.slotTitle} >{"Appointment Date"}</Typography>
		</Grid>
		<Grid key="LEFT" item xs={1} sm={1} md={1} lg={1} >
			<IconButton color={'primary'} onClick={prevDate}  >
					<LeftIcon />
				</IconButton>
		</Grid>
		{allTimeSlots.map( (t, index) => {
			let dStr = (compareDate(t.dateTime, new Date()) !== 0) 
				? DATESTR[t.date] + "/" + MONTHNUMBERSTR[t.month] + "/" + t.year
				: "Today";
			let freeSlots = t.morningSlots.filter(x => x.visit === "available").length + 
				t.afternoonSlots.filter(x => x.visit === "available").length +
				t.eveningSlots.filter(x => x.visit === "available").length;
			let myClass = (index === currentIndex) ? classes.selIndex : classes.unselIndex;
		return (
		<Grid key={"TIME"+index} item xs={3} sm={3} md={2} lg={2} >
			<div>
			<Typography className={myClass} onClick={() => {setNewCurrentIndex(index)}}>{dStr}</Typography>
			<Typography className={myClass} onClick={() => {setNewCurrentIndex(index)}}>{WEEKSTR[t.day]}</Typography>
			<Typography className={myClass} onClick={() => {setNewCurrentIndex(index)}}>{freeSlots+" free Slots"}</Typography>
			</div>
		</Grid>
		)}
		)}
		<Grid key="RIGHT" item xs={1} sm={1} md={1} lg={1} >
			<IconButton color={'primary'} onClick={nextDate}  >
			<RightIcon />
			</IconButton>
		</Grid>
	</Grid>	
	</Box>
	<BlankArea />
	{/*  Show morningSlots slots */}
	{(currSlotData.length > 0) &&
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="MORNING" container alignItems="center" >
	<Grid key="MORNINGITEM" item xs={12} sm={12} md={12} lg={12} >
	<Typography className={classes.slotTitle} >{currSlotMessage+" Slots of "+currSlotDate}</Typography>
	</Grid>
	{currSlotData.map( (t, index) => {
		return (
			<Grid key={"MOR"+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={classes.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={classes.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={classes.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={classes.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	}
	</div>
	)}
	
	async function handleCancelAppt(cancelAppt) {
		
		let myMsg = `Are you sure you want to cancel appointment of ${cancelAppt.displayName} dated `;
		myMsg += `${DATESTR[cancelAppt.date]}/${MONTHNUMBERSTR[cancelAppt.month]}/${cancelAppt.year} at `;
		myMsg += `${HOURSTR[cancelAppt.hour]}:${MINUTESTR[cancelAppt.minute]}?`;
		
		vsDialog("Cancel Appointment", myMsg,
			{label: "Yes", onClick: () => handleCancelApptConfirm(cancelAppt) },
			{label: "No" }
		);
	}
	
	function getSlotIndex(year, month, date) {
		for(let i=0; i<allTimeSlots.length; ++i) {
			if ((allTimeSlots[i].date === date) && 
				(allTimeSlots[i].month === month) &&
				(allTimeSlots[i].year === year))
			return (i)
		}
		return -1;
	}
	
	async function handleCancelApptConfirm(cancelAppt) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/cancel/${userCid}/${cancelAppt.pid}/${cancelAppt.order}`;
			let resp = await axios.get(myUrl);
			//alert.success("Cancelled appointment of "+cancelAppt.displayName);

			// remove from patient appoint 
			let tmpAppt = apptArray.filter(x => 
				x.pid	!== cancelAppt.pid ||  
				x.order !== cancelAppt.order 
				);
			setApptArray(tmpAppt)
			
			// now remove from all pending apt list
			tmpAppt = allPendingAppt.filter(x => 
				x.pid	!== cancelAppt.pid ||  
				x.order !== cancelAppt.order 
				);
			setAllPendingAppt(tmpAppt);
			//let tmpArray = await reloadAppointmentDetails();
			//generateSlots(tmpArray, holidayArray);
						
			let slotIndex = getSlotIndex(cancelAppt.year, cancelAppt.month, cancelAppt.date);
			if (slotIndex >= 0) {
				let cancelOrder = generateOrder(cancelAppt.year, cancelAppt.month, cancelAppt.date,
					cancelAppt.hour, cancelAppt.minute);
				let currentOrder = generateOrderByDate(new Date());
				let hasExpired = (cancelOrder <= currentOrder);
				let myTmpSlots = [].concat(allTimeSlots);
				
				// check if cancel apt is in morning
				let ttt = myTmpSlots[slotIndex].morningSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}

				ttt = myTmpSlots[slotIndex].afternoonSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}
				
				ttt = myTmpSlots[slotIndex].eveningSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}	
				setAllTimeSlots(myTmpSlots);
			}
		} catch (e) {
			console.log(e);
			alert.error("Error cancelling appointment of "+cancelAppt.displayName);
		}
	}
	
	function DisplayPatientAppointments() {
	return (
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	{(apptArray.length === 0) &&
		<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
		<Grid key={"NoApt"} item xs={12} sm={12} md={12} lg={12} >
			<div align="left"><Typography>No Appointment</Typography></div>
		</Grid>
		</Grid>
	}
	{(apptArray.length > 0) &&
		<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
		{apptArray.map( (a, index) => 
			<Grid key={"Apt"+a.pid+index} item xs={12} sm={6} md={3} lg={3} >
			<DisplayAppointmentBox 
				appointment={a} 
				button1={
					<IconButton color={'secondary'} size="small" onClick={() => { handleCancelAppt(a)}}  >
						<CancelIcon />
					</IconButton>
				}
			/>
			</Grid>
		)}
		</Grid>	
	}
	</Box>
	)}
	
	function DisplayAllPatients() {
	return (
	<Grid className={gClasses.noPadding} key="DATESEL" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientBox 
			patient={m} 
			button1={
				<IconButton className={gClasses.blue} size="small" onClick={() => handleSelectPatient(m) }  >
					<EventNoteIcon  />
				</IconButton>
			}
		/>
		</Grid>
	)}
	</Grid>	
	)}
	
	function setPatientFilter(myArray, filterStr) {
		filterStr = filterStr.trim().toLowerCase();
		let tmpArray = myArray;
		if (filterStr !== "") {
			if (validateInteger(filterStr)) {
				// it is integer. Thus has to be Id
				tmpArray = myArray.filter(x => x.pidStr.includes(filterStr));
			} else {
				tmpArray = myArray.filter(x => x.displayName.toLowerCase().includes(filterStr));
			}
		} 	
		setPatientArray(tmpArray);
	}
	
	function filterPatients(filterStr) {
		setSearchText(filterStr);
		setPatientFilter(patientMasterArray, filterStr);
	}

	async function getAppointmentsByPid(myPid) {
		let myAppt = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/pendinglist/pid/${userCid}/${myPid}`);
			myAppt = resp.data;
		} catch (e) {
			console.log(e);
		}
		finally {
			setApptArray(myAppt);
			return myAppt;
		}
	}

	async function handleSelectPatient(rec) {
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		setSelectPatient(false);
		await getAppointmentsByPid(rec.pid);
		let tmpArray = await reloadAppointmentDetails();	
		generateSlots(tmpArray, holidayArray); // ARS. This is okay and confirmed
	}
	
	function handleAdd() {
		//console.log("handleAdd");
		setPatientName("");
		setPatientAge("");
		setPatientGender("Male")
		setRadioValue("Male");
		setPatientEmail("");
		setPatientMobile("");
		setPatientDob(moment(new Date(2000, 1, 1)));
		
		//setIsAdd(true);
		setIsDrawerOpened(true);
	}
	
	async function handleAddEditSubmit() {
		let myDate = patientDob.toDate();
		let testAge = new Date().getFullYear() - myDate.getFullYear();
		//console.log(testAge, myDate);
		if ((testAge >= 100) || (testAge <= 1)) return setRegisterStatus(1001);
		
		let myMobile = (patientMobile !== "") ? patientMobile : 0;
		let myEmail = (patientEmail !== "") ? patientEmail : "-";
		myEmail = encrypt(myEmail);
		let dobStr = myDate.getFullYear() + MONTHNUMBERSTR[myDate.getMonth()] + DATESTR[myDate.getDate()];
		
		//console.log(myEmail);
		//console.log("Addedit", patientName, dobStr, patientGender, myEmail, myMobile);
		
		let resp;
		let myUrl;
	
		try {
			myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/addwithdob/${userCid}/${patientName}/${dobStr}/${patientGender}/${myEmail}/${myMobile}`;
			resp = await axios.get(myUrl);
			alert.success("Successfully added new patient "+patientName);
		} catch (error)  {
			console.log(error.response.status);
			setRegisterStatus(error.response.status);
			return;
		}
		setIsDrawerOpened(false);

		let ppp = await getAllPatients(userCid);
		setPatientMasterArray(ppp);
		setPatientFilter(ppp, searchText);
		setIsDrawerOpened(false);
		return; 
	}
	


	async function handleMyAppt() {
		let tmpArray = await reloadAppointmentDetails();
		generateSlots(tmpArray, holidayArray);		// ARS This is required and confirmed
		setCurrentPatient("INFO")
		setApptArray([]);
	}

	function handleDate(d) {
		//console.log(d);
		setPatientDob(d);
	}
	
	function handleSlotSelection(txt, mySlotDate) {
		//alert.info(txt);
	setCurrSlotDate(`${DATESTR[mySlotDate.date]}/${MONTHNUMBERSTR[mySlotDate.month]}/${mySlotDate.year}`);
		switch (txt) {
			case "MORNING":
				setCurrSlotMessage("Morning (till 12PM)");
				setCurrSlotData(mySlotDate.morningSlots);
				break;
			case "AFTERNOON":
				setCurrSlotMessage("Afternoon (12PM to 4PM)");
				setCurrSlotData(mySlotDate.afternoonSlots);
				break;
			case "EVENING":
				setCurrSlotMessage("Evening (from 4PM)");
				setCurrSlotData(mySlotDate.eveningSlots);
				break;
		}
	}
	
	function DisplaySlotButton() {
	return (
	<div>
		<Grid className={gClasses.vgSpacing} key="ImageButton" container alignItems="center" >
		<Grid key={"F1"} item xs={false} sm={false} md={3} lg={3} />
		<Grid key={"F2"} item xs={2} sm={2} md={2} lg={2} >
			<VsImageButton image={"MORNING"} onClick={() => handleSlotSelection("MORNING", allTimeSlots[currentIndex])}/>
		</Grid>
		<Grid key={"F3"} item xs={2} sm={2} md={2} lg={2} >
			<VsImageButton image={"AFTERNOON"} onClick={() => handleSlotSelection("AFTERNOON", allTimeSlots[currentIndex])}/>
		</Grid>
		<Grid key={"F4"} item xs={2} sm={2} md={2} lg={2} >
			<VsImageButton image={"EVENING"} onClick={() => handleSlotSelection("EVENING", allTimeSlots[currentIndex])}/>
		</Grid>
		<Grid key={"F5"} item xs={false} sm={false} md={3} lg={3} />
		<Grid key={"F11"} item xs={false} sm={false} md={3} lg={3} />
		<Grid key={"F12"} item xs={2} sm={2} md={2} lg={2} >
			<Typography className={classes.selIndex}>till 12PM</Typography>
		</Grid>
		<Grid key={"F13"} item xs={2} sm={2} md={2} lg={2} >
			<Typography className={classes.selIndex}>12PM to 4PM</Typography>
		</Grid>
		<Grid key={"F14"} item xs={2} sm={2} md={2} lg={2} >
			<Typography className={classes.selIndex}>from 4PM</Typography>
		</Grid>
		<Grid key={"F15"} item xs={false} sm={false} md={3} lg={3} />
		</Grid>
	</div>
	)}
	
	
	
	return (
		<div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Appointment Directory" groupName="" tournament=""/>
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		{(currentPatient === "") && 
			<div>
			<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
			<Grid key={"F1"} item xs={false} sm={false} md={2} lg={2} />
			<Grid key={"F2"} item xs={12} sm={12} md={4} lg={4} >
				{/*<TextField id="filter"  padding={5} fullWidth label="Search Patient by name or Id" 
					defaultValue={searchText}
					onChange={(event) => filterPatients(event.target.value)}
					InputProps={{endAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>)}}
				/>*/}
				<VsTextSearch label="Search Patient by name or Id" value={searchText}
					onChange={(event) => filterPatients(event.target.value)}
					onClear={(event) => filterPatients("")}
				/>				
			</Grid>
			<Grid key={"F4"} item xs={false} sm={false} md={3} lg={3} >
			</Grid>
			<Grid key={"F5"} item xs={6} sm={6} md={1} lg={1} >
				<VsButton name="New Patient" onClick={handleAdd} />
				
			</Grid>
			<Grid key={"F6"} item xs={6} sm={6} md={2} lg={2} >
				<VsButton name="My Appointments" onClick={handleMyAppt}/> 
			</Grid>
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
			{(currentPatient === "INFO") ?
				"Appointment Information" :
				currentPatientData.displayName+" ( Id: "+currentPatientData.pid+" ) "
			}
			</Typography>	
			<BlankArea />
			{(currentPatient !== "INFO") &&
				<DisplayPatientAppointments />
			}
			{(true) &&
				<div>
				<DisplaySlotButton />
				{/*<DisplayAvailableAppointments />*/}
				<DisplayAvailableSlotAppointments />
				</div>
			}
			</Box>
		}
		<Drawer className={classes.drawer}
			anchor="right"
			variant="temporary"
			open={isDrawerOpened}
		>
		{(true) &&
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened(false)}} />
		<ValidatorForm align="center" className={classes.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{"Add Patient"}</Typography>
			<TextValidator fullWidth  className={gClasses.vgSpacing}
				id="newPatientName" label="Name" type="text"
				value={patientName} 
				onChange={() => { setPatientName(event.target.value) }}
      />
			{/*<TextValidator  fullWidth className={gClasses.vgSpacing}
				id="newPatientAge" label="Age" type="number"
				value={patientAge}
				onChange={() => { setPatientAge(event.target.value) }}
				validators={['minNumber:1', 'maxNumber:99']}
        errorMessages={['Age to be above 1', 'Age to be less than 100']}				
      />*/}
			<div align="left">
			<Typography className={gClasses.vgSpacing}>Date of Birth</Typography>
			</div>
			<Datetime 
				className={classes.dateTimeBlock}
				inputProps={{className: classes.dateTimeNormal}}
				timeFormat={false} 
				initialValue={patientDob}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={handleDate}
				closeOnSelect={true}
			/>
			<BlankArea />
			<FormControl component="fieldset">
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
					onChange={() => {setRadioValue(event.target.value); setPatientGender(event.target.value); }}
				>
				<FormControlLabel className={classes.filterRadio} value="Male" 		control={<Radio color="primary"/>} label="Male" />
				<FormControlLabel className={classes.filterRadio} value="Female" 	control={<Radio color="primary"/>} label="Female" />
				<FormControlLabel className={classes.filterRadio} value="Other"   control={<Radio color="primary"/>} label="Other" />
			</RadioGroup>
			</FormControl>
			<TextValidator   fullWidth   className={gClasses.vgSpacing} 
				id="newPatientEmail" label="Email" type="email"
				value={patientEmail} 
				onChange={() => { setPatientEmail(event.target.value) }}
      />
			<TextValidator fullWidth required className={gClasses.vgSpacing} 
				id="newPatientMobile" label="Mobile" type="number"
				value={patientMobile} 
				onChange={() => { setPatientMobile(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
        errorMessages={['Invalid Mobile number','Invalid Mobile number']}
      />	
			<ShowResisterStatus />
			<BlankArea />
			<VsButton name={"Add"} />
			</ValidatorForm>    		
			</Box>
		}
		</Drawer>		
		</Container>				
  </div>
  );    
}