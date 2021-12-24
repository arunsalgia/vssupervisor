import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import { useLoading, Audio } from '@agney/react-loading';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'
import fileDownload  from 'js-file-download';
import fs from 'fs';
import _ from 'lodash';

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
import cloneDeep from 'lodash/cloneDeep';
import StepProgressBar from 'react-step-progress';
// import the stylesheet
import 'react-step-progress/dist/index.css';

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";

// icons
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CancelIcon from '@material-ui/icons/Cancel';
import EventNoteIcon from '@material-ui/icons/EventNote';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import Switch from "@material-ui/core/Switch";


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

import {DisplayYesNo, DisplayPageHeader, ValidComp, BlankArea,
DisplayPatientDetails,
DisplayDocumentList,
DisplayImage, DisplayPDF,
LoadingMessage,
DisplayDocumentDetails,
} from "CustomComponents/CustomComponents.js"

import {
SupportedMimeTypes, SupportedExtensions,
str1by4, str1by2, str3by4
} from "views/globals.js";

// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';


//colours 
import { red, blue 
} from '@material-ui/core/colors';

import { callYesNo, 
	downloadVisit,
	encrypt, decrypt, 
	validateInteger,
	updatePatientByFilter,
	dispAge, dispEmail, dispMobile,
	getPatientDocument,
	stringToBase64,
	vsDialog,
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
	murItem: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		paddingRight: '10px',
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
		selectedAccordian: {
			//backgroundColor: '#B2EBF2',
		},
		normalAccordian: {
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
// setup the step content
const step1Content = <h1>Request to server</h1>;
const step2Content = <h1>Geneate visit document</h1>;
const step3Content = <h1>Download visit document</h1>;

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


var userCid;
export default function Visit() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [isListDrawer, setIsListDrawer] = useState("");
	const [selectPatient, setSelectPatient] = useState(false);
  const [patientArray, setPatientArray] = useState([])
	const [patientMasterArray, setPatientMasterArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	
	const [startLoading, setStartLoading] = useState(false);
	
	const [showDocument, setShowDocument] = useState(false);
	const [documentArray, setDocumentArray] = useState([]);
	

	const [dlMime, setDlMime] = useState("");
	const [dlFile, setDlFile] = useState("");
	const [isPdf, setIsPdf] = useState(false);
	const [dlSrc, setDlSrc] = useState("");
	const [dlDoc, setDlDoc] = useState({});
	const [viewImage, setViewImage] = useState(false);
	
	const [medicineArray, setMedicineArray] = useState([])
	const [noteArray, setNoteArray] = useState([]);
	const [remarkArray, setRemarkArray] = useState([{name: "Rem1"}, {name: "Rem2"}]);
	
	//const [currentAppt, setCurrentAppt] = useState(null);
	const [visitArray, setVisitArray] = useState([])

	const [nextVisitTime, setNextVisitTime] = useState(2);
	const [nextVisitUnit, setNextVisitUnit] = useState(unitArray[1]);
	
	const [addEditNotes, setAddEditNotes] = useState(false);
	
	const [standard, setStandard] = useState(true);
	const [info, setInfo] = useState("");
	const [hideInfo, setHideInfo] = useState(true);
	const [editMedicine, setEditMedicine] = useState({});
	
	const [newPatient, setNewPatient] = useState(false)
	
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
	const [visitRegister, setVisitRegister] = useState(0);
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
		userCid = sessionStorage.getItem("cid");

		const checkPatient = async () => {	
			let ppp = await getAllPatients();
			setPatientMasterArray(ppp);		
			// check if visit has called from some other view
			try {
				let patRec = JSON.parse(sessionStorage.getItem("shareData"));
				console.log(patRec);
				setSearchText(patRec.displayName);
				setPatientArray([patRec]);
				setCurrentPatientData(patRec);
				setCurrentPatient(patRec.displayName);
				await getPatientVisit(patRec);
				let ddd = await getPatientDocument(userCid, patRec.pid);
				//console.log("Docs", ddd);
				setDocumentArray(ddd);
			} catch {
				// have come directly
				let ppp = await getAllPatients();
				setPatientArray(ppp);
				setPatientMasterArray(ppp);
			}
			sessionStorage.setItem("shareData", "");		// clean up
			
		}
		setMedQty();
		checkPatient();
		getAllMedicines();
		getAllNotes();
		getAllRemarks();
  }, []);


  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
  
	
	async  function getAllPatients() {
		if (process.env.REACT_APP_DIRECTVISIT !== 'true')
			return [];
			
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/list/${userCid}`;
			let resp = await axios.get(myUrl);
			return resp.data;
		} catch (e) {
			return [];
		}	
	}
	

	async function getPatientVisit(rec) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/list/${userCid}/${rec.pid}`)
			setVisitArray(resp.data);
		} catch (e) {
			console.log(e)
			setVisitArray([]);
		}
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
	
	async function getAllNotes() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/note/list/${userCid}`)
			setNoteArray(resp.data);
			//console.log(resp.data);
		} catch (e) {
			console.log(e);
		}
	}
		
	async function getAllRemarks() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/remark/list/${userCid}`)
			setRemarkArray(resp.data);
			//console.log(resp.data);
		} catch (e) {
			console.log(e);
		}
	}
		
		
	function DisplayCloseModal() {
	return ( <VsCancel align="right" onClick={closeModal} /> )}
	
	
	
	
	function DisplayVisitError() {
		alert.error(registerError);
		return null;
	}
	
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
		<Box borderColor="primary.main" borderRadius={7} border={1}>
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
		<Box borderColor="primary.main" borderRadius={7} border={1}>
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
		<Box borderColor="primary.main" borderRadius={7} border={1}>
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
		<Box borderColor="primary.main" borderRadius={7} border={1}>
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
		if (sessionStorage.getItem("userType") !== "Doctor") return null;
		if ((visitArray.length > 0) && (visitArray[0].visitNumber === 0)) return null;
		return (
			<VsButton align="right" name="Add New Visit" onClick={handleCreateNewVisit} />
		)
	}
	
	function handleCreateNewVisit() {
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
	
		
	function VisitRegisterStatus() {
    // console.log(`Status is ${modalRegister}`);
    let myMsg;
    switch (visitRegister) {
      case 0:
        myMsg = "";
        break;
      case 100:
        myMsg = `Successfully updated new Visit to database`;
        break;
      case 101:
        myMsg = `Unable to save new Visit `;
        break;
			case 200:
        myMsg = `Successfully generated document of new Visit`;
        break;
      case 201:
        myMsg = `Unable to generate document of new Visit `;
        break;
      case 300:
        myMsg = `Successfully uploaded Visit document`;
        break;
      case 301:
        myMsg = `Unable to download document of new Visit `;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <Grid key="VisitRegister" container justify="center" alignItems="center" >
				<Grid item xs={11} sm={11} md={11} lg={11} >
					<Typography className={((visitRegister % 100) != 0) ? gClasses.error : gClasses.nonerror}>
					{myMsg}
					</Typography>
				</Grid>
				<Grid item xs={1} sm={1} md={1} lg={1} >
				{ (visitRegister !== 0) && <VsCancel onClick={() => {setVisitRegister(0)}} />}
				</Grid>
      </Grid>
    )
  }
	
	function handleCopyNew(num) {
		let today = new Date();
		
		/*
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
		*/
		
		let selectedVisit = visitArray.find(x => x.visitNumber === num);
		let newVisit = cloneDeep(selectedVisit);
		newVisit.visitNumber = 0;
		newVisit.visitDate = new Date().toString();
		let tmpArray = [newVisit];
		tmpArray = tmpArray.concat(visitArray);
		setVisitArray(tmpArray);
		handleAccordionChange("");
		//console.log(tmpArray);
	}
	
	function handleDeleteNew() {
		let tmp = visitArray.slice(1, visitArray.length);
		setVisitArray(tmp);
	}
	
	
	
	function validateNewVisit() {
		let errcode = 0;
		
		// confirm of atleast 1 medicine given
		if (errcode == 0)
		if (visitArray[0].medicines.length == 0) {
			alert.error("No Medicine prescribed.");
			return;
		} 
		
		// confirm medicine name given and atleast 1 dose is non-zero
		if (errcode == 0)
		for(let i=0; i < visitArray[0].medicines.length; ++i) {
			// confirm medicine name given
			let m = visitArray[0].medicines[i];
			console.log("X"+m.name+"X");
			if (m.name == "") {
				return alert.error("Medicine Name cannot be blank");
			}
			
			// confirm duplicate medicine not given
			let tmp = visitArray[0].medicines.filter(x => x.name == m.name);
			if (tmp.length > 1) {
				return alert.error("Medicine "+m.name+" prescribed more than once");
			}
			
			// confirm atleast 1 dose is non-zero
			if ((m.dose1 + m.dose2 + m.dose3) == 0) {
				return alert.error("No dose specified");
			}	
		};
		return (errcode);
	}
	
	async function generateVisitDocument() {
		let errcode = validateNewVisit();
		//setShowProgress(true);
		//setStepNo(0);
		if (errcode !== 0) { setVisitError(errcode); setShowProgress(false); return; }
		//setStepNo(1);
		
		//let newVisitNumber = visitArray.length;
		let newVisit = prepareVisitData();	
		let newVisitInfo = JSON.stringify(newVisit);
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/printdoc/${userCid}/${newVisitInfo}`);
			//setStepNo(2);
			//alert.success("Successfully generated visit document");
			//await downloadVisit(userCid, currentPatientData.pid);
			let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/visit/downloadvisit/${userCid}/${currentPatientData.pid}`;
			let response = await axios({ method: 'get', url: myURL, responseType: 'arraybuffer',
      // onDownloadProgress: (progressEvent) => {
      //   // let newPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //   // console.log("File download in progress ", newPercent);
      // },
			});
			let myFile = "patientVisit.docx";
			console.log(myFile);
			console.log(response.data);
			await fileDownload (response.data, myFile);
			//setStepNo(3);
			console.log("download over");

			alert.success("Successfully generated visit document");
		} catch (e) {
			console.log(e)
			alert.error("Error generating visit document");
		}
		//setShowProgress(false);
	}
	
	async function printVisit() {	
		try {
			await downloadVisit(userCid, currentPatientData.pid);
			alert.success("Successfully downloaded visit document");
		} catch (e) {
			alert.error("Error downloading visit document");
		}
	}
	
	function prepareVisitData() {
		let newVisit = cloneDeep(visitArray[0]);
		// remove blank lines
		newVisit.remarks = newVisit.remarks.filter(x => x.name.trim() !== "");
		newVisit.userNotes = newVisit.userNotes.filter(x => x.name.trim() !== "");

		for(let i=0; i<newVisit.medicines.length; ++i) {
			newVisit.medicines[i].name = stringToBase64(newVisit.medicines[i].name);
		}
		for(let i=0; i<newVisit.userNotes.length; ++i) {
			newVisit.userNotes[i].name = stringToBase64(newVisit.userNotes[i].name);
		}
		for(let i=0; i<newVisit.remarks.length; ++i) {
			newVisit.remarks[i].name = stringToBase64(newVisit.remarks[i].name);
		}
		
		let result = {visit: newVisit, nextVisit: {after: nextVisitTime, unit: nextVisitUnit} }
		return result;
	}
	
	async function updateVisit() {
		let errcode = validateNewVisit();

		if (errcode == 0) {	
			let newVisitNumber = visitArray.length;
			let newVisit = prepareVisitData();
			// encodeURI			
			let newVisitInfo = JSON.stringify(newVisit);
			//console.log(newVisitInfo);
			try {
				await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/updatenewvisit/${userCid}/${newVisitNumber}/${newVisitInfo}`)
				alert.success("Successfully update new visit");
			} catch (e) {
				console.log(e)
				alert.success("Error updating new visit");
			}
		} else {
			//setVisitError(errcode);
		}
	}
	

	// Buttons 

	function EditUserNotesButton(props) {
		//console.log("editUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="primary" size="small" onClick={() => { handleEditUserNotes(props.visitNumber, props.notesNumber)}} >
			<EditIcon />
			</IconButton>
		)		
	}
		
	function EditMedicineButton(props) {
	if (props.visitNumber > 0) return null;
	return (
		<IconButton color="primary" size="small" onClick={() => { handleEditMedicine(props.visitNumber, props.medicineNumber)}} >
		<EditIcon />
		</IconButton>
	)}
	

	//Arun Salgia new add / edit / delete Notes
	
	function handleAddUserNotes() {
		setEmurName("");
		setIsDrawerOpened("ADDNOTE");
		// set filter
		setFilterItem("NOT");
		setFilterItemText("");
		setFilterItemArray([]);
	}
	
	function handleEditUserNotes(vNumber, notesNumber) {
		let tmp = visitArray.find( x => x.visitNumber == vNumber);
		setEmurVisitNumber(vNumber);
		setEmurNumber(notesNumber);
		setEmurName(tmp.userNotes[notesNumber].name);
		setModalRegister(0);
		setIsDrawerOpened("EDITNOTE");
		
		setFilterItem("NOT");
		setFilterItemText("");
		setFilterItemArray([]);

	}
	
	function updateUserNotes() {
		updateNoteToDatabase(emurName);
		
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		if (isDrawerOpened === "ADDNOTE") {
			tmp[0].userNotes.push({name: ""});
			index = tmp[0].userNotes.length - 1;
		}
		tmp[0].userNotes[index].name = emurName;
		console.log(tmp[0].userNotes);
		setVisitArray(tmp);
		setIsDrawerOpened("");
	}
	
	function handleDeleteNotes(vNumber, mNumber) {
		//console.log("handleDeleteMedicine "+vNumber+" Notes "+mNumber);
		if (vNumber === 0) {
			vsDialog("Delete User Note", `Are you sure you want to delete note ${visitArray[0].userNotes[mNumber].name}?`,
				{label: "Yes", onClick: () => handleDeleteNotesConfirm(vNumber, mNumber) },
				{label: "No" }
			);
		}
	}
	
	function handleDeleteNotesConfirm(vNumber, mNumber) {
		//console.log("handleDeleteMedicine "+vNumber+" Notes "+mNumber);
		if (vNumber == 0) {
			var tmp = [].concat(visitArray);
			tmp[0].userNotes = tmp[0].userNotes.filter(function(value, index, arr){ 
        return index !== mNumber;
			});
			setVisitArray(tmp);
		}
	}
	
	//Arun Salgia new add / edit / delete Remarks
	
	function handleAddNewRemark() {
		setEmurName("");
		setModalRegister(0);
		setIsDrawerOpened("ADDREM");
		
		setFilterItem("REM");
		setFilterItemText("");
		setFilterItemArray([]);
	}
	
	function handleEditRemark(vNumber, remarkNumber) {
		let tmp = visitArray.find( x => x.visitNumber == vNumber);

		setEmurVisitNumber(vNumber);
		setEmurNumber(remarkNumber);
		setEmurName(tmp.remarks[remarkNumber].name)
		setModalRegister(0);
		setIsDrawerOpened("EDITREM");
		
		setFilterItem("REM");
		setFilterItemText("");
		setFilterItemArray([]);
	}
	
	function updateRemark() {
		updateRemarkToDatabase(emurName);
		
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		if (isDrawerOpened === "ADDREM") {
			tmp[0].remarks.push({name: ""});
			index = tmp[0].remarks.length - 1;
		}
		tmp[0].remarks[index].name = emurName;
		setVisitArray(tmp);
		setIsDrawerOpened("");
	}
	
	function handleDeleteRemark(vNumber, mNumber) {
		if (vNumber !== 0) return;
		let item = visitArray[0].remarks[mNumber].name;
		vsDialog("Delete Examination Advice", `Are you sure you want to delete Examination advice of ${item}?`,
		{label: "Yes", onClick: () => handleDeleteRemarkConfirm(vNumber, mNumber) },
		{label: "No" }
		);
	}
	
	function handleDeleteRemarkConfirm(vNumber, mNumber) {
		console.log("handleDeleteMedicine "+vNumber+" Remark "+mNumber);
		if (vNumber == 0) {
			var tmp = [].concat(visitArray);
			tmp[0].remarks = tmp[0].remarks.filter(function(value, index, arr){ 
        return index !== mNumber;
			});
			setVisitArray(tmp);
			//console.log(tmp[0].remarks);
		}
	}
	

	
	//Arun Salgia new add / edit / delete medicine
	
	function handleAddNewMedicine() {
		setEmurName("");
		setEmedDose1(0);
		setEmedDose2(0);
		setEmedDose3(0);
		setEmedTime(2);
		setEmedUnit(unitArray[1]);
		setModalRegister(0);
		// for filter
		setFilterItem("MED");
		setFilterItemText("");
		setFilterItemArray([]);
		
		setIsDrawerOpened("ADDMED");
	}
	

	
	function handleEditMedicine(vNumber, mNumber) {
		//await getAllMedicines();
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
		let ttt = medicineArray.find(x => x.name == tmp.medicines[mNumber].name);
		setStandard(ttt != null);
		
				// for filter
		setFilterItem("MED");
		setFilterItemText("");
		setFilterItemArray([]);
		
		setModalRegister(0);
		setIsDrawerOpened("EDITMED");
	}

	async function updateMedicineToDatabase(medName) {
		let tmp = medicineArray.find(x => x.name === medName)
		if (!tmp) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${userCid}/${medName}`;
				axios.get(myUrl);
				let tmpArray = [{name: medName}].concat(medicineArray);
				setMedicineArray(_.sortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}
		}
	}
	
	async function updateNoteToDatabase(noteName) {
		let tmp = noteArray.find(x => x.name === noteName)
		if (!tmp) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/note/add/${userCid}/${noteName}`;
				axios.get(myUrl);
				let tmpArray = [{name: noteName}].concat(noteArray);
				setNoteArray(_.sortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}
		}
	}
	
	async function updateRemarkToDatabase(remarkName) {
		let tmp = remarkArray.find(x => x.name === remarkName)
		if (!tmp) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/remark/add/${userCid}/${remarkName}`;
				axios.get(myUrl);
				let tmpArray = [{name: remarkName}].concat(remarkArray);
				setRemarkArray(_.sortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}
		}
	}
	
	function handleMedicineUpdate() {
		if ((emedDose1+emedDose2+emedDose3) == 0) {
				setModalRegister(101);
				return;
		}
		if (emurName == "") {
			setModalRegister(102);
				return;
		}
		
		updateMedicineToDatabase(emurName);
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		if (isDrawerOpened === "ADDMED") {
			tmp[0].medicines.push({name: "", dose1: 0, dose2: 0, dose3: 0, unit: "", time: 0});
			index = tmp[0].medicines.length - 1;
		}
		console.log()
		tmp[0].medicines[index].name = emurName;
		tmp[0].medicines[index].dose1 = emedDose1;
		tmp[0].medicines[index].dose2 = emedDose2;
		tmp[0].medicines[index].dose3 = emedDose3;
		tmp[0].medicines[index].unit = emedUnit;
		tmp[0].medicines[index].time = emedTime;
		setVisitArray(tmp);

		setIsDrawerOpened("");
	}
	
	function handleDeleteMedicine(vNumber, mNumber) {
		if (vNumber !== 0) return;
		vsDialog("Delete Medicine", `Are you sure you want to delete medicine ${visitArray[0].medicines[mNumber].name}?`,
		{label: "Yes", onClick: () => handleDeleteMedicineConfirm(vNumber, mNumber) },
		{label: "No" }
		);
	}
	
	function handleDeleteMedicineConfirm(vNumber, mNumber) {
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
	
	// handle visits
	
	
	function DisplayPatientName() {
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
	
	async function addNewPatient() {
		//let myName=document.getElementById("emurName").value;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/new/${userCid}/${emurName}`;
			let resp = await axios.get(myUrl);
			//let tmpArray=[].concat(patientArray);
			//tmpArray.push(resp.data);
			//tmpArray.sort((a, b) => { return a.order - b.order;});
			//setPatientArray
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
	

	
	
	async function handleFileView(d) {
		let pdfReport;
		setStartLoading(true);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/downloadimage/${userCid}/${d.pid}/${d.title}`
			let resp = await axios.get(myUrl);
			setIsDrawerOpened((d.type === "PDF") ? "PDF" : "IMG");
			if (d.type === "PDF") {
				// pdf file
				// file={`data:application/pdf;base64,${this.state.base64}`}
				const b64 = Buffer.from(resp.data.data).toString('base64');
				//console.log(b64)
				setDlFile(b64);
				pdfReport = true;
			} else {
				//image file
				const b64 = Buffer.from(resp.data.data).toString('base64');
				//console.log(b64);
				setDlFile(b64);
				pdfReport = false
			} 
			setDlDoc(d);
			let idx = SupportedExtensions.indexOf(d.type);
			setDlMime(SupportedMimeTypes[idx]);
			setViewImage(true);
		} catch (e) {
			console.log(e);
		}
		setStartLoading(false);			
	}
	
	function DisplayMedicalReports() {
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{(documentArray.length === 0) &&
			<Typography className={gClasses.title}>{"No Reports"}</Typography>
		}
		{(documentArray.length > 0) &&
			<div>
			<VsButton align="right" 
				name={(showDocument) ? "Hide Document" : "Show Document"} 
				onClick={() =>{setShowDocument(!showDocument); }}
			/>
			{(showDocument) && 
				<div>
				{(startLoading) &&
				<Typography className={gClasses.title}>{"Loading report..."}</Typography>
			}
				<Grid className={gClasses.noPadding} key="AllDOCS" container alignItems="center" >
				{documentArray.map( (d, index) => 
				<Grid key={"DOC"+index} item xs={6} sm={4} md={2} lg={2} >
				<DisplayDocumentDetails brief
					document={d} 
					button1={
						<IconButton color="primary" size="small" onClick={() => {handleFileView(d)}} >
							<VisibilityIcon	 />
						</IconButton>	
					}
				/>
				</Grid>
			)}
			</Grid>
			</div>
			}
			</div>
		}
	</Box>
	)}
	
	function org_ArunMedicines(props) {
	let x = props.visitRec;
	return (
	<div>
	<Typography className={classes.title}>Prescription</Typography>
	<Box borderColor="primary.main" borderRadius={7} border={1}>
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
		<div align="right">
		<IconButton  color="primary" size="small" onClick={handleAddNewMedicine} >
			<AddIcon />
		</IconButton>
		</div>
	}
	</div>
	)}
	
	function ArunMedicines(props) {
	let x = props.visitRec;
	return (
	<div>	
	<Typography>
	<span className={classes.title}>Prescription</span>
	{(x.visitNumber === 0) && 
		<span>
		<IconButton  color="primary" size="small" onClick={handleAddNewMedicine} >
			<AddIcon />
		</IconButton>
		</span>
	}
	</Typography>
	<Box borderColor="primary.main" border={1}>
		<Typography className={classes.murItem}>
		{x.medicines.map( (m, index) =>
			<span key={"MEDSPAN"+index} className={classes.murItem}>
				{m.name}
				{(x.visitNumber === 0) &&
					<IconButton color="secondary" size="small" onClick={() => { handleDeleteMedicine(x.visitNumber, index)}} >
						<DeleteIcon />
					</IconButton>
				}
			</span>
		)}
		</Typography>
	</Box>
	</div>
	)}
	
	function ArunNotes(props) {
	let x = props.visitRec;
	return (
	<div>
	<Typography>
	<span className={classes.title}>User Notes</span>
		{(x.visitNumber === 0) && 
			<span>
			<IconButton  color="primary" size="small" onClick={handleAddUserNotes} >
				<AddIcon />
			</IconButton>
			</span>
		}
	</Typography>
	<Box borderColor="primary.main" border={1}>
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
	</div>
	)}
	
	function newArunNotes_issues(props) {
	let x = props.visitRec;
	return (
	<div>
	<Typography>
	<span className={classes.title}>User Notes</span>
		{(x.visitNumber === 0) && 
			<span>
			<IconButton  color="primary" size="small" onClick={handleAddUserNotes} >
				<AddIcon />
			</IconButton>
			</span>
		}
	</Typography>
	<Box borderColor="primary.main" border={1}>
	<Grid className={classes.noPadding} maxWidth="100%" key={"NOTES"+x.visitNumber} container justify="center" alignItems="center" >
	<Typography border={1} className={classes.murItem}>
		{x.userNotes.map( (un, index) =>
			<Grid item xs={4} sm={4} md={2} lg={2} >
				<Typography border={1} className={classes.murItem}>
				<span key={"NOTESPAN"+index} className={classes.murItem}>
				{un.name}
				<IconButton color="secondary" size="small" onClick={() => { handleDeleteNotes(x.visitNumber, index)}} >
					<DeleteIcon />
				</IconButton>
				</span>
				</Typography>
			</Grid>
		)}
	</Typography>
	</Grid>
	</Box>
	</div>
	)}
	
	function ArunRemarks(props) {
	let x = props.visitRec;
	return (
	<div>
	<Typography>
		<span className={classes.title}>Examination Advised</span>
		{(x.visitNumber === 0) && 
			<span>
			<IconButton  color="primary" size="small" onClick={handleAddNewRemark} >
				<AddIcon />
			</IconButton>
			</span>
		}
	</Typography>
	<Box borderColor="primary.main" border={1}>
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
	</div>
	)}
	
	function ArunFollowup(props) {
	let x = props.visitRec;
	if (x.visitNumber !== 0) return null;
	return (
	<Grid className={classes.noPadding} key={"FOLLOWUP"} container justify="center" alignItems="center" >
		<Grid item xs={4} sm={4} md={2} lg={2} >
		<Typography className={classes.title}>Next Review After</Typography>
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
	)}
	
	
	function ArunVisitUpdateButton(props) {
	let x = props.visitRec;
	if  (x.visitNumber !== 0) return null;
	
	function step1Validator() { return stepNo >= 1};
	function step2Validator() { return stepNo >= 2};
	function step3Validator() { return stepNo >= 3};
	
	return (
		<div>
		<div align="right">
			<VsButton name="Update Visit"  onClick={updateVisit} />
			<VsButton name="Generate Visit Document"  onClick={generateVisitDocument} />
			{/*<VsButton name="Download Visit Document"  onClick={printVisit} />*/}
		</div>
		{(false) &&
		<StepProgressBar startingStep={0}
		steps={[{label: 'Validate visit info', name: 'step 1', content: step1Content,
		validator: step1Validator 
		},
    {
      label: 'Generate visit document',
      name: 'step 2',
      content: step2Content,
      validator: step2Validator
    },
    {
      label: 'Download visit document',
      name: 'step 3',
      content: step3Content,
      validator: step3Validator
    }
		]}
		/>
		}
		<VisitRegisterStatus />
		</div>
	);
	}
	
	function ArunVisitSummary(props) {
	let x = props.visitRec;
	return (
	<Grid key={"MG"+x.visitNumber} container justify="center" alignItems="center" >
	<Grid item xs={11} sm={11} md={11} lg={11} >
		<Typography className={classes.heading}>{((x.visitNumber == 0) ? "(New)" : "V"+x.visitNumber)+' '+x.visitDate.substr(0,15)}</Typography>
	</Grid>
	<Grid item xs={1} sm={1} md={1} lg={1} >
		{((sessionStorage.getItem("userType") === "Doctor") && (x.visitNumber === 0)) &&
			<IconButton align="right" color="secondary" size="small" onClick={handleDeleteNew} >
			<DeleteIcon />
			</IconButton>
		}
		{((sessionStorage.getItem("userType") === "Doctor") && (visitArray[0].visitNumber > 0)) &&
			<IconButton color="primary" size="small" onClick={() => { handleCopyNew(x.visitNumber)}} >
			<FileCopyIcon />
			</IconButton>
		}
	</Grid>
	</Grid>
	)}
	
	function handleSelectNewPatient() {
		setShowDocument(false); 
		setViewImage(false); 
		setDocumentArray([]); 
		//setCurrentAppt(null); 
		setCurrentPatient(""); 
		setVisitArray([]); 
		setSelectPatient(true);
	}
	
	function DisplayAllPatients() {
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientDetails 
			patient={m} 
			button1={
				<IconButton className={gClasses.green} size="small" onClick={() => { handleSelectPatient(m)}}  >
					<LocalHospitalIcon />
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
		if (filterStr !== "") {
			if (validateInteger(filterStr)) {
				// it is integer. Thus has to be Id
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
		setFilter(patientMasterArray, filterStr);
	}


	async function handleSelectPatient(rec) {
		console.log("Select");
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		await getPatientVisit(rec);
		let ddd = await getPatientDocument(userCid, rec.pid);
		setDocumentArray(ddd);
		setShowDocument(false);
		setSelectPatient(false);
	}
	

	function DisplayMedicineMenu() {
	return (	
		<div>
		<VsCancel align="right" onClick={() => setIsListDrawer("")} />
		{medicineArray.map( (p) =>
			<MenuItem key={p.name} value={p.name}>
			<Typography onClick={() => { setEmurName(p.name); setIsListDrawer(""); } }>
				{p.name}
			</Typography>
			</MenuItem>
		)}
		</div>
	)}
	
	function setEmurNameWithFilter(itemName) {
		//console.log("Iin filter");
		let txt = itemName;
		setEmurName(txt);
		setFilterItemText(txt);
		let tmpArray = [];
		if (itemName !== "") {
			if (filterItem.substr(0,3) === "MED")
				tmpArray = medicineArray.filter( x => x.name.startsWith(txt) );
			else if (filterItem.substr(0,3) === "NOT")
				tmpArray = noteArray.filter( x => x.name.startsWith(txt) );
			else if (filterItem.substr(0,3) === "REM")
				tmpArray = remarkArray.filter( x => x.name.startsWith(txt) );
		} 
		setFilterItemArray(tmpArray);
	}
	
	function DisplayFilterArray() {
	return (
		<div align="center" >
			{filterItemArray.map( (item, index) =>
				<Typography key={"ITEM"+index} className={gClasses.blue} type="button" onClick={() => { setFilterItemArray([]); setEmurName(item.name); }} >
				{item.name}
				</Typography>
			)}
		</div>	
	)}
	
	function getCurrntPatientInfo() {
		let xxx = currentPatientData.displayName+" ( Id: "+currentPatientData.pid+" ) ";
		if (currentPatientData.age > 0) {
			xxx += " " + currentPatientData.age + "/" + currentPatientData.gender;
		}
		return xxx;
	}
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayPageHeader headerName="Visit Directory" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	{((currentPatient === "") && (process.env.REACT_APP_DIRECTVISIT === 'true')) && 
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
			<Typography></Typography>
		</Grid>
		<Grid key={"F5"} item xs={4} sm={4} md={1} lg={1} >
			{/*<VsButton name="New Patient" /> */}
			<Typography></Typography>
		</Grid>
		<Grid key={"F6"} item xs={false} sm={false} md={2} lg={2} />
		</Grid>
		<DisplayAllPatients />
		</div>
	}
	{((currentPatient !== "") && (process.env.REACT_APP_DIRECTVISIT === 'true')) && 
		<VsButton align="right" name="Select Patient" onClick={() => { setCurrentPatient("")}} />	
	}
	{(currentPatient !== "") &&
		<Box align="left" >
			<Typography align="center" className={classes.modalHeader}>
			{getCurrntPatientInfo()}
			</Typography>	
			<DisplayMedicalReports />
			{/*<DisplayPatientInfo />*/}
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<DisplayNewVisitBtn />
			{visitArray.map(x =>	
				<Accordion className={(expandedPanel !== "V"+x.visitNumber)? classes.normalAccordian : classes.selectedAccordian} 
					key={"AM"+x.visitNumber} expanded={expandedPanel === "V"+x.visitNumber} 
					onChange={handleAccordionChange("V"+x.visitNumber)}>
				<AccordionSummary key={"AS"+x.visitNumber} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<ArunVisitSummary visitRec={x} />
				</AccordionSummary>
				<AccordionDetails key={"AD"+x.visitNumber}>
					<Container component="main" maxWidth="lg">
					<ArunVisitUpdateButton visitRec={x} />		{/* only for visitNUmber 0 i.e. new visit */}
					<ArunMedicines visitRec={x} />
					<BlankArea />
					<ArunNotes visitRec={x} />
					<BlankArea />
					<ArunRemarks visitRec={x} />
					<BlankArea />
					<ArunFollowup visitRec={x} />
					</Container> 
				</AccordionDetails>
				</Accordion>
			)}	
			</Box>
		</Box>
	}
	<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{(startLoading) && <LoadingMessage />}
	{((!startLoading) && (isDrawerOpened === "PDF")) &&
		<DisplayPDF 
			title={dlDoc.title} file={dlFile}
			handleCancel={() => setViewImage(false)}
		/>
	}
	{((!startLoading) && (isDrawerOpened === "IMG")) &&
		<DisplayImage 
			title={dlDoc.title} mime={dlMime} file={dlFile}
			handleCancel={() => setViewImage(false)}
		/> 
	}
	{((isDrawerOpened === "ADDMED") || (isDrawerOpened === "EDITMED")) &&
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleMedicineUpdate}>
			<Typography align="center" className={classes.modalHeader}>
				{((isDrawerOpened === "ADDMED") ? "New Medicine" : "Edit Medicine")+` for ${currentPatient}`}
			</Typography>
			{(false) && <VsButton name="Select Medicine" align="right" onClick={() => setIsListDrawer("LIST")} />}
			<BlankArea />
			<TextValidator required fullWidth color="primary"
				id="newName" label="Medicine" name="newName"
				onChange={(event) => setEmurNameWithFilter(event.target.value)}
				value={emurName}
			/>
			<DisplayFilterArray />
			<BlankArea />
			<Grid key="editmed" container justify="center" alignItems="left" >
			<Grid className={gClasses.vgSpacing} item xs={1} sm={1} md={1} lg={1} >
			<Typography className={classes.heading}>Dose1:</Typography>
			</Grid>
			<Grid className={gClasses.vgSpacing} item xs={2} sm={2} md={2} lg={2} >
			<Select labelId='dose1' id='dose1' name="dose1" 
				required fullWidth label="Dose 1" 
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
			<Grid item className={gClasses.vgSpacing}  xs={1} sm={1} md={1} lg={1} >
			<Typography className={classes.heading}>Dose2</Typography>
			</Grid>
			<Grid item className={gClasses.vgSpacing}  xs={2} sm={2} md={2} lg={2} >
			<Select labelId='dose2' id='dose2' name="dose2" 
				required fullWidth label="Dose 2" 
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
			<Grid item className={gClasses.vgSpacing}  xs={1} sm={1} md={1} lg={1} >
			<Typography className={classes.heading}>Dose3</Typography>
			</Grid>
			<Grid item className={gClasses.vgSpacing}  xs={2} sm={2} md={2} lg={2} >
			<Select labelId='dose3' id='dose3' name="dose3" 
				required fullWidth label="Dose 3" 
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
			<Grid className={gClasses.vgSpacing}  item xs={1} sm={1} md={1} lg={1} />
			<Grid item className={gClasses.vgSpacing}  xs={1} sm={1} md={1} lg={1} >
			<Typography className={classes.heading}>for</Typography>
			</Grid>
			<Grid className={gClasses.vgSpacing} item xs={2} sm={2} md={2} lg={2} >
			<Select labelId='time' id='time' name="time"
				required fullWidth label="Time" 
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
			<Grid className={gClasses.vgSpacing}  item xs={2} sm={2} md={2} lg={2} >
			<Select labelId='unit' id='unit' name="unit" 
				required fullWidth label="Unit" 
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
			</Grid>
			<ModalResisterStatus />
			<BlankArea />
			<VsButton type="submit" 
			name= {(isDrawerOpened === "ADDMED") ? "Add" : "Update"}
			/>
		</ValidatorForm>
	}
	{((isDrawerOpened === "ADDNOTE") || (isDrawerOpened === "EDITNOTE")) &&
		<ValidatorForm align="center" className={gClasses.form} onSubmit={updateUserNotes}>
			<Typography align="center" className={classes.modalHeader}>
				{((isDrawerOpened === "ADDNOTE") ? "New Note" : "Edit Note")+`for ${currentPatient}`}
			</Typography>
			<BlankArea />
			<TextValidator required fullWidth color="primary"
				id="newName" label="Note" name="newName"
				onChange={(event) => setEmurNameWithFilter(event.target.value)}
				value={emurName}
			/>
			<DisplayFilterArray />
			<ModalResisterStatus />
			<BlankArea />
			<VsButton type ="submit" name= {(isDrawerOpened === "ADDNOTE") ? "Add" : "Update"} />
		</ValidatorForm>
	}
	{((isDrawerOpened === "ADDREM") || (isDrawerOpened === "EDITREM")) &&
		<ValidatorForm align="center" className={gClasses.form} onSubmit={updateRemark} >
			<Typography align="center" className={classes.modalHeader}>
				{((isDrawerOpened === "ADDREM") ? "New Remark" : "Edit Remark")+` for ${currentPatient}`}
			</Typography>
			<BlankArea />
			<TextValidator required fullWidth color="primary"
				id="newName" label="Remark" name="newName"
				onChange={(event) => setEmurNameWithFilter(event.target.value)}
				value={emurName}
			/>
			<DisplayFilterArray />
			<ModalResisterStatus />
			<BlankArea />
			<VsButton type="submit" name= {(isDrawerOpened === "ADDREM") ? "Add" : "Update"}
			/>
		</ValidatorForm>
	}
	{(false) && <VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />}
	</Box>
	</Drawer>
	<Drawer className={classes.drawer}
		anchor="left"
		variant="temporary"
		open={isListDrawer !== ""}
	>
	<DisplayMedicineMenu />
	</Drawer>
	</Container>			
  </div>
  );    
}
