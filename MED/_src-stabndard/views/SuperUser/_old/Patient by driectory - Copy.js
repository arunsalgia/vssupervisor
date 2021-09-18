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
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";
import { encrypt } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"

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

let modalName="";
let modalAge= 0;
let modalGender="Male";

export default function Patient() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() { }
	
	const [buttonRow, setButtonRow] = useState(0);
	const [buttonArray, setButtonArray] = useState([]);
	const [patientChar, setPatientChar] = useState("");
	const [patientArray, setPatientArray] = useState([]);
	const [addOrEdit, setAddOrEdit] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	const	[patientName, setPatientName] = useState("");
	const	[patientAge, setPatientAge] = useState(0);
	const	[patientGender, setPatientGender] = useState("Male");

	
	
	const [old, setOld] = useState(true);
	
	// for old medicine
	const [searchText,setSearchText] = useState("")
  
	const [currentPatient, setCurrentPatient] = useState("");
	
	// for new medicine to be added
	// or medicine to be modified
	const [medicineDescription, setPatientDescription] = useState("");
	const [medicinePrecaution, setPatientPrecaution] = useState("");
	
	const [edit, setEdit] = useState(false);
	
	
	const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  const [page, setPage] = useState(0);
	
	const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
	
  useEffect(() => {
      const us = async () => {
				await getPatientCount();	
      }
      us();
  }, [])


  async function getPatientCount() {
		let myData = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/count`)
			myData = resp.data;
		} catch (e) {
			console.log(e);
		}
		setButtonArray(myData);

		//console.log("COL", NUMBERINT.slice(0, BOTTONCOL));
		let myRow = Math.floor(myData.length / BOTTONCOL )
		if ((myData.length % BOTTONCOL) > 0) ++myRow;
		//console.log("ROW", NUMBERINT.slice(0, myRow));
		setButtonRow(myRow);
	}
  
  
  
	function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
        break;
      case 200:
        myMsg = `Successfully added/renamed details of ${patientName}`;
        break;
      case 601:
        myMsg = "Invalid patient age";
        break;
      case 602:
        myMsg = "Special chars not allowed in Patient name";
        break;
				
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(registerStatus === 200) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
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

	async function handleNewSubmit() {
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
	
	async function handleOldNew() {
		//console.log("Current old", old);
		if (old) {
				setPatientName("");
				setPatientDescription("");
				setPatientPrecaution("");
				setRegisterStatus(0);
				setOld(false);
		} else {
				setCurrentPatient("");
				getPatientList("");
				setRegisterStatus(0);
				setOld(true);
		}
	}
	
	async function handleDelete() {
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
	
	function selectPatient(medName) {
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
							onClick={() => {handleAlpabet(ALPHABETSTR[i]) }}
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
	
	async function handleAlpabet(ccc) {
		//console.log(ccc);
		let myMed = [];
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/alphabetlist/${ccc}`
			var resp = await axios.get(myUrl);
			myMed = resp.data;
		} catch (e) {
			console.log(e);
		}
		setPatientArray(myMed);
		setPatientChar(ccc);
	}
	
	function DisplayPatients() {
	return (
		<Box width="100%">
		<TableContainer > 
		<Table align="center" style={{ width: '90%' }}>
		<TableHead>
			<TableRow key="MEDTH1" align="center">
				<TableCell colSpan={5} key="MEDTH1" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>{'Patients (names starting with '+patientChar+")"}</Typography>
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
				<TableCell colSpan={2} key="MEDTH24" align="center" component="th" scope="row" 
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
		//console.log(tmp);
		setAddOrEdit("Edit");
		modalName = tmp.displayName;
		setPatientName(tmp.displayName);
		modalAge = tmp.age;
		modalGender =  tmp.gender;
		setRegisterStatus(0);
		openModal("ADDEDIT");
	}
	

	async function handleAddPatient() {
		console.log("handleAddPatient", name);
		setAddOrEdit("Add");

		modalName = "";
		modalAge = 30;
		modalGender = "Male";
		
		console.log("in add patient");
		setRegisterStatus(0);
		openModal("ADDEDIT");
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
		var selectBox = document.getElementById("patientGender");
		//modalGender = selectBox.options[selectBox.selectedIndex].value;

		
		console.log("Modal", modalName, modalAge, modalGender);		

		// validate age is in range
		if ((modalAge <= 0) || (modalAge >= 100)) { setRegisterStatus(601); return; }
		setRegisterStatus(0);		
		
		let resp;
		let myUrl;
		let myEmail = encrypt("noemail.mail.com");
		let myMobile='1234567890';
		if (addOrEdit == "Add") {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/add/${modalName}/${modalAge}/${modalGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
				closeModal();
				await getPatientCount();
				await handleAlpabet(modalName.substr(0, 1).toUpperCase());
			} catch (error)  {
				console.log(error);
				setRegisterStatus(611);
			}
		} else {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/edit/${patientName}/${modalName}/${modalAge}/${modalGender}/${myEmail}/${myMobile}`;
				resp = await axios.get(myUrl);
				closeModal();
				await getPatientCount();
				await handleAlpabet(modalName.substr(0, 1).toUpperCase());
			} catch (error)  {
				console.log(error);
				setRegisterStatus(611);
			}			
		}
	}
	
	
	function DisplayAddEditPatient() {
	return(
		<div align="center">
			<DisplayCloseModal />
			<Typography className={classes.header}>
			{addOrEdit+" Patient "}
			</Typography>
			<BlankArea />
			{(addOrEdit != "Add") && 
				<div>
				<Typography className={classes.header}>{"Name: "+patientName}</Typography>
				<BlankArea />
				</div>
			}
			{/* Edit Patient name here */}
			<ValidatorForm className={classes.form} onSubmit={handleAddEditSelect}>
			<TextValidator variant="outlined" required fullWidth autoFocus      
				id="patientName" label="Patient Name" type="text"
				defaultValue={modalName} 
				onChange={() => {modalName = event.target.value;}}
      />
			<BlankArea />
			<TextValidator variant="outlined" required fullWidth       
				id="patientAge" label="Patient Name" type="number"
				defaultValue={modalAge} 
				onChange={() => {modalAge = event.target.value;}}				
      />
			<BlankArea />
			<Select id='patientGender' variant="outlined" required fullWidth label="patientGender"
				defaultValue={modalGender}	
				onChange={() => {console.log(event.target.value);}}
			>
				<MenuItem key="Male" value="Male">Male</MenuItem>
				<MenuItem key="Female" value="Female">Female</MenuItem>
				<MenuItem key="Other" value="Other">Other</MenuItem>
			</Select>
			<ShowResisterStatus />
			<BlankArea />
			<Button variant="contained" type="submit" color="primary" className={gClasses.submit}>
			{(addOrEdit == "Add") ? "Add" : "Update"}
			</Button>
			</ValidatorForm>
			<ValidComp/>    
		</div>
	)}
	
	function DisplayNewPatientBtn() {
		return (
			<Typography align="right" className={gClasses.root}>
				<Link href="#" variant="body2" onClick={handleAddPatient}>Add New Patient</Link>
			</Typography>
		)
	}
	
  return (
  <div className={classes.paper} align="center" key="groupinfo">
		<DisplayPageHeader headerName="Patient Directory" groupName="" tournament=""/>
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplayAlphabetButtons />
		<BlankArea />
		<DisplayNewPatientBtn />
		<DisplayPatients />
		</Container>
		<Modal
			isOpen={modalIsOpen == "ADDEDIT"}
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
  </div>
  );    
}

