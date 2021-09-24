import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import VsButton from "CustomComponents/VsButton";
import { borders } from '@material-ui/system';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
 import VsCancel from "CustomComponents/VsCancel";
 
 
import {setTab} from "CustomComponents/CricDreamTabs.js"

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Avatar from "@material-ui/core/Avatar"
//import validator from 'validator'

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";
import {dynamicModal } from "assets/dynamicModal";


import Switch from "@material-ui/core/Switch";
import Link from '@material-ui/core/Link';

import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
DisplayPatientDetails,
} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';


// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

//colors 
import { 
red, blue, yellow, orange, pink, green, brown, deepOrange, lightGreen,
} from '@material-ui/core/colors';

import { 
	isMobile, callYesNo,
	disablePastDt, disableFutureDt, disableAllDt,
	validateInteger,
	encrypt, decrypt, 
	left, right,
	intString,
	updatePatientByFilter,
	dispAge, dispEmail, dispMobile,
	ordinalSuffix,
	getOnlyDate,
} from "views/functions.js";


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

const VISITTYPE = {pending: "pending", cancelled: "cancelled", visit: ""};

const ROWSPERPAGE = 10;
let dense = false;

const yesNoModal = dynamicModal('60%');

let searchText = "";
function setSearchText(sss) { searchText = sss;}

