import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import VsButton from "CustomComponents/VsButton";

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
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
import {dynamicModal } from "assets/dynamicModal";

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";


import Switch from "@material-ui/core/Switch";
//import  from '@material-ui/core/Container';
//import  from '@material-ui/core/CssBaseline';

import Link from '@material-ui/core/Link';

// import Table from "components/Table/Table.js";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Avatar from "@material-ui/core/Avatar"
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";

import {DisplayYesNo, DisplayPageHeader, ValidComp, BlankArea} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';


// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';

//colours 
import { red, blue 
} from '@material-ui/core/colors';

import { callYesNo, 
	encrypt, decrypt, 
	validateInteger,
	updatePatientByFilter,
	dispAge, dispEmail, dispMobile,
} from "views/functions.js";

const useStyles = makeStyles((theme) => ({
	patientName: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,	
		color: 'blue',
	},
	patientInfo: {
		fontSize: theme.typography.pxToRem(14),
	},
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
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
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		normalAccordian: {
			backgroundColor: '#B2EBF2',
		},
		selectedAccordian: {
			backgroundColor: '#FFE0B2',
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: '1px', 
		}
  }));

const addEditModal = dynamicModal('60%');
const yesNoModal = dynamicModal('60%');

const COUNTPERPAGE=10;

const str1by4 = String.fromCharCode(188)
const str1by2 = String.fromCharCode(189)
const str3by4 = String.fromCharCode(190)

let test=[];
let medQty=[];
const timeArray=[1, 2, 3, 4, 5, 6, 7];
const unitArray=["Day", "Week", "Month", "Year"];

function setMedQty() {
	for(let i=0; i<=4; ++i) {
		medQty.push({num: i, str: medStr(i)});
	}
}

function medStr(qtyNum) {
	if (qtyNum == 0) return "0";
	var retStr = (qtyNum >= 2) ? Math.floor(qtyNum / 2).toString() : "";
	switch (qtyNum % 2) 
	{
		case 1: retStr += str1by2; break;
		//case 2: retStr += str1by2; break;
		//case 3: retStr += str3by4; break;
	}
	return retStr;
}

function dose(dose1, dose2, dose3) {
	//dose3 = 3;
	return (medStr(dose1) + "-" + medStr(dose2) + "-" + medStr(dose3));
}

let searchText = "";
function setSearchText(sss) { searchText = sss;}
//let info="";
//function setInfo(i) { info = i; }

