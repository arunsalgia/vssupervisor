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


import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';


// styles
import globalStyles from "assets/globalStyles";

import {DisplayPageHeader, ValidComp, BlankArea, DisplayCustomerBox, DisplayCustomerHeader, DisplayBalance,
} from "CustomComponents/CustomComponents.js"



import { dispEmail, disablePastDt, vsDialog,  encrypt} from 'views/functions';
import { DATESTR, MONTHNUMBERSTR } from 'views/globals';

const ADDONPLANTYPE = ["ANNUAL", "MONTHLY", "LIFETIME"];

const SMSRECEIVERS = ["Doctor", "Patient"];
export default function Doctorsms() {
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [isDrawerOpened, setIsDrawerOpened] = useState("");

	const [receiver, setReceiver] = useState("Doctor");
	const [header, setHeader] = useState("VRGSER");
	const [messageId, setMessageId] = useState("");
	const [emurCount, setEmurCount] = useState(0);
	const [emurText1, setEmurText1] = useState("");
	const [emurText2, setEmurText2] = useState("");
	const [emurText3, setEmurText3] = useState("");
	const [emurText4, setEmurText4] = useState("");
	const [emurText5, setEmurText5] = useState("");
	
	const [customerSelection, setCustomerSelection] = useState([]);
	const [docSelected, setDocSelected] = useState(true);
	
	
	const [custNumber, setCustNumber] = useState(0);
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


	const [emurAmount, setEmurAmount] = useState(0);

	const [emurCb1, setEmurCb1] = useState(false);
	const [emurCb2, setEmurCb2] = useState(false);
	const [emurCb3, setEmurCb3] = useState(false);
	//const [emurCb4, setEmurCb4] = useState(false);
	//const [emurCb5, setEmurCb5] = useState(false);
	

	const [doctorTypeArray, setDoctorTypeArray] = useState([]);
	const [addOnTypeArray, setAddOnTypeArray] = useState([]);
	const [festivalArray, setFestivalArray] = useState([]);

  useEffect(() => {       
    getAllCustomers();
	}, []);
	
	async function getAllCustomers () {
		try {
			let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/customer/list`;
			let resp = await axios.get(myURL);
			setCustomerArray(resp.data);
			setCustomerSelection(new Array(resp.data.length).fill(false));
		} catch(e) {
			console.log(e);
			setCustomerArray([]);
		}

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



	function handleDate1(d) {
		//console.log(d);
		setEmurDate1(d);
	}

	function addCustomer(idx) {
		let tmpArray = lodashCloneDeep(customerSelection);
		tmpArray[idx] = !tmpArray[idx];
		setCustomerSelection(tmpArray);
		
		let newSel = true;
		for(let i=0; i<tmpArray.length; ++i) {
			if (tmpArray[i]) { newSel = false; break; }
		}
		setDocSelected(newSel);
	}
	
	function DisplayAllDoctors() {
	return (	
	<Grid className={gClasses.noPadding} key="DOCLIST" container>
	{customerArray.map( (d, index) =>
		<Grid align="left" key={"DOC"+index} item xs={6} sm={6} md={3} lg={3} >
		<VsCheckBox align="left" checked={customerSelection[index]} onClick={() => addCustomer(index)} label={d.doctorName} />
		</Grid>
	)}
	</Grid>
	)}
	
	async function sendSmsToDoctors() {
		// make parameters list
		let myParamList = [];
		switch (emurCount) {
			case 5: myParamList.push(emurText5);
			case 4: myParamList.push(emurText4);
			case 3: myParamList.push(emurText3);
			case 2: myParamList.push(emurText2);
			case 1: myParamList.push(emurText1);			
		}
		myParamList = myParamList.reverse();
		let myParams = myParamList.join("|");
		
		// Make doctor list`
		let myDoctorList=[];
		for(let i=0; i<customerSelection.length; ++i) {
			if (customerSelection[i]) myDoctorList.push(customerArray[i]._id);
		}
		
		let tmp = {
			receiver: receiver,
			doctorList: myDoctorList,
			header: header,
			messageId: messageId,
			params: myParams
		};
		tmp = encodeURIComponent(JSON.stringify(tmp));
		
		try {
			let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/sms/supervisor/${tmp}`;
			await axios.get(myURL);
		} catch(e) {
			console.log(e);
			alert.error("Unable to send SMS");
		}
		setIsDrawerOpened("");		
	}

	return (
		<div className={gClasses.webPage} align="center" key="main">
		<Container component="main" maxWidth="lg">
		<br />
		<DisplayPageHeader headerName="SMS to Doctors / Patients" groupName="" tournament=""/>
		<br />
		<Grid className={gClasses.noPadding} key="SMS" container>
		<Grid align="right"  item xs={12} sm={12} md={5} lg={5} >
			<Typography className={gClasses.title}>Send SMS to </Typography>
		</Grid>
		<Grid align="right"  item xs={false} sm={false} md={1} lg={1} />
		<Grid align="left"  item xs={12} sm={12} md={6} lg={6} >
			<VsRadioGroup label="Send SMS to " color="primary" value={receiver} 
				onChange={(event) => setReceiver(event.target.value)}
				radioList={SMSRECEIVERS}
			/>
		</Grid>	
		</Grid>
		<br />
		<DisplayAllDoctors />
		<br />
		<VsButton disabled={docSelected} name={"Send SMS to selected "+receiver+"s"} align="center" onClick={() => setIsDrawerOpened("SENDSMS")} />
		<Drawer anchor="right" variant="temporary"	open={isDrawerOpened !== ""} >
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		{(isDrawerOpened == "SENDSMS") &&
		<ValidatorForm className={gClasses.form} onSubmit={sendSmsToDoctors}>
			<Typography className={gClasses.title}>Send Message to Doctor</Typography>
			<TextValidator required fullWidth label="Header" className={gClasses.vgSpacing}
				value={header}
				onChange={(event) => setHeader(event.target.value)}
				validators={['noSpecialCharacters']}
				errorMessages={[`Special Characters not permitted`]}
			/>
			<TextValidator required fullWidth label="Message Id" type="number" className={gClasses.vgSpacing}
				value={messageId}
				onChange={(event) => setMessageId(event.target.value)}
				validators={['minNumber:111111', 'maxNumber:999999']}
				errorMessages={['6 digit Message Id','6 digit Message Id']}
			/>
			<TextValidator required fullWidth label="Number of parameters" type="number" className={gClasses.vgSpacing}
				value={emurCount}
				onChange={(event) => setEmurCount(Number(event.target.value))}
				validators={['minNumber:0', 'maxNumber:4']}
				errorMessages={['Invalid Count','Invalid Count']}
			/>
			<TextValidator  fullWidth label="Parameter 1" type="text" className={gClasses.vgSpacing}
				required={emurCount > 0}
				value={emurText1}
				onChange={(event) => setEmurText1(event.target.value)}
			/>
			<TextValidator  fullWidth label="Parameter 2" type="text" className={gClasses.vgSpacing}
				required={emurCount > 1}
				value={emurText2}
				onChange={(event) => setEmurText2(event.target.value)}
			/>
			<TextValidator  fullWidth label="Parameter 3" type="text" className={gClasses.vgSpacing}
				required={emurCount > 2}
				value={emurText3}
				onChange={(event) => setEmurText3(event.target.value)}
			/>
			<TextValidator  fullWidth label="Parameter 4" type="text" className={gClasses.vgSpacing}
				required={emurCount > 3}
				value={emurText4}
				onChange={(event) => setEmurText4(event.target.value)}
			/>			
			<BlankArea />
			<ShowResisterStatus/>
			<BlankArea/>
			<VsButton align="center" name={"Send Message to "+receiver+"s"}  type="submit" />
			<ValidComp />  
		</ValidatorForm>
	}
	</Box>
	</Drawer>		
	</Container>
	</div>
	);    
}