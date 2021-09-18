import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';

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
import { getImageName } from "views/functions.js"
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

const addEditModal = dynamicModal('60%');

let searchText = "";
function setSearchText(sss) { searchText = sss;}

let newMedicineName="";
function setNewMedicineName(sss) { newMedicineName = sss;}

export default function Medicine() {
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() { }
	
	const [directoryMode, setDirectoryMode] = useState(false);
	const [buttonArray, setButtonArray] = useState([]);
	const [medicineChar, setMedicineChar] = useState("A");
	
	const [medicineArray, setMedicineArray] = useState([]);
	const [registerStatus, setRegisterStatus] = useState(0);


	const	[medicineName, setMedicineName] = useState("");
	
	
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
  }, [])


  async function updateMedicineArray(myChar = "") {
		console.log("My Char",  myChar);
		let myData = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/count`)
			myData = resp.data;
		} catch (e) {
			console.log(e);
		}
		
		if (myChar == "") {
			myChar = (myData.length > 0) ? myData[0]._id : "A";
		}
		
		setButtonArray(myData);
		fetchMedicinesByAlphabet(myChar)
	}
  
	function ShowResisterStatus() {
	//console.log(`Status is ${registerStatus}`);
	let myMsg = "";
	switch (registerStatus) {
		case 601:
			myMsg = "New medicine already in database";
			break;
		case 611:
			myMsg = "Medicine name not found in database";
			break;
	}
	return(
      <div align="center"><Typography className={gClasses.error}>{myMsg}</Typography></div>
	)}

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
							onClick={() => {fetchMedicinesByAlphabet(ALPHABETSTR[i]) }}
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
	
	async function fetchMedicinesByAlphabet(ccc) {
		//console.log(ccc);
		let myMed = [];
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/alphabetlist/${ccc}`
			var resp = await axios.get(myUrl);
			myMed = resp.data;
		} catch (e) {
			console.log(e);
		}
		setMedicineArray(myMed);
		setMedicineChar(ccc);
	}
	
	
	// Function to display / close for function handler for edit/add
	function DisplayCloseModal() {
	return (
		<div align="right">
		<IconButton color="secondary"  size="small" onClick={closeModal} >
			<CancelIcon />
		</IconButton>
		</div>
	)}
	
	async function handleAddEditSelect() {
		//console.log("handleAddEditSelect");
		let myName = document.getElementById("newMedicineName").value;
		setNewMedicineName(myName);
		//console.log(myName);

		let myUrl;
		let resp;
		
		if (modalIsOpen == "ADD") {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${myName}/${myName}/${myName}`;
				await axios.get(myUrl);
				// now successfully added. come out of if then 
			} catch (e) {
				console.log(e);
				setRegisterStatus(e.response.status);
				return;
				// do not close the modal
			}
		} else {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/edit/${medicineName}/${myName}/${myName}/${myName}`;
				await axios.get(myUrl);
				// now successfully updated. come out of if then 
			} catch (e) {
				console.log(e);
				setRegisterStatus(e.response.status);
				return;
				// do not close the modal
			}
		}
		
		// here we come if successfully added / edited new medicine
		closeModal();
		
		// refresh display as per mode directory / filter
		if (directoryMode) {
			await updateMedicineArray(myName.substr(0, 1).toUpperCase());
		} else {
			await updateMedicinebyFilter(searchText); 
		}
	}
	
	function DisplayAddEditMedicine() {
	let myButton = "Add New";
	let myTitle = "Add new medicine";
	if (modalIsOpen != "ADD") {
		myButton = "Update";
		myTitle = "Edit medicine " + medicineName;
	}
	return(
		<div align="center">
			<DisplayCloseModal />
			<Typography className={classes.header}>{myTitle}</Typography>
			<BlankArea />
			{/* Edit medicine name here */}
			<ValidatorForm className={classes.form} onSubmit={handleAddEditSelect}>
			<TextValidator variant="outlined" required fullWidth autoFocus      
				id="newMedicineName" label="New Medicine Name" type="text"
				defaultValue={newMedicineName}        
      />
			<ShowResisterStatus />
			<BlankArea />
			<Button variant="contained" type="submit" color="primary" className={gClasses.submit}>
			{myButton}
			</Button>
			</ValidatorForm>
		</div>
	)}
	
	// button handler to edit medicine (from the table list)
	
	async function handleEditMedicine(name) {
		//console.log("handleEditMedicine", name);
		setNewMedicineName(name);
		setMedicineName(name);		// preserve current name. Will be required to send it to back end
		setRegisterStatus(0);
		openModal("EDIT");
	}

	// button to add new medicine and handler
	async function handleAddMedicine() {
		// console.log("handleAddMedicine", );
		setNewMedicineName("");
		setRegisterStatus(0);
		openModal("ADD");
	}
	
	function DisplayNewMedBtn() {
		return (
			<Typography align="right" className={gClasses.root}>
				<Link href="#" variant="body2" onClick={handleAddMedicine}>Add New Medicine</Link>
			</Typography>
		)
	}
	

	//---------- delete function 
	
	async function handleDeleteMedicine(name) {
		console.log("handleDeleteMedicine", name);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${name}`
			await axios.get(myUrl);
			let myData = medicineArray.filter(x => x.name != name);
			if (myData.length > 0) 
				setMedicineArray(myData);
			else
				await updateMedicineArray("")
		} catch (e) {
			console.log(e);
		}
	}
	
	// Medicine table display
		
	function DisplayMedicines() {
	return (
		<TableContainer> 
		<Table align="center">
		<TableHead>
			<TableRow align="center">
				<TableCell colSpan={3} key="MEDTH1" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>{'Medicines'+((directoryMode) ? ' starting with '+medicineChar : "")}</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
		<TableBody> 
		{medicineArray.map( (m, index) => 
			<TableRow key={"MEDTROW"+index}>
			<TableCell key={"MEDTCOLNAME"+index} align="center" component="td" scope="row" 
				className={classes.td} padding="none">
				<Typography>{m.name}</Typography>
			</TableCell>
			<TableCell key={"MEDTCOLEDIT"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<IconButton color="primary"  size="small" onClick={() => { handleEditMedicine(m.name) } } >
					<EditIcon	 />
				</IconButton>
			</TableCell>
			<TableCell key={"MEDTCOLDEL"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<IconButton color="primary"  size="small" onClick={() => { handleDeleteMedicine(m.name) } } >
					<DeleteIcon	 />
				</IconButton>
			</TableCell>
			</TableRow>	
		)}
		</TableBody>
		</Table>
		</TableContainer>		
	)}
	
	// function for filter based
	
	function DisplayFilter() {
	return (	
		<Grid className={classes.noPadding} key="Filter" container justify="center" alignItems="center" >
			<Grid item xs={2} sm={2} md={2} lg={2} />
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<TextField id="filter"  padding={5} variant="outlined" fullWidth label="Medicine Filter" 
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
		await updateMedicinebyFilter(searchText);
	}
	
	async function updateMedicinebyFilter(filter) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/filter/${filter}`)
			//console.log(resp.data);
			setMedicineArray(resp.data);
		} catch (e) {
			console.log("Filter error");
			setMedicineArray([]);
		}
	}
	
	// base function to select between Directory mode and Filer mode
	// As per use selection display will be shown
	
	async function initFilterModeData() {
		setSearchText("");
		setMedicineArray([]);
	}
	
	async function initDirectoryModeData() {
		//console.log("in init dir mdoe");
		await updateMedicineArray();
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
			<Grid item xs={1} sm={1} md={1} lg={1} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography padding="none" className={classes.switchText}>Medicine filter</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<FormControlLabel
				className={classes.radio}
				control={<SwitchBtn checked={directoryMode} onChange={toggleDirectoryMode} color="primary"/>}
        label=""
				/>
			</Grid>
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography padding="none" className={classes.switchText}>Medicine Directory</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} />
		</Grid>
	)}
	
	function DirectoryMode() {
	return (
		<div>
			<DisplayAlphabetButtons />
			<BlankArea />
			<DisplayNewMedBtn />
			<DisplayMedicines />
		</div>
	)}
	
	function FilterMode() {
	return (
		<div>
			<DisplayFilter />
			<BlankArea />
			<DisplayNewMedBtn />
			<DisplayMedicines />
		</div>
	)}
	
  return (
  <div className={classes.paper} align="center" key="main">
		{/*<DisplayPageHeader headerName="Medicine Directory" groupName="" tournament=""/>*/}
		<Container component="main" maxWidth="xs">
		<CssBaseline />
		<DisplaySelectionMode />
		{(directoryMode) && <DirectoryMode />}
		{(!directoryMode) && <FilterMode />}
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
			<DisplayAddEditMedicine />
		</Modal>	
		</Container>
  </div>
  );    
}

