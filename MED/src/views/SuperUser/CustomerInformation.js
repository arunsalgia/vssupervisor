import React, {useEffect, useState, createContext }  from 'react';
import { Container } from '@material-ui/core';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
//import lodashSortBy from "lodash/sortBy"
import lodashCloneDeep from 'lodash/cloneDeep';
import { useAlert } from 'react-alert'
import Grid from "@material-ui/core/Grid";

import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import VsCancel from "CustomComponents/VsCancel";
import VsButton from "CustomComponents/VsButton";
//import VsCheckBox from "CustomComponents/VsCheckBox";

import Wallet from "views/SuperUser/Wallet"

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

// styles
import globalStyles from "assets/globalStyles";

import {ValidComp, BlankArea, DisplayCustomerHeader,
} from "CustomComponents/CustomComponents.js"

import useScript from 'CustomComponents/useScript';

import { dispEmail, disablePastDt, vsDialog,  encrypt} from 'views/functions';
import { DATESTR, MONTHNUMBERSTR } from 'views/globals';
import { dispMobile } from 'views/functions';
import { compareDate } from 'views/functions';

import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
//import CloseIcon from '@material-ui/icons/Close';


/*
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
*/

const RAZORSCRIPT = "https://checkout.razorpay.com/v1/checkout.js";


