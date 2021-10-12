import React, { useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import axios from "axios";
//import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea, DisplayBalance } from 'CustomComponents/CustomComponents';
import { getMinimumBalance, isMobile, getDateTime } from 'views/functions';
import { WALLETTYPE,
DATESTR, MONTHNUMBERSTR, HOURSTR, MINUTESTR, 
 } from 'views/globals';
import useScript from './useScript';

// import classes from '*.module.css';
var request= require('request');
// import { UserContext } from "../../UserContext";
// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";
import { blue, red, deepOrange, pink } from '@material-ui/core/colors';


const COUNTPERPAGE=5;

const DVLOGO = `${process.env.PUBLIC_URL}/DV.JPG`;
const RAZORSCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const useStyles = makeStyles((theme) => ({
	filterRadio: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
			color: '#000000',	
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
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
	},  
	tdBonus: {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdWallet : {
		backgroundColor: pink[100],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
  wallet : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    backgroundColor: '#B3E5FC',
  },
  bonus : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    backgroundColor: '#FFC0CB',
  },
}));
  
var orderId=""; 
function setOrderId(sss) { orderId = sss; }

let userCid; 
export default function Wallet(props) {
  useScript(RAZORSCRIPT);

  //const history = useHistory();
  const classes = useStyles();
  const gClasses = globalStyles();

	const [razOpt, setRazOpt] = useState({});
	//const [orderId, setOrderId] = useState("");
	const [payId, setPayId] = useState("");
	const [signId, setSignId] = useState("");
	
	const [masterTransactions, setMasterTransactions] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [addNewWallet, setAddNewWallet] = useState(false);
	const [amount, setAmount] = useState(0);
	
	
  const [minBalance, setMinBalance] = useState(parseInt(process.env.REACT_APP_MINBALANCE));
  const [balance, setBalance] = useState({wallet: 0, bonus: 0});
  
  
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);

  // const [emptyRows, setEmptyRows] = useState(0);
  //const [minMessage, setMinMessage] = useState(`Minimum balance of  ${process.env.REACT_APP_MINBALANCE} is required for withdrawal.`)
  
  // have we come via route
  //console.log("Wallet", localStorage.getItem("menuValue"));
  // console.log("details from Insta",
  // sessionStorage.getItem("payment_id"),
  // sessionStorage.getItem("payment_status"),
  // sessionStorage.getItem("payment_request_id")
  // );
  useEffect(() => {
	  
		if (localStorage.getItem("saveBalance"))
				setBalance(JSON.parse(localStorage.getItem("saveBalance")));

		if (localStorage.getItem("saveTransactions")) {
			setTransactions(JSON.parse(localStorage.getItem("saveTransactions")));
		}
	
		const WalletInfo = async () => {
      try {
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${userCid}`);
        setTransactions(response.data);
        setMasterTransactions(response.data);
				sessionStorage.setItem("saveTransactions", JSON.stringify(response.data));

        response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${userCid}`);
        setBalance(response.data);
				sessionStorage.setItem("saveBalance", JSON.stringify(response.data));
      } catch (e) {
          console.log(e)
      }
    }
    
		userCid = sessionStorage.getItem("cid");
		WalletInfo();
  }, []);

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    // let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    // setEmptyRows(myempty);

  };


	
	function DisplayWalletTable(props) {
	let colCount = isMobile() ? 3 : 3;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={6}>
					{`Transaction details (Balance ${balance.wallet})`}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Date
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Time
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Type
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Trans. Id
					</TableCell>
					<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Credit
					</TableCell>
					<TableCell key={"TH26"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Debit
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{props.myArray.map( (a, index) => {
				//console.log(a);
				let t = new Date(a.transDate);
				let myDate = DATESTR[t.getDate()] + "/" + MONTHNUMBERSTR[t.getMonth()] + "/" + t.getFullYear();
				let myTime = HOURSTR[t.getHours()] + ":" + MINUTESTR[t.getMinutes()];
				let myClass = classes.tdWallet;
				//console.log(a);
				//console.log(a.type, myType, WALLETTYPE  )
				return(
					<TableRow align="center" key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography>
							{myDate}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography>
							{myTime}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography>
							{a.transType}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography>
							{a.transSubType}
						</Typography>
					</TableCell>
					<TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography>
							{(a.amount >= 0) ? parseFloat(a.amount).toFixed(2) : ""}
						</Typography>
					</TableCell>
					<TableCell key={"TD6"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography>
							{(a.amount < 0) ? abs(a.amount) : ""}
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
	
	async function orghandleRazor(response) {
		// AFTER RAZOR TRANSACTION IS COMPLETE and SUCCESSFULL YOU WILL GET THE RESPONSE HERE.
		console.log(response);
		let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/razorpaymentok/${userCid}/${amount}/${response.razorpay_payment_id}`;
    
    try {
			console.log(myURL);
      await axios.get(myURL);
			setTab(process.env.REACT_APP_WALLET);
    } catch (e) {
      console.log(e);
      //setRegisterStatus(1002);
    }
	}
  
	async function handleRazor (response)  {
		//console.log("in razor response");
		//console.log(response);
		//console.log(orderId);
		//console.log(razOpt);
		if (orderId == response.razorpay_order_id) {
			try {
				let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/razorpaymentok/${userCid}/${amount}/${response.razorpay_payment_id}`;
				//console.log(myURL);
				await axios.get(myURL);
				setTab(process.env.REACT_APP_WALLET);
			} catch (e) {
				console.log(e);
				//setRegisterStatus(1002);
			}
		} else {
			alert("Order Id mismatch");
		}
	}

	 async function handleAddWallet() {
		let sts;

		//paymentRequest = "";
		//paymentId = "";

		try {
			// generate order
			let  response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/razor/order/${userCid}/${amount}`);	
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
		}
	}


  return (
    <Container component="main" maxWidth="lg">
      <DisplayBalance wallet={balance.wallet} bonus={balance.bonus}/>
      <CssBaseline />
      <div className={gClasses.paper}>
				{(!addNewWallet) &&
					<VsButton name="Add to wallet" align="right" onClick={() => { setAmount(0); setAddNewWallet(true);  }} />
				}
				{(addNewWallet) &&
					<Box align="center" className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} width="100%" >
						<VsCancel align="right" onClick={() => {setAddNewWallet(false)}} />
							<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddWallet} >
							<Grid key="AddWalet" container justify="center" alignItems="center" >
								<Grid item xs={2} sm={2} md={2} lg={2} />
								<Grid item xs={3} sm={3} md={3} lg={3} >
								<Typography>
								<span className={gClasses.patientName}>Add amount to wallet</span>
								</Typography>
								</Grid>
								<Grid item xs={2} sm={2} md={2} lg={2} >
									<TextValidator variant="outlined" required fullWidth color="primary" type="number"
										id="amount" label="Add amount" name="amount"
										onChange={(event) => setAmount(event.target.value)}
										value={amount}
										validators={['minNumber:50']}
										errorMessages={['Minimum is 100']}
									/>
								</Grid>
								<Grid item xs={2} sm={2} md={2} lg={2} >
									<VsButton name="Add" />
								</Grid>
							</Grid>
							<Grid item xs={3} sm={3} md={3} lg={3} />
							</ValidatorForm>
					</Box>
				}
				<DisplayWalletTable myArray={transactions} />
        <BlankArea />
      </div>
    </Container>
  );
}
