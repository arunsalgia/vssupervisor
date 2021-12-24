import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';

import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';
import Box from '@material-ui/core/Box';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsTextSearch from "CustomComponents/VsTextSearch";

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import Drawer from '@material-ui/core/Drawer';
import Switch from "@material-ui/core/Switch";
//import  from '@material-ui/core/Container';
//import  from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar"
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert';
import Divider from '@material-ui/core/Divider';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
// icons
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
//import SearchIcon from '@material-ui/icons/Search';
//import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
//import EventNoteIcon from '@material-ui/icons/EventNote';
//import NoteAddIcon from '@material-ui/icons/NoteAdd';



import Report from 'views/Report/Report';
import Visit  from 'views/Visit/Visit';
import Investigation from 'views/Investigation/Investigation';
import DentalTreatment from  'views/Treatment/DentalTreatment';
import ProfCharge from 'views/ProfCharge/ProfCharge';
import {
WEEKSTR, MONTHSTR, SHORTMONTHSTR, DATESTR, MONTHNUMBERSTR,
} from 'views/globals';

// import { UserContext } from "../../UserContext";
import { isMobile, encrypt,
	dispOnlyAge, dispAge, dispEmail, dispMobile, checkIfBirthday,
	validateInteger,
	getAllPatients,
	vsDialog,
	disableFutureDt,
 } from "views/functions.js"
import {DisplayPageHeader, BlankArea, DisplayPatientBox,
	DisplayPatientHeader,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

// icons
//import DeleteIcon from '@material-ui/icons/Delete';
//import CloseIcon from '@material-ui/icons/Close';
//import CancelIcon from '@material-ui/icons/Cancel';
//import ClearSharpIcon from '@material-ui/icons/ClearSharp';

import {red, blue, yellow, orange, green, pink } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

const drawerWidth=800;
const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
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
		width: '40%'
	},
	drawer: {
		width: '40%',
		flexShrink: 0
		//backgroundColor: "rgba(0,0,0,0.6)" Don't target here
	},
	boxStyle: {padding: "5px 10px", margin: "4px 2px", backgroundColor: blue[300] },
	radio: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: "blue",
	},
    root: {
      width: '100%',
    }, 
		link: {
			backgroundColor: 'transparent',
		},
		switchText: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
    }, 
    info: {
			backgroundColor: yellow[500],	
			color: blue[700],
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
    }, 
		noinfo: {
			backgroundColor: '#FFFFFF',	
			color: '#000000',
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
		},       
    td : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#00E5FF',
		},
		th : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#FF7043',
		},
		header: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
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
			paddings: '20px',
		},
		NoPatients: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
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
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));

const ROWSPERPAGE=10;
const BOTTONCOL=13;

const NUMBERINT=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const GENDERARRAY=["Male", "Female", "Other"];

const addEditModal = (isMobile()) ? dynamicModal('90%') : dynamicModal('40%');
const yesNoModal = dynamicModal('60%');


//let searchText = "";
//function setSearchText(sss) { searchText = sss;}

var userCid;
var customerData;

