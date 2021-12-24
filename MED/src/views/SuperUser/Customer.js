import React, {useEffect, useState, createContext }  from 'react';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import lodashSortBy from "lodash/sortBy"
import lodashCloneDeep from 'lodash/cloneDeep';
import { useAlert } from 'react-alert';

import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';

import Grid from "@material-ui/core/Grid";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
 import VsCancel from "CustomComponents/VsCancel";
 import VsButton from "CustomComponents/VsButton";
 import VsCheckBox from "CustomComponents/VsCheckBox";
 import VsRadioGroup from "CustomComponents/VsRadioGroup";

import CustomerInformation from "views/SuperUser/CustomerInformation";
import Doctorsms from "views/SuperUser/Doctorsms";

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';


// styles
import globalStyles from "assets/globalStyles";

import {DisplayPageHeader, ValidComp, BlankArea, DisplayCustomerBox, DisplayCustomerHeader, DisplayBalance,
} from "CustomComponents/CustomComponents.js"



import { dispEmail, disablePastDt, vsDialog,  encrypt} from 'views/functions';
import { DATESTR, MONTHNUMBERSTR } from 'views/globals';

const ADDONPLANTYPE = ["ANNUAL", "MONTHLY", "LIFETIME"];


export default function Customer() {
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [isDrawerOpened, setIsDrawerOpened] = useState("");

	const [custNumber, setCustNumber] = useState(0);
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
	const [emurDate1, setEmurDate1] = useState(moment());
	const [emurRec, setEmurRec] = useState({});
	const [custCommission, setCustCommission] = useState(10);

	const [custFee, setCustFee] = useState(1000);
	const [registerStatus, setRegisterStatus] = useState(0);

	const [addOnPlanType, setAddOnPlanType] = useState("");

	//const [custOption, setCustOption] = useState("");

	
	const [customerArray, setCustomerArray] = useState([]);
	const [customerData, setCustomerData] = useState({});
	const [newRecharge, setNewRecharge] = useState(false);
	//const [radioRecharge, setRadioRecharge] = useState("MONTHLY");

	const [currentSelection, setCurrentSelection] = useState("");
	const [currentCustomerSelection, setCurrentCustomerSelection] = useState("");

	const [balance, setBalance] = useState(0);
	const [currentCustomer, setCurrentCustomer] = useState("");
	const [currentCustomerData, setCurrentCustomerData] = useState({});
	
	//const [smsconfig, setSmsconfig] = useState({});
//	const [subscriptionList, setSubscriptionList] = useState([]);

	const [emurData, setEmurData] = useState({});
	const [emurText1, setEmurText1] = useState("");
	const [emurText2, setEmurText2] = useState("");
	const [emurAmount, setEmurAmount] = useState(0);

	const [emurCb1, setEmurCb1] = useState(false);
	const [emurCb2, setEmurCb2] = useState(false);
	const [emurCb3, setEmurCb3] = useState(false);
	//const [emurCb4, setEmurCb4] = useState(false);
	//const [emurCb5, setEmurCb5] = useState(false);
	

	const [doctorTypeArray, setDoctorTypeArray] = useState([]);
	const [addOnTypeArray, setAddOnTypeArray] = useState([]);
	const [festivalArray, setFestivalArray] = useState([]);


	async function getAllCustomers () {
		try {
			let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/customer/list`;
			let resp = await axios.get(myURL);
			setCustomerArray(resp.data);
			// setIsDrawerOpened("");
		} catch(e) {
			console.log(e);
			setCustomerArray([]);
		}

	}


	async function setSummaryMainSelect(item) {
		if (item === "DoctorType") {
			await getDoctorTypes()
		} else if (item === "AddOn") {
			await getDoctorTypes();
			await getAddOnTypes();
		} else if (item === "Festival") {
			await getFestivalDates();
		} else if (item === "Customer") {
			//setCurrentCustomerData({});
			setCurrentCustomer("");
			getAllCustomers();
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
		<DisplayFunctionItem item="Festival"  match={currentSelection} onClick={setSummaryMainSelect} />
		<DisplayFunctionItem item="Customer"  match={currentSelection}  onClick={setSummaryMainSelect} />
		<DisplayFunctionItem item="DRSMS"  match={currentSelection}  onClick={setSummaryMainSelect} />
	</Grid>	
	</Box>
	)}


	async function getSubscription(cid) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/addon/subscribelist/${cid}`;
			let resp = await axios.get(myUrl);
			setSubscriptionList(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching subscription list`);
			setSubscriptionList([]);
		}
	}



	async function setSummaryCustomerSelect(item) {
		if (item === "AddOn") {
			await getSubscription(currentCustomerData._id);
		}
		setCurrentCustomerSelection(item)
	}
	

	function handleSelectCustomer(rec) {
		setCurrentCustomerData(rec);
		setCurrentCustomer(rec.name);
		console.log("Now should call Cust info");
	}
	
	// --------------- Festival

	async function getFestivalDates() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/festival/list`;
			let resp = await axios.get(myUrl);
			setFestivalArray(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching festival `);
			setFestivalArray([]);
		}
	}




	async function handleAddEditFestivalDate() {
		console.log(emurDate1);
		//if (!emurCb1 && !emurCb2 && !emurCb3) return setRegisterStatus(1001);

		let d = emurDate1.toDate();
		let myMonth = d.getMonth();
		let myYear = d .getFullYear();
		let myDate = d.getDate();
		let dateStr = myYear + MONTHNUMBERSTR[myMonth] + DATESTR[myDate];
		console.log(myDate, myMonth, myYear);
		// Add or Update
		if (isDrawerOpened === "ADDFESTIVALDATE") {
			let tmp = festivalArray.find(x => x.date === myDate && x.month === myMonth && x.year === myYear);
			if (tmp) return setRegisterStatus(1002);
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/festival/add/${dateStr}/${emurText1}/${emurText2}`);
				let tmpArray = [resp.data].concat(festivalArray);
				setFestivalArray(lodashSortBy(tmpArray, 'year', 'month', 'date'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error adding festival date ${emurText1}`);
			}
		} else {
			// duplicate date check
			if ((emurRec.date !== myDate) || (emurRec.month !== myMonth) || (emurRec.year !== myYear)) {
				let tmp = festivalArray.find(x => x.date === myDate && x.month === myMonth && x.year === myYear);
				if (tmp) return setRegisterStatus(1002);
			}
			let origDateStr = emurRec.year + MONTHNUMBERSTR[emurRec.month] + DATESTR[emurRec.date];
			// now update
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/festival/update/${origDateStr}/${dateStr}/${emurText1}/${emurText2}`);
				// remove the entry with oiginal date
				let tmp = festivalArray.filter(x => x.date !== emurRec.date || x.month !== emurRec.month || x.year !== emurRec.year);
				// now add the update festival
				let tmpArray = [resp.data].concat(tmp);
				setFestivalArray(lodashSortBy(tmpArray, 'year', 'month', 'date'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error updating festival date ${emurText1}`);
			}

	
		}
	}

	async function handleCancelFestivalDate(a) {
		//alert.info("To be implemented");
		let dateStr = `${a.year}${MONTHNUMBERSTR[a.month]}${DATESTR[a.date]}`;
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/festival/del/${dateStr}`);
			setFestivalArray(festivalArray.filter(x => x.date !== a.date || x.month !== a.month || x.year !== a.year));
		} catch(e) {
			alert.error(`Error deleteing festival ${a.desc}`);
		}		
	}

	function addNewFestivalDate() {
		let t = moment();
		console.log(t);
		setEmurDate1(t);
		setEmurText1("");
		setEmurText2("");
		setEmurCb1(true);
		setEmurCb2(false);
		setEmurCb3(false);
		setRegisterStatus(0);
		setIsDrawerOpened("ADDFESTIVALDATE")
	}

	function editFestivalDate(f) {
		let t = moment(f.festivalDate);
		console.log(t);
		setEmurDate1(t);
		setEmurRec(f);
		setEmurText1(f.desc);
		setEmurText2(f.greeting);
		setEmurCb1(true);
		setEmurCb2(false);
		setEmurCb3(false);
		setRegisterStatus(0);
		setIsDrawerOpened("EDITFESTIVALDATE")
	}


	function DisplayFestivalDates() {
	return (	
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1}>
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} colSpan={4} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
					Festival Dates
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
					Date
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
						Description
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
						Message Id
					</TableCell>
					{/*
					<TableCell key={"TH31"} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
						Pack1
					</TableCell>
					<TableCell key={"TH32"} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
						Pack2
					</TableCell>
					<TableCell key={"TH33"} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
						Pack3
					</TableCell>
					*/}
					<TableCell key={"TH41"} component="th" scope="row" align="center" padding="none"
					className={gClasses.th} >
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{festivalArray.map( (a, index) => {
				let myDate = `${DATESTR[a.date]}/${MONTHNUMBERSTR[a.month]}/${a.year}`;
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} component="td" scope="row" padding="none"
					className={gClasses.td} >
						<Typography align="center"  className={gClasses.patientInfo2}>
							{myDate}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} component="td" scope="row" padding="none"
					className={gClasses.td} >
						<Typography className={gClasses.patientInfo2}>
							{a.desc}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} component="td" scope="row" padding="none"
					className={gClasses.td} >
						<Typography align="center" className={gClasses.patientInfo2}>
							{a.greeting}
						</Typography>
					</TableCell>
					{/*
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" padding="none"
					className={gClasses.td} >
						<Typography align="center" className={gClasses.patientInfo2}>
							{(a.pack1) ? "Yes" : ""}
						</Typography>
					</TableCell>
					<TableCell key={"TD5"+index} align="center" component="td" scope="row" padding="none"
					className={gClasses.td} >
						<Typography align="center" className={gClasses.patientInfo2}>
							{(a.pack2) ? "Yes" : ""}
						</Typography>
					</TableCell>
					<TableCell key={"TD6"+index} align="center" component="td" scope="row" padding="none"
					className={gClasses.td} >
						<Typography align="center" className={gClasses.patientInfo2}>
							{(a.pack3) ? "Yes" : ""}
						</Typography>
					</TableCell>
					*/}
					<TableCell key={"TD11"+index} align="center" component="td" scope="row" padding="none"
					className={gClasses.td} >
						<div align="center" >
						<EditIcon color="primary" size="small" onClick={() => editFestivalDate(a)}  />
						<CancelIcon color="secondary" size="small" onClick={() => handleCancelFestivalDate(a)}  />
						</div>
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>	
	)}
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
		setEmurText1("");
		setIsDrawerOpened("ADDDT")
	}

	function handleEditDoctorType(d) {
		setEmurData(d);
		setEmurText1(d.name);
		setIsDrawerOpened("EDITDT")
	}

	async function handleAddEditDoctorType() {
		if (isDrawerOpened === "ADDDT") {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/doctortype/add/${emurText1}`);
				let tmpArray = [resp.data].concat(doctorTypeArray);
				setDoctorTypeArray(lodashSortBy(tmpArray, 'name'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error adding docgtor type ${emurText1}`);
			}
		} else {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/doctortype/edit/${emurData.name}/${emurText1}`);
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
	<Grid className={gClasses.noPadding} key="PATHDR" container >
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
		setEmurText1("");
		setEmurAmount(100);
		setEmurText2("");
		setAddOnPlanType(ADDONPLANTYPE[0]);
		setIsDrawerOpened("ADDADDON")
	}

	function handleEditAddOnType(d) {
		setEmurData(d);
		setEmurText1(d.name);
		setEmurAmount(d.charges);
		setEmurText2(d.description);
		setAddOnPlanType(d.planType);
		setIsDrawerOpened("EDITADDON")
	}

	async function handleAddEditAddOnType() {
		let docList = 0xFFFFFFFF;
		if (isDrawerOpened === "ADDADDON") {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/addon/add/${emurText1}/${emurAmount}/${emurText2}/${addOnPlanType}/${docList}`);
				let tmpArray = [resp.data].concat(addOnTypeArray);
				setAddOnTypeArray(lodashSortBy(tmpArray, 'name'));
				setIsDrawerOpened("");
			} catch(e) {
				alert.error(`Error adding add on type ${emurText1}`);
			}
		} else {
			try {
				let resp =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/addon/edit/${emurData.name}/${emurText1}/${emurAmount}/${emurText2}/${addOnPlanType}/${docList}`);
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
		<div>
		{addOnTypeArray.map( (d, index) =>
		<Box key={"DT"+index}  align="left" className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1}>
		<Grid className={gClasses.noPadding} key="PATHDR" container >
		<Grid item xs={6} sm={6} md={2} lg={2} >
			<span className={gClasses.patientInfo2}>{d.name}</span>
		</Grid>
		<Grid item xs={3} sm={3} md={1} lg={1} >
			<span className={gClasses.patientInfo2}>{d.charges+"/-"}</span>
		</Grid>
		<Grid item xs={3} sm={3} md={1} lg={1} >
			<span className={gClasses.patientInfo2}>{d.planType}</span>
		</Grid>
		<Grid item xs={12} sm={12} md={7} lg={7} >
			<span className={gClasses.patientInfo2}>{d.description}</span>
		</Grid>
		<Grid item xs={2} sm={2} md={1} lg={1} >
				<EditIcon color="primary"onClick={() => handleEditAddOnType(d)} />
				<CancelIcon color="secondary" onClick={() => handleCancelAddOnType(d)} />			
		</Grid>
		</Grid>
		</Box>
		)}
		</div>
	)}

	function addToWallet() {
		setEmurAmount(0);
		setIsDrawerOpened("ADDWALLET");
	}

	async function handleAddWallet() {
		try {
			axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/add/${currentCustomerData._id}/${emurAmount}`);
			setBalance(balance+emurAmount);
			setIsDrawerOpened("");
		} catch(e) {
			alert.error(`Error adding Amount to wallet`);
		}
	}
	
	function DisplayCustomerList() {
		return (	
			<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
			{customerArray.map( (m, index) => 
				<Grid key={"PAT"+m.name} item xs={12} sm={6} md={3} lg={3} >
				<DisplayCustomerBox customer={m}
					button1={
						<VisibilityIcon className={gClasses.blue} size="small" onClick={() => handleSelectCustomer(m) } />
					}
					button2={
						<EditIcon className={gClasses.blue} size="small" onClick={() => handleEditCustomer(m) } />
					}					
				/>
				</Grid>
				)}
			</Grid>	
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
			case 1001:
				myMsg = "Festival date should be part of atleast 1 Pack";
				break;
			case 1002:
					myMsg = "Selected festival date already added";
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

	async function handleAddCustomer() {
		await getDoctorTypes();

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
		setEmurDate1(moment(d));

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

	async function handleCustomerPlanRecharge(c) {
		if (balance < c.fee)
			return alert.error(`Insufficient amount in wallet. Customer fee is ${c.fee}`);

		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/deduct/${c._id}/${c.fee}/Plan Recharge`);
			setIsDrawerOpened("");
			setBalance(balance-c.fee);
			// extend expiry date of customer by 1 year
			let tmp = lodashCloneDeep(currentCustomerData);
			let n = new Date(tmp.expiryDate);
			n.setYear(n.getFullYear()+1);
			tmp.expiryDate = n;
			// update customer exiry data changes to database
			let status = await updateCustomer(tmp);
			if (status.success) {
				let tmpArray;
				tmpArray = customerArray.filter(x => x.customerNumber !== status.data.customerNumber);
				tmpArray.push(status.data)
				setCurrentCustomerData(status.data);
				setCustomerArray(lodashSortBy(tmpArray, 'customerNumber'));
				alert.success(`Updated new expiry date of ${status.data.name}`);
			} else {
				console.log(e);
				alert.error(`error updating expiry date`);
			}
		} catch (e) {
			console.log(e);
			alert.error("Failed to deduct plan fee from walletr");
		}
	}

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

		//let d = new Date();
		//d.setYear(d.getFullYear()+1);
		setEmurDate1(moment(c.expiryDate));

		setIsDrawerOpened("EDITCUST");	
	}

	async function updateCustomer(rec) {
		let myData = encodeURIComponent(JSON.stringify(rec));
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/customer/update/${myData}`);
			return {success: true, data: resp.data}
		} catch (e) {
			console.log(e);
			return {success: false}
		}
	}

	async function handleAddEditCustomer() {
	//	console.log("In add edit")
		let tmp = {
			customerNumber: custNumber,
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

			expiryDate: emurDate1,
		}

		let status = await updateCustomer(tmp);
		
		if (status.success) {
			let tmpArray;
			//let oldName = "";
			if (custNumber > 0) {
				tmpArray = customerArray.filter(x => x.customerNumber !== status.data.customerNumber);
			} else {
				tmpArray = [].concat(customerArray);
			}
			tmpArray.push(status.data)
			setCurrentCustomerData(status.data);
			setCustomerArray(lodashSortBy(tmpArray, 'customerNumber'));
			alert.success(`Updated details of ${status.data.name}`);
			setIsDrawerOpened("");
		} else {
			console.log(e);
			alert.error(`error updating details of ${custName}`);
		}
	}


	function handleDate1(d) {
		//console.log(d);
		setEmurDate1(d);
	}

	function handleBackToCustomer() {
		getAllCustomers();
		setCurrentCustomer("");
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
		{(currentSelection === "Festival") &&
			<div>
			<VsButton name="Add new Date" align="right" onClick={addNewFestivalDate} />
			<DisplayFestivalDates />
			</div>
		}
		{(currentSelection === "Customer") &&
			<div>
			{(currentCustomer === "") &&
				<div>
				<VsButton align="right" name="Add new Customer" onClick={handleAddCustomer} />
				<DisplayCustomerList />
				</div>
			}
			{(currentCustomer !== "") &&
				<div>
				<VsButton align="right" name="Back to Customer list" onClick={handleBackToCustomer} />
				<CustomerInformation customer={currentCustomerData} />
				</div>
			}
			</div>
		}	
		{(currentSelection === "DRSMS") &&
			<Doctorsms />
		}
		<Drawer anchor="right" variant="temporary"	open={isDrawerOpened !== ""} >
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		{/* Add / edit new customer */}
		{((isDrawerOpened === "ADDCUST") || (isDrawerOpened === "EDITCUST")) &&
				<ValidatorForm className={gClasses.form} onSubmit={handleAddEditCustomer}>
				<Typography className={gClasses.title}>{((isDrawerOpened === "ADDCUST") ? "Add" : "Edit") + " Customer of Doctor Viraag"}</Typography>
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
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={emurDate1}
					dateFormat="DD/MM/yyyy"
					isValidDate={disablePastDt}
					onClose={handleDate1}
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
				<Typography>Doctor Type</Typography>
				<Select labelId='Doctor Type' id='time' name="time" padding={10}
				variant="outlined" required fullWidth label="Time" 
				value={doctorType}
				placeholder="Arun"
				inputProps={{
					name: 'Time',
					id: 'filled-age-native-simple',
				}}
				onChange={(event) => setDoctorType(event.target.value)}
				>
				{doctorTypeArray.map(x =>	<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
				</Select>
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
				<TextValidator fullWidth required className={gClasses.vgSpacing}  label="Mobile"
					value={custMobile} 
					onChange={(event) => { setCustMobile(event.target.value) }}
				/>	
				<TextValidator required fullWidth label="Location" className={gClasses.vgSpacing}
					value={custLocation}
					onChange={(event) => setCustLocation(event.target.value)}
				/>
				<TextValidator fullWidth required className={gClasses.vgSpacing} label="Pin Code" type="number"
					value={custPinCode} 
					onChange={(event) => { setCustPinCode(event.target.value) }}
					validators={['minNumber:111111', 'maxNumber:999999']}
					errorMessages={['Invalid Pin Code','Invalid Pin Code']}
				/>
				<TextValidator fullWidth required className={gClasses.vgSpacing} label="Customer Fee" type="number"
					value={custFee} 
					onChange={() => { setCustFee(event.target.value) }}
					validators={['minNumber:1000']}
					errorMessages={['Invalid Customer Fee']}
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
				<Typography className={gClasses.title}>{((isDrawerOpened === "ADDDT") ? "Add" : "Edit") + " Doctor Type"}</Typography>
				<TextValidator required fullWidth label="Doctor Type" className={gClasses.vgSpacing}
					value={emurText1}
					onChange={(event) => setEmurText1(event.target.value)}
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
				<Typography className={gClasses.title}>{((isDrawerOpened === "ADDDT") ? "Add" : "Edit") + " Add On Type"}</Typography>
				<TextValidator required fullWidth label="Name" className={gClasses.vgSpacing}
					value={emurText1}
					onChange={(event) => setEmurText1(event.target.value)}
					validators={['noSpecialCharacters']}
					errorMessages={[`Special Characters not permitted`]}
				/>
				<TextValidator required fullWidth type="number" label="Charges" className={gClasses.vgSpacing}
					value={emurAmount}
					onChange={(event) => setEmurAmount(Number(event.target.value))}
					validators={['minNumber:100']}
					errorMessages={[`Charges should be alleast 100`]}
				/>
				<Grid className={gClasses.noPadding} key="ADDEDITPERS" container alignItems="center" align="center">
				<Grid align="left"  item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.title}>Plan Type</Typography>
				</Grid>
				<Grid align="left"  item xs={6} sm={6} md={10} lg={10} >
					<VsRadioGroup 					
						value={addOnPlanType} onChange={(event) => setAddOnPlanType(event.target.value)}
						radioList={ADDONPLANTYPE}
					/>
				</Grid>	
				</Grid>
				<TextValidator required fullWidth label="Description" className={gClasses.vgSpacing}
					value={emurText2}
					onChange={(event) => setEmurText2(event.target.value)}
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
		{((isDrawerOpened === "ADDFESTIVALPACK")) &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddEditFestivalPack}>
			<Typography className={gClasses.title}>{((isDrawerOpened === "ADDFESTIVALPACK") ? "Add" : "Edit") + " Festival Pack"}</Typography>
			<TextValidator required fullWidth label="Festival Pack Name" className={gClasses.vgSpacing}
				value={emurText1}
				onChange={(event) => setEmurText1(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
			/>
			<BlankArea />
			<ShowResisterStatus/>
			<BlankArea/>
			<VsButton align="center" name={(isDrawerOpened === "ADDFESTIVALPACK" ? "Add" : "Update")} type="submit" />
			<ValidComp />  
			</ValidatorForm>
		}
		{((isDrawerOpened === "ADDFESTIVALDATE") || (isDrawerOpened === "EDITFESTIVALDATE") ) &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddEditFestivalDate}>
			<Typography className={gClasses.title}>{((isDrawerOpened === "ADDFESTIVALDATE") ? "Add" : "Edit") + " new date to Festival"}</Typography>
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={emurDate1}
				dateFormat="DD/MM/yyyy"
				onClose={handleDate1}
				closeOnSelect={true}
			/>
			<TextValidator required fullWidth label="Description" className={gClasses.vgSpacing}
				value={emurText1}
				onChange={(event) => setEmurText1(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
			/>
			<TextValidator required fullWidth label="Greeting" className={gClasses.vgSpacing}
				value={emurText2}
				onChange={(event) => setEmurText2(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
			/>
			{/*
			<VsCheckBox label="Part of festival pack 1" align="left" checked={emurCb1} onClick={() => setEmurCb1(!emurCb1)} />
			<VsCheckBox label="Part of festival pack 2" align="left" checked={emurCb2} onClick={() => setEmurCb2(!emurCb2)} />
			<VsCheckBox label="Part of festival pack 3" align="left" checked={emurCb3} onClick={() => setEmurCb3(!emurCb3)} />
			<BlankArea />
			*/}
			<ShowResisterStatus/>
			<BlankArea/>
			<VsButton align="center" name={(isDrawerOpened === "ADDFESTIVALDATE" ? "Add" : "Update")} type="submit" />
			<ValidComp />  
			</ValidatorForm>
		}		
		</Box>
		</Drawer>		
		</Container>
		</div>
		);    
}