var orderId=""; 
function setOrderId(sss) { orderId = sss; }
let userCid; 
export default function CustomerInformations(props) {
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	useScript(RAZORSCRIPT);

	const [razOpt, setRazOpt] = useState({});

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
	const [custCommission, setCustCommission] = useState(10);

	const [custFee, setCustFee] = useState(1000);
	const [registerStatus, setRegisterStatus] = useState(0);

	const [panelSubscribed, setPanelSubscribed] = useState(false);

	
	const [custOption, setCustOption] = useState("");

	
	const [customerArray, setCustomerArray] = useState([]);
	const [customerData, setCustomerData] = useState({});
	const [newRecharge, setNewRecharge] = useState(false);
	const [radioRecharge, setRadioRecharge] = useState("MONTHLY");

	const [currentSelection, setCurrentSelection] = useState("");
	const [currentCustomerSelection, setCurrentCustomerSelection] = useState("");

	const [balance, setBalance] = useState(0);
	const [currentCustomer, setCurrentCustomer] = useState("");
	const [currentCustomerData, setCurrentCustomerData] = useState({});
	
	const [smsconfig, setSmsconfig] = useState({});
	const [subscriptionList, setSubscriptionList] = useState([]);

	const [emurData, setEmurData] = useState({});
	const [emurText1, setEmurText1] = useState("");
	const [emurText2, setEmurText2] = useState("");
	const [emurAmount, setEmurAmount] = useState(0);

	/*
	const [emurCb1, setEmurCb1] = useState(false);
	const [emurCb2, setEmurCb2] = useState(false);
	const [emurCb3, setEmurCb3] = useState(false);
	const [emurCb4, setEmurCb4] = useState(false);
	const [emurCb5, setEmurCb5] = useState(false);
*/	

	const [doctorTypeArray, setDoctorTypeArray] = useState([]);
	const [addOnTypeArray, setAddOnTypeArray] = useState([]);
	const [festivalArray, setFestivalArray] = useState([]);


  useEffect(() => {	
		let cData;
		if (props.customer) {
			cData = props.customer;
		} else {
			// direct call 
			cData = JSON.parse(sessionStorage.getItem("customerData"));
		}
		userCid = cData._id;
		setCurrentCustomerData(cData);
		setCurrentCustomer(cData.name)
		getWalletBalance(userCid);
		checkIfPanelSubscribed();
  }, []);


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

	async function checkIfPanelSubscribed() {
		//	http://localhost:4000/addon/hassubscribedpaneldoctor/61454cba236fba38bc29bce4
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/addon/hassubscribedpaneldoctor/${userCid}`;
			let resp = await axios.get(myUrl);
			setPanelSubscribed(resp.data.status);
		} catch (e) {
			console.log(e)
			alert.error(`Error in checking panel subscription.`);
		}
	}

	async function handleSubscribe(d) {
		setEmurText1(d.name);
		let tmp  = moment();
		setEmurDate1(tmp);
		setIsDrawerOpened("ADDADDON")
	}

	async function handleAddonConfirm() {
		let d = emurDate1.toDate();
		console.log(d);
		let expiryStr = `${d.getFullYear()}${MONTHNUMBERSTR[d.getMonth()]}${DATESTR[d.getDate()]}`;
		
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/addon/subscribe/${userCid}/${emurText1}/${expiryStr}`;
			let resp = await axios.get(myUrl);
			let tmp = subscriptionList.filter(x => x.name !== emurText1);
			tmp.push(resp.data);
			setSubscriptionList(tmp);
		} catch (e) {
			console.log(e)
			alert.error(`Error in subscribing ${emurText1}`);
		}
	}

	function DisplayAllOnType() {
		//console.log(subscriptionList);
	return (
		<div>
		{addOnTypeArray.map( (d, index) => {
			let isSub = false;
			let exp = true;
			let tmp = subscriptionList.find(x => x.name === d.name);
			let eStr = "";
			if (tmp) {
				let ttt = new Date(tmp.expiryDate);
				eStr = DATESTR[ttt.getDate()] + "/" + MONTHNUMBERSTR[ttt.getMonth()] + "/"+ttt.getFullYear();
				exp = compareDate(ttt, new Date()) < 0;
				if (!exp) isSub = true;
			}
			return(
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
			<Grid item xs={9} sm={9} md={7} lg={7} >
				<span className={gClasses.patientInfo2}>{d.description}</span>
			</Grid>
			<Grid item xs={2} sm={2} md={1} lg={1} >		
			{(isSub) &&
				<span className={gClasses.patientInfo2Green}>{"Active till "+eStr}</span>
			}
			{(!isSub) &&
				<VsButton name="Subscribe" onClick={() => handleSubscribe(d)} />
			}
			</Grid>
			</Grid>
			</Box>
			)}
		)}
		</div>
	)}

	async function getSMSConfig(cid) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/sms/getconfig/${cid}`;
			let resp = await axios.get(myUrl);
			setSmsconfig(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching SMS subscription `);
			setSmsconfig({});
		}
	}

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
			await getAllAddons();
			await getSubscription(userCid);
		}
		setCurrentCustomerSelection(item)
	}


	function DisplayCustomerFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Profile"  match={currentCustomerSelection} onClick={setSummaryCustomerSelect} />
		<DisplayFunctionItem item="Panel"  match={currentCustomerSelection}  onClick={setSummaryCustomerSelect} />
		{/*<DisplayFunctionItem item="Sms"  match={currentCustomerSelection}  onClick={setSummaryCustomerSelect} />*/}
		<DisplayFunctionItem item="AddOn"  match={currentCustomerSelection} onClick={setSummaryCustomerSelect} />
		<DisplayFunctionItem item="Wallet"  match={currentCustomerSelection}  onClick={setSummaryCustomerSelect} />
	</Grid>	
	</Box>
	)}
	
	async function getAllAddons() {
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

	async function getWalletBalance(cid) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${cid}`;
			let resp = await axios.get(myUrl);
			setBalance(resp.data.wallet);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching balance `);
			setBalance(0);
		}
	}

