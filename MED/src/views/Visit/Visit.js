import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import axios from "axios";
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
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
//import StepProgressBar from 'react-step-progress';
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
	ordinalSuffix,
} from "views/functions.js";

const useStyles = makeStyles((theme) => ({
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
		reviewDate: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: 'blue',
			marginBottom: '50px',
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
// set-up the step content
const step1Content = <h1>Request to server</h1>;
const step2Content = <h1>Geneate visit document</h1>;
const step3Content = <h1>Download visit document</h1>;

let test=[];
let medQty=[];
const timeArray=[1, 2, 3, 4, 5, 6];
const unitArray=["Day", "Week", "Month"];

function setMedQty() {
	medQty = [];
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
export default function Visit(props) {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [currentSelection, setCurrentSelection] = useState("Medicine");
	const [visitIndex, setVisitIndex] = useState(0);
	const [remember, setRemember] = useState(false);
	
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
	
	const [modalRegister, setModalRegister] = useState(0);

	

  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");

		const checkPatient = async () => {	
			try {
				let patRec = props.patient;	//JSON.parse(sessionStorage.getItem("shareData"));
				//console.log(patRec);
				setCurrentPatientData(patRec);
				setCurrentPatient(patRec.displayName);
				await getPatientVisit(patRec);
				//setSearchText(patRec.displayName);
				//setPatientArray([patRec]);

				//let ddd = await getPatientDocument(userCid, patRec.pid);
				//console.log("Docs", ddd);
				//setDocumentArray(ddd);
			} catch {
				// have come directly
				//let ppp = await getAllPatients();
				//setPatientArray(ppp);
				//setPatientMasterArray(ppp);
			}
			sessionStorage.setItem("shareData", "");		// clean up
			
		}
		setMedQty();
		checkPatient();
		getAllMedicines();
		getAllNotes();
		getAllRemarks();
  }, []);


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
		sessionStorage.setItem("shareData",JSON.stringify(currentPatientData));
		setCurrentSelection(item);
	}
	
	
	function DisplayFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Medicine" />
		<DisplayFunctionItem item="User Note" />
		<DisplayFunctionItem item="Lab Test" />
		{((visitArray.length > 0) && (visitArray[0].visitNumber === 0) && (visitIndex === 0)) &&
			<DisplayFunctionItem item="Next Review" />
		}
	</Grid>	
	</Box>
	)}

	function changIndex(num) {
		num += visitIndex;
		if (num < 0) return;
		if (num === visitArray.length) return;
		setVisitIndex(num);
		setCurrentSelection("Medicine");
	}
	
	function DisplayVisitDates() {
	if (visitArray.length === 0) {
		return (
			<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
				<Grid key={"VISIST"} item xs={12} sm={12} md={12} lg={12} >
					<Typography className={classes.slotTitle} >
						{"No Visit history available"}
					</Typography>
				</Grid>
			</Grid>	
			</Box>
		);
	}
	
	let v = visitArray[visitIndex];
	let myDate;
	if (v.visitNumber === 0)
			myDate = "Today's new Visit";
	else {
		let d = new Date(v.visitDate);
		myDate = `Visit dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
	}
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
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
	)}

	async function getPatientVisit(rec) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/list/${userCid}/${rec.pid}`)
			setVisitArray(resp.data);
			setVisitIndex(0);
		} catch (e) {
			console.log(e)
			setVisitArray([]);
			setVisitIndex(0);
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
	
	
	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = "Duplicate Medicine";
        break;
      case 1002:
        myMsg = `All the doses cannot be 0`;
        break;
      case 1003:
        myMsg = `No Medicine selected`;
        break;
      case 2001:
        myMsg = "Duplicate User Note";
        break;
      case 3001:
        myMsg = `Duplicate Lab Test`;
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
	

	function DisplayNewVisitBtn() {
		if ((visitArray.length > 0) && (visitArray[0].visitNumber === 0)) return null;
		return (
			<div align="right">
				<VsButton name="Add Blank Visit" onClick={handleCreateNewVisit} />
				{(visitArray.length > 0) &&
				<VsButton name="Duplicate Visit" onClick={handleCopyNew} />
				}
			</div>
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
		setVisitIndex(0);
		// also add date
		
	}
	
	function handleCopyNew() {
		let today = new Date();

		let selectedVisit = visitArray[visitIndex];
		let newVisit = cloneDeep(selectedVisit);
		updateNewVisit(newVisit.medicines, newVisit.userNotes, newVisit.remarks, nextVisitTime, nextVisitUnit)
		
		newVisit.visitNumber = 0;
		newVisit.visitDate = new Date().toString();
		let tmpArray = [newVisit];
		tmpArray = tmpArray.concat(visitArray);
		setVisitArray(tmpArray);
		setVisitIndex(0);
	}
	
	function handleDeleteNew() {
		let tmp = visitArray.slice(1, visitArray.length);
		setVisitArray(tmp);
	}
	
	
	
	function validateNewVisit() {
		let errcode = 0;
		return (0);
		
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
		try {
			await axios.get (`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/printdoc/${userCid}/${currentPatientData.pid}`);
			
			// now prepare for download
			let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/visit/downloadvisit/${userCid}/${currentPatientData.pid}`;
			let response = await axios({ method: 'get', url: myURL, responseType: 'arraybuffer',

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
	
	
	function updateNewVisit(med, note, rem, nextime, nextunit) {	
		let newVisit = {
			pid: currentPatientData.pid, displayName: currentPatientData.displayName,
			medicine: med, userNote: note, remark: rem, nextTime: nextime, nextUnit: nextunit
		};
		//console.log(newVisit);
		let newVisitInfo = encodeURIComponent(JSON.stringify(newVisit));
		axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/update/${userCid}/${newVisitInfo}`);
		//console.log("posted");
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
		let myResult = {visit: visitArray[0], nextVisit: {after: nextVisitTime, unit: nextVisitUnit} }
		return myResult;
		
		
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
			let tmp1 = encodeURIComponent(newVisitInfo);
			//console.log(newVisitInfo);
			try {
				await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/updatenewvisit/${userCid}/${newVisitNumber}/${tmp1}`)
				alert.success("Successfully update new visit");
			} catch (e) {
				console.log(e)
				alert.success("Error updating new visit");
			}
		} else {
			//setVisitError(errcode);
		}
	}
	
	//Arun Salgia new add / edit / delete Notes
	
	function handleAddUserNotes() {
		setEmurName("");
		setIsDrawerOpened("ADDNOTE");
		// set filter
		setFilterItem("NOT");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
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
		setRemember(false);
	}
	
	function updateUserNotes() {
		updateNoteToDatabase(emurName);
		
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		if (isDrawerOpened === "ADDNOTE") {
			if (tmp[0].userNotes.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				setModalRegister(2001);
				return;
			} 
			tmp[0].userNotes.push({name: ""});
			index = tmp[0].userNotes.length - 1;
		} else {
			if (tmp[0].userNotes[index].name.toLowerCase() !== emurName.toLowerCase()) {
				if (tmp[0].userNotes.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					setModalRegister(2001);
					return;
				} 
			}
		}
		setIsDrawerOpened("");
		
		tmp[0].userNotes[index].name = emurName;
		console.log(tmp[0].userNotes);
		updateNewVisit(tmp[0].medicines, tmp[0].userNotes, tmp[0].remarks, nextVisitTime, nextVisitUnit)
		setVisitArray(tmp);
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
		if (vNumber !== 0) return;
		
		var tmp = [].concat(visitArray);
		tmp[0].userNotes = tmp[0].userNotes.filter(function(value, index, arr){ 
			return index !== mNumber;
		});
		setVisitArray(tmp);
		updateNewVisit(tmp[0].medicines, tmp[0].userNotes, tmp[0].remarks, nextVisitTime, nextVisitUnit)
	}
	
	
	function handleAddNewRemark() {
		setEmurName("");
		setModalRegister(0);
		setIsDrawerOpened("ADDREM");
		
		setFilterItem("REM");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);

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
		setRemember(false);

	}
	
	function updateRemark() {
		updateRemarkToDatabase(emurName);
		
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		if (isDrawerOpened === "ADDREM") {
			if (tmp[0].remarks.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				setModalRegister(3001);
				return;
			}
			tmp[0].remarks.push({name: ""});
			index = tmp[0].remarks.length - 1;
		} else {
			if (tmp[0].remarks[index].name.toLowerCase() !== emurName.toLowerCase()) {
				if (tmp[0].remarks.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					setModalRegister(3001);
					return;
				}
			}
		}
		setIsDrawerOpened("");
		
		tmp[0].remarks[index].name = emurName;
		setVisitArray(tmp);
		updateNewVisit(tmp[0].medicines, tmp[0].userNotes, tmp[0].remarks, nextVisitTime, nextVisitUnit)
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
			updateNewVisit(tmp[0].medicines, tmp[0].userNotes, tmp[0].remarks, nextVisitTime, nextVisitUnit);
		}
	}
	

	
	function handleAddNewMedicine() {
		setEmurNumber(0);
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
		setRemember(false);
		
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
		setRemember(false);
		
		setModalRegister(0);
		setIsDrawerOpened("EDITMED");
	}

	function updateMedicineToDatabase(medName) {
		if (!remember) return;
		let tmp = medicineArray.find(x => x.name.toLowerCase() === medName.toLowerCase());
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

	function handleVsMedicineDelete(med) {
		let medName = med.name;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${userCid}/${medName}`;
			axios.get(myUrl);
			setMedicineArray(medicineArray.filter(x => x.name !== medName))
			setFilterItemArray(filterItemArray.filter(x => x.name !== medName));
		} catch (e) {
			console.log(e);
		}
	}

	
	function updateNoteToDatabase(noteName) {
		if (!remember) return;
		
		let tmp = noteArray.find(x => x.name.toLowerCase() === noteName.toLowerCase())
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
	
		
	function handleVsNoteDelete(note) {
		let noteName = note.name;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/note/delete/${userCid}/${noteName}`;
			axios.get(myUrl);
			setNoteArray(noteArray.filter(x => x.name !== noteName));
			setFilterItemArray(filterItemArray.filter(x => x.name !== noteName));
		} catch (e) {
			console.log(e);
		}
	}
	
	
	function updateRemarkToDatabase(remarkName) {
		if (!remember) return;
		let tmp = remarkArray.find(x => x.name.toLowerCase() === remarkName.toLowerCase());
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
	
	function handleVsRemarkDelete(remark) {
		let remarkName = remark.name;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/remark/delete/${userCid}/${remarkName}`;
			axios.get(myUrl);
			setRemarkArray(remarkArray.filter(x => x.name !== remarkName));
			setFilterItemArray(filterItemArray.filter(x => x.name !== remarkName))
		} catch (e) {
			console.log(e);
		}
	}
	
	function handleMedicineUpdate() {
		if ((emedDose1+emedDose2+emedDose3) == 0) {
				setModalRegister(1002);
				return;
		}
		if (emurName == "") {
			setModalRegister(1003);
			return;
		}
		
		updateMedicineToDatabase(emurName);
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		//console.log("indx", index);
		if (isDrawerOpened === "ADDMED") {
			//console.log(tmp[0].medicines);
			//console.log(emurName);
			if (tmp[0].medicines.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				// duplicate medicine 
				setModalRegister(1001);
				return;
			}
			tmp[0].medicines.push({name: "", dose1: 0, dose2: 0, dose3: 0, unit: "", time: 0});
			index = tmp[0].medicines.length - 1;
		} else {
			console.log("in edit");
			if (tmp[0].medicines[index].name.toLowerCase() !== emurName.toLowerCase()) {
				//console.log("in edit different");
				if (tmp[0].medicines.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					// duplicate medicine 
					//console.log("in edit error");
					setModalRegister(1001);
					return;
				}
			}
		}

		setIsDrawerOpened("");		

		tmp[0].medicines[index].name = emurName;
		tmp[0].medicines[index].dose1 = emedDose1;
		tmp[0].medicines[index].dose2 = emedDose2;
		tmp[0].medicines[index].dose3 = emedDose3;
		tmp[0].medicines[index].unit = emedUnit;
		tmp[0].medicines[index].time = emedTime;
		setVisitArray(tmp);
		updateNewVisit(tmp[0].medicines, tmp[0].userNotes, tmp[0].remarks, nextVisitTime, nextVisitUnit);
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
		if (vNumber !== 0) return;
		var tmp = [].concat(visitArray);
		tmp[0].medicines = tmp[0].medicines.filter(function(value, index, arr){ 
			return index != mNumber;
		});
		updateNewVisit(tmp[0].medicines, tmp[0].userNotes, tmp[0].remarks, nextVisitTime, nextVisitUnit);
		setVisitArray(tmp);
		console.log(tmp[0].medicines);
	}
	
	// handle visits

	function ArunMedicines() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	return (
	<div>	
	{(x.visitNumber === 0) && 
		<VsButton name="Add new Medicine" align="left" onClick={handleAddNewMedicine} />
	}	
	<Box borderColor="primary.main" border={1}>
	{x.medicines.map( (m, index) =>
		<Grid className={classes.noPadding} key={"MED"+x.visitNumber+"-"+index} container justify="center" alignItems="center" >
		<Grid item xs={4} sm={4} md={6} lg={6} >
			<Typography className={classes.heading}>{"Medicine: "+m.name}</Typography>
		</Grid>
		<Grid item xs={4} sm={4} md={2} lg={2} >
			<Typography className={classes.heading}>{"Dose: "+dose(m.dose1, m.dose2, m.dose3)}</Typography>
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<Typography className={classes.heading}>{"Duration: "+m.time+" "+m.unit+((m.time > 1) ? "s" : "")}</Typography>
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
	</div>
	)}
	
	function ArunNotes() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	return (
	<div>

	{(x.visitNumber === 0) && 
		<VsButton name="Add new User Note" align="left"  onClick={handleAddUserNotes} />
	}
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
	
	function ArunRemarks() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	return (
	<div>
	{(x.visitNumber === 0) && 
		<VsButton name="Add new Lab Test" align="left" onClick={handleAddNewRemark} />
	}
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
	
	function updateUnit(value) {
		setNextVisitUnit(value);
		let myVisit = visitArray[0];
		updateNewVisit(myVisit.medicines, myVisit.userNotes, myVisit.remarks, nextVisitTime, value)
	}
	
	function updateTime(value) {
		setNextVisitTime(value);
		let myVisit = visitArray[0];
		updateNewVisit(myVisit.medicines, myVisit.userNotes, myVisit.remarks, value, nextVisitUnit);
	}
	
	function orgArunFollowup() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	if (x.visitNumber !== 0) return null;
	
	return (
	<Grid className={classes.noPadding} key={"FOLLOWUP"} container justify="center" alignItems="center" >
		<Grid item xs={4} sm={4} md={2} lg={2} >
		<Typography className={classes.title}>Next Review After</Typography>
		</Grid>
		<Grid item xs={4} sm={4} md={1} lg={1} >
			<Select labelId='time' id='time' name="time" padding={10}
			required fullWidth label="Time" 
			value={nextVisitTime}
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
				required fullWidth label="Unit" 
				value={nextVisitUnit}
				inputProps={{
					name: 'Unit',
					id: 'filled-age-native-simple',
					align: 'center',
				}}
				onChange={(event) => setNextVisitUnit(event.target.value)}
			>
			{unitArray.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
			</Select>
		</Grid>
		<Grid item xs={false} sm={false} md={8} lg={8} />
	</Grid>
	)}
	
	function ArunFollowup() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	if (x.visitNumber !== 0) return null;
	let d = new Date();
	console.log(d, nextVisitUnit, nextVisitTime )
	switch (nextVisitUnit) {
		case 'Day':
			d.setDate(d.getDate()+nextVisitTime);
			break;
		case 'Week':
			d.setDate(d.getDate()+(7*nextVisitTime));
			break;	
		case 'Month':
			d.setMonth(d.getMonth()+nextVisitTime);
			break;	
		case 'Year':
			d.setYear(d.getFullYear()+nextVisitTime);
			break;			
	}
	console.log(d);
	let reviewDate = DATESTR[d.getDate()] + "/" + MONTHNUMBERSTR[d.getMonth()] + "/" + d.getFullYear();
	return (
		<div align="left">
		<Typography className={classes.reviewDate}>{"Next visit scheduled on "+reviewDate}</Typography>
		<Grid className={classes.noPadding} key={"UNIT"} container>
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<BlankArea />
		</Grid>
		<Grid item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={4} sm={4} md={2} lg={2} >
		<Typography className={classes.title}>Select Unit: </Typography>
		</Grid>
		<Grid item xs={4} sm={4} md={10} lg={10} >
			<FormControl component="fieldset">
			<RadioGroup row aria-label="unitSelect" name="unitSelect" value={nextVisitUnit} 
				onChange={() => {updateUnit(event.target.value); }}
			>
			{unitArray.map ( r =>
			<FormControlLabel className={gClasses.filterRadio} value={r} control={<Radio color="primary"/>} label={r} />
			)}
			</RadioGroup>
			</FormControl>			
		</Grid>
		<Grid item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={4} sm={4} md={2} lg={2} >
		<Typography className={classes.title}>Select Time: </Typography>
		</Grid>
		<Grid item xs={4} sm={4} md={10} lg={10} >
			<FormControl component="fieldset">
			<RadioGroup row aria-label="timeSelect" name="timeSelect" value={nextVisitTime} 
				onChange={() => {updateTime(Number(event.target.value)); }}
			>
			{timeArray.map ( r =>
			<FormControlLabel className={gClasses.filterRadio} value={r} control={<Radio color="primary"/>} label={r} />
			)}
			</RadioGroup>
			</FormControl>			
		</Grid>
		</Grid>
		</div>
	)}
	
	
	function ArunVisitUpdateButton() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	if  (x.visitNumber !== 0) return null;

	return (
		<div align="right">
			<VsButton name="Print Visit Document"  onClick={generateVisitDocument} />
			{/*<VsButton name="Download Visit Document"  onClick={printVisit} />*/}
		</div>
	);
	}

	function setEmurNameWithFilter(itemName) {
		let txt = itemName;
		setEmurName(txt);
		setFilterItemText(txt);
		let tmpArray = [];
		if (itemName !== "") {
			if (filterItem.substr(0,3) === "MED")
				tmpArray = medicineArray.filter( x => x.name.toLowerCase().includes(txt.toLowerCase()) );
			else if (filterItem.substr(0,3) === "NOT")
				tmpArray = noteArray.filter( x => x.name.toLowerCase().includes(txt.toLowerCase()) );
			else if (filterItem.substr(0,3) === "REM")
				tmpArray = remarkArray.filter( x => x.name.toLowerCase().includes(txt.toLowerCase()) );
		} 
		console.log(tmpArray);
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
	
	function handleVsSelect(item) {
		//console.log(item);
		//alert.info(`To select item ${item.name}`)
		setFilterItemArray([]); 
		setEmurName(item.name);
	}
	

	return (
	<div align="center" key="main">
	<CssBaseline />
	{(currentPatient !== "") &&
		<Box align="left" >
			<DisplayVisitDates />
			<DisplayFunctionHeader />
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<DisplayNewVisitBtn />
				<ArunVisitUpdateButton />		{/* only for visitNumber 0 i.e. new visit */}
				{(currentSelection === "Medicine") &&
					<ArunMedicines />
				}
				{(currentSelection === "User Note") &&
					<ArunNotes />
				}
				{(currentSelection === "Lab Test") &&
					<ArunRemarks  />
				}
				{(currentSelection === "Next Review") &&
					<ArunFollowup />
				}
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
			<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
			<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsMedicineDelete} />
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
				{((isDrawerOpened === "ADDNOTE") ? "New Note" : "Edit Note")+` for ${currentPatient}`}
			</Typography>
			<BlankArea />
			<TextValidator required fullWidth color="primary"
				id="newName" label="Note" name="newName"
				onChange={(event) => setEmurNameWithFilter(event.target.value)}
				value={emurName}
			/>
			<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
			<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsNoteDelete} />
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
			<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
			<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsRemarkDelete} />
			<ModalResisterStatus />
			<BlankArea />
			<VsButton type="submit" name= {(isDrawerOpened === "ADDREM") ? "Add" : "Update"}
			/>
		</ValidatorForm>
	}
	</Box>
	</Drawer>		
  </div>
  );    
}
