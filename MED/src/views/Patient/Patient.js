import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';
import Box from '@material-ui/core/Box';
import VsButton from "CustomComponents/VsButton";
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';

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

// import CardAvatar from "components/Card/CardAvatar.js";
// import { UserContext } from "../../UserContext";
import { isUserLogged, isMobile, encrypt, decrypt, callYesNo, updatePatientByFilter,
	dispOnlyAge, dispAge, dispEmail, dispMobile,
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
import CancelIcon from '@material-ui/icons/Cancel';

import {red, blue, yellow, orange } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
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

const ALPHABETSTR = [
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z"
];

const NUMBERINT=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const GENDERARRAY=["Male", "Female", "Other"];

const addEditModal = (isMobile()) ? dynamicModal('90%') : dynamicModal('40%');
const yesNoModal = dynamicModal('60%');

let modalName="";
function setModalName(ggg) { modalName = ggg; }
let modalAge= 0;
function setModalAge(ggg) { modalAge = ggg };
let modalGender="Male";
function setModalGender(ggg) { modalGender = ggg; }
let modalEmail="nomail@mail.com";
function setModalEmail(ggg) { modalEmail = ggg; }
let modalMobile="9999999999";
function setModalMobile(ggg) { modalMobile= ggg; }


let searchText = "";
function setSearchText(sss) { searchText = sss;}


const defaultDirectoryMode=true;
const userCid = sessionStorage.getItem("cid");

export default function Patient() {
	//const history = useHistory();	
  const classes = useStyles();
	const gClasses = globalStyles();

	const [patientArray, setPatientArray] = useState([]);
	const [newPatient, setNewPatient] = useState(false);
	const [radioValue, setRadioValue] = useState("Male");
	const [addEdit, setAddEdit] = useState("ADD");
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() { }
	
	const [directoryMode, setDirectoryMode] = useState(defaultDirectoryMode);
	const [buttonArray, setButtonArray] = useState([]);
	const [patientChar, setPatientChar] = useState("A");


	const [patientDelete, setPatientDelete] = useState({});
	const [patientAppointment, setPatientAppointment] = useState({});
	
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [oldPatientName, setOldPatientName] = useState("");
	const	[patientName, setPatientName] = useState("");
	const	[patientAge, setPatientAge] = useState(0);
	const	[patientGender, setPatientGender] = useState("Male");
	const	[patientEmail, setPatientEmail] = useState("");
	const	[patientMobile, setPatientMobile] = useState(0);
	
	//const [rowsPerPage, setRowsPerPage] = useState(ROWSPERPAGE);
  const [page, setPage] = useState(0);
	
	const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
	
  useEffect(() => {
		const us = async () => {
		}
		us();
		sessionStorage.setItem("YESNOMODAL", "");
  }, [])

	
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
				setPatientDelete(rec);

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
	
	function DisplayCloseModal() {
	return (
		<div align="right">
		<IconButton color="secondary"  size="small" onClick={closeModal} >
			<CancelIcon />
		</IconButton>
		</div>
	)}
	
	
	
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
			handleDeleteConfirm(patientDelete);
			return;
		}
		if ((id === "visit") && (action === "YES"))	{
			handleVisitConfirm(patientDelete);
			return;
		}
		
		if ((id === "appointment") && (action === "YES"))	{
			handleAppointmentConfirm(patientDelete);
			return;
		}
	}
	//==========================
	
	function DisplayFilter() {
	return (	
		<Grid className={classes.noPadding} key="Filter" container justify="center" alignItems="center" >
			<Grid item xs={3} sm={3} md={3} lg={3} />
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<TextField id="filter"  padding={5} variant="outlined" fullWidth label="Patient Name / Id" 
				defaultValue={searchText}
				//onChange={(event) => setSearchText(event.target.value)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<SearchIcon onClick={selectFilter}/>
						</InputAdornment>
				)}}
			/>
			</Grid>
			<Grid item xs={3} sm={3} md={3} lg={3} />
		</Grid>
	)}
	
	async function selectFilter() {
		let myText = document.getElementById("filter").value;
		//console.log(myText);
		setSearchText(myText);
		let ppp = await updatePatientByFilter(searchText,userCid);
		setPatientArray(ppp);
	}
	

	function handleAdd() {
		//console.log("handleAdd");
		setPatientName("");
		setPatientAge("");
		setPatientGender("Male")
		setRadioValue("Male");
		setPatientEmail("");
		setPatientMobile("");
		
		setRegisterStatus(0);
		setAddEdit("ADD");
		setNewPatient(true);
	}
	
	function handleEdit(rec) {
		//console.log("handleAdd");

		setOldPatientName(rec.displayName);
		setPatientName(rec.displayName);		
		setPatientAge(dispOnlyAge(rec.age));
		setPatientGender(rec.gender);
		setRadioValue(rec.gender);
		setPatientEmail(dispEmail(rec.email));
		setPatientMobile(dispMobile(rec.mobile));
		
		setRegisterStatus(0);
		setAddEdit("EDIT");
		setNewPatient(true);
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
	
	function DisplayNewPatientBtn() {
	return (
		<Typography align="right" className={classes.link}>
			<Link href="#" variant="body2" onClick={handleAdd}>Add New Patient</Link>
		</Typography>
	)}
	
	
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
		if (addEdit === "ADD") {
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
		setNewPatient(false);
		let ppp = await updatePatientByFilter(searchText, userCid); 
		setPatientArray(ppp);
		return; 
		
		//console.log("redisplay required here");
		// refresh display as per mode directory / filter
		if (directoryMode) {
			await updatePatientArray(myName.substr(0, 1).toUpperCase());
		} else {
			let ppp = await updatePatientByFilter(searchText, userCid); 
			setPatientArray(ppp);
		}
		return;
		
		await getPatientCount();
		await fetchPatientsByAlphabet(modalName.substr(0, 1).toUpperCase());
		await getPatientCount();
		await fetchPatientsByAlphabet(modalName.substr(0, 1).toUpperCase());
	}
	
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplayPageHeader headerName="Patients" groupName="" tournament=""/>
		<BlankArea />
		<DisplayFilter />
		<BlankArea />
		{(!newPatient) && <DisplayNewPatientBtn />}
		{(newPatient) &&
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<div align="right"><IconButton color="secondary"  size="small" onClick={() => {setNewPatient(false)}} >
				<CancelIcon />
			</IconButton></div>
			<Typography className={classes.header}>{(addEdit == "ADD") ? "Add New Patient" : "Edit Patient"}</Typography>
			<BlankArea />
			<ValidatorForm className={classes.form} onSubmit={handleAddEditSubmit}>
			<Grid spacing={4} key="AddEdit" container justify="center" alignItems="center" >
			<Grid item xs={12} sm={12} md={6} lg={6} >
			<TextValidator variant="outlined" required fullWidth autoFocus      
				id="newPatientName" label="Name" type="text"
				value={patientName} 
				onChange={() => { setPatientName(event.target.value) }}
      />
			</Grid>
			<Grid item xs={3} sm={3} md={3} lg={3} >
			<TextValidator variant="outlined" fullWidth       
				id="newPatientAge" label="Age" type="number"
				value={patientAge}
				onChange={() => { setPatientAge(event.target.value) }}
				validators={['minNumber:1', 'maxNumber:99']}
        errorMessages={['Age to be above 1', 'Age to be less than 100']}
				
      />
			</Grid>
			<Grid item xs={9} sm={9} md={3} lg={3} >
			<FormControl component="fieldset">
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
					onChange={() => {setRadioValue(event.target.value); }}
				>
					<FormControlLabel className={classes.filterRadio} value="Male" 		control={<Radio color="primary"/>} label="Male" />
					<FormControlLabel className={classes.filterRadio} value="Female" 	control={<Radio color="primary"/>} label="Female" />
					<FormControlLabel className={classes.filterRadio} value="Other"   control={<Radio color="primary"/>} label="Other" />
				</RadioGroup>
			</FormControl>
			</Grid>

			<Grid item xs={6} sm={6} md={6} lg={6} >
			<TextValidator variant="outlined"  fullWidth      
				id="newPatientEmail" label="Email" type="email"
				value={patientEmail} 
				onChange={() => { setPatientEmail(event.target.value) }}
      />
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={3} >
			<TextValidator variant="outlined" fullWidth      
				id="newPatientMobile" label="Mobile" type="number"
				value={patientMobile} 
				onChange={() => { setPatientMobile(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
        errorMessages={['Invalid Mobile number','Invalid Mobile number']}
      />	
			</Grid>
			<Grid item xs={12} sm={12} md={3} lg={3} >
			<VsButton name={(addEdit === "ADD") ? "Add New" : "Update"} />
			</Grid>
			</Grid>
			<ShowResisterStatus />
			<BlankArea />
			</ValidatorForm>    
		</Box>	
		}
		<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
		{patientArray.map( (m, index) => 
			<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
			<DisplayPatientDetails 
				patient={m} 
				button1={<VsButton name="Appt"  color='green' onClick={() => { handleAppointmentConfirm(m)}} />}
				button2={<VsButton name="Visit" color='green' onClick={() => { handleVisit(m)}} />}
				button3={<VsButton name="Edit" onClick={() => { handleEdit(m)}} />}
				button4={<VsButton name="Del" color='red' onClick={() => { handleCancel(m)}} />}
			/>
			</Grid>
		)}
		</Grid>
		</ Container>
  </div>
  );    
}

