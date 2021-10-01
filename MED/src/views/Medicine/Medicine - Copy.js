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
import VsCancel from "CustomComponents/VsCancel";

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
//import CancelIcon from '@material-ui/icons/Cancel';

import {red, blue, yellow, orange } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
// import {setTab} from "CustomComponents/CricDreamTabs.js"

const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    }, 
		medicineName: {
			fontSize: theme.typography.pxToRem(16),
			fontWeight: theme.typography.fontWeightBold,	
			color: 'blue',
		},
		medicineInfo: {
			fontSize: theme.typography.pxToRem(14),
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

const ROWSPERPAGE=10;
const BOTTONCOL=13;

const ALPHABETSTR = [
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z"
];

const NUMBERINT=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const addEditModal = dynamicModal('60%');

let searchText = "";
function setSearchText(sss) { searchText = sss;}


var userCid; 

export default function Medicine() {
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [newMedicine, setNewMedicine] = useState(false);
	const [addEdit, setAddEdit] = useState("ADD");
	
	const [medicineArray, setMedicineArray] = useState([]);
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [oldMedicineName, setOldMedicineName] = useState("");
	const	[medicineName, setMedicineName] = useState("");
	const [medicineDesc, setMedicineDesc] = useState("");
	const [medicinePrecaution, setMedicinePrecaution] = useState("");
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() { }
	
	
	
	const [rowsPerPage, setRowsPerPage] = useState(ROWSPERPAGE);
  const [page, setPage] = useState(0);
	

  useEffect(() => {
      const us = async () => {
		
      }
			userCid = sessionStorage.getItem("cid");
			us();
  }, [])


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

	function DisplayCloseModal() {
	return ( 
		<VsCancel align="right" onClick={closeModal} />
	)}
	
	async function handleAddEditSelect() {
		console.log(medicineName, medicineDesc, medicinePrecaution);
		
		let myUrl;
		let resp;
		
		if (addEdit === "ADD") {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${userCid}/${medicineName}/${medicineDesc}/${medicinePrecaution}`;
				await axios.get(myUrl);
				// now successfully added. come out of if then 
				let newMed = {name: medicineName, description: medicineDesc, precaution: medicinePrecaution};
			} catch (e) {
				console.log(e);
				setRegisterStatus(e.response.status);
				return;
				// do not close the modal
			}
		} else {
			try {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/edit/${userCid}/${oldMedicineName}/${medicineName}/${medicineDesc}/${medicinePrecaution}`;
				await axios.get(myUrl);
				// now successfully updated. come out of if then 
			} catch (e) {
				console.log(e);
				setRegisterStatus(e.response.status);
				return;
				// do not close the modal
			}
		}
		
		setNewMedicine(false);
		updateMedicineByFilter(searchText);
	}
	

	
//================

	function DisplayFilter() {
	return (	
		<Grid className={classes.noPadding} key="Filter" container justify="center" alignItems="center" >
			<Grid item xs={3} sm={3} md={3} lg={3} />
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<TextField id="filter"  padding={5} variant="outlined" fullWidth label="Medicine Name" 
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
		await updateMedicineByFilter(searchText);
	}
	
	async function updateMedicineByFilter(filter) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/filter/${userCid}/${filter}`)
			//console.log(resp.data);
			setMedicineArray(resp.data);
		} catch (e) {
			console.log("Filter error");
			setMedicineArray([]);
		}
	}
	
	function DisplayNewMedicineBtn() {
	return (
		<Typography align="right" className={classes.link}>
			<Link href="#" variant="body2" onClick={handleAdd}>Add New Medicine</Link>
		</Typography>
	)}
	
	function handleAdd() {
		//console.log("handleAdd");
		setMedicineName("");

		setRegisterStatus(0);
		setAddEdit("ADD");
		setNewMedicine(true);
	}
	
	function handleEdit(rec) {
		setOldMedicineName(rec.name);
		setMedicineName(rec.name);		
		setMedicineDesc(rec.description);
		setMedicinePrecaution(rec.precaution);

		
		setRegisterStatus(0);
		setAddEdit("EDIT");
		setNewMedicine(true);
	}

	async function handleCancel(rec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${userCid}/${rec.name}`;
			await axios.get(myUrl);
			let tmpArray = [].concat(medicineArray);
			tmpArray = tmpArray.filter(x => x.name !== rec.name);
			setMedicineArray(tmpArray);
		} catch(e) {
			console.log(e);
		}
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplayPageHeader headerName="Medicines" groupName="" tournament=""/>
		<BlankArea />
		<DisplayFilter />
		<BlankArea />
		{(!newMedicine) && <DisplayNewMedicineBtn />}
		{(newMedicine) &&
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<VsCancel align="right" onClick={() => {setNewMedicine(false)}} />
			<Typography className={classes.header}>{(addEdit == "ADD") ? "Add New Medicine" : "Edit Medicine"}</Typography>
			<BlankArea />
			<ValidatorForm className={classes.form} onSubmit={handleAddEditSelect}>
			<Grid spacing={4} key="AddEdit" container justify="center" alignItems="center" >
			<Grid item xs={12} sm={12} md={3} lg={3} >
			<TextValidator variant="outlined" required fullWidth      
				id="newMedicineName" label="Name" type="text"
				value={medicineName}
				onChange={() => {setMedicineName(event.target.value); }}
      />
			</Grid>
			<Grid item xs={12} sm={12} md={3} lg={3} >
			<TextValidator variant="outlined" fullWidth       
				id="newMedicineDesc" label="Description" 
				value={medicineDesc}
				onChange={() => { setMedicineDesc(event.target.value) }}
      />
			</Grid>
			<Grid item xs={12} sm={12} md={3} lg={3} >
			<TextValidator variant="outlined" fullWidth       
				id="newMedicineDesc" label="Precaution" 
				value={medicinePrecaution}
				onChange={() => { setMedicinePrecaution(event.target.value) }}
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
		<Grid className={classes.noPadding} key="AllPatients" container alignItems="center" >
		{medicineArray.map( (m, index) => 
		<Grid key={"MED"+index} item xs={12} sm={12} md={3} lg={3} >
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<div align="left" >
			<Typography>
			<span className={classes.medicineName}>{m.name}</span>
			</Typography>
			<Typography className={classes.medicineInfo}> 
				{"Description: " + m.description}
			</Typography>
			<Typography className={classes.medicineInfo}> 
				{"Precaution : "+m.precaution}
			</Typography>
			<BlankArea />
			<VsButton key={"EDIT"+index} name="Edit" onClick={() => { handleEdit(m)}} />
			<VsButton key={"CAN"+index} name="Del" color='red' onClick={() => { handleCancel(m)}} />
			</div>
			</Box>
		</Grid>
		)}
		</Grid>
		</Container>
  </div>
  );    
}

