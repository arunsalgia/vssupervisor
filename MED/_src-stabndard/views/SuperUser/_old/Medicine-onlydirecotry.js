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

export default function Medicine() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() { }
	
	const [buttonRow, setButtonRow] = useState(0);
	const [buttonArray, setButtonArray] = useState([]);
	const [medicineChar, setMedicineChar] = useState("");
	const [medicineArray, setMedicineArray] = useState([]);
	const [addOrEdit, setAddOrEdit] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	
	const [old, setOld] = useState(true);
	
	// for old medicine
	const [searchText,setSearchText] = useState("")
  
	const [currentMedicine, setCurrentMedicine] = useState("");
	
	// for new medicine to be added
	// or medicine to be modified
	const	[medicineName, setMedicineName] = useState("");
	const [medicineDescription, setMedicineDescription] = useState("");
	const [medicinePrecaution, setMedicinePrecaution] = useState("");
	
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
				await getMedicineCount();	
      }
      us();
  }, [])


  async function getMedicineCount() {
		let myData = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/count`)
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
        myMsg = `Successfully added/renamed ${medicineName}`;
        break;
      case 601:
        myMsg = `Error in add/edit ${medicineName}`;
        break;
      case 602:
        myMsg = "Patient Id Invalid / Blank";
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

	async function getMedicineList(filter) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/list/${filter}`)
			//console.log(resp.data);
			setMedicineArray(resp.data);
		} catch (e) {
			console.log("Filter error");
			setMedicineArray([]);
		}
	}
	
	async function selectFilter() {
		//console.log("Filter:", searchText);
		getMedicineList(searchText);
		setCurrentMedicine("");
	}

	async function handleNewSubmit() {
		//console.log("In new submit");
		console.log("Name:", medicineName);
		console.log("Desc:", medicineDescription);
		console.log("pre:", medicinePrecaution);
		axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${medicineName}/${medicineDescription}/${medicinePrecaution}`)
		.then((response) =>{
			//console.log(response.data);
			//let tmp = [].concat(medicineArray);
			//tmp.push(response.data);
			//setMedicineArray(tmp);
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
				setMedicineName("");
				setMedicineDescription("");
				setMedicinePrecaution("");
				setRegisterStatus(0);
				setOld(false);
		} else {
				setCurrentMedicine("");
				getMedicineList("");
				setRegisterStatus(0);
				setOld(true);
		}
	}
	
	async function handleDelete() {
		//console.log("dlete");
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${currentMedicine}`)
			var newList = medicineArray.filter(x => x.name !== currentMedicine);
			console.log(newList);
			setMedicineArray(newList);
		} catch (e) {
			console.log("Delete error");
		}
		setCurrentMedicine("");
	}
	
	function selectMedicine(medName) {
		setCurrentMedicine(medName);
		var myMed = medicineArray.find( x => x.name == medName);
		//console.log(myMed);
		setMedicineName(myMed.name);
		setMedicineDescription(myMed.description);
		setMedicinePrecaution(myMed.precaution);
		setEdit(false);
	}
	
	async function handleEdit() {
		//console.log("Edit button");
		if (edit) {
			// Update given by user
			try {
				var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/update/${medicineName}/${medicineDescription}/${medicinePrecaution}`);
				//console.log(resp.data);
				let tmp = medicineArray.find(x => x.name == medicineName);
				tmp.description = medicineDescription;
				tmp.precaution = medicinePrecaution;
			} catch (e) {
				console.log("Update error");
				//setMedicineArray([]);
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
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/alphabetlist/${ccc}`
			var resp = await axios.get(myUrl);
			myMed = resp.data;
		} catch (e) {
			console.log(e);
		}
		setMedicineArray(myMed);
		setMedicineChar(ccc);
	}
	
	function DisplayMedicines() {
	return (
		<TableContainer> 
		<Table align="center">
		<TableHead>
			<TableRow align="center">
				<TableCell colSpan={3} key="MEDTH1" align="center" component="th" scope="row" 
					className={classes.th} padding="none">
					<Typography className={classes.header}>{'List of medicines'}</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
		<TableBody> 
		{medicineArray.map( (m, index) => 
			<TableRow key={"MEDTROW"+index}>
			<TableCell key={"MEDTCOLNAME"+index} align="center" component="td" scope="row" 
				className={classes.td} padding="none">
				<Typography>{m._id}</Typography>
			</TableCell>
			<TableCell key={"MEDTCOLEDIT"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<IconButton color="primary"  size="small" onClick={() => { handleEditMedicine(m._id) } } >
					<EditIcon	 />
				</IconButton>
			</TableCell>
			<TableCell key={"MEDTCOLDEL"+index} component="td" scope="row" align="center" 
				className={classes.td} padding="none">
				<IconButton color="primary"  size="small" onClick={() => { handleDeleteMedicine(m._id) } } >
					<DeleteIcon	 />
				</IconButton>
			</TableCell>
			</TableRow>	
		)}
		</TableBody>
		</Table>
		</TableContainer>		
	)}
	
	async function handleEditMedicine(name) {
		console.log("handleEditMedicine", name);
		setAddOrEdit("Edit");
		setMedicineName(name);
		openModal("ADDEDIT");
	}
	
	async function handleAddMedicine() {
		console.log("handleAddMedicine", name);
		setAddOrEdit("Add");
		setMedicineName("");
		openModal("ADDEDIT");
	}
	
	async function handleDeleteMedicine(name) {
		console.log("handleDeleteMedicine", name);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${name}`
			await axios.get(myUrl);
			let myData = medicineArray.filter(x => x._id != name);
			setMedicineArray(myData);
			await getMedicineCount();
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
		setRegisterStatus(0);
		console.log("handleAddEditSelect");
		let myName = document.getElementById("medicineName").value;
		console.log(myName);
		if (myName != medicineName) {
			try {
				let myUrl = (addOrEdit == "Add") ?
					`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${myName}/${myName}/${myName}` :
					`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/edit/{medicineName}/${myName}/${myName}/${myName}`;
					
				await axios.get(myUrl);
				let myData = medicineArray.filter(x => x._id != medicineName);
				if (myName.substr(0,1) === medicineChar) {
					myData.push({_id: myName});
				}
				myData.sort((a, b) => { return a.order - b.order;});
				setMedicineArray(myData);
				setRegisterStatus(0);
				closeModal();
				getMedicineCount();
			} catch (e) {
				console.log(e);
				setRegisterStatus(601);
			}
		} else
			closeModal();
	}
	
	function DisplayAddEditMedicine() {
	return(
		<div align="center">
			<DisplayCloseModal />
			<Typography className={classes.header}>
			{addOrEdit+" Medicine "}
			</Typography>
			<BlankArea />
			{(addOrEdit != "Add") && 
				<div>
				<Typography className={classes.header}>{"Name: "+medicineName}</Typography>
				<BlankArea />
				</div>
			}
			{/* Edit medicine name here */}
			<ValidatorForm className={classes.form} onSubmit={handleAddEditSelect}>
			<TextValidator variant="outlined" required fullWidth autoFocus      
				id="medicineName" label="Medicine Name" type="text"
				defaultValue={medicineName}        
      />
			<ShowResisterStatus />
			<BlankArea />
			<Button variant="contained" type="submit" color="primary" className={gClasses.submit}>
			{(addOrEdit == "Add") ? "Add" : "Update"}
			</Button>
			</ValidatorForm>
			<ValidComp/>    
		</div>
	)}
	
	function DisplayNewMedBtn() {
		return (
			<Typography align="right" className={gClasses.root}>
				<Link href="#" variant="body2" onClick={handleAddMedicine}>Add New Medicine</Link>
			</Typography>
		)
	}
	
  return (
  <div className={classes.paper} align="center" key="groupinfo">
		<DisplayPageHeader headerName="Medicine Directory" groupName="" tournament=""/>
		<Container component="main" maxWidth="xs">
		<CssBaseline />
		<DisplayAlphabetButtons />
		<BlankArea />
		<DisplayNewMedBtn />
		<DisplayMedicines />
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
			<DisplayAddEditMedicine />
		</Modal>	
  </div>
  );    
}