/*
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
*/


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

	function DisplayWalletBalance(props) {
		//console.log(doctorTypeArray);
	return (
		<Box key={"WALLET"}  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid align="center"  className={gClasses.noPadding} key="PATHDR" container >
		<Grid align="left" item xs={6} sm={6} md={4} lg={4} >
			<span className={gClasses.functionSelected}>{"Wallet Balance: ₹"}</span>
			<span className={gClasses.functionSelected}>{props.balance}</span>
		</Grid>
		<Grid item xs={3} sm={3} md={7} lg={7} />
		<Grid item xs={3} sm={3} md={1} lg={1} >
			<VsButton name="Add wallet" onClick={addToWallet} />
		</Grid>
		</Grid>
		</Box>
	)}

	//-----------------------------------------






	
	
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
			setCurrentCustomerData(status.data);
			sessionStorage.setItem("customerData", JSON.stringify(status.data));
			alert.success(`Updated details of ${status.data.name}`);
			setIsDrawerOpened("");
		} else {
			console.log(e);
			alert.error(`error updating details of ${custName}`);
		}
	}
	
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
				setCurrentCustomerData(status.data);
				sessionStorage.setItem("customerData", JSON.stringify(status.data));
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

	
	function DisplaySingleLine(props) {
		return(
			<Grid className={gClasses.noPadding} key={props.msg1+props.msg2} container align="center">
			<Grid align="left"  item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Blue}>{props.msg1}</Typography>
			</Grid>	
			<Grid align="left"  item xs={8} sm={8} md={10} lg={10} >
				<Typography className={gClasses.patientInfo2}>{props.msg2}</Typography>
			</Grid>	
			</Grid>
	
		)} 

	function DisplayCustomerDetails() {
	let t = new Date();
	let e = new Date(currentCustomerData.expiryDate);
	let hasexpired = compareDate(e, t);
	let expiryDate = `${DATESTR[e.getDate()]}/${MONTHNUMBERSTR[e.getMonth()]}/${e.getFullYear()}`;
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="right" >
		{(hasexpired < 0) &&
		<VsButton name="Recharge Plan" onClick={() => handleCustomerPlanRecharge(currentCustomerData)} />
		}
		<VsButton name="Edit Details" onClick={() => handleEditCustomer(currentCustomerData)} />
		</div>
		<DisplaySingleLine msg1="Name" msg2={currentCustomerData.name} />
		<BlankArea />
		<DisplaySingleLine msg1="Plan Status" msg2={(hasexpired < 0) ? "Plan expired" : "Plan Valid"} />
		<DisplaySingleLine msg1="Plan Expiry" msg2={expiryDate} />
		<DisplaySingleLine msg1="Plan Charges" msg2={currentCustomerData.fee} />
		<DisplaySingleLine msg1="Doctor Name" msg2={currentCustomerData.doctorName} />
		<DisplaySingleLine msg1="" msg2={currentCustomerData.type} />
		<BlankArea />
		<DisplaySingleLine msg1="Clinic Name" msg2={currentCustomerData.clinicName} />
		<BlankArea />
		<DisplaySingleLine msg1="Clinic Addres" msg2={currentCustomerData.addr1} />
		<DisplaySingleLine msg1="" msg2={currentCustomerData.addr2} />
		<DisplaySingleLine msg1="" msg2={currentCustomerData.addr3} />
		<BlankArea />
		<DisplaySingleLine msg1="Mobile" msg2={dispMobile(currentCustomerData.mobile)} />
		<BlankArea />
		<DisplaySingleLine msg1="Email" msg2={dispEmail(currentCustomerData.email)} />
		<BlankArea />
		<DisplaySingleLine msg1="Location" msg2={currentCustomerData.location} />
		<BlankArea />
		<DisplaySingleLine msg1="Pin Code" msg2={currentCustomerData.pinCode} />
		<BlankArea />
	</Box>	
	)}
	
	
	function addNewPanelDoctor() {
		setEmurText1("");
		setEmurText2("");
		setIsDrawerOpened("ADDPANEL");
	}

	function editPanelDoctor(d)  {
		setEmurData(d);
		setEmurText1(d.name);
		setEmurText2(d.mobile);
		setIsDrawerOpened("EDITPANEL");
	}

	function cancelPanelDoctor(name) {
		vsDialog("Remove Panel Doctor", `Are you sure you want to remove ${name} from Panel?`,
			{label: "Yes", onClick: () => cancelPanelDoctorConfirm(name) },
			{label: "No" }
		);
	}

	function cancelPanelDoctorConfirm(name) {
		
		let myIndex = currentCustomerData.doctorPanel.indexOf(name);
		let myDoctor = currentCustomerData.doctorPanel.filter(x => x !== name);

		let mobile = currentCustomerData.doctorMobile[myIndex];
		let myMobile = currentCustomerData.doctorMobile.filter(x => x !== mobile);
	
		console.log(myDoctor, myMobile);
		updatePanelDoctors(myDoctor, myMobile);
	}

	async function handleAddEditPanel() 
	{
		setIsDrawerOpened("");
	}

	async function updatePanelDoctors(newDocList, newMobList) {
		let tmp = JSON.stringify({name: newDocList, mobile: newMobList});
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/customer/updatepaneldoctors/${userCid}/${tmp}`);
			setCurrentCustomerData(resp.data);
			//setDoctorName(resp.data.doctorPanel);
			//set
		} catch (e) {
			alert.error("Error updating panel doctors");
		}
	}

	function DisplayPanelDoctors() {
		console.log(currentCustomerData.doctorPanel);
		console.log(currentCustomerData.doctorMobile);
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsButton name="Add new Doctor" align="right" onClick={addNewPanelDoctor} />
	{(panelSubscribed) &&
	<Container component="main" maxWidth="sm">
	{currentCustomerData.doctorPanel.map( (d, index) => {
		console.log(d);
		console.log(currentCustomerData.doctorMobile[index]);
	return(
		<Box key={"PD"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1}>
		<Grid className={gClasses.noPadding} key={"PANEL"+index} container >
		<Grid align="left" item xs={5} sm={5} md={5} lg={5} >
			<span className={gClasses.patientInfo2Blue}>{d}</span>
		</Grid>
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<span className={gClasses.patientInfo2Blue}>{currentCustomerData.doctorMobile[index]}</span>
		</Grid>
		<Grid align="right" item xs={2} sm={2} md={2} lg={2} >
			<EditIcon color="primary" size="small" onClick={() => editPanelDoctor({ name: d, mobile: currentCustomerData.doctorMobile[index] } )} />
			<CancelIcon color="secondary" size="small" onClick={() => cancelPanelDoctor(d) } />
		</Grid>
		</Grid>
		</Box>
	)})}
	</Container>
	}
	{(!panelSubscribed) &&
	<Typography>Panel not subscribed</Typography>
	}
	</Box>	
	)}

	function handleDate1(d) {
		//console.log(d);
		setEmurDate1(d);
	}

	  
	async function handleRazor (response)  {
		//console.log("in razor response");
		//console.log(response);
		//console.log(orderId);
		//console.log(razOpt);
		if (orderId == response.razorpay_order_id) {
			try {
				let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/razorpaymentok/${userCid}/${emurAmount}/${response.razorpay_payment_id}`;
				//console.log(myURL);
				await axios.get(myURL);
				alert.success(`Successfully recharged amount ${emurAmount}`);
				setBalance(balance+emurAmount);				
			} catch (e) {
				console.log(e);
				alert.error("Error recharging");
			}
		} else {
			alert.error("Order Id mismatch");
		}
	}

	 async function handleAddWallet() {
		let sts;
		setIsDrawerOpened("");

		try {
			// generate order
			let  response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/razor/order/${userCid}/${emurAmount}`);	
			//console.log(response.data);
			let myOpt = response.data
			setRazOpt(myOpt);
			setOrderId(myOpt.order_id);
			//setPayId("");
			//setSignId("");
			
			// now check out
			
			myOpt["handler"] = handleRazor;
			//console.log(myOpt);
			
			var rzp1 = new Razorpay(myOpt);
			rzp1.open();
		} catch (e) {
			//setRegisterStatus(1001);
			console.log(e);
			console.log("Error Razor error");
			alert.error("Error Razor error");
		}
	}


	return (
  <div className={gClasses.webPage} align="center" key="main">
	{(currentCustomer !== "") &&
	<div>
		<DisplayCustomerHeader customer={currentCustomerData} />
		<DisplayWalletBalance balance={balance} />
		<DisplayCustomerFunctionHeader />
		{(currentCustomerSelection == "Profile") &&
			<DisplayCustomerDetails />
		}
		{(currentCustomerSelection == "AddOn") &&
		<div>
		<DisplayAllOnType />
		</div>
		}
		{(currentCustomerSelection == "Wallet") &&
			<Wallet customer={currentCustomerData} />
		}
		{(currentCustomerSelection == "Panel") &&
			<DisplayPanelDoctors customer={currentCustomerData} />
		}
	</div>
	}
	<Drawer anchor="right" variant="temporary"	open={isDrawerOpened !== ""} >
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{(isDrawerOpened === "EDITCUST") &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddEditCustomer}>
			<Typography className={gClasses.title}>{`Edit details of ${currentCustomer}`}</Typography>
			{(sessionStorage.getItem("userType") === "Developer") &&
				<TextValidator fullWidth label="Referral Code" className={gClasses.vgSpacing}
					value={referalCode}
					onChange={(event) => setReferalCode(event.target.value)}
					validators={['noSpecialCharacters']}
					errorMessages={[`Special Characters not permitted`]}
				/>
			}
			<TextValidator required fullWidth label="Customer Name" className={gClasses.vgSpacing}
				value={custName}
				onChange={(event) => setCustName(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Doctor Name" className={gClasses.vgSpacing}
				value={doctorName}
				onChange={(event) => setDoctorName(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
      />
			<TextValidator required fullWidth label="Clinic Name" className={gClasses.vgSpacing}
				value={clinicName}
				onChange={(event) => setClinicName(event.target.value)}
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
			{(sessionStorage.getItem("userType") === "Developer") &&
				<TextValidator fullWidth required className={gClasses.vgSpacing} label="Customer Fee" type="number"
					value={custFee} 
					onChange={() => { setCustFee(event.target.value) }}
					validators={['minNumber:1000']}
					errorMessages={['Invalid Customer Fee']}
				/>
			}
			<BlankArea />
			<ShowResisterStatus/>
      <BlankArea/>
			<VsButton align="center" name={"Update"} type="submit" />
			<ValidComp />  
    </ValidatorForm>
	}	
	{(isDrawerOpened === "ADDWALLET") &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddWallet}>
			<Typography className={gClasses.title}>{"Add to wallet"}</Typography>
			<TextValidator required fullWidth type="number" label="Wallet Amount" className={gClasses.vgSpacing}
				value={emurAmount}
				onChange={(event) => setEmurAmount(Number(event.target.value))}
				validators={['minNumber:100']}
				errorMessages={[`Amount should be at least 100`]}
      />
			<BlankArea />
			<ShowResisterStatus/>
      <BlankArea/>
			<VsButton align="center" name={"Add"} type="submit" />
			<ValidComp />  
    </ValidatorForm>
	}
	{(isDrawerOpened === "ADDADDON") &&
			<ValidatorForm className={gClasses.form} onSubmit={handleAddonConfirm}>
			<Typography className={gClasses.title}>{"Subscribe add on facility "+emurText1}</Typography>
			<br />
			<Typography className={gClasses.title}>{"Set Expiry date"}</Typography>
			<br />
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
			<ShowResisterStatus/>
			<br />
			<VsButton align="center" name={"Subscribe"} type="submit" />
    </ValidatorForm>
	}	{((isDrawerOpened === "ADDPANEL") || (isDrawerOpened === "EDITPANEL")) &&
	<ValidatorForm className={gClasses.form} onSubmit={handleAddEditPanel}>
 		<Typography className={gClasses.title}>{(isDrawerOpened === "ADDPANEL") ? "Add New Panel Doctor" : "Edit Panel Doctor details"}</Typography>
		 <br />
		<TextValidator fullWidth label="Panel Doctor Name" className={gClasses.vgSpacing}
			value={emurText1}
			onChange={(event) => setEmurText1(event.target.value)}
			validators={['noSpecialCharacters']}
			errorMessages={[`Special Characters not permitted`]}
		/>
		<TextValidator required fullWidth label="Panel Doctor Mobile Number" type="number" className={gClasses.vgSpacing}
			value={emurText2}
			onChange={(event) => setEmurText2(event.target.value)}
			validators={['minNumber:1000000000', 'maxNumber:9999999999']}
			errorMessages={['Invalid Mobile Number','Invalid Mobile Number']}
		/>
		<ShowResisterStatus/>
		<BlankArea/>
		<VsButton align="center"  type="submit" name={(isDrawerOpened === "ADDPANEL") ? "Add Panel Doctor" : "Edit Panel Doctor"} />
		<ValidComp /> 
	</ValidatorForm>
	}
	</Box>
	</Drawer>		
 </div>
  );    
}