import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';

import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';
import Box from '@material-ui/core/Box';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsTextSearch from "CustomComponents/VsTextSearch";

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import Drawer from '@material-ui/core/Drawer';
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
import { useAlert } from 'react-alert';
import Divider from '@material-ui/core/Divider';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
// icons
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
//import SearchIcon from '@material-ui/icons/Search';
//import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
//import EventNoteIcon from '@material-ui/icons/EventNote';
//import NoteAddIcon from '@material-ui/icons/NoteAdd';



import Report from 'views/Report/Report';
import Visit  from 'views/Visit/Visit';
import Investigation from 'views/Investigation/Investigation';
import DentalTreatment from  'views/Treatment/DentalTreatment';
import ProfCharge from 'views/ProfCharge/ProfCharge';
import {
WEEKSTR, MONTHSTR, SHORTMONTHSTR, DATESTR, MONTHNUMBERSTR,
} from 'views/globals';

// import { UserContext } from "../../UserContext";
import { isMobile, encrypt,
	dispOnlyAge, dispAge, dispEmail, dispMobile, checkIfBirthday,
	validateInteger,
	getAllPatients,
	vsDialog,
	disableFutureDt,
 } from "views/functions.js"
import {DisplayPageHeader, BlankArea, DisplayPatientBox,
	DisplayPatientHeader,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

// icons
//import DeleteIcon from '@material-ui/icons/Delete';
//import CloseIcon from '@material-ui/icons/Close';
//import CancelIcon from '@material-ui/icons/Cancel';
//import ClearSharpIcon from '@material-ui/icons/ClearSharp';

import {red, blue, yellow, orange, green, pink } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

const drawerWidth=800;
const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
	dateTime: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		backgroundColor: pink[100],
		align: 'center',
		width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		width: '40%'
	},
	drawer: {
		width: '40%',
		flexShrink: 0
		//backgroundColor: "rgba(0,0,0,0.6)" Don't target here
	},
	boxStyle: {padding: "5px 10px", margin: "4px 2px", backgroundColor: blue[300] },
	radio: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: "blue",
	},
    root: {
      width: '100%',
    }, 
		link: {
			backgroundColor: 'transparent',
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

const ROWSPERPAGE=10;
const BOTTONCOL=13;

const NUMBERINT=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const GENDERARRAY=["Male", "Female", "Other"];

const addEditModal = (isMobile()) ? dynamicModal('90%') : dynamicModal('40%');
const yesNoModal = dynamicModal('60%');


//let searchText = "";
//function setSearchText(sss) { searchText = sss;}

var userCid;
var customerData;

export default function Inventory() {
	//const history = useHistory();	
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [searchText, setSearchText] = useState("");
	
	const [registerStatus, setRegisterStatus] = useState("");
	
	const [currentSelection, setCurrentSelection] = useState("Items");
	const [inventoryItems, setInventoryItems] = useState([]);

	const [emurData1, setEmurData1] = useState("");
	const [emurData2, setEmurData2] = useState("");
	// 

	const [isDrawerOpened, setIsDrawerOpened] = useState(false);

	


  const [page, setPage] = useState(0);
	
	
  useEffect(() => {
		const us = async () => {
		}
		userCid = sessionStorage.getItem("cid");
		//us();
		getInventoryItems();
  }, [])

	async function getInventoryItems() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/list/${userCid}`;
			let resp = await axios.get(myUrl);
			setInventoryItems(resp.data);
		} catch (e) {
			console.log(e);
			alert.error("Error fetching Inventory Items");
			setInventoryItems([]);
		}		
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
		setCurrentSelection(item);
	}
	
	function DisplayFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Items" />
		<DisplayFunctionItem item="Summary" />
	</Grid>	
	</Box>
	)}

	function DisplaySingleItem(props) {
	return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<div align="center">
			<Typography className={gClasses.patientName}>{props.item.name}</Typography>
			</div>
			<div align = "right">
			<EditIcon color="primary" size="small" onClick={() => { handleEditItem(props.item.name)}} />
			<CancelIcon color="secondary" size="small" onClick={() => { handleDeleteItem(props.item.name)}} />
			</div>
		</Box>	
	)}
	
	function DisplayInventoryItems() {
	return (
	<div>
	<VsButton name="Add new Inventory Item" align="right" onClick={handleAddItem} />
	<Grid className={gClasses.noPadding} key="AllItems" container alignItems="center" >
	{inventoryItems.map( (i, index) => 
		<Grid key={"ITEM1"+index} item xs={6} sm={4} md={2} lg={2} >
			<DisplaySingleItem item={i} />
		</Grid>
	)}
	</Grid>	
	</div>
	)}
	

	function DisplayInventorySummary() {
	return (
		<Typography>Summary</Typography>
	)}

	function handleAddItem() {
		setEmurData1("");
		setIsDrawerOpened("ADDITEM");
	}
	
	function handleEditItem(item) {
		setEmurData1(item.name);
		setEmurData2(item.Name);
		setIsDrawerOpened("EDITITEM");
	}
	
	function handleAddEditSubmit() {
		alert("Item is "+emurData1);
	}
	
	function handleDeleteItem() {
		
	}
	

	function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 621:
        myMsg = "Invalid patient age";
        break;
			case 1001:
        myMsg = "Invalid date of birth";
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


	







	
	

	
	function handleDate(d) {
		//console.log(d);
		setPatientDob(d);
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Inventory" groupName="" tournament=""/>
		<CssBaseline />
		{(sessionStorage.getItem("userType") === "Assistant") &&
			<Typography className={gClasses.indexSelection} >
				{"Only Doctors are permitted to Add / View / Edit Inventory"}
			</Typography>
		}
		{(sessionStorage.getItem("userType") !== "Assistant") &&
			<div align="center" key="main">
			<DisplayFunctionHeader />
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			{(currentSelection === "Items") &&
				<DisplayInventoryItems />
			}
			{(currentSelection === "Summary") &&
				<DisplayInventorySummary />
			}
			</Box>
			</div>
		}
		<Drawer anchor="right" variant="temporary" open={isDrawerOpened} >
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened(false)}} /> 
		{((isDrawerOpened === "ADDITEM") || (isDrawerOpened === "EDITITEM")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{(isDrawerOpened === "ADDITEM")  ? "Add Item" : "Edit Item"}</Typography>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Name" type="text"
				value={emurData1} 
				onChange={() => { setEmurData1(event.target.value) }}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton type="submit" name={(isDrawerOpened === "ADDITEM") ? "Add" : "Update"} />
			</ValidatorForm>    						
		}
		</Box>
		</Drawer>
  </div>
  );    
}