const userCid = sessionStorage.getItem("cid");
export default function Visit() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [medicineArray, setMedicineArray] = useState([])
	const [notesArray, setNotesArry] = useState([]);
	const [remarkArray, setRemarkArray] = useState([{name: "Rem1"}, {name: "Rem2"}]);
	
	const [selectPatient, setSelectPatient] = useState(false);
  const [patientArray, setPatientArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [currentAppt, setCurrentAppt] = useState(null);
	const [visitArray, setVisitArray] = useState([])

	const [nextVisitTime, setNextVisitTime] = useState(2);
	const [nextVisitUnit, setNextVisitUnit] = useState(unitArray[0]);
	
	const [addEditNotes, setAddEditNotes] = useState(false);
	
	const [standard, setStandard] = useState(true);
	const [info, setInfo] = useState("");
	const [hideInfo, setHideInfo] = useState(true);
	const [editMedicine, setEditMedicine] = useState({});
	
	// for old medicine
	//const [currentVisit, setCurrentVisit] = useState("");
	

	
	// for new patient to be added
	// or patient to be modified
	//const	[patientName, setPatientName] = useState("");
	//const [patientEmail, setPatientEmail] = useState("");
	//const [patientMobile, setPatientMobile] = useState("");
	//const [patientGender, setPatientGender] = useState("Male");
	//const [patientAge, setPatientAge] = useState(30);
	
	// medicines

	
	const [emurVisitNumber, setEmurVisitNumber] = useState(0);
	const [emurNumber, setEmurNumber] = useState(0);
	const [emurName, setEmurName] = useState("");
	
	const [emedDose1, setEmedDose1] = useState(0);
	const [emedDose2, setEmedDose2] = useState(0);
	const [emedDose3, setEmedDose3] = useState(0);
	const [emedTime,  setEmedTime] = useState(0);
	const [emedUnit,  setEmedUnit] = useState("");
	
	const [registerStatus, setRegisterStatus] = useState(0);
	const [registerError, setRegisterError] = useState("");
	const [modalRegister, setModalRegister] = useState(0);
	//const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  //const [page, setPage] = useState(0);
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	
  useEffect(() => {	
		const checkPatient = async () => {		
			// check if appointment has been called from Patient view
			let myPatient;
			try {
				let shareData = JSON.parse(sessionStorage.getItem("shareData"));
				sessionStorage.setItem("shareData", "");		// clean up
				console.log(shareData);
				switch (shareData.caller) {
					case "PATIENT":
						//let allPat = [];
						//allPat.push(shareData.patient);
						
						setCurrentPatient(shareData.patient.displayName);
						setCurrentPatientData(shareData.patient);
						setPatientArray([shareData.patient]);
						setCurrentAppt(null);		// directly from patient. This no info about appt
						myPatient = shareData.patient;
						break;
						
					case "APPOINTMENT":	
						console.log(shareData.appointment);
						let myData = await updatePatientByFilter(shareData.appointment.pid.toString(), userCid);
						console.log(myData);
						if (myData.length == 0) {
							//error. SHould not have come here.
							return;
						}
						console.log(myData[0]);
						setCurrentPatient(myData[0].displayName);
						setCurrentPatientData(myData[0]);
						setPatientArray([myData[0]]);
						setCurrentAppt(shareData.appointment);	
						myPatient = myData[0];								// directly f
						break;
				}
				// now get all visits of patient
				getPatientVisit(myPatient);
			} catch {
				// no share data. Thus called directly
				console.log("direct");
			}
			
		}
		setMedQty();
		getAllMedicines();
		// find out if we have 
		checkPatient();
  }, []);

	
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
  
	//progress
	const LoadingIndicator = props => {
		const { promiseInProgress } = usePromiseTracker();
		return (
			promiseInProgress && 
			<h1>Hey some async call in progress ! </h1>
			);  
	}
	
	async function getAllMedicines() {
		if (medicineArray.length == 0) {
			try {
				var resp = await 
					trackPromise(
						axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/list/${userCid}`)
					);
				setMedicineArray(resp.data);
				//console.log(resp.data);
			} catch (e) {
				console.log(e);
				setMedicineArray([]);
			}
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
	
	
	//======old funcs
	
	
	function DisplayVisitError() {
	return(
		<Container component="DisplayVisitError" maxWidth="s">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>{registerError}</Typography>
		</Container>
	)}
	
	function setVisitError(errcode) {
    console.log(errcode);
    let myMsg;
		let iserr = true;
    switch (errcode) {
      case 0:
        myMsg = "";
				iserr = false;
        break;
      case 1001:
        myMsg = `No medicines specified`;
        break;
      case 1011:
        myMsg = `Blank medicine name specified`;
        break;
      case 1012:
        myMsg = `Duplicate medicines specified`;
        break;
      case 1013:
        myMsg = `All the 3 doses specifed as 0`;
        break;
			case 200:
				myMsg = `Successfully updated current visit`;
				iserr = false;
				break;
			case 201:
				myMsg = `Error updating current visit`;
				//iserr = false;
				break;
      default:
          myMsg = "Unknown Error";
          break;
    }
		setRegisterError(myMsg);
		openModal("ERROR");
    //return(
		//   <div>
    //    <Typography className={(iserr == false) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
     // </div>
    //)
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
	
	function DisplayStandardInput(props) {
		return (
		<div key="StdInp" align="left" >
			<FormControlLabel align="right"
				className={classes.radio}
        control={
          <SwitchBtn
						className={classes.radio}
            checked={standard}
            onChange={() => {setStandard(!standard) }}
            color="primary"
          />
        }
        label="Standard"
      />
			{standard &&
			<Select labelId='team' id='team' name="team" padding={10}
				variant="outlined" required fullWidth label={props.myDesc}
				value={emurName}
				inputProps={{
					name: 'Group',
					id: 'filled-age-native-simple',
				}}
				onChange={(event) => setEmurName(event.target.value)}
			>
				{props.myArray.map(x =>	<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
			</Select>
			}
			{!standard &&
			<TextValidator variant="outlined" required fullWidth color="primary"
				id="newName" label={props.myDesc} name="newName"
				onChange={(event) => setEmurName(event.target.value)}
				autoFocus
				value={emurName}
			/>
			}
		</div>
		);
	}
	
	function DisplayAddNew() {
		let show = false;
		if (visitArray.length > 0)
		if (visitArray[0].visitNumber > 0)
			show = true;
		
		if (show)
			return (
				<Typography align="right" className={gClasses.link} className={gClasses.root}>
					<Link href="#"  onClick={handleCreateNewVisit} variant="body2">Add New</Link>
				</Typography>
			);
		else
			return null;
	}
	
	function handleMedicineUpdate() {
		/*
		console.log("Edit medicine submitted");
		console.log(emurVisitNumber, emurNumber);
		console.log(emurName);
		console.log(emedDose1, emedDose2, emedDose3);
		console.log(emedTime, emedUnit);
		*/
		
		if ((emedDose1+emedDose2+emedDose3) == 0) {
				setModalRegister(101);
				return;
		}
		if (emurName == "") {
			setModalRegister(102);
				return;
		}
		
		let tmp = [].concat(visitArray);
		tmp[0].medicines[emurNumber].name = emurName;
		tmp[0].medicines[emurNumber].dose1 = emedDose1;
		tmp[0].medicines[emurNumber].dose2 = emedDose2;
		tmp[0].medicines[emurNumber].dose3 = emedDose3;
		tmp[0].medicines[emurNumber].unit = emedUnit;
		tmp[0].medicines[emurNumber].time = emedTime;
		setVisitArray(tmp);

		//setModalRegister(100);
		closeModal();

	}
	
	function DisplayEditMedicine() {
	
	return(
		<Container component="DisplayEditMedicine" maxWidth="md">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>Edit Medicine</Typography>
		<BlankArea />
		<ValidatorForm align="center" className={gClasses.form} >
			<DisplayStandardInput myArray={medicineArray} myDesc={"Medicine Name"} />
			<BlankArea />
			<Grid key="editmed" container justify="center" alignItems="center" >
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Typography className={classes.heading}>Dose1</Typography>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Select labelId='dose1' id='dose1' name="dose1" padding={10}
						variant="outlined" required fullWidth label="Dose 1" 
						value={emedDose1}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedDose1(event.target.value)}
						>
					{medQty.map(x =>	<MenuItem key={x.str} value={x.num}>{x.str}</MenuItem>)}
					</Select>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Typography className={classes.heading}>Dose2</Typography>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Select labelId='dose2' id='dose2' name="dose2" padding={10}
						variant="outlined" required fullWidth label="Dose 2" 
						value={emedDose2}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedDose2(event.target.value)}
						>
					{medQty.map(x =>	<MenuItem key={x.str} value={x.num}>{x.str}</MenuItem>)}
					</Select>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Typography className={classes.heading}>Dose3</Typography>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Select labelId='dose3' id='dose3' name="dose3" padding={10}
						variant="outlined" required fullWidth label="Dose 3" 
						value={emedDose3}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedDose3(event.target.value)}
						>
					{medQty.map(x =>	<MenuItem key={x.str} value={x.num}>{x.str}</MenuItem>)}
					</Select>
				</Grid>
			</Grid>
			<BlankArea />
			<Grid key="edittime" container justify="center" alignItems="center" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Typography className={classes.heading}>for</Typography>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Select labelId='time' id='time' name="time" padding={10}
						variant="outlined" required fullWidth label="Time" 
						value={emedTime}
						placeholder="Arun"
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedTime(event.target.value)}
						>
					{timeArray.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
					</Select>
				</Grid>
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Select labelId='unit' id='unit' name="unit" padding={10}
						variant="outlined" required fullWidth label="Unit" 
						value={emedUnit}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedUnit(event.target.value)}
						>
					{unitArray.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
					</Select>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
			</Grid>
			<ModalResisterStatus />
			<BlankArea />
			{/*<Button
				type="submit"
				variant="contained"
				color="primary"
				className={gClasses.submit}
			>
			Update
			</Button>*/}
			<VsButton name="Update" onClick={handleMedicineUpdate} />
		</ValidatorForm>
		</Container>
	)}
	
	
	
//============ starts from here
	
	//  handle Visit display /add / del /copy / update components and functions 
	
	
	function DisplayMedNotesRem(props) {
		let myVisit = visitArray.find(x => x.visitNumber == props.visitNumber);
		let myMed = myVisit.medicines;
		let myNotes = myVisit.userNotes;
		let myRem = myVisit.remarks;
		
		return (
		<Container component="main" maxWidth="lg">
		<Typography className={classes.title}>Prescription</Typography>
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		{myMed.map( (m, index) =>
			<Grid className={classes.noPadding} key={"MED"+props.visitNumber+"-"+index} container justify="center" alignItems="center" >
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<Typography className={classes.heading}>{m.name}</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Typography className={classes.heading}>{dose(m.dose1, m.dose2, m.dose3)}</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Typography className={classes.heading}>{m.time+" "+m.unit}</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<EditMedicineButton visitNumber={props.visitNumber} medicineNumber={index} />
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<DeleteMedicineButton visitNumber={props.visitNumber} medicineNumber={index} />
			</Grid>
		</Grid>
		)}
		</Box>
		{(props.visitNumber == 0) && <Typography align="right" className={gClasses.link}>
			<Link href="#" onClick={handleAddNewMedicine} variant="body2">Add Prescription</Link>
		</Typography>}
		{/* user notes start from here */}
		<Typography className={classes.title}>User Notes</Typography>
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		{myNotes.map( (un, index) =>
			<Grid className={classes.noPadding} key={"NOTES"+props.visitNumber+"med"+index} container justify="center" alignItems="center" >
			<Grid item xs={10} sm={10} md={10} lg={10} >
				<Typography className={classes.heading}>{un.name}</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<EditUserNotesButton visitNumber={props.visitNumber} notesNumber={index} />
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<DeleteUserNotesButton visitNumber={props.visitNumber} notesNumber={index} />
			</Grid>
		</Grid>
		)}
		</Box>
		{(props.visitNumber == 0) && <Typography align="right" className={gClasses.link}>
			<Link href="#" onClick={handleAddUserNotes} variant="body2">Add User Note</Link>
		</Typography>}
		{/* remarks start from here */}
		<Typography className={classes.title}>Examination Advised</Typography>
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		{myRem.map( (r, index) =>
			<Grid className={classes.noPadding} key={"REM"+props.visitNumber+"-"+index} container justify="center" alignItems="center" >
			<Grid item xs={10} sm={10} md={10} lg={10} >
				<Typography className={classes.heading}>{r.name}</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<EditRemarkButton visitNumber={props.visitNumber} remarkNumber={index} />
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<DeleteRemarkButton visitNumber={props.visitNumber} remarkNumber={index} />
			</Grid>
		</Grid>
		)}
		</Box>
		{(props.visitNumber == 0) && <Typography align="right" className={gClasses.link}>
			<Link href="#" onClick={handleAddNewRemark} variant="body2">Add Medical Examination</Link>
		</Typography>}
		</Container>
		);
	}
	
	function updateInfo() {
		let myInfo = document.getElementById("diagnosis").value;
		setInfo(myInfo);
	}
	
	function DisplayPatientInfo() {
	setInfo("High BP. Blood loss. Cavity in upper left. Needs root canal required.");
	return (
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		<Typography align="right" className={classes.link}>
			<Link variant="body2" onClick={() => { setHideInfo(!hideInfo); }}>
				{(hideInfo) ? "Show Diagnosis"  : "Hide Diagnosis"}
			</Link>
		</Typography>
		{(!hideInfo) && 
			<div align="left">
			<TextField id="diagnosis" fullWidth multiline maxRows="4" defaultValue={info} />
				{/*<Button variant="contained" color="primary" className={gClasses.button}
			onClick={updateInfo}
			>
			Update Info
				</Button>*/}
			<VsButton name="Update Info" onClick={updateInfo} />
			</div>
		}
		</Box>
	)}


	function orgDisplayAllVisits() {
	return (
	<div align="left">
		{visitArray.map(x =>	
			<Accordion className={(expandedPanel === "V"+x.visitNumber)? classes.normalAccordian : classes.selectedAccordian} 
				key={"AM"+x.visitNumber} expanded={expandedPanel === "V"+x.visitNumber} 
				onChange={handleAccordionChange("V"+x.visitNumber)}>
			<AccordionSummary key={"AS"+x.visitNumber} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
			<Grid key={"MG"+x.visitNumber} container justify="center" alignItems="center" >
			<Grid item xs={11} sm={11} md={11} lg={11} >
				<Typography className={classes.heading}>{((x.visitNumber == 0) ? "(New)" : "V"+x.visitNumber)+' '+x.visitDate.substr(0,15)}</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<DisplayVisitCopyRemoveButton visitNumber={x.visitNumber} />
			</Grid>
			</Grid>
			</AccordionSummary>
			<AccordionDetails key={"AD"+x.visitNumber}>
				<DisplayMedNotesRem visitNumber={x.visitNumber}/>
			</AccordionDetails>
			</Accordion>
		)}	
	</div>
	)}
	
		
	function DisplayVisitCopyRemoveButton(props) {
		if (props.visitNumber == 0) {
			return (
			<IconButton align="right" color="secondary" size="small" onClick={handleDeleteNew} >
				<DeleteIcon />
			</IconButton>
			);
		} else if (visitArray[0].visitNumber > 0) {
			return (
				<IconButton color="primary" size="small" onClick={() => { handleCopyNew(props.visitNumber)}} >
				<FileCopyIcon />
				</IconButton>
			);
			{/*return (<Link href="#" onClick={() => { handleCopyNew(props.visitNumber)} } variant="body2">Copy to New</Link>);*/}
		} else {
			return null	
		}			
	}
	
	
	function DisplayNewVisitBtn() {
		//console.log(visitArray);
		let disp = false;
		if (visitArray.length == 0)
			disp = true;
		else if (visitArray[0].visitNumber > 0)
			disp = true;
		
		if (!disp)	return null;
			
		return (
			<Typography align="right" className={classes.link}>
				<Link href="#" variant="body2" onClick={handleCreateNewVisit}>Add New Visit</Link>
			</Typography>
		)
	}
	
	function handleCreateNewVisit() {
		//console.log("In new visit");
		//console.log(expandedPanel);
		let x = new Date();
		
		let tmpArray = [{
			enabled: true,
			medicines: [],
			pid: currentPatientData.pid,
			displayName: currentPatientData.displayName,
			remarks: [],
			userNotes: [],
			visitDate: x.toString(),
			visitNumber: 0,
			appointment: '',
		}];
		
		//console.log(tmpArray[0]);
		tmpArray = tmpArray.concat(visitArray);
		setVisitArray(tmpArray);
	}
	
	function DisplayVisitUpdateButton() {
	if  ((visitArray.length > 0) && (visitArray[0].visitNumber === 0)) 
		return (
			<div align="left">
			<VsButton name="Update New Visit"  onClick={updateVisit} />
			<VsButton name="Print Visit"  onClick={printVisit} />
			</div>
		)
	else
		return null;
	}
	
	
	function handleCopyNew(num) {
		let today = new Date();
		
		let tmpArray = [{
			enabled: true,
			medicines: [],
			pid: currentPatientData.pid,
			displayName: currentPatientData.displayName,
			remarks: [],
			userNotes: [],
			visitDate: today.toString(),
			visitNumber: 0,
			appointment: '',
		}];
		
		let selectedVisit = visitArray.find(x => x.visitNumber === num);
		
		selectedVisit.medicines.forEach(m => {
			tmpArray[0].medicines.push(m);
		});
		
		selectedVisit.remarks.forEach(r => {
			tmpArray[0].remarks.push(r);
		});
		
		selectedVisit.userNotes.forEach(u => {
			tmpArray[0].userNotes.push(u);
		});
		
		tmpArray = tmpArray.concat(visitArray);
		setVisitArray(tmpArray);
		handleAccordionChange("");
		//console.log(tmpArray);
	}
	
	function handleDeleteNew() {
		let tmp = visitArray.slice(1, visitArray.length);
		setVisitArray(tmp);
	}
	
	async function printVisit() {
		alert("To be implemented");
	}
	
	async function updateVisit() {
		//console.log("Update today's visit", visitArray[0].medicines);
		
		let errcode = 0;
		
		// confirm of atleast 1 medicine given
		if (errcode == 0)
		if (visitArray[0].medicines.length == 0) {
			errcode = 1001;
		} 
		
		// confirm medicine name given and atleast 1 dose is non-zero
		if (errcode == 0)
		for(let i=0; i < visitArray[0].medicines.length; ++i) {
			// confirm medicine name given
			let m = visitArray[0].medicines[i];
			console.log("X"+m.name+"X");
			if (m.name == "") {
				errcode = 1011;
				break;
			}
			
			// confirm duplicate medicine not given
			let tmp = visitArray[0].medicines.filter(x => x.name == m.name);
			if (tmp.length > 1) {
				errcode = 1012;
				break;
			}
			
			// confirm atleast 1 dose is non-zero
			if ((m.dose1 + m.dose2 + m.dose3) == 0) {
				errcode = 1013;
				break;
			}
			
		};
		
		if (errcode == 0) {
			let newVisit = visitArray.length;
			let newVisitInfo = JSON.stringify(
			{
				appointment: currentAppt,
				visit:       visitArray[0]
			});
			try {
				errcode = 200;
				await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/updatenewvisit/${userCid}/${newVisit}/${newVisitInfo}`)
			} catch (e) {
				console.log(e)
				errcode = 201;
			}
		}
		setVisitError(errcode);
	}
	
	// user notes function here
	
	
	
	function EditUserNotesButton(props) {
		//console.log("editUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="primary" size="small" onClick={() => { handleEditUserNotes(props.visitNumber, props.notesNumber)}} >
			<EditIcon />
			</IconButton>
		)		
	}
	

	// Add medicine, notes and remarks
	
	function handleAddUserNotes() {
		//console.log("In handleAddUserNotes");
		let tmpArray = [].concat(visitArray);
		tmpArray[0].userNotes.push({name: ""});
		//console.log(tmpArray[0]);
		setVisitArray(tmpArray);
	}
	
	
	function handleAddNewRemark() {
		//console.log("In handleAddNewRemark");
		let tmpArray = [].concat(visitArray);
		let obj = {name: ""};
		tmpArray[0].remarks.push(obj);
		setVisitArray(tmpArray);
		//console.log(tmpArray[0].remarks);
		//console.log("In handleAddNewRemark over");
	}
	
	
	function handleAddNewMedicine() {
		let tmp = {
			dose1: 2, dose2: 0, dose3: 0,
			name: "", time: 1, unit: unitArray[0]
		};
		let tmpArray = [].concat(visitArray);
		tmpArray[0].medicines.push(tmp);
		setVisitArray(tmpArray);
	}
	
	
	// edit medicine, remark, user notes
	
	function handleEditRemark(vNumber, remarkNumber) {
		//console.log("handleEditRemark "+vNumber+" Notes "+remarkNumber);
		let tmp = visitArray.find( x => x.visitNumber == vNumber);

		setEmurVisitNumber(vNumber);
		setEmurNumber(remarkNumber);
		setEmurName(tmp.remarks[remarkNumber].name)
		setModalRegister(0);
		openModal("REMARK");	
	}
	
	function DisplayEditRemark() {
	return(
		<Container component="DisplayEditRemark" maxWidth="md">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>Edit Medical Test</Typography>
		<BlankArea />
		<ValidatorForm align="center" className={gClasses.form} >
			{/*<DisplayStandardInput myArray={remarkArray} myDesc={"Remark"} />*/}
			<Grid key="EditRemark" container justify="center" alignItems="center" >
				<Grid item xs={10} sm={10} md={10} lg={10} >
					<TextValidator variant="outlined" required fullWidth color="primary"
						id="newName" label="Medical Test" name="newName"
						onChange={(event) => setEmurName(event.target.value)}
						autoFocus
						value={emurName}
					/>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					{/*<Button
						type="submit"
						variant="contained"
						color="primary"
						className={gClasses.submit}
					>Update</Button>*/}
					<VsButton name="Update" onClick={updateRemark} />
				</Grid>
			</Grid>
			<ModalResisterStatus />
		</ValidatorForm>
		</Container>
	)}
	
	function updateRemark() {
		let tmp = [].concat(visitArray);
		tmp[0].remarks[emurNumber].name = emurName;
		//console.log(tmp[0].remarks);
		setVisitArray(tmp);
		setModalRegister(300);
		closeModal();
	}
	
	
	function handleEditUserNotes(vNumber, notesNumber) {
		console.log("handleEditUserNotes "+vNumber+" Notes "+notesNumber);
		let tmp = visitArray.find( x => x.visitNumber == vNumber);
		setEmurVisitNumber(vNumber);
		setEmurNumber(notesNumber);
		setEmurName(tmp.userNotes[notesNumber].name);
		setModalRegister(0);
		openModal("NOTES");	
	}
	
	function DisplayEditUserNotes() {
	return(
		<Container component="DisplayEditRemark" maxWidth="md">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>Edit User Notes</Typography>
		<BlankArea />
		<ValidatorForm align="center" className={gClasses.form} >
			<Grid key="EditRemark" container justify="center" alignItems="center" >
				<Grid item xs={10} sm={10} md={10} lg={10} >
					<TextValidator variant="outlined" required fullWidth color="primary"
						id="newName" label="User Note" name="newName"
						onChange={(event) => setEmurName(event.target.value)}
						autoFocus
						value={emurName}
					/>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					{/*<Button
						type="submit"
						variant="contained"
						color="primary"
						className={gClasses.submit}
					>Update</Button>*/}
					<VsButton name="Update" onClick={updateUserNotes} />
				</Grid>
			</Grid>
			<ModalResisterStatus />
		</ValidatorForm>
		</Container>
	)}
	
	function updateUserNotes() {
		console.log(emurVisitNumber, emurNumber);
		console.log(emurName);
		let tmp = [].concat(visitArray);
		tmp[0].userNotes[emurNumber].name = emurName;
		console.log(tmp[0].userNotes);
		setVisitArray(tmp);
		setModalRegister(200);
		closeModal();
	}
	
	
	
	function org_DisplayEditRemark() {
	return(
		<Container component="DisplayEditRemark" maxWidth="md">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>Edit Medical Test</Typography>
		<BlankArea />
		<ValidatorForm align="center" className={gClasses.form} >
			<DisplayStandardInput myArray={remarkArray} myDesc={"Remark"} />
			<BlankArea />
			<ModalResisterStatus />
			<BlankArea />
			{/*<Button
				type="submit"
				variant="contained"
				color="primary"
				className={gClasses.submit}
			>
			Update
			</Button>*/}
			<VsButton name="Update" onClick={updateRemark} />
		</ValidatorForm>
		</Container>
	)}
	
	
	function orgEditRemarkButton(props) {
		//console.log("editUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="primary" size="small" onClick={() => { handleEditRemark(props.visitNumber, props.remarkNumber)}} >
			<EditIcon />
			</IconButton>
		)		
	}
	
	function oldDeleteRemarkButton(props) {
		//console.log("delUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="secondary" size="small" onClick={() => { handleDeleteRemark(props.visitNumber, props.remarkNumber)}} >
			<DeleteIcon />
			</IconButton>
		)		
	}
	
	
	// handle Notes display  / add / edit / delete
	
	
	// handle Medicine display  / add / edit / delete
	
	async function handleEditMedicine(vNumber, mNumber) {
		await getAllMedicines();
		console.log("handleEditMedicine "+vNumber+" Medicine "+mNumber);
		let tmp = visitArray[0];
		setEditMedicine(tmp.medicines[mNumber]);
		console.log(tmp.medicines[mNumber]);
		
		setEmurVisitNumber(vNumber);
		setEmurNumber(mNumber);
		setEmurName(tmp.medicines[mNumber].name)
		setEmedDose1(tmp.medicines[mNumber].dose1);
		setEmedDose2(tmp.medicines[mNumber].dose2);
		setEmedDose3(tmp.medicines[mNumber].dose3);
		setEmedTime (tmp.medicines[mNumber].time);
		setEmedUnit (tmp.medicines[mNumber].unit);
		let dummy = medicineArray.find(x => x.name == tmp.medicines[mNumber].name);
		setStandard(dummy != null);
		setModalRegister(0);
		openModal("MEDICINE");	
	}
	
	
	
	function handleDeleteMedicine(vNumber, mNumber) {
		console.log("handleDeleteMedicine "+vNumber+" Medicine "+mNumber);
		if (vNumber == 0) {
			var tmp = [].concat(visitArray);
			tmp[0].medicines = tmp[0].medicines.filter(function(value, index, arr){ 
        return index != mNumber;
			});
			setVisitArray(tmp);
			console.log(tmp[0].medicines);
		}
	}
	
	function handleDeleteRemark(vNumber, mNumber) {
		console.log("handleDeleteMedicine "+vNumber+" Remark "+mNumber);
		if (vNumber == 0) {
			var tmp = [].concat(visitArray);
			tmp[0].remarks = tmp[0].remarks.filter(function(value, index, arr){ 
        return index !== mNumber;
			});
			setVisitArray(tmp);
			console.log(tmp[0].remarks);
		}
	}
	
	function handleDeleteNotes(vNumber, mNumber) {
		console.log("handleDeleteMedicine "+vNumber+" Notes "+mNumber);
		if (vNumber == 0) {
			var tmp = [].concat(visitArray);
			tmp[0].userNotes = tmp[0].userNotes.filter(function(value, index, arr){ 
        return index !== mNumber;
			});
			setVisitArray(tmp);
			console.log(tmp[0].userNotes);
		}
	}
	
	function EditMedicineButton(props) {
	if (props.visitNumber > 0) return null;

	return (
		<IconButton color="primary" size="small" onClick={() => { handleEditMedicine(props.visitNumber, props.medicineNumber)}} >
		<EditIcon />
		</IconButton>
	)}
	
	
	// handle visits
	
	// filter patient 
	function oldDisplaySearch() {
		return (
			<Grid key="DisplaySearch" container justify="center" alignItems="center" >
			<Grid item xs={2} sm={2} md={2} lg={2} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<TextField id="filter" variant="outlined" fullWidth label="Filter Patient" padding={10} 
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
			<Grid item xs={4} sm={4} md={4} lg={4} >
				{/*<InputLabel align= "left" id="demo-simple-select-label"></InputLabel>*/}
				<FormControl fullWidth className={classes.formControl}>
        <InputLabel htmlFor="grouped-native-select">Select Patient Name</InputLabel>
				<Select labelId='team' id='team' name="team" padding={10}
					variant="outlined" required fullWidth 
					value={currentPatient}
					//size="3"
					inputProps={{
						name: 'Group',
						id: 'filled-age-native-simple',
						label: "Select Patient",
					}}
					onChange={(event) => selectPatient(event.target.value)}
				>
					{patientArray.map(x =>	<MenuItem key={x.displayName} value={x.displayName}>{x.displayName + " (Id:"+ x.pid+") ("+x.age+x.gender.substr(0,1)+")"}</MenuItem>)}
				</Select>
				 </FormControl>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} />
			</Grid>
		);
	}
	
	
	async function old_getPatientList(filter) {
		filter = filter.trim();
		var subcmd = "list"
		if (filter != "") {
			// if it is complete numeric then it must by ID
			subcmd = (validateInteger(filter))	? "listbyid" : subcmd = "listbyname";
		} else
			subcmd = "list"
		
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/${subcmd}/${userCid}/${filter}`)
			//console.log(resp.data);
			let tmp = resp.data;
			tmp.forEach(ttt => {
				ttt.email = decrypt(ttt.email);
			});
			//console.log(tmp);
			setPatientArray(tmp);
		} catch (e) {
			console.log(e);
			setPatientArray([]);
		}
	}
	
	function DisplayPatientDetails() {
	return(
		<Typography className={classes.modalHeader}>
		{currentPatientData.displayName+" ( Id: "+currentPatientData.pid+" ) "+currentPatientData.age+currentPatientData.gender.substring(0,1)}
		</Typography>
	)}
	// yes no handler
	function yesNoHandler(id, action) {
		console.log(id, action);
	}
	
	//--------
	
	function DisplayFilter() {
	return (	
		<Grid className={classes.noPadding} key="Filter" container justify="center" alignItems="center" >
			<Grid item xs={false} sm={false} md={3} lg={3} />
			<Grid item xs={12} sm={12} md={6} lg={6} >
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
			<Grid item xs={false} sm={false} md={3} lg={3} />
		</Grid>
	)}
	
	async function selectFilter() {
		let myText = document.getElementById("filter").value;
		//console.log(myText);
		setSearchText(myText);
		let ppp = await updatePatientByFilter(searchText, userCid);
		setPatientArray(ppp);
	}
	
	async function handleSelectPatient(rec) {
		setSelectPatient(false);
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		await getPatientVisit(rec);
	}
	
	async function getPatientVisit(pRec) {
		//let pRec = patientArray.find(x => x.displayName == name);
		console.log("in pat visit");
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/list/${userCid}/${pRec.pid}`)
			setVisitArray(resp.data);
			console.log(resp.data);
		} catch(e) {
			setVisitArray([]);
			console.log(e);
		}
	}
	
  return (
 <div className={gClasses.webPage} align="center" key="main">
	<DisplayPageHeader headerName="Visits" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	{(!selectPatient) && 
		<Typography align="right" className={classes.link}>
			<Link href="#" variant="body2" onClick={() => { setCurrentAppt(null); setCurrentPatient(""); setVisitArray([]); setSelectPatient(true); }}>Select Patient</Link>
		</Typography>
	}
	{(selectPatient) && 
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="right"><IconButton color="secondary"  size="small" onClick={() => {setSelectPatient(false)}} >
				<CancelIcon />
			</IconButton></div>
			<Typography>
				<span className={classes.patientName}>Select Patient</span>
			</Typography>
		<DisplayFilter />
		<Grid className={classes.noPadding} key="AllPatients" container alignItems="center" >
			{patientArray.map( (m, index) => 
				<Grid key={"PAT"+index} item xs={12} sm={12} md={3} lg={3} >
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
		<div align="left">
			<Typography align="center" className={classes.modalHeader}>
			{currentPatientData.displayName+" ( Id: "+currentPatientData.pid+" ) "}
			</Typography>
			{/*<DisplayPatientInfo />*/}
			<DisplayNewVisitBtn />
			<DisplayVisitUpdateButton />
			{visitArray.map(x =>	
				<Accordion className={(expandedPanel === "V"+x.visitNumber)? classes.normalAccordian : classes.selectedAccordian} 
					key={"AM"+x.visitNumber} expanded={expandedPanel === "V"+x.visitNumber} 
					onChange={handleAccordionChange("V"+x.visitNumber)}>
				<AccordionSummary key={"AS"+x.visitNumber} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Grid key={"MG"+x.visitNumber} container justify="center" alignItems="center" >
				<Grid item xs={11} sm={11} md={11} lg={11} >
					<Typography className={classes.heading}>{((x.visitNumber == 0) ? "(New)" : "V"+x.visitNumber)+' '+x.visitDate.substr(0,15)}</Typography>
				</Grid>
				<Grid item xs={1} sm={1} md={1} lg={1} >
					{/*  button to copy old visit and delete for new visit */}
					{(x.visitNumber == 0) &&
						<IconButton align="right" color="secondary" size="small" onClick={handleDeleteNew} >
						<DeleteIcon />
						</IconButton>
					}
					{(visitArray[0].visitNumber > 0) &&
						<IconButton color="primary" size="small" onClick={() => { handleCopyNew(x.visitNumber)}} >
						<FileCopyIcon />
						</IconButton>
					}
				</Grid>
				</Grid>
				</AccordionSummary>
				<AccordionDetails key={"AD"+x.visitNumber}>
					<Container component="main" maxWidth="lg">
					{/* Display Prescription */}
					<Typography className={classes.title}>Prescription</Typography>
					<Box borderColor="primary.main" borderRadius={7} border={2}>
					{x.medicines.map( (m, index) =>
						<Grid className={classes.noPadding} key={"MED"+x.visitNumber+"-"+index} container justify="center" alignItems="center" >
						<Grid item xs={4} sm={4} md={6} lg={6} >
							<Typography className={classes.heading}>{m.name}</Typography>
						</Grid>
						<Grid item xs={4} sm={4} md={2} lg={2} >
							<Typography className={classes.heading}>{dose(m.dose1, m.dose2, m.dose3)}</Typography>
						</Grid>
						<Grid item xs={2} sm={2} md={2} lg={2} >
							<Typography className={classes.heading}>{m.time+m.unit}</Typography>
						</Grid>
						<Grid item xs={1} sm={1} md={1} lg={1} >
							{(x.visitNumber === 0) &&
								<IconButton color="primary" size="small" onClick={() => { handleEditMedicine(x.visitNumber, index)}} >
								<EditIcon />
								</IconButton>
							}
						</Grid>
						<Grid item xs={1} sm={1} md={1} lg={1} >
							{(x.visitNumber === 0) &&
								<IconButton color="secondary" size="small" onClick={() => { handleDeleteMedicine(x.visitNumber, index)}} >
								<DeleteIcon />
								</IconButton>
							}
						</Grid>
					</Grid>
					)}
					</Box>
					{(x.visitNumber === 0) && 
						<Typography align="right" className={gClasses.link}>
						<Link href="#" onClick={handleAddNewMedicine} variant="body2">Add Prescription</Link>
						</Typography>
					}
					{/* Display User Notes */}
					<BlankArea />
					<Typography className={classes.title}>User Notes</Typography>
					<Box borderColor="primary.main" borderRadius={7} border={2}>
					{x.userNotes.map( (un, index) =>
						<Grid className={classes.noPadding} key={"NOTES"+x.visitNumber+"notes"+index} container justify="center" alignItems="center" >
						<Grid item xs={10} sm={10} md={10} lg={10} >
							<Typography className={classes.heading}>{un.name}</Typography>
						</Grid>
						<Grid item xs={1} sm={1} md={1} lg={1} >
						{(x.visitNumber === 0) &&
							<IconButton color="primary" size="small" onClick={() => { handleEditUserNotes(x.visitNumber, index)}} >
							<EditIcon />
							</IconButton>
						}
						</Grid>
						<Grid item xs={1} sm={1} md={1} lg={1} >
						{(x.visitNumber === 0) &&
							<IconButton color="secondary" size="small" onClick={() => { handleDeleteNotes(x.visitNumber, index)}} >
							<DeleteIcon />
							</IconButton>
						}
						</Grid>
					</Grid>
					)}
					</Box>
					{(x.visitNumber === 0) &&
						<Typography align="right" className={gClasses.link}>
						<Link href="#" onClick={handleAddUserNotes} variant="body2">Add User Note</Link>
						</Typography>
					}
					{/* Display Medical examinations */}
					<BlankArea />
					<Typography className={classes.title}>Examination Advised</Typography>
					<Box borderColor="primary.main" borderRadius={7} border={2}>
					{x.remarks.map( (r, index) =>
						<Grid className={classes.noPadding} key={"REM"+x.visitNumber+"-"+index} container justify="center" alignItems="center" >
						<Grid item xs={10} sm={10} md={10} lg={10} >
							<Typography className={classes.heading}>{r.name}</Typography>
						</Grid>
						<Grid item xs={1} sm={1} md={1} lg={1} >
						{(x.visitNumber === 0) &&
							<IconButton color="primary" size="small" onClick={() => { handleEditRemark(x.visitNumber, index)}} >
							<EditIcon />
							</IconButton>
						}
						</Grid>
						<Grid item xs={1} sm={1} md={1} lg={1} >
							{(x.visitNumber === 0) &&
								<IconButton color="secondary" size="small" onClick={() => { handleDeleteRemark(x.visitNumber, index)}} >
								<DeleteIcon />
								</IconButton>
							}
						</Grid>
					</Grid>
					)}
					</Box>
					{(x.visitNumber === 0) && 
						<Typography align="right" className={gClasses.link}>
						<Link href="#" onClick={handleAddNewRemark} variant="body2">Add Medical Examination</Link>
						</Typography>
					}					
					<BlankArea />
					{/* Follow up visit */}
					{(x.visitNumber === 0) &&
						<Grid className={classes.noPadding} key={"FOLLOWUP"} container justify="center" alignItems="center" >
							<Grid item xs={4} sm={4} md={2} lg={2} >
							<Typography className={classes.title}>Follow up</Typography>
							</Grid>
							<Grid item xs={4} sm={4} md={1} lg={1} >
								<Select labelId='time' id='time' name="time" padding={10}
								variant="outlined" required fullWidth label="Time" 
								value={nextVisitTime}
								placeholder="Arun"
								inputProps={{
									name: 'Time',
									id: 'filled-age-native-simple',
								}}
								onChange={(event) => setNextVisitTime(event.target.value)}
								>
								{timeArray.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
								</Select>
							</Grid>
							<Grid item xs={4} sm={4} md={1} lg={1} >
								<Select labelId='unit' id='unit' name="unit" padding={10}
									variant="outlined" required fullWidth label="Unit" 
									value={nextVisitUnit}
									inputProps={{
										name: 'Unit',
										id: 'filled-age-native-simple',
									}}
									onChange={(event) => setNextVisitUnit(event.target.value)}
								>
								{unitArray.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
								</Select>
							</Grid>
							<Grid item xs={false} sm={false} md={8} lg={8} />
						</Grid>
					}
					</Container>
					{/*<DisplayMedNotesRem visitNumber={x.visitNumber}/>*/}
				</AccordionDetails>
				</Accordion>
			)}	
		</div>
	}
	</Container>
	<Modal
		isOpen={modalIsOpen == "REMARK"}
		shouldCloseOnOverlayClick={false}
		onAfterOpen={afterOpenModal}
		onRequestClose={closeModal}
		style={modalStyles}
		contentLabel="Example Modal"
		aria-labelledby="modalTitle"
		aria-describedby="modalDescription"
		ariaHideApp={false}
	>
		<DisplayEditRemark />
	</Modal>
	<Modal
		isOpen={modalIsOpen == "MEDICINE"}
		shouldCloseOnOverlayClick={false}
		onAfterOpen={afterOpenModal}
		onRequestClose={closeModal}
		style={modalStyles}
		contentLabel="Example Modal"
		aria-labelledby="modalTitle"
		aria-describedby="modalDescription"
		ariaHideApp={false}
	>
		<DisplayEditMedicine />
	</Modal>		
	<Modal
		isOpen={modalIsOpen == "NOTES"}
		shouldCloseOnOverlayClick={false}
		onAfterOpen={afterOpenModal}
		onRequestClose={closeModal}
		style={modalStyles}
		contentLabel="Example Modal"
		aria-labelledby="modalTitle"
		aria-describedby="modalDescription"
		ariaHideApp={false}
	>
		<DisplayEditUserNotes />
	</Modal>				
  </div>
  );    
}
