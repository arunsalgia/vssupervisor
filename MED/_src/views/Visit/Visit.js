import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";

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
red, blue 
} from '@material-ui/core/colors';

import { 
	encrypt, decrypt, 
	validateInteger,
} from "views/functions.js";

const useStyles = makeStyles((theme) => ({
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

const COUNTPERPAGE=10;

const str1by4 = String.fromCharCode(188)
const str1by2 = String.fromCharCode(189)
const str3by4 = String.fromCharCode(190)

let test=[];
let medQty=[];
const timeArray=[1,2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const unitArray=["Day(s)", "Weeks(s)", "Month(s)"];

function setMedQty() {
	for(let i=0; i<=20; ++i) {
		medQty.push({num: i, str: medStr(i)});
	}
}

function medStr(qtyNum) {
	if (qtyNum == 0) return "0";
	var retStr = (qtyNum >= 4) ? Math.floor(qtyNum / 4).toString() : "";
	switch (qtyNum % 4) 
	{
		case 1: retStr += str1by4; break;
		case 2: retStr += str1by2; break;
		case 3: retStr += str3by4; break;
	}
	return retStr;
}

function dose(dose1, dose2, dose3) {
	//dose3 = 3;
	return (medStr(dose1) + "-" + medStr(dose2) + "-" + medStr(dose3));
}

export default function Visit() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [standard, setStandard] = useState(true);
	
	// for old medicine
	const [searchText,setSearchText] = useState("")
  const [patientArray, setPatientArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [visitArray, setVisitArray] = useState([])
	const [currentVisit, setCurrentVisit] = useState("");
	
	const [editMedicine, setEditMedicine] = useState({});
	
	// for new patient to be added
	// or patient to be modified
	const	[patientName, setPatientName] = useState("");
	const [patientEmail, setPatientEmail] = useState("");
	const [patientMobile, setPatientMobile] = useState("");
	const [patientGender, setPatientGender] = useState("Male");
	const [patientAge, setPatientAge] = useState(30);
	
	// medicnes
	const [medicineArray, setMedicineArray] = useState([])
	const [notesArray, setNotesArry] = useState([]);
	const [remarkArray, setRemarkArray] = useState([{name: "Rem1"}, {name: "Rem2"}]);
	
	const [evisitNumber, setEvisitNumber] = useState(0);
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
	const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  const [page, setPage] = useState(0);
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	
  useEffect(() => {		
		setMedQty();
		getAllMedicines();
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
						axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/list`)
					);
				setMedicineArray(resp.data);
				console.log(resp.data);
			} catch (e) {
				console.log(e);
				setMedicineArray([]);
			}

		}	
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
			let newVisitInfo = JSON.stringify(visitArray[0]);
			try {
				errcode = 200;
				await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/updatenewvisit/${newVisit}/${newVisitInfo}`)
			} catch (e) {
				console.log(e)
				errcode = 201;
			}
		}
		setVisitError(errcode);
	}
	
	
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

	async function getPatientList(filter) {
		filter = filter.trim();
		var subcmd = "list"
		if (filter != "") {
			// if it is complete numeric then it must by ID
			subcmd = (validateInteger(filter))	? "listbyid" : subcmd = "listbyname";
		} else
			subcmd = "list"
		
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/${subcmd}/${filter}`)
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
	
	async function selectFilter() {
		//console.log("Filter:", searchText);
		getPatientList(searchText);
		setCurrentPatient("");
		setRegisterStatus(0);
	}

	async function selectPatient(name) {
		//console.log(name);
		setCurrentPatient(name);
		let pRec = patientArray.find(x => x.displayName == name);
		setCurrentPatientData(pRec);
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/list/${pRec.pid}`)
			//console.log(resp.data);
			setVisitArray(resp.data);
		} catch(e) {
			setVisitArray([]);
			console.log(e);
		}
	}
	
	function handleCreateNew() {
		//console.log("In new visit");
		//console.log(expandedPanel);
		let x = new Date();
		
		let tmpArray = [{
			enabled: true,
			medicines: [],
			pid: currentPatientData.pid,
			remarks: [],
			userNotes: [],
			visitDate: x.toString(),
			visitNumber: 0		
		}];
		//console.log(tmpArray[0]);
		tmpArray = tmpArray.concat(visitArray);
		setVisitArray(tmpArray);
	}
	
	function handleCopyNew(num) {
		//console.log("Copy Visit ",num);
		let today = new Date();
		
		let tmpArray = [{
			enabled: true,
			medicines: [],
			pid: currentPatientData.pid,
			remarks: [],
			userNotes: [],
			visitDate: today.toString(),
			visitNumber: 0		
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
		setExpandedPanel("V0");
		//console.log(tmpArray);
	}
	
	function handleDeleteNew() {
		let tmp = visitArray.slice(1, visitArray.length);
		setVisitArray(tmp);
	}
	
	function DisplaySearch() {
		return (
			<Grid key="DisplaySearch" container justify="center" alignItems="center" >
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<TextField padding={10}
				variant="outlined"
				fullWidth
				label="Search Patient(s)"
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
						name: 'Group',
						id: 'filled-age-native-simple',
					}}
					onChange={(event) => selectPatient(event.target.value)}
				>
					{patientArray.map(x =>	<MenuItem key={x.displayName} value={x.displayName}>{x.displayName + " (Id:"+ x.pid+") ("+x.age+x.gender.substr(0,1)+")"}</MenuItem>)}
				</Select>
			</Grid>
			</Grid>
		);
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
	
	function handleCopyMedicine(vNumber, mNumber) {
		console.log("handleCopyMedicine "+vNumber+" Medicine "+mNumber);
		if (visitArray[0].visitNumber != 0) return;
		
		if (vNumber > 0) {
			let newArray = [].concat(visitArray);
			
			var tmp =  newArray.find(x => x.visitNumber == vNumber);
			var cloned = Object.assign({}, tmp.medicines[mNumber]);
			newArray[0].medicine.push(cloned);			
			setVisitArray(newArray);
			console.log(newArray[0].medicine);
		}
	}
	
	async function handleEditMedicine(vNumber, mNumber) {
		// make sure we have medicine list
		await getAllMedicines();
		
		
		console.log("handleEditMedicine "+vNumber+" Medicine "+mNumber);
		let tmp = visitArray.find( x => x.visitNumber == vNumber);
		setEditMedicine(tmp.medicines[mNumber]);
		console.log(tmp.medicines[mNumber]);
		
		setEvisitNumber(vNumber);
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
	
	function DeleteMedicineButton(props) {
		//console.log("DELMED",props)
		if (props.visitNumber > 0)
			return (
				<IconButton color="primary" size="small" onClick={() => { handleCopyMedicine(props.visitNumber, props.medicineNumber)}} >
				<FileCopyIcon />
        </IconButton>
			)
		else
			return (
				<IconButton color="secondary" size="small" onClick={() => { handleDeleteMedicine(props.visitNumber, props.medicineNumber)}} >
				<DeleteIcon />
        </IconButton>
			)
	}
	
	function EditMedicineButton(props) {
		if (props.visitNumber > 0)
			return (
				null
			)
		else
			return (
				<IconButton color="primary" size="small" onClick={() => { handleEditMedicine(props.visitNumber, props.medicineNumber)}} >
				<EditIcon />
        </IconButton>
			)
	}
	
	function DisplayMedNotesRem(props) {
		let myVisit = visitArray.find(x => x.visitNumber == props.visitNumber);
		let myMed = myVisit.medicines;
		let myNotes = myVisit.userNotes;
		let myRem = myVisit.remarks;
		
		return (
		<Container component="DisplayMedNotesRem" maxWidth="lg">
		<Typography className={classes.title}>Medicine</Typography>
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		{myMed.map( (m, index) =>
			<Grid className={classes.noPadding} key={"med"+props.visitNumber+"med"+index} container justify="center" alignItems="center" >
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
		{(props.visitNumber == 0) && <Typography align="right" className={gClasses.root}>
			<Link href="#" onClick={handle_AddNewMedicineButton} variant="body2">Add Medicine</Link>
		</Typography>}
		<BlankArea />
		{/* user notes start from here */}
		<Typography className={classes.title}>User Notes</Typography>
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		{myNotes.map( (un, index) =>
			<Grid className={classes.noPadding} key={"med"+props.visitNumber+"med"+index} container justify="center" alignItems="center" >
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
		{(props.visitNumber == 0) && <Typography align="right" className={gClasses.root}>
			<Link href="#" onClick={handle_AddNewUserNotesButton} variant="body2">Add User Notes</Link>
		</Typography>}
		<BlankArea />
		{/* remarks start from here */}
		<Typography className={classes.title}>Doctor's Remarks (not to be shared with patient)</Typography>
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		{myRem.map( (r, index) =>
			<Grid className={classes.noPadding} key={"V"+props.visitNumber+"rem"+index} container justify="center" alignItems="center" >
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
		{(props.visitNumber == 0) && <Typography align="right" className={gClasses.root}>
			<Link href="#" onClick={handle_AddNewRemarkButton} variant="body2">Add Remark</Link>
		</Typography>}
		</Container>
		);
	}
	
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
	
	function handle_AddNewMedicineButton() {
		
		let tmp = {
			dose1: 0, dose2: 0, dose3: 0,
			name: "", time: 1, unit: unitArray[0]
		};
		let tmpArray = [].concat(visitArray);
		tmpArray[0].medicines.push(tmp);
		setVisitArray(tmpArray);
	}
	
	function DisplayAddNew() {
		let show = false;
		if (visitArray.length > 0)
		if (visitArray[0].visitNumber > 0)
			show = true;
		
		if (show)
			return (
				<Typography align="right" className={gClasses.root}>
					<Link href="#" onClick={handleCreateNew} variant="body2">Add New</Link>
				</Typography>
			);
		else
			return null;
	}
	
	function handleMedicineUpdate() {
		/*
		console.log("Edit medicine submitted");
		console.log(evisitNumber, emurNumber);
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

		setModalRegister(100);

	}
	
	function DisplayCloseModal() {
	return (
		<div align="right">
		<IconButton color="secondary"  size="small" onClick={closeModal} >
			<CancelIcon />
		</IconButton>
		</div>
	)}
	
	function DisplayEditMedicine() {
	
	return(
		<Container component="DisplayEditMedicine" maxWidth="md">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>Edit Medicine</Typography>
		<BlankArea />
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleMedicineUpdate}>
			<DisplayStandardInput myArray={medicineArray} myDesc={"Medicine Name"} />
				{/*<Select labelId='team' id='team' name="team" padding={10}
				variant="outlined" required fullWidth label="Medicine Name" 
				value={emurName}
				inputProps={{
					name: 'Group',
					id: 'filled-age-native-simple',
				}}
				onChange={(event) => setEmurName(event.target.value)}
				>
					{medicineArray.map(x =>	<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
				</Select>*/}
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
			<Button
				type="submit"
				variant="contained"
				color="primary"
				className={gClasses.submit}
			>
			Update
			</Button>
		</ValidatorForm>
		</Container>
	)}
	
	// user notes
	function handleEditUserNotes(vNumber, notesNumber) {
		console.log("handleEditUserNotes "+vNumber+" Notes "+notesNumber);
		let tmp = visitArray.find( x => x.visitNumber == vNumber);
		//setEditMedicine(tmp.medicines[mNumber]);
		//console.log(tmp.medicines[mNumber]);
		
		setEvisitNumber(vNumber);
		setEmurNumber(notesNumber);
		setEmurName(tmp.userNotes[notesNumber].name);
		setModalRegister(0);
		openModal("NOTES");	
	}
	
	function DisplayEditNotes() {
	return(
		<Container component="DisplayEditNotes" maxWidth="md">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>Edit Notes</Typography>
		<BlankArea />
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleNotesUpdate}>
			{/*<TextValidator variant="outlined" required fullWidth color="primary"
				id="newName" label="User Note" name="newName"
				onChange={(event) => setEmurName(event.target.value)}
				autoFocus
				value={emurName}
			/>*/}
			<DisplayStandardInput myArray={notesArray} myDesc={"User Note"} />
			<BlankArea />
			<ModalResisterStatus />
			<BlankArea />
			<Button
				type="submit"
				variant="contained"
				color="primary"
				className={gClasses.submit}
			>
			Update
			</Button>
		</ValidatorForm>
		</Container>
	)}
	
	function handle_AddNewUserNotesButton() {
		console.log("In handle_AddNewUserNotesButton");
		let tmpArray = [].concat(visitArray);
		let obj = {name: ""};
		tmpArray[0].userNotes.push(obj);
		setVisitArray(tmpArray);
	}
	
	function handleDeleteUserNotes(visitNumber, notesNumber) {
		console.log("In handleDeleteUserNotes");
		if (visitNumber == 0) {
			var tmp = [].concat(visitArray);
			tmp[0].userNotes = tmp[0].userNotes.filter(function(value, index, arr){ 
        return index != notesNumber;
			});
			setVisitArray(tmp);
			console.log(tmp[0].userNotes);
		}
	}
	
	function EditUserNotesButton(props) {
		//console.log("editUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="primary" size="small" onClick={() => { handleEditUserNotes(props.visitNumber, props.notesNumber)}} >
			<EditIcon />
			</IconButton>
		)		
	}
	
	function DeleteUserNotesButton(props) {
		//console.log("delUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="secondary" size="small" onClick={() => { handleDeleteUserNotes(props.visitNumber, props.notesNumber)}} >
			<DeleteIcon />
			</IconButton>
		)		
	}
	
	function handleNotesUpdate() {
		console.log(evisitNumber, emurNumber);
		console.log(emurName);
		
		if (emurName == "") {
			setModalRegister(202);
				return;
		}
		
		let tmp = [].concat(visitArray);
		tmp[0].userNotes[emurNumber].name = emurName;
		
		console.log(tmp[0].userNotes);
		
		setVisitArray(tmp);

		setModalRegister(200);

	}
	
	function DisplayUserNotes(props) {
		let myVisit = visitArray.find(x => x.visitNumber == props.visitNumber);
		let myNotes = myVisit.userNotes;
		console.log(props.visitNumber, myNotes);
		return null;
		
		return (
		<Container component="DisplayUserNotes" maxWidth="lg">
		<Typography className={classes.title}>User Notes</Typography>
		<Box borderColor="primary.main" borderRadius={7} border={2}>
		{myNotes.map( (un, index) =>
			<Grid className={classes.noPadding} key={"med"+props.visitNumber+"med"+index} container justify="center" alignItems="center" >
			<Grid item xs={9} sm={9} md={9} lg={9} >
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
		{(props.visitNumber == 0) && <Typography align="right" className={gClasses.root}>
			<Link href="#" onClick={handle_AddNewUserNotesButton} variant="body2">Add User Notes</Link>
		</Typography>}
		</Container>
		);
	}
	
	
	// remarks functions
	
	function handleDeleteRemark(visitNumber, remarkNumber) {
		console.log("In handleDeleteRemark");
		if (visitNumber == 0) {
			var tmp = [].concat(visitArray);
			tmp[0].remarks = tmp[0].remarks.filter(function(value, index, arr){ 
        return index != remarkNumber;
			});
			setVisitArray(tmp);
			console.log(tmp[0].remarks);
		}
	}
	
	function handle_AddNewRemarkButton() {
		console.log("In handle_AddNewRemarkButton");
		let tmpArray = [].concat(visitArray);
		let obj = {name: ""};
		tmpArray[0].remarks.push(obj);
		setVisitArray(tmpArray);
		//console.log(tmpArray[0].remarks);
		//console.log("In handle_AddNewRemarkButton over");
	}
	
	
	function handleRemarkUpdate() {
		//console.log(evisitNumber, emurNumber);
		//console.log(emurName);
		
		if (emurName == "") {
			setModalRegister(302);
				return;
		}
		
		let tmp = [].concat(visitArray);
		tmp[0].remarks[emurNumber].name = emurName;
		
		console.log(tmp[0].remarks);
		
		setVisitArray(tmp);

		setModalRegister(300);

	}
	
	function DisplayEditRemark() {
	return(
		<Container component="DisplayEditRemark" maxWidth="md">
		<DisplayCloseModal />
		<Typography align="center" className={classes.modalHeader}>Edit Remark</Typography>
		<BlankArea />
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleRemarkUpdate}>
			{/*<TextValidator variant="outlined" required fullWidth color="primary"
				id="newName" label="Remark" name="newName"
				onChange={(event) => setEmurName(event.target.value)}
				autoFocus
				value={emurName}
			/>*/}
			<DisplayStandardInput myArray={remarkArray} myDesc={"Remark"} />
			<BlankArea />
			<ModalResisterStatus />
			<BlankArea />
			<Button
				type="submit"
				variant="contained"
				color="primary"
				className={gClasses.submit}
			>
			Update
			</Button>
		</ValidatorForm>
		</Container>
	)}
	
	function handleEditRemark(vNumber, remarkNumber) {
		console.log("handleEditRemark "+vNumber+" Notes "+remarkNumber);
		let tmp = visitArray.find( x => x.visitNumber == vNumber);

		setEvisitNumber(vNumber);
		setEmurNumber(remarkNumber);
		setEmurName(tmp.remarks[remarkNumber].name)
		setModalRegister(0);
		openModal("REMARK");	
	}
	
	function EditRemarkButton(props) {
		//console.log("editUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="primary" size="small" onClick={() => { handleEditRemark(props.visitNumber, props.remarkNumber)}} >
			<EditIcon />
			</IconButton>
		)		
	}
	
	function DeleteRemarkButton(props) {
		//console.log("delUN", props);
		if (props.visitNumber > 0)	return null;
		return (
			<IconButton color="secondary" size="small" onClick={() => { handleDeleteRemark(props.visitNumber, props.remarkNumber)}} >
			<DeleteIcon />
			</IconButton>
		)		
	}
	
  return (
  <div  align="center" key="groupinfo">
      <DisplayPageHeader headerName="Patient Visit" groupName="" tournament=""/>
      <Container component="main" maxWidth="lg">
      <CssBaseline />
			<LoadingIndicator />
			<DisplaySearch/>
			<BlankArea/>
			{(patientArray.length == 0) &&	
				<Typography className={classes.NoMedicines}>No Patient Selected</Typography>
			}
			{(currentPatient != "") && <div align="left">
				{((visitArray.length > 0) && (visitArray[0].visitNumber == 0)) &&
					<Button variant="contained" color="primary" 
					className={gClasses.noPadding}
					onClick={updateVisit}
					>
					Update Visit
					</Button>
				}
				<DisplayAddNew />
				{/*<ShowResisterStatus/>*/}
				{visitArray.map(x =>	
					<Accordion className={(expandedPanel === "V"+x.visitNumber)? classes.normalAccordian : classes.selectedAccordian} 
						key={"AM"+x.visitNumber} expanded={expandedPanel === "V"+x.visitNumber} 
						onChange={handleAccordionChange("V"+x.visitNumber)}>
					<AccordionSummary key={"AS"+x.visitNumber} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Grid key="gr-group" container justify="center" alignItems="center" >
					<Grid item xs={11} sm={11} md={11} lg={11} >
						<Typography className={classes.heading}>{"V"+x.visitNumber+' '+x.visitDate.substr(0,15)}</Typography>
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
			</div>}
			<BlankArea />
			<ValidComp /> 
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
				<DisplayEditNotes />
			</Modal>			
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
				isOpen={modalIsOpen == "ERROR"}
				shouldCloseOnOverlayClick={false}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={modalStyles}
				contentLabel="Example Modal"
				aria-labelledby="modalTitle"
				aria-describedby="modalDescription"
				ariaHideApp={false}
			>
				<DisplayVisitError />
			</Modal>					
		</Container>
  </div>
  );    
}

