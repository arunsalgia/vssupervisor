import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';

import axios from "axios";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';
import Box from '@material-ui/core/Box';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import Drawer from '@material-ui/core/Drawer';

//import  from '@material-ui/core/Container';
//import  from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import { useAlert } from 'react-alert';
import "react-datetime/css/react-datetime.css";
// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import MinusIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';

import lodashSumBy from 'lodash/sumBy';
import lodashSortBy from 'lodash/sortBy';
//import SearchIcon from '@material-ui/icons/Search';
//import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
//import EventNoteIcon from '@material-ui/icons/EventNote';
//import NoteAddIcon from '@material-ui/icons/NoteAdd';

/*
import GridItem from "components/Grid/GridItem.js";
import Avatar from "@material-ui/core/Avatar"
import { useHistory } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import Datetime from "react-datetime";
import moment from "moment";
import VisibilityIcon from '@material-ui/icons/Visibility';

*/

import {
WEEKSTR, MONTHSTR, SHORTMONTHSTR, DATESTR, MONTHNUMBERSTR,
} from 'views/globals';

// import { UserContext } from "../../UserContext";
import { isMobile, encrypt,
	validateInteger,
	vsDialog,
	disableFutureDt,
 } from "views/functions.js"
import {DisplayPageHeader, BlankArea,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

// icons
//import DeleteIcon from '@material-ui/icons/Delete';
//import CloseIcon from '@material-ui/icons/Close';
//import CancelIcon from '@material-ui/icons/Cancel';
//import ClearSharpIcon from '@material-ui/icons/ClearSharp';


const drawerWidth=800;
const AVATARHEIGHT=4;

/*


import {red, blue, yellow, orange, green, pink } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

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
*/



//let searchText = "";
//function setSearchText(sss) { searchText = sss;}

var userCid;
var customerData;

export default function Inventory() {
	//const history = useHistory();	
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

//	const [searchText, setSearchText] = useState("");
	
	const [registerStatus, setRegisterStatus] = useState("");
	
	const [currentSelection, setCurrentSelection] = useState("Items");
	const [inventoryItems, setInventoryItems] = useState([]);
	const [inventorySummary, setInventorySummary] = useState([]);
	const [inventoryTransactions, setInventoryTransactions ] = useState([])
	const [emurData1, setEmurData1] = useState("");
	const [emurData2, setEmurData2] = useState("");
	const [emurBalance, setEmurBalance] = useState("");
	const [emurInventory, setEmurInventory] = useState(0);

	// 

	const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    //console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
	


  //const [page, setPage] = useState(0);
	
	
  useEffect(() => {
		const us = async () => {
		}
		userCid = sessionStorage.getItem("cid");
		//us();
		getInventoryItems();
		//getInventorySummary();
		getInventoryTransactions();
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
	
	async function getInventorySummary() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/inventorysummary/${userCid}`;
			let resp = await axios.get(myUrl);
			setInventorySummary(resp.data);
		} catch (e) {
			console.log(e);
			alert.error("Error fetching Inventory Summary");
			setInventorySummary([]);
		}		
	}

		
	async function getInventoryTransactions() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/listallinventory/${userCid}`;
			let resp = await axios.get(myUrl);
			setInventoryTransactions(resp.data);
		} catch (e) {
			console.log(e);
			alert.error("Error fetching Inventory transactions");
			setInventoryTransactions([]);
		}		
	}



	function DisplayInventoryTransactionDetails(props) {
	return (
	<Table>
	<TableBody>
	{props.list.map( (i, index) => {
		let d = new Date(i.date);
		let dateStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
	return (
	<TableRow align="Center" key={"DATA"+index} className={gClasses.selectedAccordian} >
	<TableCell >
		<Typography className={gClasses.patientInfo2}>{dateStr}</Typography>
	</TableCell>	
	<TableCell >
	<Typography className={gClasses.patientInfo2}>{(i.quantity > 0) ? "Add" : "Withdraw"}</Typography>
	</TableCell>
	<TableCell >
	<Typography className={gClasses.patientInfo2}>{(i.quantity > 0) ? i.quantity : ""}</Typography>
	</TableCell>
	<TableCell >
	<Typography className={gClasses.patientInfo2}>{(i.quantity < 0) ? -i.quantity : ""}</Typography>
	</TableCell>
	<TableCell >
		<EditIcon color="primary" size="small" onClick={() => { handleEditItem(i)}} />
		<CancelIcon color="secondary" size="small" onClick={() => { handleDeleteTransaction(i)}} />
	</TableCell>
	</TableRow>
	)}
	)}
</TableBody>
</Table>
	)}

	function DisplayInventorySummary() {
	return (
		<div>
			<Container component="main" maxWidth="md">
			<VsButton name="Add new Inventory Item" align="right" onClick={handleAddItem} />
			<br />
			{inventoryItems.map((i, index) => {
				let myTransactions = inventoryTransactions.filter(x => x.inventoryNumber === i.id);
				let balance = lodashSumBy(myTransactions, 'quantity');
			return (
			<Accordion key={"AC"+i.name} expanded={expandedPanel === i.name} onChange={handleAccordionChange(i.name)}>
          <AccordionSummary className={(expandedPanel === i.name) ? gClasses.selectedAccordian : gClasses.normalAccordian} key={"AS"+i.name} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Grid className={gClasses.noPadding} container align="center">
					<Grid key={"ITEM1"+index} item xs={4} sm={4} md={4} lg={4} >
						<Typography className={gClasses.patientInfo2Blue}>{i.name}</Typography>
					</Grid>	
					<Grid key={"ITEM2"+index} item xs={4} sm={4} md={4} lg={4} >
						<Typography className={gClasses.patientInfo2}>{"Balance: " + balance }</Typography>
					</Grid>	
					<Grid key={"ITEM3"+index} item xs={false} sm={false} md={2} lg={2} />
					<Grid key={"ITEM4"+index} item xs={4} sm={4} md={2} lg={2} >
						<EditIcon color="primary" size="small" onClick={() => { handleEditItem(i)}} />
						<CancelIcon color="secondary" size="small" onClick={() => { handleDeleteItem(i)}} />
						<AddIcon color="primary" size="small" onClick={() => { handleAddToInventory(i, balance)}} />
						<MinusIcon color="primary" size="small" onClick={() => { handleSubFromInventory(i, balance)}} />
					</Grid>	
					</Grid>
          </AccordionSummary>
          <AccordionDetails>
            <DisplayInventoryTransactionDetails list={myTransactions} />
          </AccordionDetails>
      </Accordion>
			)}
			)}
		</Container>
		</div>
	)}

	function handleAddToInventory(item, balance) {
		//console.log(item);
		setEmurData1(item.name);
		setEmurData2(1);
		setEmurBalance(10000000);
		setEmurInventory(item.id);
		setIsDrawerOpened("ADDINVENTORY");
	}

	function handleSubFromInventory(item, balance) {
		//console.log(item);
		if (balance == 0) return alert.error(`No inventory found for ${item.name}`);
		setEmurData1(item.name);
		setEmurData2(1);
		setEmurBalance(balance);
		setEmurInventory(item.id);
		setIsDrawerOpened("SUBINVENTORY");
	}


	async function handleAddSubFromInventory() {
		console.log(emurInventory);
		try {
			let myCmd = (isDrawerOpened === "ADDINVENTORY") ? "addinventory" : "subinventory";
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/${myCmd}/${userCid}/${emurInventory}/${emurData2}`;
			console.log(myUrl);
			let resp = await axios.get(myUrl);
			setInventoryTransactions([resp.data].concat(inventoryTransactions));
		} catch (e) {
			console.log(e);
			alert.error("Error adding new Inventory transaction");
		}
		setIsDrawerOpened("");
	}

	function handleAddItem() {
		setEmurData1("");
		setIsDrawerOpened("ADDITEM");
	}
	
	function handleEditItem(item) {
		setEmurData1(item.name);
		setEmurData2(item.name);
		setIsDrawerOpened("EDITITEM");
	}
	
	async function handleAddEditSubmit() {
		if (isDrawerOpened == "ADDITEM") {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/add/${userCid}/${emurData1}`;
				let resp = await axios.get(myUrl);
				let tmpArray = [resp.data].concat(inventoryItems);
				setInventoryItems(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
				alert.error("Error adding new Inventory Item");
			}
		} else {
			//console.log(emurData1, emurData2);
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/edit/${userCid}/${emurData2}/${emurData1}`;
				let resp = await axios.get(myUrl);
				let tmpArray = [resp.data].concat(inventoryItems.filter(x => x.name !== emurData2));
				setInventoryItems(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
				alert.error("Error editing Inventory Item");
			}
		}
		setIsDrawerOpened("");
	}
	
	function handleDeleteItem(item) {
		vsDialog("Delete Inventory Item", `Are you sure you want to delete Inventory Item ${item.name}?`,
		{label: "Yes", onClick: () => handleDeleteItemConfirm(item) },
		{label: "No" });
	}
	
	async function handleDeleteItemConfirm(item) {
		//alert.info(`Confirmed to delete ${item.name}`);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/delete/${userCid}/${item.name}`;
			let resp = await axios.get(myUrl);
			setInventoryItems(inventoryItems.filter(x => x.name !== item.name));
			setInventoryTransactions(inventoryTransactions.filter(x => x.inventoryNumber !== item.id));
		} catch (e) {
			console.log(e);
			alert.error("Error deleting Inventory Item");
		}
	}

	function handleDeleteTransaction(t) {
		// first check if banace goes below zero
		let newBalance = lodashSumBy(inventoryTransactions.filter(x => x.inventoryNumber === t.inventoryNumber), 'quantity') - t.quantity;
		if (newBalance < 0) {
			return alert.show("Cannot delete transaction. Balance goes below 0");
		}
		vsDialog("Delete Transaction", `Are you sure, you want to delete transaction of ${t.quantity} `,
		{label: "Yes", onClick: () => handleDeleteTransactionConfirm(t) },
		{label: "No" });
		
	}

	async function handleDeleteTransactionConfirm(t) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/delinventory/${userCid}/${t.inventoryNumber}/${t.id}`;
			await axios.get(myUrl);
			setInventoryTransactions(inventoryTransactions.filter(x => x.inventoryNumber !== t.inventoryNumber || x.id !== t.id));
		} catch (e) {
			console.log(e);
			alert.error("Error deleting Inventory transaction");
		}	
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
		<br />
		<DisplayPageHeader headerName="Inventory" groupName="" tournament=""/>
		<br />
		<CssBaseline />
		{(sessionStorage.getItem("userType") === "Assistant") &&
			<Typography className={gClasses.indexSelection} >
				{"Only Doctors are permitted to Add / View / Edit Inventory"}
			</Typography>
		}
		{(sessionStorage.getItem("userType") !== "Assistant") &&
			<div align="center" key="main">
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<DisplayInventorySummary />
			</Box>
			</div>
		}
		<Drawer className={gClasses.drawer} anchor="right" variant="temporary" open={isDrawerOpened} >
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened(false)}} /> 
		{((isDrawerOpened === "ADDITEM") || (isDrawerOpened === "EDITITEM")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{(isDrawerOpened === "ADDITEM")  ? "Add new Inventory Item" : "Edit Inventory Item "}</Typography>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Inventory Item Name" type="text"
				value={emurData1} 
				onChange={(event) => { setEmurData1(event.target.value) }}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton type="submit" name={(isDrawerOpened === "ADDITEM") ? "Add Inventory Item" : "Update Inventory Item"} />
			</ValidatorForm>    						
		}
		{((isDrawerOpened === "ADDINVENTORY") || (isDrawerOpened === "SUBINVENTORY")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddSubFromInventory}>
			<Typography className={gClasses.title}>{(isDrawerOpened === "ADDINVENTORY")  ? `Add to Inventry of ${emurData1}` : `Withdraw from Inventry of ${emurData1}`}</Typography>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Inventory Quantity" type="number"
				value={emurData2} 
				onChange={(event) => { setEmurData2(Number(event.target.value)) }}
				validators={['minNumber:1', `maxNumber:${emurBalance}`]}
				errorMessages={['Invalid Amount', 'Invalid Amount']}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton type="submit" name={(isDrawerOpened === "ADDINVENTORY") ? "Add" : "Withdraw"} />
			</ValidatorForm>    						
		}
		</Box>
		</Drawer>
  </div>
  );    
}

