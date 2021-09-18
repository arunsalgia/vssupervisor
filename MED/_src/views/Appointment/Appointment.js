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
import { borders } from '@material-ui/system';

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

import {DisplayPageHeader, ValidComp, BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';


// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';

//colors 
import { 
red, blue, yellow, orange, pink,
} from '@material-ui/core/colors';

import { 
	encrypt, decrypt, 
	validateInteger,
	left, right,
	intToString,
} from "views/functions.js";

//include('views/protos.js');

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
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
	th: { 
		border: 5,
    align: "center",
    padding: "none",
		//backgroundColor: '#FFA726',
		backgroundColor: '#B3E5FC',
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
	noday: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#FFFFFF',
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

const str1by4 = String.fromCharCode(188)
const str1by2 = String.fromCharCode(189)
const str3by4 = String.fromCharCode(190)

const DUMMYDAY={date: 0, dayType: "", apptCount: 0};
const HOLIDAYTYPE="HO";
const WEEKDAYTYPE="WD";
const WEEKENDTYPE="WE";

const DATESTR = [
"1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
"31"							
];

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

const menuModal = dynamicModal('30%');


export default function Appointment() {
  const classes = useStyles();
	const gClasses = globalStyles();
	
	
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
	
	const [year, setYear] = useState("2021");
	const [month, setMonth] = useState("September");
	const [lastDayOfMonth, setLastDayOfMonth] = useState(0);
	const [monthlyMode, setMonthlyMode] = useState(true);
	
	const [apptMatrix, setApptMatrix] = useState([]);
	const [holidayArray, setHoildayArray] = useState([]);
	const [menuData, setMenuData] = useState({});
	const [apptCountArray, setApptCountArray] = useState([]);
	
	
	const [registeredPatient, setRegisteredPatient] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [newErrorMessage, setNewErrorMessage] = useState("");
	const [newAppointment, setNewAppointment] = useState(false);
  const [patientArray, setPatientArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	
	const [apptHour, setApptHour] = useState("");
	const [apptMinute, setApptMinute] = useState(MINUTESTR[0]);
	const [apptArray, setApptArray] = useState([]);
	
  useEffect(() => {	
		const us = async () => {			
		}

		
		// make year
		WEEKENDS = [0, 6];			//JSON.parse(`${process.env.REACT_APP_WEEKENDS}`)
		let x = `${process.env.REACT_APP_WEEKENDS}`;
		console.log("ST", x);
		
		let istart = Number(`${process.env.REACT_APP_STARTTIME}`);
		let iend = Number(`${process.env.REACT_APP_ENDTIME}`);
		HOURSTR = ALLHOURSTR.slice(istart, iend);
		
		setApptHour(HOURSTR[0]);
		//console.log(WEEKENDS);
		//console.log(HOURSTR);
		//console.log(istart, iend);
		
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
		
		us();
  }, []);

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
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Button variant="contained" color="primary" className={gClasses.submit}
					onClick={handleMonthYearSelect}
				>
				Select
				</Button>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} />
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
		//console.log(tmp.getDate());
		setLastDayOfMonth(tmp.getDate());
		//let myCounts = await getMonthlyAppointmentCounts(month, year);
		let myCounts = [];
		await generateMatrix(month, year, myCounts);
	}
	
	async function getMonthlyAppointmentCounts(month, year) {
		let myData = [];
		
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/count/month/${year}/${MONTHSTR.indexOf(month)}`
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
		console.log("In matrix generation");
		console.log(myCounts);
		
		
		let iMonth = MONTHSTR.indexOf(myMonth);
		let iYear = Number(myYear);
		
		let myHoildays = await getHoildays(iYear, iMonth);
		let tmp = [];

		// update week days/ends before 1st of month
		var d = new Date(iYear, iMonth, 1);
		for(let i=0; i<d.getDay(); ++i)
			tmp.push(DUMMYDAY);
		
		// all days of this month
		d = new Date(iYear, iMonth+1, 0);
		let lastDate = d.getDate();
		for (let i=1; i<=lastDate; ++i) {
			d = new Date(iYear, iMonth, i);
			let dType = WEEKDAYTYPE;
			// check if holiday/monthly
			let hhh = myHoildays.find(x => x.date == i);
			if (hhh) {
				dType = HOLIDAYTYPE;
			} else if (WEEKENDS.includes(d.getDay())) {
				dType = WEEKENDTYPE;
			}
			
			// get counts of this date
			let ccc = myCounts.find(x => x._id == i);
			//console.log(ccc);
			let xxx = {date: i, dayType: dType, apptCount: (ccc) ? ccc.count : 0}
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
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/monthly/${year}/${month}`)
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
	<Typography className={classes.th}>{"Appointments of month "+month + ' ' + year}</Typography>
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
		//console.log(d.date);
		let myClass = null;
		switch (d.dayType) {
			case ""         : myClass = classes.noday; break
			case WEEKDAYTYPE: myClass = classes.wd; break;
			case HOLIDAYTYPE: myClass = classes.ho; break;
			case WEEKENDTYPE: myClass = classes.we; break;
		}
		return(
		<TableCell key={"TD"+d.date+index} align="center" component="td" scope="row" align="center" padding="none"
		className={myClass}
		onClick={() => {handleDateClick(d)}}
		>
		{(d.date != 0) && <div>
			<Avatar size="small" className={classes.orange}>{d.date}</Avatar>
			<Typography padding="none" align="center">{d.apptCount+" Appt(s)"}</Typography>
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
			<DisplayCloseModal />
			<Typography>{menuData.date + " " + month + " " + year}</Typography>
			<BlankArea />
			{(menuData.dayType != HOLIDAYTYPE) &&
			<Button 
			variant="contained" color="primary" className={gClasses.submit}
			onClick={() => { setHoliday(menuData, "OFF") }}
			>Set Clinic Off</Button>}
			{(menuData.dayType == HOLIDAYTYPE) &&
			<Button variant="contained" color="primary" className={gClasses.submit}
			onClick={() => { setHoliday(menuData, "ON") }}
			>Set Clinic On</Button>}
			<Button 
				variant="contained" color="primary" className={gClasses.submit}
				onClick={() => { handleDailyAppointments(menuData) }}
			>Appointment</Button>
		</div>
	)}
	
	function DisplayCloseModal() {
	return (
		<div align="right">
		<IconButton color="secondary"  size="small" onClick={closeModal} >
			<CancelIcon />
		</IconButton>
		</div>
	)}
	
	async function setHoliday(mData, todo) {
		let tmp=[].concat(apptMatrix);
		
		if (todo == "OFF") {
			// declare this as holiday
			
			let myurl = `${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/set/${year}/${MONTHSTR.indexOf(month)}/${mData.date}/clinicoff`
			try {
				let resp = await axios.get(myurl);
				let ha = [].concat(holidayArray);
				ha.push(resp.data);
				console.log(resp.data);
				setHoildayArray(ha);
				tmp[mData.row][mData.col].dayType	= HOLIDAYTYPE;
			} catch (e) {
					console.log(e)
			}	
		} else {
			// declare this as not a holiday
			
			let myurl = `${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/delete/${year}/${MONTHSTR.indexOf(month)}/${mData.date}`;
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
		
		// now get appointers from database
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/list/date/${year}/${MONTHSTR.indexOf(month)}/${menuData.date}`
			let resp = await axios.get(myUrl);
			setApptArray(resp.data);
		} catch (e) {
			console.log(e);
			setApptArray([]);
		}
	}
	
	function DisplayDailyAppointments() {
	return(
	<div>
	<Typography className={classes.title}>{"Appointments of "+menuData.date+' '+month + ' ' + year}</Typography>
	{(!newAppointment) && <DisplayNewApptBtn />}
	{(newAppointment)  && <DisplayNewAppointment />}
	{(apptArray.length == 0) && <Typography className={classes.zeroAppt}>No appointments</Typography>}
	{(apptArray.length > 0)  && <DislayAllAppointmentsOfToday />}
	</div>
	)}
	
	function DisplayNewApptBtn() {
		return (
			<Typography align="right" className={gClasses.root}>
				<Link href="#" onClick={() => { 
					setNewAppointment(true); 
					setRegisteredPatient(false); 
					setNewErrorMessage("")
					setCurrentPatient("");
					setCurrentPatientData({});
					setSearchText("")
					setCurrentPatientData({});
					}
				} variant="body2">Add New Appointment</Link>
			</Typography>
		);
	}
	
	function DisplayNewAppointment() {
	return(
		<Box className={classes.newAppt} border={1} >
		<div align="right">
				<IconButton align="right" color="secondary"  size="small" onClick={handleNewAppointmentCancel} >
					<CancelIcon />
				</IconButton>
		</div>
		<Typography>New Appointment</Typography>
		{(!registeredPatient && (currentPatient == "")) &&  <DisplayOldSearch />}
		{(registeredPatient  && (currentPatient == "")) &&  <DisplayNewSearch />}
		{(currentPatient != "") &&
			<Grid className={classes.noPadding} key="MonthYear" container justify="center" alignItems="center" >
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={classes.apptName}>
					{currentPatient + " ( " + ((currentPatientData.age == 0) ? "New" : currentPatientData.age + currentPatientData.gender.substr(0,1)) + " )"}
				</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Select labelId='hourmin' id='hourmin'
					variant="outlined" required fullWidth label="Mourmin" name="hourmin" id="hourmin"
					value={apptHour}
					inputProps={{
						name: 'ApptHr',
						id: 'ApptHr',
					}}
					onChange={(event) => setApptHour(event.target.value)}
					>
					{HOURSTR.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
				</Select>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Select labelId='hourmin1' id='hourmin1'
					variant="outlined" required fullWidth label="hourmin1" name="hourmin1" id="hourmin1"
					value={apptMinute}
					inputProps={{
						name: 'ApptMin',
						id: 'ApptMin',
					}}
					onChange={(event) => setApptMinute(event.target.value)}
					>
					{MINUTESTR.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
				</Select>
			</Grid>
			<Grid item xs={4} sm={4} md={4} lg={4} >
			<Button 
				variant="contained" color="primary" className={gClasses.submit}
				onClick={handleNewAppointmentSubmit}
				>Add New Appointment
			</Button>
			</Grid>
			</Grid>
		}
		</Box>
	)}
	
	function DisplayOldSearch() {
	return (
		<Grid key="DisplaySearch" container justify="center" alignItems="center" >
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<FormControlLabel align="right" className={classes.radio} label="New"
			control={
				<SwitchBtn color="primary" className={classes.radio} checked={registeredPatient} 
				onChange={toggleRegisteredPatient}  
				/>
			}
			/>
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<TextField padding={5} variant="outlined" fullWidth label="Patient Id/Name" autoFocus
			value={searchText}
			onChange={(event) => setSearchText(event.target.value)}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<SearchIcon onClick={selectFilter}/>
					</InputAdornment>
			)}}
			/>
		</Grid>
		<Grid item xs={6} sm={6} md={6} lg={6} >
			<Select labelId='team' id='team' name="team" padding={10}
				variant="outlined" required fullWidth label="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" 
				value={currentPatient}
				inputProps={{
					name: 'SearchText',
					id: '`',
				}}
				onChange={(event) => selectPatient(event.target.value)}
			>
				{patientArray.map(x =>	
				<MenuItem key={x.displayName} value={x.displayName}>
				{x.displayName + " (Id:"+ x.pid+") ("+ ((x.age > 0) ? x.age+x.gender.substr(0,1) : "new")+")"}
				</MenuItem>)}
			</Select>
		</Grid>
		</Grid>
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
		} else {
			subcmd = "list"
		}
		
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/${subcmd}/${filter}`)
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
	
	async function findNewPatient() {
		console.log("in findNewPatient");
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/new/${searchText}`)
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
	
	function DisplayNewSearch() {
	return (
		<div>
		<Grid key="DisplaySearch" container justify="center" alignItems="center" >
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<FormControlLabel align="right" className={classes.radio} label="New"
			control={
				<SwitchBtn color="primary" className={classes.radio} checked={registeredPatient} 
				onChange={toggleRegisteredPatient}  
				/>
			}
			/>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextField padding={5} variant="outlined" fullWidth label="New Patient name" autoFocus
			value={searchText}
			onChange={(event) => setSearchText(event.target.value)}
			/>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
		<Button variant="contained" color="primary" className={gClasses.submit}
		onClick={findNewPatient}
		>
		New Patient
		</Button>		
		</Grid>
		</Grid>
		{(newErrorMessage != "") && <Typography className={gClasses.error}>{newErrorMessage}</Typography>}
		</div>
	)}
	
	async function selectPatient(name) {
		//console.log(name);
		//console.log(patientArray);
		let pRec = patientArray.find(x => x.displayName == name);
		//console.log(pRec);
		setCurrentPatient(pRec.displayName);
		setCurrentPatientData(pRec);
	}
	
	function toggleRegisteredPatient() {
		setRegisteredPatient(!registeredPatient)
		setSearchText("");
		setNewErrorMessage("");
		setPatientArray([]);
	}
	
	async function handleNewAppointmentSubmit() {
		let x = apptArray.filter(x => x.data.pid == currentPatientData.pid);
		if (x.length > 0) {
			alert("Duplicate appointment.");
			return;
		}

		let tmp = {
			data: currentPatientData,
			year: Number(year),
			month: MONTHSTR.indexOf(month),
			date: menuData.date,
			hour: Number(apptHour),
			minute: Number(apptMinute),
			order: Number(apptHour)*100 + Number(apptMinute),
			apptTime: new Date(Number(year), MONTHSTR.indexOf(month), menuData.date,
								Number(apptHour), Number(apptMinute), 0),
		};
		let jTmp = JSON.stringify(tmp);
		
		// add this to database
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/add/${jTmp}`;
			let resp = await axios.get(myUrl);
			let tmpArray=[].concat(apptArray);
			tmpArray.push(tmp);
			tmpArray.sort((a, b) => {
				return a.order - b.order;
			});
			//console.log(tmpArray);
			setApptArray(tmpArray);	
			setNewAppointment(false);
		} catch (e) {
			console.log(e);
			return;
		}
	}	
	
	function handleNewAppointmentCancel() {
		setNewAppointment(false);
		// clear all
		setSearchText("");
		setPatientArray([]);
		setCurrentPatient("");
		setCurrentPatientData({});
		setApptHour(HOURSTR[0]);
		setApptMinute(MINUTESTR[0]);
	}	
	
	async function handleDeleteAppt(appt) {
		console.log(appt);
		let tmpArray = apptArray.filter(x => x.data.pid != appt.data.pid ||	x.order != appt.order);
		console.log(tmpArray);
		setApptArray(tmpArray);
	}
	
	async function handleEditAppt(appt) {
			console.log(appt);
	}
	
	function DisplayBlockAppointments(props) {
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableBody>  
			{props.myArray.map( (a, index) => {
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<Typography className={classes.apptName}>
							{a.data.displayName + " (ID: " + a.data.pid + ")"}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<Typography className={classes.apptName}>
							{(a.data.age == 0) ? "New" : (a.data.age + "  " + a.data.gender)}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.td}>
						<Typography className={classes.apptName}>
							{props.hrStr + ":" + props.mnStr}
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
						<IconButton color="secondary"  size="small" onClick={() => { handleDeleteAppt(a) } } >
							<CancelIcon />
						</IconButton>
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>		
	)}
	
	function DislayAllAppointmentsOfToday() {
		//console.log(HOURSTR);
		//console.log(MINUTESTR);
	return(	
		<div>
		{HOURSTR.map( h => {
			//console.log("Hour is ", h);
			return (
			<div>
			{MINUTESTR.map( m => {
				//console.log("Min is ", m);
				let tmpArray = apptArray.filter(x => x.hour == Number(h) && x.minute == Number(m));
				if (tmpArray.length == 0) return null;
				//console.log(h, m, tmpArray.length);
				let myPanel = h + m;
				return (
					<Accordion className={(expandedPanel == myPanel) ? classes.selectedAccordian : classes.normalAccordian} 
						expanded={expandedPanel === myPanel} onChange={handleAccordionChange(myPanel)}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
						<Typography className={classes.accordianSummary}>
							{"Appointment(s) of " + h + ":" + m + " ( Count: " + tmpArray.length + " )"}
						</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.allAppt}>
						<DisplayBlockAppointments myArray={tmpArray} hrStr={h} mnStr={m} />
					</AccordionDetails>
      </Accordion>
					
			)}
			)}
			</div>
		)}
		)}
		</div>
	)}

	
	const LoadingIndicator = props => {
		const { promiseInProgress } = usePromiseTracker();
		return (
			promiseInProgress && 
			<h1>Hey some async call in progress ! </h1>
			);  
	}
	

  return (
  <div  align="center" key="groupinfo">
		<DisplayPageHeader headerName="Patient Appointment" groupName="" tournament=""/>
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<LoadingIndicator />
		<DisplayMonthYear />
		{(monthlyMode) && <DisplayApptMatrix />}
		{(!monthlyMode) && <DisplayDailyAppointments />}
		<BlankArea />
		</Container>
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
  </div>
  );    
}