export default function Customer() {
  const classes = useStyles();
	const gClasses = globalStyles();

	const [registerStatus, setRegisterStatus] = useState(0);
	const [referalCode, setReferalCode] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [mobile, setMobile] = useState("");
	
	const [addUser, setAddUser] = useState(false);
	const [editUser, setEditUser] = useState(false);
	
	const [customerArray, setCustomerArray] = useState([]);
	const [customerData, setCustomerData] = useState({});
	const [newRecharge, setNewRecharge] = useState(false);
	const [newCustomer, setNewCustomer] = useState(false);
	const [radioRecharge, setRadioRecharge] = useState("MONTHLY");
	const [newExpiry, setNewExpiry] = useState(new Date());
	const [customerName, setCustomerName] = useState("");
	
	const [radioUserType, setRadioUserType] = useState("Doctor");
	const [radioCustomerPlan, setRadioCustomerPlan] = useState("MONTHLY");
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	
  useEffect(() => {	
		const getAllCustomers = async () => {		
			try {
				let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/customer/list`;
				let resp = await axios.get(myURL);
				console.log(resp.data);
				setCustomerArray(resp.data);
			} catch(e) {
				console.log(e);
			}
		}
		getAllCustomers();
  }, []);

	
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
							<Link href="#" variant="body2" disabled={a.enabled === false} onClick={() => {sessionStorage.setItem("cid", a._id) }}>Select</Link>
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
						<Typography className={classes.link}>
							<Link href="#" variant="body2" onClick={() => {handleNewUser(a)}}>{"New User"}</Link>
						</Typography>
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
		alert("New Customer to be added");
	}
	
	
  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
			case 0:
				myMsg = "";
				break;
      case 200:
        // setUserName("");
        // setPassword("");
        // setRepeatPassword("");
        // setEmail("");
        myMsg = `User ${userName} successfully regisitered.`;
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

	function handleNewUser(a) {
		if (!a.enabled) return;
		
		setUserName("")
		setEmail("");
		setMobile("");
		
		setCustomerData(a);
		setAddUser(true);	
	}
	
	function addNewUserSubmit() {
		alert("Add new user");
	}
	
	return (
  <div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Customer" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	{(newRecharge) &&
		<DisplayRecharge />
	}
	{(!newCustomer) &&
		<div align="right">
		<Link href="#" variant="body2" onClick={() => {setNewCustomer(true)}}>{"Add new Customer"}</Link>
		</div>
	}
	{(newCustomer) &&
		<Box className={classes.tdPending} width="100%">
			<VsCancel align="right" onClick={() => {setNewCustomer(false)}} />
			<Typography className={classes.title}>{"Add new Customer"}</Typography>
			<BlankArea />
			<ValidatorForm className={gClasses.form} onSubmit={addNewCustomerSubmit}>
				{/*<TextValidator variant="outlined" fullWidth
				id="referral" label="Referral Code" name="referral"
				// defaultValue={userName}
				onChange={(event) => setReferalCode(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
				// error={error.userName}
				// helperText={helperText.userName}
				value={referalCode}
        />
				<BlankArea/>*/}
      <FormControl component="fieldset">
			<RadioGroup row aria-label="radioselection" name="radioselection" value={radioCustomerPlan} 
				onChange={() => {setRadioCustomerPlan(event.target.value); }}
			>
				<FormControlLabel className={classes.filterRadio} value="LIFETIME" control={<Radio color="primary"/>} label="Lifetime" />
				<FormControlLabel className={classes.filterRadio} value="YEARLY" 	 control={<Radio color="primary"/>} label="Yearly" />
				<FormControlLabel className={classes.filterRadio} value="MONTHLY"  control={<Radio color="primary"/>} label="Monthly" />
			</RadioGroup>
			</FormControl>
			<TextValidator variant="outlined" required 
				id="userName" label="Customer Name" name="username"
				value={userName}
				onChange={(event) => setUserName(event.target.value)}
				validators={['required', 'minLength', 'noSpecialCharacters']}
				errorMessages={['User Name to be provided', 'Mimumum 6 characters required', ]}
      />
			<BlankArea/>
      <TextValidator variant="outlined"  required type="email"  
				label="Email" name="email"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
				validators={['isEmailOK', 'required']}
				errorMessages={['Invalid Email', 'Email to be provided']}
			/>
			<BlankArea/>
      <TextValidator variant="outlined" required     
				label="Mobile" name="mobile"
				value={mobile}
				onChange={(event) => setMobile(event.target.value)}
				validators={['required', 'mobile']}
				errorMessages={[, 'Mobile to be provided', '10 digit mobile number required']}
      />
			{/*<TextValidator variant="outlined" required type="password"
      id="password" label="Password" 
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      validators={['required', 'minLength', 'noSpecialCharacters']}
      errorMessages={['Password to be provided', 'Minimum 6 characters required', 'Special characters not permitted']}
			/>
      <TextValidator variant="outlined" required type="password"
				id="repeatPassword" label="Repeat Password" 
				value={repeatPassword}
				onChange={(event) => setRepeatPassword(event.target.value)}
				validators={['isPasswordMatch', 'required']}
				errorMessages={['password mismatch', 'this field is required']}
			/>*/}
			<ShowResisterStatus/>
      <BlankArea/>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={gClasses.submit}
      >
        Register
    </Button>
    </ValidatorForm>
    
    <ValidComp p1={password}/>  
		</Box>
	}
	{(addUser) &&
		<Box className={classes.tdPending} width="100%">
			<VsCancel align="right" onClick={() => {setAddUser(false)}} />
			<Typography className={classes.title}>{"Add new user for customer " + customerData.name}</Typography>
			<FormControl component="fieldset">
				{/*<FormLabel component="legend">Filter on</FormLabel>*/}
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioUserType} 
					onChange={() => {setRadioUserType(event.target.value); }}
				>
					<FormControlLabel className={classes.filterRadio} value="Doctor"  	control={<Radio color="primary"/>} label="Doctor" />
					<FormControlLabel className={classes.filterRadio} value="Assistant" control={<Radio color="primary"/>} label="Assistant" />
				</RadioGroup>
			</FormControl>
			<BlankArea/>
			<ValidatorForm className={gClasses.form} onSubmit={addNewUserSubmit}>
      <TextValidator variant="outlined" required 
				id="userName" label="User Name" name="username"
				value={userName}
				onChange={(event) => setUserName(event.target.value)}
				validators={['required', 'minLength', 'noSpecialCharacters']}
				errorMessages={['User Name to be provided', 'Mimumum 6 characters required', ]}
      />
			<BlankArea />
      <TextValidator variant="outlined"  required type="email"  
				label="Email" name="email"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
				validators={['isEmailOK', 'required']}
				errorMessages={['Invalid Email', 'Email to be provided']}
			/>
			<BlankArea />
      <TextValidator variant="outlined" required     
				label="Mobile" name="mobile"
				value={mobile}
				onChange={(event) => setMobile(event.target.value)}
				validators={['required', 'mobile']}
				errorMessages={[, 'Mobile to be provided', '10 digit mobile number required']}
      />
			{/*<TextValidator variant="outlined" required type="password"
      id="password" label="Password" 
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      validators={['required', 'minLength', 'noSpecialCharacters']}
      errorMessages={['Password to be provided', 'Minimum 6 characters required', 'Special characters not permitted']}
			/>
      <TextValidator variant="outlined" required type="password"
				id="repeatPassword" label="Repeat Password" 
				value={repeatPassword}
				onChange={(event) => setRepeatPassword(event.target.value)}
				validators={['isPasswordMatch', 'required']}
				errorMessages={['password mismatch', 'this field is required']}
			/>*/}
			<ShowResisterStatus/>
      <BlankArea/>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={gClasses.submit}
      >
        Add New User
    </Button>
    </ValidatorForm>
    
    <ValidComp p1={password}/>  
		</Box>
	}
	<DisplayCustomerList />
	</Container>
  </div>
  );    
}