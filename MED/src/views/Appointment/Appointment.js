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


// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
//import CancelIcon from '@material-ui/icons/Cancel';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

//colors 
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
} from "views/functions.js";


const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
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

const str1by4 = String.fromCharCode(188)
const str1by2 = String.fromCharCode(189)
const str3by4 = String.fromCharCode(190)

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

const WEEKSTR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHSTR = ["January", "February", "March", "April", "May", "June",
							"July", "August", "September", "October", "November", "December"];						
let YEARSTR = ["2020", "2021", "2022"];

let WEEKENDS=[1, 2, 6];		// sat and sun are week ends

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


var userCid
export default function Appointment() {
  const classes = useStyles();
	const gClasses = globalStyles();
	
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
	const [holidayArray, setHoildayArray] = useState([]);
	const [menuData, setMenuData] = useState({});
	const [apptCountArray, setApptCountArray] = useState([]);
	
	const [cancelAppt, setCancelAppt] = useState({});
	
	const [registeredPatient, setRegisteredPatient] = useState(true);
	//const [searchText, setSearchText] = useState("");
	const [newErrorMessage, setNewErrorMessage] = useState("");
	const [newAppointment, setNewAppointment] = useState(false);
  const [patientArray, setPatientArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	
	//const [currentAppointment, setCurrentAppointment] = useState({});
	
	
	const [apptHour, setApptHour] = useState("");
	const [apptMinute, setApptMinute] = useState(MINUTESTR[0]);
	const [apptArray, setApptArray] = useState([]);
	const [masterApptArray, setMasterApptArray] = useState([]);
	
  useEffect(() => {	
		const checkPatient = async () => {		
			// check if appointment has been called from Patient view
			let newDirMode = true;
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
				// no share data. Thus called directly
				//console.log("direct");
			}
			return newDirMode;
		}

		const getData = async (month, year) => {
			let dirMode = await checkPatient();
			setDirectoryMode(dirMode);
			if (dirMode) {
				let myCounts = await getMonthlyAppointmentCounts(month, year);
				await generateMatrix(month, year, myCounts);
			}
		}
		
		userCid = sessionStorage.getItem("cid");
		// make year
		WEEKENDS = [0, 6];			//JSON.parse(`${process.env.REACT_APP_WEEKENDS}`)
		let x = `${process.env.REACT_APP_WEEKENDS}`;
		
		let istart = Number(`${process.env.REACT_APP_STARTTIME}`);
		let iend = Number(`${process.env.REACT_APP_ENDTIME}`);
		HOURSTR = ALLHOURSTR.slice(istart, iend);
		
		setApptHour(HOURSTR[0]);
		
		let tmp = new Date();
		let yyyy = tmp.getFullYear();
		setYear(yyyy.toString());
		
		YEARSTR=[];	
		YEARSTR.push((yyyy-1).toString());
		YEARSTR.push((yyyy+0).toString());
		YEARSTR.push((yyyy+1).toString());
		
		// make month
		let mmm = tmp.getMonth();
		setMonth(MONTHSTR[mmm]);
		
		getData(MONTHSTR[mmm], yyyy.toString());
  }, []);

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
	
	function DisplayMonthYear() {
	return (
	<Grid className={classes.noPadding} key="MonthYear" container justify="center" alignItems="center" >
			<Grid item xs={2} sm={2} md={2} lg={2} />
			<Grid item xs={3} sm={3} md={3} lg={3} >
				<Select labelId='month' id='month' name="month" padding={10} key="GETMONTH" 
					variant="outlined" required fullWidth label="Month"
					className={classes.select}
					value={month}
					inputProps={{
							name: 'GETMONTH',
							id: 'GETMONTH',
					}}
					onChange={(event) => handleSetMonthYear(event.target.value, true)}
				>
					{MONTHSTR.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
				</Select>
			</Grid>
			<Grid item xs={3} sm={3} md={3} lg={3} >
				<Select labelId='year' id='year' name="year" padding={10} key="GETYEAR" 
					variant="outlined" required fullWidth label="Year"
					className={classes.select}
					value={year}
					inputProps={{
							name: 'GETYEAR',
							id: 'GETYEAR',
					}}
					onChange={(event) => handleSetMonthYear(event.target.value, false)}
				>
					{YEARSTR.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
				</Select>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<VsButton name="Select" onClick={handleMonthYearSelect} />
			</Grid>	
			<Grid item xs={3} sm={3} md={3} lg={3} />
		</Grid>	
	)}

	function handleSetMonthYear(mmmyyy, isMonth) {
		setApptMatrix([]);
		setMonthlyMode(true);
		if (isMonth)
			setMonth(mmmyyy);
		else
			setYear(mmmyyy);	
	}
	
	async function handleMonthYearSelect() {
		//console.log("In handleMonthYearSelect");
		setMonthlyMode(true);
		// last day
		let tmp = new Date(Number(year), MONTHSTR.indexOf(month)+1, 0)
		setLastDayOfMonth(tmp.getDate());
		
		let myCounts = await getMonthlyAppointmentCounts(month, year)
		await generateMatrix(month, year, myCounts);
	}
	
	async function getMonthlyAppointmentCounts(month, year) {
		let myData = [];
		
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/count/month/${userCid}/${year}/${MONTHSTR.indexOf(month)}`
		try {
			let resp = await axios.get(myUrl);
			myData = resp.data;
		} catch(e) {
			console.log(e);
		}	
		setApptCountArray(myData);
		return myData;
	}
	
	async function generateMatrix(myMonth, myYear, myCounts) {
		//console.log("In matrix generation");
		//console.log(myCounts);
		
		
		let iMonth = MONTHSTR.indexOf(myMonth);
		let iYear = Number(myYear);
		
		let myHoildays = await getHoildays(iYear, iMonth);
		let tmp = [];

		// update week days/ends before 1st of month
		var d = new Date(iYear, iMonth, 1);
		for(let i=0; i<d.getDay(); ++i)
			tmp.push(DUMMYDAY);
		
		// all days of this month
		
		// for today
		d = new Date();
		let today = { date: d.getDate(), month: d.getMonth(), year: d.getFullYear() }

		// get last date
		d = new Date(iYear, iMonth+1, 0);
		let lastDate = d.getDate();
		for (let i=1; i<=lastDate; ++i) {
			let dType = TODAYTYPE;
			// special colour for today appointment
			if ((today.date !== i) || (today.month !== iMonth) || (today.year !== iYear)) {
				d = new Date(iYear, iMonth, i);
				// check if holiday/monthly
				let hhh = myHoildays.find(x => x.date == i);
				if (hhh) {
					dType = HOLIDAYTYPE;		
				} else if (WEEKENDS.includes(d.getDay())) {
					dType = WEEKENDTYPE;
				} else
					dType = WEEKDAYTYPE;
			}
			// get counts of this date
			let ccc = myCounts.find(x => x.date == i);
			//console.log(ccc);
			let xxx = {date: i, dayType: dType, apptCount: (ccc) ? ccc.pending : 0}
			tmp.push(xxx);
		}
		
		// update week days/ends after last day of month
		//d = new Date(iYear, iMonth+1, 0);
		//for(let i=(d.getDay()+1); i<=6; ++i)
		let bal = tmp.length % 7;
		for(let i=bal; i<7; ++i)
			tmp.push(DUMMYDAY);

		let matrix=[];
		//let rows = tmp.length / 7;
		for (let start=0, end=7; start < tmp.length; start += 7, end +=7)  
			matrix.push(tmp.slice(start,end));

		for(let r=0; r<matrix.length; ++r) {
		for(let c=0; c<7; ++c) {
			matrix[r][c].row = r;
			matrix[r][c].col = c;
		}}
		setApptMatrix(matrix);
		//console.log(matrix);
	}
	
	async function getHoildays(year, month) {
		// note month will be in the range 0 to 11 for Jan to Dec
		let tmp = [];
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/monthly/${userCid}/${year}/${month}`)
			tmp = resp.data;
			//console.log(resp.data);
		} catch (e) {
			console.log(e);
		}	
		setHoildayArray(tmp);
		return tmp;
	}
	
	function DisplayApptMatrix() {
	if (apptMatrix.length == 0) return null;
	return(
	<div>
	<Typography className={classes.th}>{"Appointment calender of "+month + ' ' + year}</Typography>
	<BlankArea />
	<TableContainer>
	<Table
		className={classes.table}
		aria-labelledby="tableTitle"
		size={dense ? 'small' : 'medium'}
		aria-label="enhanced table"
	>
	<TableHead>
		<TableRow align="center">
		{WEEKSTR.map( (w, index)  =>
			<TableCell key={"TD"+index} align="center" component="th" scope="row" align="center" padding="none"
			className={classes.th}>
			{w}
			</TableCell>
		)}
		</TableRow>
	</TableHead>
	<TableBody> 
	{apptMatrix.map( (days7, index) => 
		<TableRow key={"TROW"+index}>
		{days7.map( (d, index)  => {
		//console.log(d);
		let myClass = null;
		switch (d.dayType) {
			case ""         : myClass = classes.noday; break
			case WEEKDAYTYPE: myClass = classes.wd; break;
			case HOLIDAYTYPE: myClass = classes.ho; break;
			case WEEKENDTYPE: myClass = classes.we; break;
			case TODAYTYPE: myClass = classes.today; break;
		}
		return(
		<TableCell key={"TD"+d.date+index} align="center" component="td" scope="row" align="center" padding="none"
		className={myClass}
		onClick={() => {handleDateClick(d)}}
		>
		{(d.date != 0) && <div>
			<Avatar size="small" className={classes.orange}>{d.date}</Avatar>
			<Typography padding="none" align="center">{(d.apptCount > 0) ? d.apptCount+" Appt" : ""}</Typography>
		</div>}
		{(d.date == 0) && <div>
		<Typography padding="none" align="center">--</Typography>
		</div>}
		</TableCell>)}
		)}
		</TableRow>	
	)}
	</TableBody>
	</Table>
	</TableContainer>
	</div>
	)}
	
	async function handleDateClick(x) {
		if (x.date == 0) return; // no action on dummy day
		setMenuData(x);
		openModal("TABLECELL");
	}
	
	function DisplayTableCellMenu() {
	//console.log("Show Menu function");
	//console.log(menuData);
	return (
		<div align = "center">
			<Typography>{menuData.date + " " + month + " " + year}</Typography>
			<DisplayCloseModal />
			<BlankArea />
			{/*<Button 
			variant="contained" color="primary" className={gClasses.submit}
			onClick={() => { setHoliday(menuData, (menuData.dayType != HOLIDAYTYPE) ? "OFF" : "ON") }}
			>{(menuData.dayType != HOLIDAYTYPE) ? "Clinic Off" : "Clinic On"}</Button>
			<Button 
				variant="contained" color="primary" className={gClasses.submit}
				onClick={() => { handleDailyAppointments(menuData) }}
			>Appointment</Button>*/}
			<VsButton name={(menuData.dayType != HOLIDAYTYPE) ? "Clinic Off" : "Clinic On"}  onClick={() => { setHoliday(menuData, (menuData.dayType != HOLIDAYTYPE) ? "OFF" : "ON") }} />
			<VsButton name="Appointment"  onClick={() => { handleDailyAppointments(menuData) }} />
		</div>
	)}
	
	function DisplayCloseModal() {
	return (
		<VsCancel align="right" onClick={closeModal} />
	)}
	
	async function setHoliday(mData, todo) {
		let tmp=[].concat(apptMatrix);
		
		if (todo == "OFF") {
			// declare this as holiday
			
			let myurl = `${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/set/${userCid}/${year}/${MONTHSTR.indexOf(month)}/${mData.date}/clinicoff`
			try {
				let resp = await axios.get(myurl);
				let ha = [].concat(holidayArray);
				ha.push(resp.data);
				//console.log(resp.data);
				setHoildayArray(ha);
				tmp[mData.row][mData.col].dayType	= HOLIDAYTYPE;
			} catch (e) {
					console.log(e)
			}	
		} else {
			// declare this as not a holiday
			
			let myurl = `${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/delete/${userCid}/${year}/${MONTHSTR.indexOf(month)}/${mData.date}`;
			try {
				let resp = await axios.get(myurl);
				let ha = holidayArray.filter(x => x.date != mData.date);
				setHoildayArray(ha);
				tmp[mData.row][mData.col].dayType	= HOLIDAYTYPE;
				
				let d = new Date(Number(year), MONTHSTR.indexOf(month), mData.date);
				let myDayType = WEEKENDS.includes(d.getDay()) ? WEEKENDTYPE : WEEKDAYTYPE;
				tmp[mData.row][mData.col].dayType = myDayType;
			} catch (e) {
					console.log(e)
			}	
		}
		setApptMatrix(tmp);
		//console.log(tmp[mData.row][mData.col]);
		//console.log(tmp);
		closeModal();
	}
	
	// Start of DAILY Appointment
	
	async function handleDailyAppointments(ddd) {
		closeModal();
		setNewAppointment(false);
		setMonthlyMode(false);
		// init data of daily apptArray
		
		setNewAppointment(false);
		setSearchText("");
		setPatientArray([]);
		setCurrentPatient("");
		setCurrentPatientData({});
		setApptHour(HOURSTR[0]);
		setApptMinute(MINUTESTR[0]);
		
		let today = new Date();	
		let apptDate = new Date(Number(year), MONTHSTR.indexOf(month), menuData.date+1);
		let myCheck = (apptDate.getTime() <= today.getTime());
		setBeforeToday(myCheck);
		
		// now get appointers from database
		let newRadio = "pending";
		setRadioValue(newRadio);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/list/date/${userCid}/${year}/${MONTHSTR.indexOf(month)}/${menuData.date}`
			let resp = await axios.get(myUrl);
			let tmpArray = resp.data
			tmpArray.sort((a, b) => { return a.order - b.order;});
			setMasterApptArray(tmpArray);
			updateRadioFilter(tmpArray, newRadio);
		} catch (e) {
			console.log(e);
			setMasterApptArray([]);
			setApptArray([]);
		}
	}
	
	function DisplayDailyAppointments() {
	return(
	<div>
	<Typography className={classes.title}>{"Appointments of "+ordinalSuffix(menuData.date)+' '+month + ' ' + year}</Typography>
	<DisplayNewApptBtn />
	{(newAppointment) && 
		<div>
		{(!selectPatient) &&
			<Typography align="right" className={classes.link}>
				<Link href="#" variant="body2" onClick={() => { setCurrentPatient(""); setSelectPatient(true); }}>Select Patient</Link>
			</Typography>
		}
		{(selectPatient) &&
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<VsCancel align="right" onClick={() => {setSelectPatient(false)}} />
			<Typography>
					<span className={classes.patientName}>Select Patient</span>
			</Typography>
			<DisplayFilter />
			<Grid className={classes.noPadding} key="AllPatients" container alignItems="center" >
				{patientArray.map( (m, index) => 
					<Grid key={"PAT"+index} item xs={12} sm={6} md={4} lg={4} >
					<DisplayPatientDetails 
						patient={m} 
						button1={<VsButton name="Select"  color='green' onClick={() => { handleSelectPatient(m)}} />}
					/>
					</Grid>
				)}
			</Grid>
			</Box>
		}
		<DisplayNewAppointment />
		</div>
	}
	<DisplayBlockAppointments myArray={apptArray} />
	</div>
	)}
	
	function DisplayNewApptBtn() {
		//console.log("NEW APPT Step 1");
		if (newAppointment) return null;
		
		if (directoryMode) {
			//console.log(menuData);
			// check if old date. If old date do not allow new appointment
			let selDate = new Date(Number(year), MONTHSTR.indexOf(month), menuData.date, 0, 0, 0);
			
			let today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			
			//console.log(today.getTime());
			//console.log(selDate.getTime());
			let s = Math.floor(selDate.getTime() / 1000);
			let t = Math.floor(today.getTime() / 1000);
			
			if (s < t) return null;

			// clear up current patient/$
			//setCurrentPatient("");
			//setCurrentPatientData({});
		}

		
		return (
			<Typography align="right" className={gClasses.link}>
				<Link href="#" onClick={() => { 
					setNewAppointment(true); 
					//setRegisteredPatient(false); 
					//setNewErrorMessage("")
					//setCurrentPatient("");
					//setCurrentPatientData({});
					setSearchText("")
					//setCurrentPatientData({});
					}
				} variant="body2">Add New Appointment</Link>
			</Typography>
		);
	}
	
	async function selectPatientForNewAppointment(name) {
		console.log(name);
		//console.log(patientArray);
		let pRec = patientArray.find(x => x.displayName == name);
		console.log(pRec);
		setCurrentPatient(pRec.displayName);
		setCurrentPatientData(pRec);
	}
	

	
	function handleDate(d) {
		setAptDate(d.toDate());
	}
	
	function handleTime(d) {
		setAptTime(d.toDate());
	}
	
	function DisplayNewAppointment() {
	//console.log("NewAppt", currentPatientData);
	//console.log("dir mode", directoryMode);
	
	if (directoryMode) {
		setAptDate(new Date(Number(year), MONTHSTR.indexOf(month), menuData.date))
	} else {
		setAptDate(new Date())
	}
	setAptTime(new Date(2021, 9,1, 10, 0));
	
	//let myMin = new Date().toString();
	//let myMax = new Date(2021,11, 31).toString();
	//let yyy = new Date(2021, 1, 1, 9, 0);
	
	return(
		<Box className={classes.newAppt} border={1} >
		<CssBaseline />
		<VsCancel align="right" onClick={handleNewAppointmentCancel} />
		<Typography className={classes.switchText}>New Appointment</Typography>
		<BlankArea />
		{(currentPatient != "") &&
			<div>
			{/*<Typography className={classes.apptName}>
				{currentPatient + " (Id: " + currentPatientData.pid  + ") " + currentPatientData.age + currentPatientData.gender.substr(0,1)}
			</Typography>*/}
			<Grid key="DateTime" container justify="right" alignItems="center" >
				<Grid item xs={false} sm={false} md={1} lg={1} />
				<Grid item xs={12} sm={12} md={3} lg={3} >
					<Typography className={classes.apptName}>
					{currentPatient + " (Id: " + currentPatientData.pid  + ") " + dispAge(currentPatientData.age, currentPatientData.gender)}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={12} md={2} lg={2} >
					<Datetime 
						className={classes.dateTimeBlock}
						inputProps={{className: classes.dateTimeNormal}}
						timeFormat={false} 
						initialValue={aptDate}
						dateFormat="DD/MM/yyyy"
						isValidDate={(directoryMode) ? disableAllDt : disablePastDt}
						onClose={handleDate}
					/>
				</Grid>
				<Grid item xs={12} sm={12} md={2} lg={2} >
					<Datetime 
						className={classes.dateTimeBlock}
						inputProps={{className: classes.dateTimeNormal}}
						dateFormat={false} 
						timeFormat="HH:mm"
						initialValue={aptTime}
						timeConstraints={{minutes: { step: 15, }}}
						onClose={handleTime}
					/>
				</Grid>
				<Grid item xs={12} sm={12} md={2} lg={2} >
					<VsButton name="Add New" onClick={handleNewAppointmentSubmit} />
				</Grid>
				<Grid item xs={false} sm={false} md={2} lg={2} />			
				</Grid>
			</div>
		}
		</Box>
	)}
	
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
	
	async function findNewPatient() {
		console.log("in findNewPatient");
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/new/${userCid}/${userCid}/${searchText}`)
			console.log(resp.data);
			let tmp = resp.data;
			console.log(resp.data.record);
			setCurrentPatientData(resp.data.record);
			setCurrentPatient(resp.data.record.displayName);
		} catch (e) {
			console.log(e);
			setNewErrorMessage("Invalid/Duplicate Patient");
			setCurrentPatientData({});
			setCurrentPatient("");
		}
	}
	
	async function updatePatient(name) {
		//console.log(name);
		//console.log(patientArray);
		let pRec = patientArray.find(x => x.displayName == name);
		//console.log(pRec);
		setCurrentPatient(pRec.displayName);
		setCurrentPatientData(pRec);
	}
	
	
	async function handleNewAppointmentSubmit() {
		//console.log(aptDate);
		//console.log(aptTime);
		let myYear = aptDate.getFullYear();
		let myMonth = aptDate.getMonth();
		let myDate =  aptDate.getDate();
		let myHour = aptTime.getHours();
		let myMin = aptTime.getMinutes();
		//console.log(myYear, myMonth, myDate, myHour, myMin);
		
		// check if appointment of same date and time for the user already there (type pending)
		let sameTime = masterApptArray.filter(x => x.visit === VISITTYPE.pending &&
			x.year == myYear && x.month == myMonth && x.date === myDate &&
			x.hour == myHour && x.minute == myMin && x.pid === currentPatientData.pid);
			//console.log("SAME", sameTime);
			//x.hour === Number(apptHour) && x.minute === Number(apptMinute));
		if (sameTime.length > 0) {
			//alert("Duplicate appointment.");
			callYesNo(openModal, "sametime", 
				`Duplicate Appoint of ${currentPatientData.displayName}`, 
				`Appointment already exists of specified time.`, 
				"Ok", "", false);
			return;	
		}
			handleAddApptConfirm();
	}	
	
	function handleNewAppointmentCancel() {
		setNewAppointment(false);
		// clear all
		//setSearchText("");
		//setPatientArray([]);
		//setCurrentPatient("");
		//setCurrentPatientData({});
		//setApptHour(HOURSTR[0]);
		//setApptMinute(MINUTESTR[0]);
	}	
	
	async function handleCancelAppt(appt) {
		// confirm cancel
		console.log(appt);
		setCancelAppt(appt);
		callYesNo(openModal, "cancel", 
				`Cancel Appointment of ${appt.displayName}`, 
				`Are you sure you want to cancel?`, 
				"Yes", "No", false);
		return;
	}
	
	
	async function handleVisitAppt(appt) {
		let myData = {
			caller: "APPOINTMENT",
			patient: null,
			appointment: appt
		}
		sessionStorage.setItem("shareData", JSON.stringify(myData));
		setTab(process.env.REACT_APP_VISIT);
	}
	
	
	async function handleEditAppt(appt) {
		console.log(appt);
		setCurrentPatient(appt.displayName);
		setCurrentPatientData(appt);
		setAptDate(appt.apptTime);
		setAptTime(appt.apptTime);
		setNewAppointment(true);
	}
	
	
	function handleChange(v) {
		console.log(v);
		setRadioValue(v);
		updateRadioFilter(masterApptArray, v);
	}
	
	function DisplayFilterRadios() {
	return (	
		<FormControl component="fieldset">
		{/*<FormLabel component="legend">Filter on</FormLabel>*/}
		<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
			onChange={() => {handleChange(event.target.value); }}
		>
			<FormControlLabel className={classes.filterRadio} value="all" 			control={<Radio color="primary"/>} label="All appointments" />
			<FormControlLabel className={classes.filterRadio} value="pending" 	control={<Radio color="primary"/>} label="Pending  appointments" />
			<FormControlLabel className={classes.filterRadio} value="visit"  		control={<Radio color="primary"/>} label="Visit completed" />
			<FormControlLabel className={classes.filterRadio} value="cancelled" control={<Radio color="primary"/>} label="Cancelled  appointments" />
		</RadioGroup>
	</FormControl>
	)}
	
	function DisplayBlockAppointments(props) {
	let colCount = isMobile() ? 6 : 7;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{"Appointment List"}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH3"} component="th" scope="row" align="center" padding="none"
						className={classes.th} colSpan={colCount}>
						<DisplayFilterRadios />
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Patient
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Date
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Time
					</TableCell>
					{(!isMobile()) && 
					<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Status
					</TableCell>
					}
					<TableCell key={"TH26"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={3}>
					cmd
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{props.myArray.map( (a, index) => {
				let ooo = a.order.toString();				

				let myDate = ooo.substr(6,2) + "-" + 
					intString(Number(ooo.substr(4,2))+1, 2) + "-" + 
					(isMobile() ? ooo.substr(2, 2) : ooo.substr(0, 4));

				let myTime = ooo.substr(8,2) + ":" + ooo.substr(10,2)
				let myVisit;
				let myClass; 
				switch (a.visit) {
					case VISITTYPE.pending: myVisit = "Pending"; myClass = classes.tdPending; break;
					case VISITTYPE.cancelled: myVisit = "Cancelled"; myClass = classes.tdCancel; break;
					default: myVisit = "Visit"; myClass = classes.tdVisit; break;
				}
				let visitAppt = (a.visit !== VISITTYPE.pending);
				let editAppt = (a.visit !== VISITTYPE.pending);
				let cancelAppt = (a.visit !== VISITTYPE.pending);
				let myName = a.displayName + (isMobile() ? "" : " (ID: " + a.pid + ")");
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myName}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myDate}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myTime}
						</Typography>
					</TableCell>
					{(!isMobile()) &&
					<TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
							<Typography className={classes.apptName}>
							{myVisit}
							</Typography>
					</TableCell>
					}
					<TableCell key={"TD11"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<IconButton color="primary" disabled={visitAppt} size="small" onClick={() => { handleVisitAppt(a) } } >
							<LocalHospitalIcon	 />
						</IconButton>
					</TableCell>
					<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<IconButton color="primary" disabled={editAppt} size="small" onClick={() => { handleEditAppt(a) } } >
							<EditIcon	 />
						</IconButton>
					</TableCell>
					<TableCell key={"TD13"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<VsCancel disabled={cancelAppt} onClick={() => { handleCancelAppt(a) } } />
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	

	
	const LoadingIndicator = props => {
		const { promiseInProgress } = usePromiseTracker();
		return (
			promiseInProgress && 
			<h1>Hey some async call in progress ! </h1>
			);  
	}
	
	//=================
	
	function initCommon() {
		setApptMatrix([]);
		setMasterApptArray([]);
		setApptArray([]);
		setCurrentPatient("");
		setCurrentPatientData({});
		setBeforeToday(true);
		setPatientArray([]);
		setSelectPatient(false);
	}
	
	function initDirectoryModeData() {
		initCommon();
	}
	
	function initFilterModeData() {
		initCommon();
	}
	
	async function toggleDirectoryMode() {
		let newMode = !directoryMode;
		if (newMode)	{
			initDirectoryModeData();
			let myCounts = await getMonthlyAppointmentCounts(month, year);
			await generateMatrix(month, year, myCounts);
		} else {
			initFilterModeData();
		}
		setDirectoryMode(newMode);
	}
	
	function updateRadioFilter(mainArray, opt) {
		//console.log(radioValue);
		//console.log(mainArray)
		//console.log(VISITTYPE)
		let fArray = [];
		//for(let i=0; i<
		switch (opt) {
			case "all" : fArray = [].concat(mainArray); break;
			case "pending" : fArray = mainArray.filter(x => x.visit === VISITTYPE.pending); break;
			case "cancelled" : fArray = mainArray.filter(x => x.visit === VISITTYPE.cancelled); break;
			case "visit" : 
				fArray = mainArray.filter(x => x.visit !== VISITTYPE.cancelled &&
					x.visit !== VISITTYPE.pending); 
				break;
		}
		//console.log("fil", fArray);
		//console.log("can", dArray);
		setApptArray(fArray);
	}
	
	
	async function addNewPatient() {
		//let myName=document.getElementById("emurName").value;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/new/${userCid}/${emurName}`;
			let resp = await axios.get(myUrl);
			closeModal();
			setPatientArray([resp.data]);
		} catch(e) {
			console.log(e);
			setModalRegister(401);
		}
	}
	
	function DisplayNewPatient() {
	return (	
	<Container component="main" maxWidth="md">
		<VsCancel align="right" onClick={closeModal} />
		<Typography align="center" className={classes.modalHeader}>"Input new Patient Name"</Typography>
		<BlankArea />
			<ValidatorForm align="center" className={gClasses.form} onSubmit={addNewPatient} >
			<Grid key="NewPatirnt" container justify="center" alignItems="center" >
				<Grid item xs={10} sm={10} md={10} lg={10} >
					<TextValidator variant="outlined" required fullWidth color="primary"
						id="emurName" label="New Patient Name" name="emurName"
						onChange={(event) => setEmurName(event.target.value)}
						autoFocus
						value={emurName}
					/>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<VsButton name="New Patient" />
				</Grid>
			</Grid>
			</ValidatorForm>
			<ModalResisterStatus />
	</Container>
	)}
	
	function DisplayFilter() {
	return (	
	<Grid className={classes.noPadding} key="Filter" container justify="center" alignItems="center" >
		<Grid item xs={false} sm={false} md={3} lg={3} />
		<Grid item xs={9} sm={9} md={6} lg={6} >
			<TextField id="filter"  padding={5} variant="outlined" fullWidth label="Patient Name / Id" 
				defaultValue={searchText}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<SearchIcon onClick={selectFilter}/>
						</InputAdornment>
				)}}
			/>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
			<VsButton name="New Patient" onClick={() => { setEmurName(""); openModal("NEWPATIENT")}} />	
		</Grid>	
	</Grid>
	)}
	
	async function selectFilter() {
		let myText = document.getElementById("filter").value;
		//console.log(myText);
		setSearchText(myText);
		let ppp = await updatePatientByFilter(searchText, userCid);
		setPatientArray(ppp)
	}
	
	async function getAppointmentsByPid(myPid) {
		//let myData = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/list/pid/${userCid}/${myPid}`);
			//console.log(resp.data);
			let newRadio = "all";
			setRadioValue(newRadio);
			let tmpArray = resp.data
			tmpArray.sort((a, b) => { return b.order - a.order;});
			setMasterApptArray(tmpArray);
			updateRadioFilter(tmpArray, newRadio);
		} catch (e) {
			console.log(e);
			setMasterApptArray([])
			setApptArray([]);
		}
		//return myData;
	}

	async function selectCurrentPatient(name) {
		setCurrentPatient(name);
		//console.log(name);
		let tmp = patientArray.find(x => x.displayName === name);
		setCurrentPatientData(tmp);
		//console.log(tmp);
		getAppointmentsByPid(tmp.pid);
		return;
		
		// now get the appoints
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/list/pid/${userCid}/${tmp.pid}`);
			//console.log(resp.data);
			let newRadio = "all";
			setRadioValue(newRadio);
			let tmpArray = resp.data
			tmpArray.sort((a, b) => { return b.order - a.order;});
			setMasterApptArray(tmpArray);
			updateRadioFilter(tmpArray, newRadio);
		} catch (e) {
			console.log(e);
			setMasterApptArray([])
			setApptArray([]);
		}
	}
	
	
	function org_DisplayPatientVisit(props) {
		{/*if (apptArray.length === 0)
		return (<Typography>No appointment</Typography>);*/}
	
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableBody>  
			{apptArray.map( (a, index) => {
				let ooo = a.order.toString();
				let myDate = ooo.substr(6, 2) + "-" + ooo.substr(4, 2) + "-" + ooo.substr(0, 4);
				let myTime = ooo.substr(8, 2) + ":" + ooo.substr(10, 2);
				let myVisit = "Over";
				if (a.visit === "pending")	myVisit = "Pending";
				if (a.visit === "cancelled")	myVisit = "Cancelled";
				
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<Typography className={classes.apptName}>
							{a.data.displayName + " (ID: " + a.pid + ")"}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<Typography className={classes.apptName}>
							{a.data.age + "  " + a.data.gender.substr(0,1)}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<Typography className={classes.apptName}>
							{myDate + " " + myTime}
						</Typography>
					</TableCell>
					<TableCell key={"TD7"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<Typography className={classes.apptName}>
							{myVisit}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<IconButton color="primary"  size="small" onClick={() => { handleEditAppt(a) } } >
							<EditIcon	 />
						</IconButton>
					</TableCell>
					<TableCell key={"TD6"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<VsCancel onClick={() => { handleCancelAppt(a) } } />
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	
	
	async function handleSelectPatient(rec) {
		setSelectPatient(false);
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		if (directoryMode) {
			
		} else {
			await getPatientAppt(rec);
		}
	}
	
	async function getPatientAppt(rec) {
		//let myData = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/list/pid/${userCid}/${rec.pid}`);
			//console.log(resp.data);
			let newRadio = "all";
			setRadioValue(newRadio);
			let tmpArray = resp.data
			tmpArray.sort((a, b) => { return b.order - a.order;});
			setMasterApptArray(tmpArray);
			updateRadioFilter(tmpArray, newRadio);
		} catch (e) {
			console.log(e);
			setMasterApptArray([])
			setApptArray([]);
		}
		//return myData;
	}

	function DisplayFilterMode() {
	return (
		<div>
			{(!selectPatient) &&
				<Typography align="right" className={classes.link}>
					<Link href="#" variant="body2" onClick={() => { setCurrentPatient(""); setApptArray([]); setSelectPatient(true); }}>Select Patient</Link>
				</Typography>
			}
			{(selectPatient) &&
				<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => {setSelectPatient(false)}} />
				<Typography>
						<span className={gClasses.patientName}>Select Patient</span>
				</Typography>
				<DisplayFilter />
				<Grid className={classes.noPadding} key="AllPatients" container alignItems="center" >
					{patientArray.map( (m, index) => 
						<Grid key={"PAT"+index} item xs={12} sm={12} md={4} lg={4} >
						<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
						<div align="left" >
						<Typography>
						<span className={gClasses.patientName}>{m.displayName}</span>
						</Typography>
						<Typography>
						<span className={gClasses.patientInfo}>{"Id: " + m.pid}</span>
						</Typography>
						<Typography className={gClasses.patientInfo}> 
							{"Age: " + dispAge(m.age, m.gender)}
						</Typography>
						<Typography className={gClasses.patientInfo}> 
							{"Email: "+dispEmail(m.email)}
						</Typography>
						<Typography className={gClasses.patientInfo}> 
							{"Mobile: "+dispMobile(m.mobile)}
						</Typography>
						<BlankArea />
						<VsButton name="Select"  color='green' onClick={() => { handleSelectPatient(m)}} />
						</div>
						</Box>
						</Grid>
					)}
				</Grid>
				</Box>
			}
			{(currentPatient !== "") &&
			<div>
				<Typography className={classes.title}>{"Appointments of "+currentPatient+" (Id: "+currentPatientData.pid+" )" }</Typography>
				<DisplayNewApptBtn />
				{(newAppointment)  && <DisplayNewAppointment />}
				<DisplayBlockAppointments myArray={apptArray} />
			</div>
			}
		</div>
	)}
	
	async function handleMonthYear(d) {
		setMonthlyMode(true);	
		let myDate = d.toDate();
		setMonthYearDate(myDate);
		//alert(myDate);
		
		let myMonth = MONTHSTR[myDate.getMonth()];
		let myYear = myDate.getFullYear().toString();
		setYear(myYear)
		setMonth(myMonth);

		// last day
		//let tmp = new Date(Number(year), MONTHSTR.indexOf(month)+1, 0)
		//setLastDayOfMonth(tmp.getDate());

		let myCounts = await getMonthlyAppointmentCounts(myMonth, myYear)
		await generateMatrix(myMonth, myYear, myCounts);

	}
	
	function DisplayDirectoryMode() {
	return(
	<div>
		<BlankArea />
		<Datetime 
			timeFormat={false} 
			initialValue={monthYearDate}
			dateFormat="MMMM yyyy"
			inputProps={{className: classes.dateTime}}
			closeOnSelect={true}
			onClose={handleMonthYear}
			className={classes.dateTimeBlock}
		/>
		<BlankArea />
		{(monthlyMode) && <DisplayApptMatrix />}
		{(!monthlyMode) && <DisplayDailyAppointments />}
	</div>
	)}
	
	function DisplaySelectionMode() {
	return (
		<Grid className={classes.noPadding} key="MonthYear" container justify="center" alignItems="center" >
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<div align="right">
				<Typography padding="none" className={classes.switchText}>Appointment by Name</Typography>
				</div>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<div align="center" >
				<FormControlLabel 
				className={classes.radio}
				control={<SwitchBtn checked={directoryMode} onChange={toggleDirectoryMode} color="primary"/>}
				label=""
				/>
				</div>
			</Grid>
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<div align="left">
				<Typography padding="none" className={classes.switchText}>Appointment Calender</Typography>
				</div>
			</Grid>
		</Grid>
	)}
	
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
	
	
	
	return (
  <div className={gClasses.webPage} align="center" key="main">
		{/*<DisplayPageHeader headerName="Patient Directory" groupName="" tournament=""/>*/}
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplaySelectionMode />
		{(directoryMode) && <DisplayDirectoryMode />}
		{(!directoryMode) && <DisplayFilterMode />}
		</Container>
		<Modal
			isOpen={modalIsOpen == "NEWPATIENT"}
			shouldCloseOnOverlayClick={false}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={modalStyles}
			contentLabel="Example Modal"
			aria-labelledby="modalTitle"
			aria-describedby="modalDescription"
			ariaHideApp={false}
		>
			<DisplayNewPatient />
		</Modal>
		<Modal
			isOpen={modalIsOpen == "TABLECELL"}
			shouldCloseOnOverlayClick={false}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={menuModal}
			contentLabel="Example Modal"
			aria-labelledby="modalTitle"
			aria-describedby="modalDescription"
			ariaHideApp={false}
		>
			<DisplayTableCellMenu />
		</Modal>	
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