export default function Patient() {
	//const history = useHistory();	
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [searchText, setSearchText] = useState("");
	//const [isBirthday, setIsBirthday] = useState(false);
	
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});

	const [currentSelection, setCurrentSelection] = useState("");
	

	// 
	const [patientMasterArray, setPatientMasterArray] = useState([]);
	const [patientArray, setPatientArray] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [radioValue, setRadioValue] = useState("Male");
	
	const [patientRec, setPatientRec] = useState({});
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [oldPatientName, setOldPatientName] = useState("");
	const	[patientName, setPatientName] = useState("");
	const	[patientAge, setPatientAge] = useState(0);
	const	[patientGender, setPatientGender] = useState("Male");
	const	[patientEmail, setPatientEmail] = useState("");
	const	[patientMobile, setPatientMobile] = useState(0);
	const [patientDob, setPatientDob] = useState(new Date(2000, 1, 1));
  const [page, setPage] = useState(0);
	
	
  useEffect(() => {
		const us = async () => {
			
			try {
				console.log("starting");
				console.log(sessionStorage.getItem("userType"));
				if (sessionStorage.getItem("userType") !== "Developer") {
					console.log("starting JSON");
					customerData = JSON.parse(sessionStorage.getItem("customerData"));
					console.log("starting axios");
					console.log(userCid);
					let rrr =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/checkexpiry/${userCid}`);
					console.log("over axios");
					if (rrr.data.status) return alert.error('Plan has expired');
				} else {
					customerData = {type: "Developer"};
				}
				//console.log("in try");
				let ppp = JSON.parse(localStorage.getItem("vdBkpPatients"+userCid));
				setPatientMasterArray(ppp);
				setPatientFilter(ppp, searchText);
			} catch {
				console.log("in patient catch");
				// no action required
			}
			finally {
				//console.log("in finally");
				let ppp = await getAllPatients(userCid);
				setPatientMasterArray(ppp);
				setPatientFilter(ppp, searchText);				
			}
		}
		userCid = sessionStorage.getItem("cid");
		us();
  }, [])


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


	async function handleCancelPatient(rec) {
		console.log("handleCancelPatient", rec.displayName);
		let myData = await getVisitCount(rec);
		console.log(myData);
		if (myData != null) {
			if ((myData.pending > 0) || (myData.visit > 0)) {
				setPatientRec(rec);

				let pmsg = (myData.pending > 0) ? `${myData.pending} pending appointments` : "";
				let vmsg = (myData.visit > 0)   ? `${myData.visit} visits` : "";
				
				let andmsg = ((pmsg !== "") && (vmsg !== "")) ? " and " : ""

				callYesNo(openModal, "delete", 
				`Delete Patient ${rec.displayName}`, 
				`${rec.displayName} has ` + pmsg + andmsg + vmsg + ". Continue with Delete?", 
				"Delete", "Cancel", false);
			} else {
				handleDeleteConfirm(rec);
			}
		}
		return;

		//callYesNo(openModal, "visit", `New visit for ${rec.displayName}`, "Appointment not taken for today. Continue?", "Continue", "Cancel", false);
		//arun
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/delete/${userCid}/${name}`
			await axios.get(myUrl);
			let myData = patientArray.filter(x => x.displayName != name);
			setPatientArray(myData);
			await getPatientCount();
		} catch (e) {
			console.log(e);
		}
	}
	
	
	async function handleDeleteConfirm(rec) {
		console.log("Delete of "+rec.displayName);
		let myData = patientArray.filter(x => x.displayName != rec.displayName);
		setPatientArray(myData);
		return;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/delete/${userCid}/${rec.displayName}`
			await axios.get(myUrl);
			let myData = patientArray.filter(x => x.displayName != rec.displayName);
			setPatientArray(myData);
			await getPatientCount();
		} catch (e) {
			console.log(e);
		}
	}
	
	// handle confirmation of YES / No
	
	function handleAppointmentConfirm(rec) {
		//sessionStorage.setItem("shareData", JSON.stringify(rec));
		setTab(process.env.REACT_APP_APPT);
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
		setRegisterStatus(0);
		setIsAdd(true);
		setIsDrawerOpened(true);
	}
	
	function handleEdit(rec) {
		console.log(rec);
		setOldPatientName(rec.displayName);
		setPatientName(rec.displayName);		
		setPatientAge(dispOnlyAge(rec.age));
		setPatientGender(rec.gender);
		setRadioValue(rec.gender);
		setPatientEmail(dispEmail(rec.email));
		setPatientMobile(dispMobile(rec.mobile));
		setPatientDob(moment(rec.dob));
		setRegisterStatus(0);
		setIsAdd(false);
		setIsDrawerOpened(true);
	}

	async function handleCancel(rec) {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/visitcount/${userCid}/${rec.pid}`;
		try {
			let resp = await axios.get(myUrl);
			let msg = "";
			if ((resp.data.pending > 0) && (resp.data.visit > 0)) {
				msg = `${rec.displayName} has appointment and ${resp.data.visit} visit(s).`;
			} else if (resp.data.pending > 0) {
				msg = `${rec.displayName} has appointment.`;
			} else if (resp.data.visit > 0) {
				msg = `${rec.displayName} has ${resp.data.visit} visit(s).`;
			}
			msg += " Are you sure you want to delete?";
			vsDialog("Delete patient", msg,
				{label: "Yes", onClick: () => handleCancelConfirm(rec) },
				{label: "No" }
			);		
		} catch (e) {
			console.log(e);
			alert.error("Error deleting patient record");
		}		
	}
	
	function handleCancelConfirm(rec) {
		alert.error("Delete all info of "+rec.displayName);
		//console.log(rec);
	}


	
	async function handleAddEditSubmit() {
		let myDate = patientDob.toDate();
		let testAge = new Date().getFullYear() - myDate.getFullYear();
		console.log(testAge, myDate);
		if ((testAge >= 100) || (testAge <= 1)) return setRegisterStatus(1001);
		let myMobile = (patientMobile !== "") ? patientMobile : 0;
		let myEmail = (patientEmail !== "") ? patientEmail : "-";
		myEmail = encrypt(myEmail);
		let dobStr = myDate.getFullYear() + MONTHNUMBERSTR[myDate.getMonth()] + DATESTR[myDate.getDate()];
		console.log(myEmail);
		console.log("Addedit", patientName, dobStr, patientGender, myEmail, myMobile);
		let resp;
		let myUrl;
		if (isAdd) {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/addwithdob/${userCid}/${patientName}/${dobStr}/${patientGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
			} catch (error)  {
				console.log(error.response.status);
				setRegisterStatus(error.response.status);
				return
			}
		} else {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/editwithdob/${userCid}/${oldPatientName}/${patientName}/${dobStr}/${patientGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
			} catch (error)  {
				console.log(error.response.status);
				setRegisterStatus(error.response.status);
				return;
			}			
		}
		setIsDrawerOpened(false);

		let ppp = await getAllPatients(userCid);
		setPatientMasterArray(ppp);
		setPatientFilter(ppp, searchText);
		setIsDrawerOpened(false);
		return; 
	}
	
	function handleSelectPatient(pat) {
		setCurrentPatientData(pat);
		setCurrentPatient(pat.displayName);
		setCurrentSelection("");
		//setIsBirday(checkIfBirthday(pat.dob));
	}


	function DisplayFunctionItem(props) {
	let itemName = props.item;
	return (
	<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
	<Typography onClick={() => setSelection(itemName)}>
		<span 
			className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
		{itemName}
		</span>
	</Typography>
	</Grid>
	)}
	
	async function setSelection(item) {
		//sessionStorage.setItem("shareData",JSON.stringify(currentPatientData));
		setCurrentSelection(item);
	}
	
	
	function DisplayFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Investigation" />
		<DisplayFunctionItem item="Report" />
		<DisplayFunctionItem item="Visit" />
		<DisplayFunctionItem item="Treatment" />
		<DisplayFunctionItem item="Payment" />
	</Grid>	
	</Box>
	)}


	
	function DisplayAllPatients() {
	//console.log(patientArray);
	//console.log(patientMasterArray);
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientBox patient={m}
		button1={
			<IconButton className={gClasses.blue} size="small" onClick={() => handleSelectPatient(m) }  >
				<VisibilityIcon  />
			</IconButton>
		}
		button2={
			<IconButton className={gClasses.blue} size="small" onClick={() => {handleEdit(m)}}  >
				<EditIcon  />
			</IconButton>
		}
		button3={
			<IconButton color="secondary" size="small" onClick={() => {handleCancel(m)}}  >
				<CancelIcon />
			</IconButton>
		}
		/>
		</Grid>
	)}
	</Grid>	
	)}
	
	function setPatientFilter(myArray, filterStr) {
		//console.log(myArray);
		//console.log(filterStr);
		filterStr = filterStr.trim().toLowerCase();
		//console.log(filterStr);
		let tmpArray;
		if (myArray !== "") {
			if (validateInteger(filterStr)) {
				// it is integer. Thus has to be Id
				//console.log("Num check",filterStr);
				tmpArray = myArray.filter(x => x.pidStr.includes(filterStr));
			} else {
				tmpArray = myArray.filter(x => x.displayName.toLowerCase().includes(filterStr));
			}
		} else {
			tmpArray = myArray;
		}
		setPatientArray(tmpArray);
	}
	
	function filterPatients(filterStr) {
		setSearchText(filterStr);
		setPatientFilter(patientMasterArray, filterStr);
	}
	
	function handleBack() {
		setSearchText("");
		setPatientArray(patientMasterArray);
		setCurrentPatientData({});
		setCurrentPatient("");
	}
	
	function handleDate(d) {
		//console.log(d);
		setPatientDob(d);
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		{(currentPatient === "") &&
			<div>
			<DisplayPageHeader headerName="Patient Directory" groupName="" tournament=""/>
			<BlankArea />
			<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
				<Grid key={"F1"} item xs={false} sm={false} md={2} lg={2} />
				<Grid key={"F2"} item xs={12} sm={12} md={4} lg={4} >
					{/*<TextField id="filter"  padding={5} fullWidth label="Search Patient by name or Id" 
					value={searchText}
					onChange={(event) => filterPatients(event.target.value)}
					InputProps={
						{
							endAdornment: (
								<div>
								<InputAdornment position="end"><SearchIcon /></InputAdornment>
								</div>
								)
						}
					}
					/>*/}
				<VsTextSearch label="Search Patient by name or Id" value={searchText}
					onChange={(event) => filterPatients(event.target.value)}
					onClear={(event) => filterPatients("")}
				/>
				</Grid>
				<Grid key={"F4"} item xs={8} sm={8} md={3} lg={3} >
				</Grid>
				<Grid key={"F5"} item xs={4} sm={4} md={1} lg={1} >
					<VsButton name="New Patient" onClick={handleAdd} />
				</Grid>
				<Grid key={"F6"} item xs={false} sm={false} md={2} lg={2} />
			</Grid>
			<DisplayAllPatients />
			</div>
		}
		{(currentPatient !== "") &&
			<div>
			<VsButton align="right" name="Back to Patient Directory" onClick={handleBack} />
			<DisplayPatientHeader patient={currentPatientData} />
			<DisplayFunctionHeader />
			<Divider className={gClasses.divider} /> 
			{((currentSelection === "Treatment") &&  (customerData.type === "Dentist")) &&
				<DentalTreatment patient={currentPatientData} />
			}
			{((currentSelection === "Treatment") && (customerData.type !== "Dentist")) &&
				<Typography>Aiyoo gochi hai gochi!!!!</Typography>
			}
			{(currentSelection === "Investigation") &&
				<Investigation patient={currentPatientData} />
			}
			{(currentSelection === "Report") &&
				<Report patient={currentPatientData} />
			}
			{(currentSelection === "Visit") &&
				<Visit patient={currentPatientData} />
			}
			{(currentSelection === "Payment") &&
				<ProfCharge patient={currentPatientData} />
			}
			</div>
		}
		<Drawer className={classes.drawer}
			anchor="right"
			variant="temporary"
			open={isDrawerOpened}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened(false)}} />
		<ValidatorForm align="center" className={classes.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{(isAdd) ? "Add Patient" : "Edit Patient"}</Typography>
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
				<FormControlLabel className={gClasses.filterRadio} value="Male" 		control={<Radio color="primary"/>} label="Male" />
				<FormControlLabel className={gClasses.filterRadio} value="Female" 	control={<Radio color="primary"/>} label="Female" />
				<FormControlLabel className={gClasses.filterRadio} value="Other"   control={<Radio color="primary"/>} label="Other" />
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
			<VsButton name={(isAdd) ? "Add" : "Update"} />
			</ValidatorForm>    		
			</Box>
		</Drawer>
		</ Container>
  </div>
  );    
}

