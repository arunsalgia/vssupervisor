import React, { useState, useEffect} from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
//import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import axios from "axios";
import { isMobile } from 'views/functions';
import { 
DATESTR, MONTHNUMBERSTR, HOURSTR, MINUTESTR, 
 } from 'views/globals';
 //import useScript from 'CustomComponents/useScript';

// import classes from '*.module.css';
//var request= require('request');
//import { blue, red, deepOrange, pink } from '@material-ui/core/colors';


//const COUNTPERPAGE=5;

//const DVLOGO = `${process.env.PUBLIC_URL}/DV.JPG`;
//const RAZORSCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

/*
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
*/
//var orderId=""; 
//function setOrderId(sss) { orderId = sss; }

let userCid; 
export default function Wallet(props) {
 // useScript(RAZORSCRIPT);

  //const history = useHistory();
  //const classes = useStyles();
  const gClasses = globalStyles();

	const [transactions, setTransactions] = useState([]);

/*
	const [razOpt, setRazOpt] = useState({});
	const [orderId, setOrderId] = useState("");
	const [payId, setPayId] = useState("");
	const [signId, setSignId] = useState("");
	
	//const [masterTransactions, setMasterTransactions] = useState([]);
	//const [addNewWallet, setAddNewWallet] = useState(false);
	//const [amount, setAmount] = useState(0);
	
	
  //const [minBalance, setMinBalance] = useState(parseInt(process.env.REACT_APP_MINBALANCE));
  //const [balance, setBalance] = useState(0);
  
  
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
*/

  useEffect(() => {
	
		const WalletInfo = async () => {
      try {
        // get wallet transaction 
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${userCid}`);
        setTransactions(response.data);
      } catch (e) {
          console.log(e)
      }
    }
    
		userCid = props.customer._id;
		WalletInfo();
  }, []);

	
	function DisplayWalletTable() {
	let colCount = isMobile() ? 3 : 3;
	return (
		<Box key={"WALLET"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={gClasses.patientInfo2Blue} >
					Date
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={gClasses.patientInfo2Blue} >
					Time
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={gClasses.patientInfo2Blue} >
					Type
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={gClasses.patientInfo2Blue} >
					Trans. Id
					</TableCell>
					<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={gClasses.patientInfo2Blue} >
					Credit
					</TableCell>
					<TableCell key={"TH26"} component="th" scope="row" align="center" padding="none"
					className={gClasses.patientInfo2Blue} >
					Debit
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{transactions.map( (a, index) => {
				//console.log(a);
				let t = new Date(a.transDate);
				let myDate = DATESTR[t.getDate()] + "/" + MONTHNUMBERSTR[t.getMonth()] + "/" + t.getFullYear();
				let myTime = HOURSTR[t.getHours()] + ":" + MINUTESTR[t.getMinutes()];
				let myClass = gClasses.patientInfo2;
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
							{(a.amount < 0) ? Math.abs(a.amount) : ""}
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
	
/*
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
*/

return (
	<DisplayWalletTable />
);
}
