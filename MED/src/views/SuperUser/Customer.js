import React, {useEffect, useState, createContext }  from 'react';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import lodashSortBy from "lodash/sortBy"
import { useAlert } from 'react-alert';

import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
 import VsCancel from "CustomComponents/VsCancel";
 import VsButton from "CustomComponents/VsButton";
 
import {setTab} from "CustomComponents/CricDreamTabs.js"

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Avatar from "@material-ui/core/Avatar"
//import validator from 'validator'

// styles
import globalStyles from "assets/globalStyles";

import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
DisplayPatientDetails,
} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';


//colors 
import { 
red, blue, yellow, orange, pink, green, brown, deepOrange, lightGreen,
} from '@material-ui/core/colors';

import { 
	isMobile, dispEmail,
	getOnlyDate,
	vsDialog,
} from "views/functions.js";
import { disablePastDt } from 'views/functions';
import { encrypt } from 'views/functions';


const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	}, 
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
	}, 
	info: {
			color: blue[700],
	}, 
	filterRadio: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
			color: '#000000',	
	},
	switchText: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	}, 
		orange: {
			backgroundColor: orange[300],
			color: '#000000',
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
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		accordianSummary: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			//backgroundColor: pink[100],
		},
		zeroAppt: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		normalAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		selectedAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: yellow[100],
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: "none", 
		},
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[700]
	},  
	newAppt: {
		backgroundColor: pink[100],
	},
	allAppt: {
		backgroundColor: blue[100],
	},
	select: {
		padding: "none", 
		backgroundColor: '#B3E5FC',
		margin: "none",
	},
	table: {
    //minWidth: 750,
  },
  td : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdPending : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdCancel : {
		backgroundColor: pink[100],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdVisit : {
		backgroundColor: lightGreen[300],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	th: { 
		border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA726',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	wd: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#E0E0E0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	we: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#F8BBD0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	today: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: green[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	noday: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	ho: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: yellow[400],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
}));


