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
import Header from "CustomComponents/Header";

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
import { isUserLogged, encrypt, callYesNo } from "views/functions.js"
import {DisplayYesNo, DisplayPageHeader, BlankArea } from "CustomComponents/CustomComponents.js"

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
// import {setTab} from "CustomComponents/CricDreamTabs.js"

const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
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

const COUNTPERPAGE=10;
const BOTTONCOL=9;

const ALPHABETSTR = [
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z"
];

const NUMBERINT=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const GENDERARRAY=["Male", "Female", "Other"];

const addEditModal = dynamicModal('60%');
const yesNoModal = dynamicModal('60%');

let modalName="";
function setModalName(mmm) { modalName = mmm; }
let modalAge= 0;
function setModalAge(aaa) { modalAge = aaa };
let modalGender="Male";
function setModalGender(ggg) { modalGender = ggg; }

let searchText = "";
function setSearchText(sss) { searchText = sss;}



export default function Patient() {
	const history = useHistory();
	
  if (!isUserLogged()) {  history.push('/welcome'); }
	
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() { }
	
	const [directoryMode, setDirectoryMode] = useState(false);
	const [buttonArray, setButtonArray] = useState([]);
	const [patientChar, setPatientChar] = useState("A");

	const [patientArray, setPatientArray] = useState([]);

	const [registerStatus, setRegisterStatus] = useState(0);
	
	const	[patientName, setPatientName] = useState("");
	const	[patientAge, setPatientAge] = useState(0);
	const	[patientGender, setPatientGender] = useState("Male");
	
	const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
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

	async function updatePatientArray(myChar = "") {
		//console.log("My Char",  myChar);
		let myData = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/count`)
			myData = resp.data;
		} catch (e) {
			console.log(e);
		}
		
		if (myChar == "") {
			myChar = (myData.length > 0) ? myData[0]._id : "A";
		}
		
		setButtonArray(myData);
		fetchPatientByAlphabet(myChar)
	}
  
  async function fetchPatientByAlphabet(ccc) {
		//console.log(ccc);
		let myData = [];
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/alphabetlist/${ccc}`
			var resp = await axios.get(myUrl);
			myData = resp.data;
		} catch (e) {
			console.log(e);
		}
		setPatientArray(myData);
		setPatientChar(ccc);
	}
	
	// start visit of patient
	async function handleVisit(rec) {
		console.log(rec);
		alert(`Visit of ${rec.displayName} direct from here. To be implemented`);
	}
	
	async function handleAppointment(rec) {
		console.log(rec);
		alert(`Appointment of ${rec.displayName} direct from here. To be implemented`);
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

	async function getPatientList(filter) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/list/${filter}`)
			//console.log(resp.data);
			setPatientArray(resp.data);
		} catch (e) {
			console.log("Filter error");
			setPatientArray([]);
		}
	}
	
	async function selectFilter() {
		//console.log("Filter:", searchText);
		getPatientList(searchText);
		setCurrentPatient("");
	}

	async function old_handleNewSubmit() {
		//console.log("In new submit");
		console.log("Name:", patientName);
		console.log("Desc:", medicineDescription);
		console.log("pre:", medicinePrecaution);
		axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${patientName}/${medicineDescription}/${medicinePrecaution}`)
		.then((response) =>{
			//console.log(response.data);
			//let tmp = [].concat(patientArray);
			//tmp.push(response.data);
			//setPatientArray(tmp);
			setRegisterStatus(200);
		})
		.catch ( (e) => {
			console.log(e);
			setRegisterStatus(601);
		});
	}
	
	
	async function old_handleDelete() {
		//console.log("dlete");
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${currentPatient}`)
			var newList = patientArray.filter(x => x.name !== currentPatient);
			console.log(newList);
			setPatientArray(newList);
		} catch (e) {
			console.log("Delete error");
		}
		setCurrentPatient("");
	}
	
	function old_selectPatient(medName) {
		setCurrentPatient(medName);
		var myMed = patientArray.find( x => x.name == medName);
		//console.log(myMed);
		setPatientName(myMed.name);
		setPatientDescription(myMed.description);
		setPatientPrecaution(myMed.precaution);
		setEdit(false);
	}
	
	async function handleEdit() {
		//console.log("Edit button");
		if (edit) {
			// Update given by user
			try {
				var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/update/${patientName}/${medicineDescription}/${medicinePrecaution}`);
				//console.log(resp.data);
				let tmp = patientArray.find(x => x.name == patientName);
				tmp.description = medicineDescription;
				tmp.precaution = medicinePrecaution;
			} catch (e) {
				console.log("Update error");
				//setPatientArray([]);
			}
		} else {
			// Edit given by user. Nothing special to be done
		} 
		setEdit(!edit);
	}
	
	// Start of function s/ component
	
	function DisplayAlphabetButtons() {
	return (
		<TableContainer> 
		<Table align="center">
		<TableBody> 
		{NUMBERINT.slice(0, 3).map( (r, index) => 
			<TableRow key={"TROW"+r}>
			{NUMBERINT.slice(0, BOTTONCOL).map( (c, index)  => {
				let i =  r*BOTTONCOL + c;
				if (i >= ALPHABETSTR.length) return null;
				let tmp = buttonArray.find(x => x._id == ALPHABETSTR[i]);
				//console.log(tmp);
				if (tmp) {
					return(
						<TableCell key={"TD"+i} align="center" component="td" scope="row" align="center" padding="none"
							onClick={() => {fetchPatientsByAlphabet(ALPHABETSTR[i]) }}
						>
							<Avatar size="small" variant={"square"} className={classes.info}>
								{ALPHABETSTR[i]}
							</Avatar>
						</TableCell>
					)
				} else {
					return(
						<TableCell key={"TD"+i} align="center" component="td" scope="row" align="center" padding="none">
							<Avatar size="small" variant={"square"} className={classes.noinfo}>
								{ALPHABETSTR[i]}
							</Avatar>
						</TableCell>
					)
				}
			}
			)}
			</TableRow>	
		)}
		</TableBody>
		</Table>
		</TableContainer>	
	)}
	
	async function fetchPatientsByAlphabet(ccc) {
		//console.log(ccc);
		let myPat = [];
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/alphabetlist/${ccc}`
			var resp = await axios.get(myUrl);
			myPat = resp.data;
		} catch (e) {
			console.log(e);
		}
		setPatientArray(myPat);
		setPatientChar(ccc);
	}
	
	// display patient table
	
	function DisplayPatients() {
	return (
		<Box width="100%">
		<TableContainer > 
		<Table align="center" style={{ width: '90%' }}>
		<TableHead>
			<TableRow key="MEDTH1" align="center">
				<TableCell colSpan={7} key="MEDTH1" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>{'Patient names'+((directoryMode) ? ' starting with '+patientChar : "")}</Typography>
				</TableCell>
			</TableRow>
			<TableRow key="MEDTH2" align="center">
				<TableCell key="MEDTH21" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>Name along with Id</Typography>
				</TableCell>
				<TableCell key="MEDTH22" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>Age</Typography>
				</TableCell>
				<TableCell key="MEDTH23" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>Gender</Typography>
				</TableCell>
				<TableCell colSpan={4} key="MEDTH24" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>cmds</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
		<TableBody> 
		{patientArray.map( (m, index) => 
			<TableRow key={"MEDTROW"+index}>
			<TableCell key={"MEDTCOLNAME"+index} align="center" component="td" scope="row" 
				className={classes.td} padding="none">
				<Typography>{m.displayName+" (Id: "+m.pid+" )"}</Typography>
			</TableCell>
			<TableCell key={"MEDTCOLAGE"+index} align="center" component="td" scope="row" 
				className={classes.td} padding="none">
				<Typography>{m.age}</Typography>
			</TableCell>
			<TableCell key={"MEDTCOLGENDER"+index} align="center" component="td" scope="row" 
				className={classes.td} padding="none">
				<Typography>{m.gender}</Typography>
			</TableCell>
			<TableCell key={"MEDTCOLAPPT"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<Typography className={gClasses.root}>
					<Link href="#" variant="body2" onClick={() => { handleAppointment(m) } }>Appt</Link>
				</Typography>
			</TableCell>
			<TableCell key={"MEDTCOLVISIT"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<Typography className={gClasses.root}>
					<Link href="#" variant="body2" onClick={() => { handleVisit(m) } }>Visit</Link>
				</Typography>
			</TableCell>
			<TableCell key={"MEDTCOLEDIT"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<IconButton color="primary"  size="small" onClick={() => { handleEditPatient(m.displayName) } } >
					<EditIcon	 />
				</IconButton>
			</TableCell>
			<TableCell key={"MEDTCOLDEL"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<IconButton color="primary"  size="small" onClick={() => { handleDeletePatient(m.displayName) } } >
					<DeleteIcon	 />
				</IconButton>
			</TableCell>
			</TableRow>	
		)}
		</TableBody>
		</Table>
		</TableContainer>	
		</Box>
	)}
	
	async function handleEditPatient(name) {
		console.log("handleEditPatient", name);
		let tmp = patientArray.find(x => x.displayName == name);

		setModalName(tmp.displayName);
		setModalAge(tmp.age);
		setModalGender(tmp.gender);

		setPatientName(tmp.displayName);		
		setPatientAge(tmp.age);
		setPatientGender(tmp.gender);
		
		setRegisterStatus(0);
		openModal("EDIT");
	}
	

	async function handleAddPatient() {
		console.log("handleAddPatient");

		setModalName("");
		setModalAge(30);
		setModalGender("Male");
		
		setRegisterStatus(0);
		openModal("ADD");
	}
	
	async function handleDeletePatient(name) {
		console.log("handleDeletePatient", name);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/delete/${name}`
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
	
	
	async function handleAddEditSelect() {
		let myName = document.getElementById("newPatientName").value;
		setModalName(myName);
		
		let myAge = document.getElementById("newPatientAge").value;
		setModalAge(myAge);
		
		let myGender = document.querySelector('#newPatientGender').innerText;
		//let selectElement = document.querySelector('#newPatientGender');
    //console.log(selectElement, selectElement.value, selectElement.selectedIndex, selectElement.innerText);
    setModalGender(myGender);
		
		if ((myAge <= 0) || (myAge >= 100)) 
		{ 
			setRegisterStatus(621); 
			return; 
		}
		console.log("Modal", myName, myAge, myGender);		

		let resp;
		let myUrl;
		let myEmail = encrypt("noemail.mail.com");
		let myMobile='1234567890';
		
		if (modalIsOpen == "ADD") {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/add/${modalName}/${modalAge}/${modalGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
			} catch (error)  {
				console.log(error.response.status);
				setRegisterStatus(error.response.status);
				return
			}
		} else {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/edit/${patientName}/${modalName}/${modalAge}/${modalGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
			} catch (error)  {
				console.log(error.response.status);
				setRegisterStatus(error.response.status);
				return;
			}			
		}
		closeModal();
		
		console.log("resdisplay required here");
		// refresh display as per mode directory / filter
		if (directoryMode) {
			await updatePatientArray(myName.substr(0, 1).toUpperCase());
		} else {
			await updatePatientByFilter(searchText); 
		}
		return;
		await getPatientCount();
		await fetchPatientsByAlphabet(modalName.substr(0, 1).toUpperCase());
		await getPatientCount();
		await fetchPatientsByAlphabet(modalName.substr(0, 1).toUpperCase());
	}
	
	
	function DisplayAddEditPatient() {
	let myTitle = "Add new Patent";
	let myButton = "Add new";
	if (modalIsOpen != "ADD") {
		myTitle = "Edit Patient " + patientName;
		myButton = "Update";
	}
	return(
		<div align="center">
			<DisplayCloseModal />
			<Typography className={classes.header}>{myTitle}
			</Typography>
			<BlankArea />
			{/* Edit Patient name here */}
			<ValidatorForm className={classes.form} onSubmit={handleAddEditSelect}>
			<TextValidator variant="outlined" required fullWidth autoFocus      
				id="newPatientName" label="New Patient Name" type="text"
				defaultValue={modalName} 
      />
			<BlankArea />
			<TextValidator variant="outlined" required fullWidth       
				id="newPatientAge" label="New Patient Age" type="number"
				defaultValue={modalAge} 			
      />
			<BlankArea />
			<Select variant="outlined" required fullWidth
				id='newPatientGender'  label="New Patient Gender"
				defaultValue={modalGender}	
			>
				<MenuItem key="Male" value="Male">Male</MenuItem>
				<MenuItem key="Female" value="Female">Female</MenuItem>
				<MenuItem key="Other" value="Other">Other</MenuItem>
			</Select>
			<ShowResisterStatus />
			<BlankArea />
			<Button variant="contained" type="submit" color="primary" className={gClasses.submit}>
			{myButton}
			</Button>
			</ValidatorForm>    
		</div>
	)}
	
	function DisplayNewPatientBtn() {
		return (
			<Typography align="right" className={gClasses.root}>
				<Link href="#" variant="body2" onClick={handleAddPatient}>Add New Patient</Link>
			</Typography>
		)
	}
		// function for filter based
	
	function DisplayFilter() {
	return (	
		<Grid className={classes.noPadding} key="Filter" container justify="center" alignItems="center" >
			<Grid item xs={2} sm={2} md={2} lg={2} />
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<TextField id="filter"  padding={5} variant="outlined" fullWidth label="Patient Filter" 
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
			<Grid item xs={2} sm={2} md={2} lg={2} />
		</Grid>
	)}
	
	async function selectFilter() {
		let myText = document.getElementById("filter").value;
		//console.log(myText);
		setSearchText(myText);
		await updatePatientByFilter(searchText);
	}
	
	async function updatePatientByFilter(filter) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/filter/${filter}`)
			//console.log(resp.data);
			setPatientArray(resp.data);
		} catch (e) {
			console.log("Filter error");
			setPatientArray([]);
		}
	}
	
	
	// selection mode Directory of filter
	
	async function initFilterModeData() {
		setSearchText("");
		setPatientArray([]);
		callYesNo(openModal, "Id is filter", "Confirm");
		callYesNo(openModal, "Filter", "Check Filter", "Is Filter Ok?", "Yes", "", false);
	}
	
	async function initDirectoryModeData() {
		//console.log("in init dir mdoe");
		await updatePatientArray();
		callYesNo(openModal, "DIR", "Check Dir", "Is Dir Ok?", "", "Cancel", true);
	}
	
	function toggleDirectoryMode() {
		let newMode = !directoryMode;
		if (newMode)	{
			initDirectoryModeData();
		} else {
			initFilterModeData();
		}
		setDirectoryMode(newMode);
	}
	
	function DisplaySelectionMode() {
	return (
		<Grid className={classes.noPadding} key="MonthYear" container justify="center" alignItems="center" >
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<div align="right">
				<Typography padding="none" className={classes.switchText}>Patient Filter</Typography>
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
				<Typography padding="none" className={classes.switchText}>Patient Directory</Typography>
				</div>
			</Grid>
		</Grid>
	)}
	
	function DirectoryMode() {
	return (
		<div>
			<DisplayAlphabetButtons />
			<BlankArea />
			<DisplayNewPatientBtn />
			<DisplayPatients />
		</div>
	)}
	
	function FilterMode() {
	return (
		<div>
			<DisplayFilter />
			<BlankArea />
			<DisplayNewPatientBtn />
			<DisplayPatients />
		</div>
	)}
	
	function yesNoHandler(id, action) {
		console.log("Id is " + id + "  Action is " + action);
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<Header />
		{/*<DisplayPageHeader headerName="Patient Directory" groupName="" tournament=""/>*/}
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplaySelectionMode />
		{(directoryMode) && <DirectoryMode />}
		{(!directoryMode) && <FilterMode />}
		</Container>
		<Modal
			isOpen={(modalIsOpen == "ADD") || (modalIsOpen == "EDIT")}
			shouldCloseOnOverlayClick={false}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={addEditModal}
			contentLabel="Example Modal"
			aria-labelledby="modalTitle"
			aria-describedby="modalDescription"
			ariaHideApp={false}
		>
			<DisplayAddEditPatient />
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

