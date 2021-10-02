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

// icons
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CancelIcon from '@material-ui/icons/Cancel';
import EventNoteIcon from '@material-ui/icons/EventNote';
						
// import CardAvatar from "components/Card/CardAvatar.js";
// import { UserContext } from "../../UserContext";
import { isUserLogged, isMobile, encrypt, decrypt, callYesNo, updatePatientByFilter,
	dispOnlyAge, dispAge, dispEmail, dispMobile,
	validateInteger,
 } from "views/functions.js"
import {DisplayYesNo, DisplayPageHeader, BlankArea,
DisplayPatientDetails,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

// icons
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
//import CancelIcon from '@material-ui/icons/Cancel';

import {red, blue, yellow, orange, green } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

const drawerWidth=800;
const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
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
	filterRadio: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		color: '#000000',	
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


let searchText = "";
function setSearchText(sss) { searchText = sss;}

var userCid;

export default function Patient() {
	//const history = useHistory();	
  const classes = useStyles();
	const gClasses = globalStyles();

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
	
  const [page, setPage] = useState(0);
	
	
  useEffect(() => {
		const us = async () => {
			let ppp = await getAllPatients();
			setPatientMasterArray(ppp);
			setPatientArray(ppp);
		}
		userCid = sessionStorage.getItem("cid");
		us();
		sessionStorage.setItem("YESNOMODAL", "");
  }, [])

	
	async  function getAllPatients() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/list/${userCid}`;
			let resp = await axios.get(myUrl);
			return resp.data;
		} catch (e) {
			return [];
		}	
	}
	
	
	function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 621:
        myMsg = "Invalid patient age";
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
		sessionStorage.setItem("shareData", JSON.stringify(rec));
		setTab(process.env.REACT_APP_APPT);
	}
	
	function yesNoHandler(id, action) {
		//console.log("Id is " + id + "  Action is " + action);
		if ((id === "delete") && (action === "YES"))	{
			handleDeleteConfirm(patientRec);
			return;
		}
		if ((id === "visit") && (action === "YES"))	{
			handleVisitConfirm(patientRec);
			return;
		}
		
		if ((id === "appointment") && (action === "YES"))	{
			handleAppointmentConfirm(patientRec);
			return;
		}
	}
	//==========================
	
	function handleAdd() {
		//console.log("handleAdd");
		setPatientName("");
		setPatientAge("");
		setPatientGender("Male")
		setRadioValue("Male");
		setPatientEmail("");
		setPatientMobile("");
		
		setRegisterStatus(0);
		setIsAdd(true);
		setIsDrawerOpened(true);
	}
	
	function handleEdit(rec) {
		setOldPatientName(rec.displayName);
		setPatientName(rec.displayName);		
		setPatientAge(dispOnlyAge(rec.age));
		setPatientGender(rec.gender);
		setRadioValue(rec.gender);
		setPatientEmail(dispEmail(rec.email));
		setPatientMobile(dispMobile(rec.mobile));
		
		setRegisterStatus(0);
		setIsAdd(false);
		setIsDrawerOpened(true);
	}

	function handleCancel(rec) {
		alert("Cancel"+rec.displayName);
		console.log(rec);
	}
	
	function handleAppt(rec) {
		console.log("Appt");
		sessionStorage.setItem("shareData", JSON.stringify(rec));
		setTab(process.env.REACT_APP_APPT);
	}
	
	function handleVisit(rec) {
		let myData = {
			caller: "PATIENT",
			patient: rec,
			appointment: null,
		}
		sessionStorage.setItem("shareData", JSON.stringify(myData));
		setTab(process.env.REACT_APP_VISIT);
	}
	

	async function handleAddEditSubmit() {
		console.log("Addedit", patientName, patientAge, patientGender, patientEmail, patientMobile);
		let myAge = (patientAge !== "") ? patientAge : 0;
		let myMobile = (patientMobile !== "") ? patientMobile : 0;
		let myEmail = (patientEmail !== "") ? patientEmail : "-";
		myEmail = encrypt(myEmail);
		console.log(myEmail);
		console.log("Addedit", patientName, myAge, patientGender, myEmail, myMobile);
		
		let resp;
		let myUrl;
		if (isAdd) {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/add/${userCid}/${patientName}/${myAge}/${patientGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
			} catch (error)  {
				console.log(error.response.status);
				setRegisterStatus(error.response.status);
				return
			}
		} else {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/edit/${userCid}/${oldPatientName}/${patientName}/${myAge}/${patientGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
			} catch (error)  {
				console.log(error.response.status);
				setRegisterStatus(error.response.status);
				return;
			}			
		}
		setIsDrawerOpened(false);

		let ppp = await getAllPatients();
		setPatientMasterArray(ppp);
		setFilter(ppp, searchText);
		setIsDrawerOpened(false);
		return; 
	}
	
	function DisplayAllPatients() {
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientDetails 
			patient={m} 
			button1={
				<IconButton color={'primary'} size="small" onClick={() => { handleAppointmentConfirm(m)}}  >
					<EventNoteIcon />
				</IconButton>
			}
			button2={
				<IconButton className={gClasses.green} size="small" onClick={() => {handleVisit(m)}}  >
					<LocalHospitalIcon />
				</IconButton>
			}
			button3={
				<IconButton className={gClasses.blue} size="small" onClick={() => {handleEdit(m)}}  >
					<EditIcon  />
				</IconButton>
			}
			button4={
				<IconButton color="secondary" size="small" onClick={() => {handleCancel(m)}}  >
					<CancelIcon />
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
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplayPageHeader headerName="Patient Directory" groupName="" tournament=""/>
		<BlankArea />
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
				<VsButton name="New Patient" onClick={handleAdd} />
			</Grid>
			<Grid key={"F6"} item xs={false} sm={false} md={2} lg={2} />
		</Grid>
		<DisplayAllPatients />
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
			<TextValidator  fullWidth className={gClasses.vgSpacing}
				id="newPatientAge" label="Age" type="number"
				value={patientAge}
				onChange={() => { setPatientAge(event.target.value) }}
				validators={['minNumber:1', 'maxNumber:99']}
        errorMessages={['Age to be above 1', 'Age to be less than 100']}				
      />
			<FormControl component="fieldset">
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
					onChange={() => {setRadioValue(event.target.value); }}
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
			<TextValidator    fullWidth  className={gClasses.vgSpacing} 
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