export default function Customer() {
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [isDrawerOpened, setIsDrawerOpened] = useState("");

	const [custNUmber, setCustNumber] = useState(0);
	const [referalCode, setReferalCode] = useState("");
	const [doctorName, setDoctorName] = useState("");
	const [doctorType, setDoctorType] = useState("");
	const [clinicName, setClinicName]  = useState("");
  const [custName, setCustName] = useState("");
	const [custEmail, setCustEmail] = useState("");
	const [custMobile, setCustMobile] = useState(0);
	const [custAddr1, setCustAddr1] = useState("");
	const [custAddr2, setCustAddr2] = useState("");
	const [custAddr3, setCustAddr3] = useState("");
	const [custLocation, setCustLocation] = useState("");
	const [custPinCode, setCustPinCode] = useState(0);
	const [custExpiry, setCustExpiry] = useState(new Date());
	const [custCommission, setCustCommission] = useState(10);

	const [custFee, setCustFee] = useState(1000);
	const [registerStatus, setRegisterStatus] = useState(0);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");


	
	const [custOption, setCustOption] = useState("");

	
	const [customerArray, setCustomerArray] = useState([]);
	const [customerData, setCustomerData] = useState({});
	const [newRecharge, setNewRecharge] = useState(false);
	const [newCustomer, setNewCustomer] = useState(false);
	const [radioRecharge, setRadioRecharge] = useState("MONTHLY");

	const [currentSelection, setCurrentSelection] = useState("");
	
	const [radioUserType, setRadioUserType] = useState("Doctor");
	const [radioCustomerPlan, setRadioCustomerPlan] = useState("MONTHLY");

	const [emurData, setEmurData] = useState({});
	const [emurName, setEmurName] = useState("");

	const [doctorTypeArray, setDoctorTypeArray] = useState([]);
	const [addOnTypeArray, setAddOnTypeArray] = useState([]);
	
  useEffect(() => {	
		const getAllCustomers = async () => {		
			try {
				let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/customer/list`;
				let resp = await axios.get(myURL);
				//console.log(resp.data);
				setCustomerArray(resp.data);
				setIsDrawerOpened("");
			} catch(e) {
				console.log(e);
			}
		}
		getAllCustomers();
  }, []);


	async function setSummaryMainSelect(item) {
		if (item === "DoctorType") {
			await getDoctorTypes()
		} else 		if (item === "AddOn") {
			await getDoctorTypes();
			await getAddOnTypes();
		}
		setCurrentSelection(item);
	}


	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
		<Typography onClick={() => props.onClick(itemName)}>
			<span 
				className={(itemName === props.match) ? gClasses.functionSelected : gClasses.functionUnselected}>
			{itemName}
			</span>
		</Typography>
		</Grid>
		)}

	function DisplayFunctionHeader() {
		return (
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<DisplayFunctionItem item="DoctorType"  match={currentSelection} onClick={setSummaryMainSelect} />
			<DisplayFunctionItem item="AddOn"  match={currentSelection}  onClick={setSummaryMainSelect} />
			<DisplayFunctionItem item="Customer"  match={currentSelection}  onClick={setSummaryMainSelect} />
		</Grid>	
		</Box>
		)}
	function handleSelectCustomer(rec) {
		sessionStorage.setItem("cid", rec._id);
		sessionStorage.setItem("customerData", JSON.stringify(rec));
	}
	
	//------------ Doctor Type 


	async function getDoctorTypes() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/doctortype/list`;
			let resp = await axios.get(myUrl);
			setDoctorTypeArray(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching doctor type`);
			setDoctorTypeArray([]);
		}
	}
	
	function handleAddDoctorType() {
		setEmurName("");
		setIsDrawerOpened("ADDDT")
	}

	function handleEditDoctorType(d) {
		setEmurData(d);
		setEmurName(d.name);
		setIsDrawerOpened("EDITDT")
	}

	async function handleAddEditDoctorType() {
		if (isDrawerOpened === "ADDDT") {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/doctortype/add/${emurName}`);
				let tmpArray = [resp.data].concat(doctorTypeArray);
				setDoctorTypeArray(lodashSortBy(tmpArray, 'name'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error adding docgtor type ${emurName}`);
			}
		} else {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/doctortype/edit/${emurData.name}/${emurName}`);
				let tmpArray = doctorTypeArray.filter(x => x.name !== emurData.name);
				tmpArray.push(resp.data);
				setDoctorTypeArray(lodashSortBy(tmpArray, 'name'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error update docgtor type ${emurDate.name}`);
			}
		}

	}

	function handleCancelDoctorType(d) {
		let msg = `Are you sure you want to cancel doctor type ${d.name}?`;
		vsDialog("Delete Doctor type", msg,
		{label: "Yes", onClick: () => handleCancelDoctorTypeConfirm(d) },
		{label: "No" }
		);		
	}

	async function handleCancelDoctorTypeConfirm(d) {
		try {
			axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/doctortype/delete/${d.name}`);
			setDoctorTypeArray(doctorTypeArray.filter(x => x.name !== d.name));
		} catch(e) {
			alert.error(`Error deleting docgtor type ${d.name}`);
		}
	}


	function DisplayAllDoctorType() {
		//console.log(doctorTypeArray);
	return (
	<Grid className={classes.noPadding} key="PATHDR" container >
	{doctorTypeArray.map( (d, index) =>
		<Grid key={"DT"+index} item xs={3} sm={3} md={3} lg={3} >
		<Box  align="left" className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1}>
			<span className={gClasses.patientInfo2}>{d.name}</span>
			<span className={gClasses.patientInfo2}>
				<EditIcon color="primary"onClick={() => handleEditDoctorType(d)} />
				<CancelIcon color="secondary" onClick={() => handleCancelDoctorType(d)} />			
			</span>
		</Box>
		</Grid>	

	)}
	</Grid>
	)}


	//------------ Add on Type 


	async function getAddOnTypes() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/addon/list`;
			let resp = await axios.get(myUrl);
			setAddOnTypeArray(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching add on type`);
			setAddOnTypeArray([]);
		}
	}
	
	function handleAddAddOnType() {
		setEmurName("");
		setIsDrawerOpened("ADDADDON")
	}

	function handleEditAddOnType(d) {
		setEmurData(d);
		setEmurName(d.name);
		setIsDrawerOpened("EDITADDON")
	}

	async function handleAddEditAddOnType() {
		let docList = 0xFFFFFFFF;
		if (isDrawerOpened === "ADDADDON") {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/addon/add/${emurName}/${docList}`);
				let tmpArray = [resp.data].concat(addOnTypeArray);
				setAddOnTypeArray(lodashSortBy(tmpArray, 'name'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error adding add on type ${emurName}`);
			}
		} else {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/addon/edit/${emurData.name}/${emurName}/${docList}`);
				let tmpArray = addOnTypeArray.filter(x => x.name !== emurData.name);
				tmpArray.push(resp.data);
				setAddOnTypeArray(lodashSortBy(tmpArray, 'name'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error update add on type ${emurDate.name}`);
			}
		}

	}

	function handleCancelAddOnType(d) {
		let msg = `Are you sure you want to cancel add on type ${d.name}?`;
		vsDialog("Delete Add on type", msg,
		{label: "Yes", onClick: () => handleCancelAddOnTypeConfirm(d) },
		{label: "No" }
		);		
	}

	async function handleCancelAddOnTypeConfirm(d) {
		try {
			axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/addon/delete/${d.name}`);
			setAddOnTypeArray(addOnTypeArray.filter(x => x.name !== d.name));
		} catch(e) {
			alert.error(`Error deleting add on type ${d.name}`);
		}
	}


	function DisplayAllOnType() {
		//console.log(doctorTypeArray);
	return (
	<Grid className={classes.noPadding} key="PATHDR" container >
	{addOnTypeArray.map( (d, index) =>
		<Grid key={"DT"+index} item xs={3} sm={3} md={3} lg={3} >
		<Box  align="left" className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1}>
			<span className={gClasses.patientInfo2}>{d.name}</span>
			<span className={gClasses.patientInfo2}>
				<EditIcon color="primary"onClick={() => handleEditAddOnType(d)} />
				<CancelIcon color="secondary" onClick={() => handleCancelAddOnType(d)} />			
			</span>
		</Box>
		</Grid>	

	)}
	</Grid>
	)}



	//-----------------------------------------

	//--
	function DisplayCustomerList() {
	return (	
	<Box className={classes.allAppt} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} colSpan={7} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Customer List
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Customer Name
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
						Plan Type
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Expiry Date
					</TableCell>
					<TableCell colSpan={4} key={"TH31"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{customerArray.map( (a, index) => {
				let myExpiry = getOnlyDate(a.expiryDate);
				let myClass = (a.enabled) ? classes.tdPending : classes.tdCancel;
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{a.name}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{a.plan}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myExpiry}
						</Typography>
					</TableCell>
					<TableCell key={"TD11"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
							<Link href="#" variant="body2" disabled={a.enabled === false} onClick={() => {handleSelectCustomer(a) }}>Select</Link>
						</Typography>
					</TableCell>
					<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" disabled={a.enabled === false}  onClick={() => {setCustomerData(a); setNewExpiry(a.expiryDate); setRadioRecharge(""); setNewRecharge(true); }}>Recharge</Link>
						</Typography>
					</TableCell>
					<TableCell key={"TD13"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
							<Link href="#" variant="body2" onClick={() => {handleEnable(a)}}>{"Set " + ((a.enabled) ? "Disable" : "Enable")}</Link>
						</Typography>
					</TableCell>
					<TableCell key={"TD14"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
								<IconButton className={gClasses.blue} size="small" onClick={() => {handleEditCustomer(a)}}  >
									<EditIcon  />
								</IconButton>
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>	
	)}
	
	async function handleEnable(rec) {
		let tmpArray = [].concat(customerArray);
		let tmp = tmpArray.find(x => x._id === rec._id);
		tmp.enabled = !tmp.enabled;
		setCustomerArray(tmpArray);
	}
	
	function handleRecharge(newRadio) {
		let myExpiry = new Date(customerData.expiryDate);
		switch (newRadio) {
			case 'LIFETIME' : myExpiry = new Date(2031, 1, 1); break;
			case 'YEARLY': 	myExpiry.setYear(myExpiry.getFullYear()+1); break;
			case 'MONTHLY': myExpiry.setMonth(myExpiry.getMonth()+1); break;
		}
		setNewExpiry(myExpiry);
		setRadioRecharge(newRadio);
	}
	
	function DisplayRecharge() {
	if (!customerData.enabled) return null;
	return (	
		<Box className={classes.tdPending} width="100%">
			<VsCancel align="right" onClick={() => {setNewRecharge(false)}} />
			<Typography className={classes.title}>{"Recharge of "+customerData.name}</Typography>
			<BlankArea />
			<FormControl component="fieldset">
				{/*<FormLabel component="legend">Filter on</FormLabel>*/}
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioRecharge} 
					onChange={() => {handleRecharge(event.target.value); }}
				>
					<FormControlLabel className={classes.filterRadio} value="LIFETIME" control={<Radio color="primary"/>} label="Lifetime" />
					<FormControlLabel className={classes.filterRadio} value="YEARLY"   control={<Radio color="primary"/>} label="Yearly" />
					<FormControlLabel className={classes.filterRadio} value="MONTHLY"  control={<Radio color="primary"/>} label="Monthly" />
				</RadioGroup>
			</FormControl>
			<BlankArea />
			<Typography className={classes.title}>{"Current Expiry: "+getOnlyDate(customerData.expiryDate)}</Typography>
			<BlankArea />
			<Typography className={classes.title}>{"Next    Expiry: "+getOnlyDate(newExpiry)}</Typography>
			<BlankArea />
			<VsButton name="Update Expiry" />
		</Box>
	)}
	
	function addNewCustomerSubmit() {
		alert.show("New Customer to be added");
	}
	
	
  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
			case 0:
				myMsg = "";
				break;
      case 200:
        // setCustName("");
        // setPassword("");
        // setRepeatPassword("");
        // setEmail("");
        myMsg = `User ${custName} successfully regisitered.`;
        break;
      case 602:
        myMsg = "User Name already in use";
        break;
      case 603:
        myMsg = "Email id already in use";
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

	function handleAddCUstomer() {
		setCustNumber(0);
		setReferalCode("");
		setDoctorName("");
		setDoctorType("");
		setClinicName("");
		setCustName("");
		setCustEmail("");
		setCustMobile("");
		setCustAddr1("");
		setCustAddr2("");
		setCustAddr3("");

		setCustLocation("");
		setCustPinCode(0);

		setCustFee(1000);

		let d = new Date();
		d.setYear(d.getFullYear()+1);
		setCustExpiry(moment(d));

		setCustCommission(10);

		setIsDrawerOpened("ADDCUST");	
	}
	
	/*
	customerNumber: Number,
	// Doctors details
	name: String,
	type: String,
	email: String,
	mobile: String,
	// Clinic details
	doctorName: String,
	clinicName: String,
	addr1: String,
	addr2: String,
	addr3: String,
	location: String,
	pinCode: String,
	workingHours: [Number], // clinic weekly working slots (15 minute slots
	
	// 
	commission: Number,			// commission for each referral recharge
	referenceCid: String,		// the reference of doctor who made this customer join

	welcomeMessage: String,
	plan: String,
	fee: Number,
	expiryDate: Date,
	enabled:Boolean,
*/

	function handleEditCustomer(c) {
		setCustNumber(c.customerNumber);
		setCustName(c.name);
		setDoctorType(c.type);
		setCustEmail(dispEmail(c.email));
		setCustMobile(c.mobile);

		setDoctorName(c.doctorName);
		setClinicName(c.clinicName);
		setCustAddr1(c.addr1);
		setCustAddr2(c.addr2);
		setCustAddr3(c.addr3);
		setCustLocation(c.location);
		setCustPinCode(c.pinCode);
		// commission is fixed 10%
		setCustCommission(c.commission);
		setReferalCode(c.referenceCid)


		setCustFee(c.fee);

		let d = new Date();
		d.setYear(d.getFullYear()+1);
		setCustExpiry(moment(d));

		setIsDrawerOpened("EDITCUST");	
	}

	async function handleAddEditCustomer() {
	//	console.log("In add edit")
		let tmp = {
			customerNumber: custNUmber,
			name: custName,
			type: doctorType,
			email: encrypt(custEmail),
			mobile: custMobile,

			doctorName: doctorName,
			clinicName: clinicName,

			addr1: custAddr1,
			addr2: custAddr2,
			addr3: custAddr3,

			location: custLocation,
			pinCode: custPinCode,

			commission: custCommission,
			referenceCid: referalCode,

			welcomeMessage: "welcome to Doctor Viraag",
			plan: "YEARLY",
			fee: custFee,

			expiryDate: custExpiry,
		}

		let myData = encodeURIComponent(JSON.stringify(tmp));
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/customer/update/${myData}`);
			//console.log(resp.data);
			let tmpArray;
			let oldName = "";
			if (custNUmber > 0) {
				tmpArray = customerArray.filter(x => x.customerNumber !== resp.data.customerNumber);
			} else {
				tmpArray = [].concat(customerArray);
			}
			tmpArray.push(resp.data)
			setCustomerArray(lodashSortBy(tmpArray, 'customerNumber'));
			alert.success(`Updated details of ${resp.data.name}`);
			setIsDrawerOpened("");
		} catch (e) {
			console.log(e);
			alert.error(`error updating details of ${custName}`);
		}
	}
	
	function handleDate(d) {
		//console.log(d);
		setCustExpiry(d);
	}

	return (
  <div className={gClasses.webPage} align="center" key="main">
	<DisplayPageHeader headerName="Customer" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	<DisplayFunctionHeader />
	{(currentSelection === "DoctorType") &&
		<div>
		<VsButton align="right" name="Add new Doctor Type" onClick={handleAddDoctorType} />
		<DisplayAllDoctorType/>
		</div>
	}
	{(currentSelection === "AddOn") &&
		<div>
		<VsButton align="right" name="Add new Add on Type" onClick={handleAddAddOnType} />
		<DisplayAllOnType/>
		</div>
	}
	{(currentSelection === "Customer") &&
		<div>
		{(!newCustomer) &&
			<VsButton align="right" name="Add new CUstomer" onClick={handleAddCUstomer} />
		}
		<DisplayCustomerList />
		</div>
	}	
	<Drawer className={classes.drawer} anchor="right" variant="temporary"	open={isDrawerOpened !== ""} >
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{/* Add / edit new customer */}
	{((isDrawerOpened === "ADDCUST") || (isDrawerOpened === "EDITCUST")) &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddEditCustomer}>
			<Typography className={classes.title}>{((isDrawerOpened === "ADDCUST") ? "Add" : "Edit") + " Customer of Doctor Viraag"}</Typography>
			<TextValidator fullWidth label="Referral Code" className={gClasses.vgSpacing}
				value={referalCode}
				onChange={(event) => setReferalCode(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
			/>
			<div align="left">
				<Typography className={gClasses.vgSpacing}>Expiry Date</Typography>
			</div>
			<Datetime 
				className={classes.dateTimeBlock}
				inputProps={{className: classes.dateTimeNormal}}
				timeFormat={false} 
				initialValue={custExpiry}
				dateFormat="DD/MM/yyyy"
				isValidDate={disablePastDt}
				onClose={handleDate}
				closeOnSelect={true}
			/>
			<TextValidator required fullWidth label="Name of the Customer" className={gClasses.vgSpacing}
				value={custName}
				onChange={(event) => setCustName(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Name of the Clinic" className={gClasses.vgSpacing}
				value={clinicName}
				onChange={(event) => setClinicName(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Name of the Doctor" className={gClasses.vgSpacing}
				value={doctorName}
				onChange={(event) => setDoctorName(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Doctor's Specialisation" className={gClasses.vgSpacing}
				value={doctorType}
				onChange={(event) => setDoctorType(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Address1" className={gClasses.vgSpacing}
				value={custAddr1}
				onChange={(event) => setCustAddr1(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Address2" className={gClasses.vgSpacing}
				value={custAddr2}
				onChange={(event) => setCustAddr2(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Address3" className={gClasses.vgSpacing}
				value={custAddr3}
				onChange={(event) => setCustAddr3(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
      <TextValidator required fullWidth label="Email" type="email" className={gClasses.vgSpacing}
				value={custEmail}
				onChange={(event) => setCustEmail(event.target.value)}
			/>
			<TextValidator fullWidth required className={gClasses.vgSpacing}  label="Mobile" type="number"
				value={custMobile} 
				onChange={() => { setCustMobile(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
        errorMessages={['Invalid Mobile number','Invalid Mobile number']}
      />	
      <TextValidator required fullWidth label="Location" className={gClasses.vgSpacing}
				value={custLocation}
				onChange={(event) => setCustLocation(event.target.value)}
			/>
			<TextValidator fullWidth required className={gClasses.vgSpacing} label="Pin Code" type="number"
				value={custPinCode} 
				onChange={() => { setCustPinCode(event.target.value) }}
				validators={['minNumber:111111', 'maxNumber:999999']}
        errorMessages={['Invalid Pin Code','Invalid Pin Code']}
      />
			<TextValidator fullWidth required className={gClasses.vgSpacing} label="Customer Fee" type="number"
				value={custFee} 
				onChange={() => { setCustFee(event.target.value) }}
				validators={['minNumber:1000']}
        errorMessages={['Invalid Customer Code']}
      />
			<BlankArea />
			<ShowResisterStatus/>
      <BlankArea/>
			<VsButton align="center" name={(isDrawerOpened === "ADDCUST" ? "Add" : "Update")} type="submit" />
			<ValidComp />  
    </ValidatorForm>
	}
	{((isDrawerOpened === "ADDDT") || (isDrawerOpened === "EDITDT")) &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddEditDoctorType}>
			<Typography className={classes.title}>{((isDrawerOpened === "ADDDT") ? "Add" : "Edit") + " Doctor Type"}</Typography>
			<TextValidator required fullWidth label="Doctor Type" className={gClasses.vgSpacing}
				value={emurName}
				onChange={(event) => setEmurName(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<BlankArea />
			<ShowResisterStatus/>
      <BlankArea/>
			<VsButton align="center" name={(isDrawerOpened === "ADDDT" ? "Add" : "Update")} type="submit" />
			<ValidComp />  
    </ValidatorForm>
	}
	{((isDrawerOpened === "ADDADDON") || (isDrawerOpened === "EDITADDON")) &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddEditAddOnType}>
			<Typography className={classes.title}>{((isDrawerOpened === "ADDDT") ? "Add" : "Edit") + " Add On Type"}</Typography>
			<TextValidator required fullWidth label="Add On Type" className={gClasses.vgSpacing}
				value={emurName}
				onChange={(event) => setEmurName(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<BlankArea />
			<ShowResisterStatus/>
      <BlankArea/>
			<VsButton align="center" name={(isDrawerOpened === "ADDADDON" ? "Add" : "Update")} type="submit" />
			<ValidComp />  
    </ValidatorForm>
	}
	</Box>
	</Drawer>		
	</Container>
  </div>
  );    
}