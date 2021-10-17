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
import VsList from "CustomComponents/VsList";
import VsCheckBox from "CustomComponents/VsCheckBox";

import { useLoading, Audio } from '@agney/react-loading';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'
import fileDownload  from 'js-file-download';
import fs from 'fs';
import _ from 'lodash';
import BorderWrapper from 'react-border-wrapper'

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
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';

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
str1by4, str1by2, str3by4,
HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, MONTHSTR,
ToothLeft, ToothRight,
ToothNumber,
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
import { red, blue, green, lightGreen, 
} from '@material-ui/core/colors';

import { 
	validateInteger,
	dispAge, dispEmail, dispMobile,
	vsDialog,
	ordinalSuffix,
} from "views/functions.js";

const useStyles = makeStyles((theme) => ({
	selectedTooth: {
		backgroundColor: green[900],
		color: 'white',
		fontWeight: theme.typography.fontWeightBold,
		margin: "3px",
	},
	normalTooth: {
		//backgroundColor: 'lightGreen',
		fontWeight: theme.typography.fontWeightBold,
		margin: "3px",
	},
	toothNumber: {
		borderColour: 'black',
		borderWidth: "1px",
		borderRadius: "0px",
		borderType: "solid",
		innerPadding: "0px",
		//padding: "10px",
		//margin: "10px",
	},
	tooth: {
		//backgroundColor: 'lightGreen',
		fontSize: theme.typography.pxToRem(12),
		//fontWeight: theme.typography.fontWeightBold,
	},
	toothType: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
		margin: "5px",
	},
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
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


let searchText = "";
function setSearchText(sss) { searchText = sss;}


var userCid;
export default function DentalTreatment(props) {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [currentSelection, setCurrentSelection] = useState("Treatment");
	const [remember, setRemember] = useState(false);
	
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const [treatmentIndex, setTreatmentIndex] = useState(0);
	const [treatmentArray, setTreatmentArray] = useState([]);
	
	const [myToothArray, setmyToothArray] = useState([11, 13, 26, 28, 41, 47, 33, 34]);

	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	
	const [emurIndex, setEmurIndex] = useState(0);
	const [emurNumber, setEmurNumber] = useState(0);
	
	const [emurName, setEmurName] = useState("");
	const [emurToothArray, setEmurToothArray] = useState([]);
	const [emurAmount, setEmurAmount] = useState(0);
	
	const [balance, setBalance] = useState(0);
	
	const [modalRegister, setModalRegister] = useState(0);
	
  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");
		const checkPatient = async () => {	
			let patRec = props.patient;	//JSON.parse(sessionStorage.getItem("shareData"));
			//console.log(patRec);
			setCurrentPatientData(patRec);
			setCurrentPatient(patRec.displayName);
			await getPatientTreatment(patRec);
		}
		checkPatient()
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
	
	async function getPatientTreatment(patRec) {
		
	}
	
	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={6} sm={6} md={2} lg={2} >
		{(itemName !== "NEW") &&		
			<Typography onClick={() => setSelection(itemName)}>
				<span 
					className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
				{itemName}
				</span>
			</Typography>
		}
		</Grid>
		)}
	
	async function setSelection(item) {
		//sessionStorage.setItem("shareData",JSON.stringify(currentPatientData));
		setCurrentSelection(item);
	}
	
	function DisplayFunctionHeader() {
	return (
	<Box className={gClasses.boxStyle} borderColor="black" border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Treatment" />
	</Grid>	
	</Box>
	)}
	
	
	
	function changIndex(num) {
		num += treatmentIndex;
		if (num < 0) return;
		if (num === treatmentArray.length) return;
		setTreatmentIndex(num);
		//setCurrentSelection("Medicine");
	}

	function DisplayTreatmentDates() {
		if (treatmentArray.length === 0) {
			return (
				<Box className={gClasses.boxStyle} borderColor="black" border={1} >
				<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
					<Grid key={"VISIST"} item xs={12} sm={12} md={12} lg={12} >
						<Typography className={classes.slotTitle} >
							{"No Treatment history available"}
						</Typography>
					</Grid>
				</Grid>	
				</Box>
			);
		}
		
		//console.log(treatmentArray);
		let v = treatmentArray[treatmentIndex];
		let myDate;
		if (v.treatmentNumber === 0)
				myDate = "Today's new Treatment";
		else {
			let d = new Date(v.treatmentDate);
			myDate = `Treatment dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
		}
		return (
		<Box className={gClasses.boxStyle} borderColor="black" border={1} >
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<Grid key={"LEFT1"} item xs={2} sm={2} md={2} lg={2} >	
				<IconButton color={'primary'} onClick={() => {changIndex(-1)}}  >
					<LeftIcon />
				</IconButton>
			</Grid>
			<Grid key={"VISIST"} item xs={8} sm={8} md={8} lg={8} >
				<Typography className={classes.slotTitle} >
					{myDate}
				</Typography>
			</Grid>
			<Grid key="RIGHT1" item xs={2} sm={2} md={2} lg={2} >
				<IconButton color={'primary'} onClick={() => {changIndex(1)}}  >
						<RightIcon />
					</IconButton>
			</Grid>
		</Grid>	
		</Box>
		)
	}

	function handleUpdate(num) {
		//console.log(emurToothArray);
		//console.log(num);
		let newTootlArray;
		if (emurToothArray.includes(num)) {
			newTootlArray = emurToothArray.filter(x => x !== num);
		} else {
			newTootlArray = [].concat(emurToothArray);
			newTootlArray.push(num);
		}
		console.log(newTootlArray);
		setEmurToothArray(newTootlArray);
	}
	
	function dummy(num) {};
	
	function DisplayTeeth(props) {
	let _Click = (props.onClick == null) ? dummy : props.onClick;
	return (
		<div>
			<Typography align="center" className={classes.tooth}>
				<span className={classes.toothType}>UL: </span>
				{ToothNumber.upperLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? classes.selectedTooth : classes.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
				)}
				<span className={classes.toothType}>UR: </span>
				{ToothNumber.upperRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? classes.selectedTooth : classes.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
				)}
			</Typography>
			<Typography align="center" className={classes.tooth}>
				<span className={classes.toothType}>LL: </span>
				{ToothNumber.lowerLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? classes.selectedTooth : classes.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
				)}
				<span className={classes.toothType}>LR: </span>
				{ToothNumber.lowerRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? classes.selectedTooth : classes.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) } >{t}</span>
						</BorderWrapper>								
					)}
				)}
			</Typography>
		</div>
	)}
	
	function DisplayNewBtn() {
		if ((treatmentArray.length > 0) && (treatmentArray[0].treatmentNumber === 0)) return null;
		return (
			<div align="right">
				<VsButton name="Add New Treatment" onClick={handleCreateNewTreatment} />
			</div>
		)
	}
	
	function handleCreateNewTreatment() {
		
		let myArray = [].concat(treatmentArray);
		let tmp = {
			pid: currentPatientData.pid,
			treatmentNumber: 0,
			treatmentDate: new Date(),
			treatment: [],
		}
		myArray = [tmp].concat(myArray);
		console.log(myArray);
		setTreatmentArray(myArray);
		//setCurrentSelection("Symptom");
		setTreatmentIndex(0);
	}

	function handleVsTreatmentDelete(treat) {
		
	}
	function handleAddDiagnosis() {
		setEmurName("");
		setEmurToothArray([]);
		setEmurAmount(0);
		
		setIsDrawerOpened("ADDTREAT");
		// set filter
		setFilterItem("TRE");
		setFilterItemText("");
		setFilterItemArray([]);
	}
	
		
	function handleDeleteTreatment(itemName) {
		//console.log("handleDeleteSymptom "+vNumber+" Notes "+mNumber);
		vsDialog("Delete Treatment", `Are you sure you want to delete treatment ${itemName}?`,
			{label: "Yes", onClick: () => handleDeleteTreatmentConfirm(itemName) },
			{label: "No" }
		);
	}
	
	function handleDeleteTreatmentConfirm(itemName) {
		let tmpArray = [].concat(treatmentArray);
		tmpArray[0].treatment = tmpArray[0].treatment.filter(x => x.name !== itemName);
		setTreatmentArray(tmpArray);
		updateTreatment(tmpArray[0].treatment);
	}
	

	function ArunTreatment() {
		if (treatmentArray.length === 0) return null;
		let x = treatmentArray[treatmentIndex];
		return (
			<div> 
			{(x.treatmentNumber === 0) && 
				<VsButton name="New treatment type" align="left" onClick={handleAddDiagnosis} />
			}	
			<Box borderColor="primary.main" border={1}>
			{x.treatment.map( (un, index) => {
				let arr = _.sortBy(un.toothArray);
				let ttt = arr.toString();
				return (
					<Grid className={classes.noPadding} key={"NOTES"} container justify="center" alignItems="center" >
					<Grid item xs={10} sm={3} md={3} lg={3} >
						<Typography className={classes.heading}>{"Treatment: "+un.name}</Typography>
					</Grid>
					<Grid item xs={10} sm={3} md={6} lg={6} >
						{/*\<DisplayTeeth toothArray={un.toothArray} />*/}
						<Typography className={classes.heading}>{"Tooth: "+ttt}</Typography>
					</Grid>
					<Grid item xs={10} sm={2} md={2} lg={2} >
						<Typography className={classes.heading}>{"Amount: "+un.amount}</Typography>
					</Grid>
					<Grid item xs={1} sm={1} md={1} lg={1} >
						{(x.treatmentNumber === 0) &&
							<IconButton color="secondary" size="small" onClick={() => { handleDeleteTreatment(un.name)}} >
							<DeleteIcon />
							</IconButton>
						}
					</Grid>
					</Grid>
				)}
			)}
			</Box>
			</div>
		)}
		
	function updateTreatmentToDatabase(treatment) {
		
	}
	
	function updateNewTreatment(tArray) {
		
	}
	
	function updateTreatment() {
		updateTreatmentToDatabase(emurName);
		
		let tmp = [].concat(treatmentArray);
		let index = emurNumber;
		if (isDrawerOpened === "ADDTREAT") {
			if (tmp[0].treatment.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				setModalRegister(2001);
				return;
			} 
			tmp[0].treatment.push({name: emurName, toothArray: emurToothArray, amount: emurAmount});
			index = tmp[0].treatment.length - 1;
		} else {
			if (tmp[0].treatment[index].name.toLowerCase() !== emurName.toLowerCase()) {
				if (tmp[0].treatment.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					setModalRegister(2001);
					return;
				} 
			}
		}
		setIsDrawerOpened("");
		
		tmp[0].treatment[index].name = emurName;
		console.log(tmp[0].treatment);
		updateNewTreatment(tmp[0].treatment)
		setTreatmentArray(tmp);
	}
	

	function handleVsSelect(item) {
		setFilterItemArray([]); 
		setEmurName(item.name);
	}
	
	
	function setEmurNameWithFilter(txt) {
		//console.log("Iin filter", txt);
		setEmurName(txt);
		setFilterItemText(txt);
		let tmpArray = [];
		if (txt !== "") {
			if (filterItem.substr(0,3) === "TRE")
				tmpArray = [];
		} 
		//console.log(tmpArray);
		setFilterItemArray(tmpArray);
	}
	
	function handleToothUpdate(num) {
		let newTootlArray;
		if (emurToothArray.includes(num)) {
			newTootlArray = emurToothArray.filter(x => x !== num);
		} else {
			newTootlArray = [].concat(emurToothArray);
			newTootlArray.push(num);
		}
		//console.log(newTootlArray);
		setEmurToothArray(newTootlArray);
	}
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
		<DisplayTreatmentDates />
		<DisplayFunctionHeader />
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<DisplayNewBtn />
			{(currentSelection === "Treatment") &&
				<ArunTreatment />
			}
		</Box>
		{/*<DisplayTeeth toothArray={emurToothArray} onClick={handleUpdate} />
		<DisplayTeeth toothArray={myToothArray} />*/}
		<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{((isDrawerOpened === "ADDTREAT") || (isDrawerOpened === "EDITTREAT")) &&
		<ValidatorForm align="center" className={gClasses.form} onSubmit={updateTreatment}>
			<Typography align="center" className={classes.modalHeader}>
				{((isDrawerOpened === "ADDTREAT") ? "New Treatment" : "Edit Treatment")+` for ${currentPatient}`}
			</Typography>
			<BlankArea />
			<TextValidator required fullWidth color="primary"
				id="newName" label="Treatment type" name="newName"
				onChange={(event) => setEmurNameWithFilter(event.target.value)}
				value={emurName}
			/>
			<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
			<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsTreatmentDelete} />
			<BlankArea />
			<DisplayTeeth toothArray={emurToothArray} onClick={handleToothUpdate} />
			<TextValidator required fullWidth color="primary" type="number" className={gClasses.vgSpacing} 
				id="newName" label="Professional Charge" name="newName"
				onChange={(event) => setEmurAmount(event.target.value)}
				value={emurAmount}
				validators={['minNumber:100']}
        errorMessages={['Invalid Amount']}
			/>
			<ModalResisterStatus />
			<BlankArea />
			<VsButton type ="submit" name= {(isDrawerOpened === "ADDTREAT") ? "Add" : "Update"} />
		</ValidatorForm>
	}
	</Box>
	</Drawer>
	</div>
  );    
}
