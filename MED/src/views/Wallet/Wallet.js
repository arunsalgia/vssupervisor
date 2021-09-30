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
import { getMinimumBalance, isMobile } from 'views/functions';
import { WALLETTYPE } from 'views/globals';

// import classes from '*.module.css';
var request= require('request');
// import { UserContext } from "../../UserContext";
// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";
import { blue, red, deepOrange, pink } from '@material-ui/core/colors';
// var Insta = require('instamojo-nodejs');


//const INSTAMOJOSCRIPT="https://js.instamojo.com/v1/checkout.js";
const COUNTPERPAGE=5;


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
		color: blue[700]
	},  
	tdWallet : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdBonus : {
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
  

let userCid;

export default function Wallet(props) {
  //useScript(INSTAMOJOSCRIPT);

  //const history = useHistory();
  const classes = useStyles();
  const gClasses = globalStyles();

	const [radioValue, setRadioValue] = useState("all");
	const [masterTransactions, setMasterTransactions] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [addNewWallet, setAddNewWallet] = useState(false);
	const [amount, setAmount] = useState(0);
	
	
  const [minBalance, setMinBalance] = useState(parseInt(process.env.REACT_APP_MINBALANCE));
  const [balance, setBalance] = useState({wallet: 0, bonus: 0});
  
  
  const [registerStatus, setRegisterStatus] = useState(0);
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  // const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [minMessage, setMinMessage] = useState(`Minimum balance of  ${process.env.REACT_APP_MINBALANCE} is required for withdrawal.`)
  
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
	  setMasterTransactions(JSON.parse(localStorage.getItem("saveTransactions")));
	}
	
    const minimumAmount = async () => {
      let amt = await getMinimumBalance();
      setMinBalance(amt); 
      console.log("Min Balance ", amt);
      setMinMessage(`Minimum balance of  ${amt} is required for withdrawal.`);
    }
    
	const WalletInfo = async () => {
      try {
        // get user details
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${sessionStorage.getItem("cid")}`);
        setTransactions(response.data);
        setMasterTransactions(response.data);
				sessionStorage.setItem("saveTransactions", JSON.stringify(response.data));
		
        // let myempty = rowsPerPage - Math.min(rowsPerPage, response.data.length - page * rowsPerPage);
        // setEmptyRows(myempty);

        response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${sessionStorage.getItem("cid")}`);
        setBalance(response.data);
				sessionStorage.setItem("saveBalance", JSON.stringify(response.data));
      } catch (e) {
          console.log(e)
      }
    }
    
		userCid = sessionStorage.getItem("cid");
		WalletInfo();
    minimumAmount()
  }, []);

  function ShowResisterStatus() {
    let myMsg;
    let errmsg = true;
    switch (registerStatus) {
      case 1001:
        myMsg = message;
        errmsg = false;
      break;
      case 1002:
        myMsg = message;
      break;
      case 0:
        myMsg = ``;
        errmsg = false;
      break;      
      default:
        myMsg = `Unknown error code ${registerStatus}`;
        break;
    }
    let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
    return(
      <div>
        <Typography className={myClass}>{myMsg}</Typography>
      </div>
    );
  }


  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    // let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    // setEmptyRows(myempty);

  };


  function handleAddWallet() {
    setTab(process.env.REACT_APP_ADDWALLET);
  }

  function handleWithdraw() {
    if (balance.wallet <= minBalance)
      alert(minMessage);
    else
      setTab(process.env.REACT_APP_WITHDRAWWALLET);
  }


  function WalletButton() {
    return (
      <div>
      <Button type="submit" variant="contained" color="primary"
        onClick={handleAddWallet}
        className={gClasses.button}>Add to Wallet
      </Button>
      <Button type="submit" variant="contained" color="primary" 
       onClick={handleWithdraw}
        className={gClasses.button}>Withdraw
     </Button>
     </div>
    )
  }

  function allData() {
    // console.log(" All");
    setTransactions(masterTransactions);
    setPage(0);
  }

  function walletData() {
    let tmp = masterTransactions.filter(x => x.isWallet === true);
    // console.log(" Wallet", tmp.length);
    setTransactions(tmp);
    setPage(0);
  }

  function bonusData() {
    let tmp = masterTransactions.filter(x => x.isWallet === false);
    // console.log(" Bonus", tmp.length);
    setTransactions(tmp);
    setPage(0);
  }

  function SelectButton() {
  return(
    <Grid key="walletType" align="center" container>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_t20" variant="contained" color="primary" size="small"
    className={gClasses.button} 
    onClick={allData}>
    All
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_odi" variant="contained" color="primary" size="small"
    className={gClasses.button} 
    onClick={walletData}>
    Wallet
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_test" variant="contained" color="primary" size="small"
    className={gClasses.button} 
    onClick={bonusData}>
    Bonus
    </Button>
    </Grid>
    </Grid>      
  )};
  

	function handleRadioChange(v) {
		console.log(v);
		setRadioValue(v);
		let myArray;
		switch (v) {
			case WALLETTYPE.bonus: myArray = masterTransactions.filter(x => x.type === WALLETTYPE.bonus); break;
			case WALLETTYPE.wallet: myArray = masterTransactions.filter(x => x.type === WALLETTYPE.wallet); break;
			default:  	myArray = [].concat(masterTransactions); break;
		}
		setTransactions(myArray);
	}
	
	function DisplayFilterRadios() {
	return (	
		<FormControl component="fieldset">
		<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
			onChange={() => {handleRadioChange(event.target.value); }}
		>
			<FormControlLabel className={classes.filterRadio} value="all" 			control={<Radio color="primary"/>} label="All Transactions" />
			<FormControlLabel className={classes.filterRadio} value="wallet" 	control={<Radio color="primary"/>} label="Wallet Transactions" />
			<FormControlLabel className={classes.filterRadio} value="bonus"  		control={<Radio color="primary"/>} label="Bonus Transactions" />
		</RadioGroup>
	</FormControl>
	)}
	
	function DisplayWalletTable(props) {
	let colCount = isMobile() ? 3 : 3;
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={colCount}>
					{"Wallet details"}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH3"} component="th" scope="row" align="center" padding="none"
						className={classes.th} colSpan={colCount}>
						<DisplayFilterRadios />
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Date
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Type
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Amount
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{props.myArray.map( (a, index) => {
				let myDate = getDateTime(a.date);
				let myType;
				let myClass; 
				switch (a.visit) {
					case WALLETTYPE.bonus: myType = "Bonus"; myClass = classes.tdWallet; break;
					case WALLETTYPE.wallet: myType = "Wallet"; myClass = classes.tdBonus; break;
				}
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myDate}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{myType}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{a.amount}
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
	
	function handleAddWallet() {
		alert("Amount to add is "+amount);
	}

  return (
    <Container component="main" maxWidth="md">
      <DisplayBalance wallet={balance.wallet} bonus={balance.bonus}/>
      <CssBaseline />
      <div className={gClasses.paper}>
        <ShowResisterStatus />
        <BlankArea />
				{(!addNewWallet) &&
					<div align="right">
					<Typography align="right" className={classes.link}>
						<Link align="right" href="#" variant="body2" onClick={() => { setAmount(0); setAddNewWallet(true);  }}>Add to wallet</Link>
					</Typography>
					</div>
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
										autoFocus
										value={amount}
										validators={['minNumber:100']}
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
