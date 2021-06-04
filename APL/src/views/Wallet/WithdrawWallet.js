import React, { useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import axios from "axios";
import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea, ValidComp, JumpButton } from 'CustomComponents/CustomComponents.js';
var request= require('request');
// import { UserContext } from "../../UserContext";
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";
import { red, deepOrange, yellow, blue, green } from '@material-ui/core/colors';
// var Insta = require('instamojo-nodejs');

const useStyles = makeStyles((theme) => ({
  pending : {
   fontSize: theme.typography.pxToRem(16),
   fontWeight: theme.typography.fontWeightBold,
   color: red[700],
  },
  docpending : {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    color: yellow[700],
  },
  submitted : {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    color: blue[700],
  },
  verified : {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    color: green[700],
  },
 
}));

export default function WithdrawWallet() {
  //useScript(INSTAMOJOSCRIPT);

  // const history = useHistory();
  const classes = useStyles();
  const gClasses = globalStyles();
  const [amount, setAmount] = React.useState(100);
  const [registerStatus, setRegisterStatus] = useState(0);
  const [kycId, setKycId] = useState("PENDING");
  const [kycBank, setKycBank] = useState("PENDING");
  const [balance, setBalance] = useState(0);
  const [withdrawDisable, setWidthrawDisable] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [emptyRows, setEmptyRows] = React.useState(0);
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    const WalletInfo = async () => {
      try {
        // get user details
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${localStorage.getItem("uid")}`);
        let myBalance = response.data.reduce((accum,item) => accum + item.amount, 0);
        setBalance(myBalance);
        if (balance > 300)
          setWidthrawDisable(false)
      } catch (e) {
          console.log(e)
      }
    }
    WalletInfo();
  }, []);

  
  function ShowResisterStatus() {
    let myMsg;
    let errmsg = true;
    switch (registerStatus) {
      case 1001:
        myMsg = 'Error connecting to Payment gateway';
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
 
    
  async function handleSubmit() {
    setRegisterStatus(0);
    try {
      var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/generatepaymentrequest/${localStorage.getItem("uid")}/${amount}`);
      //let myrequestid = response.data;
      let resp = await window.open(`${process.env.REACT_APP_GATEWAYURL}/${response.data}`, '_parent');
    } catch (e) {
      setRegisterStatus(1001);
      console.log(e);
      console.log("Error calling wallet");
    }
  }

  function IdKYC() {
    let myClass;
    switch (kycId) {
      case "DOCPENDING": myClass = classes.docpending; break;
      case "SUBMITTED" : myClass = classes.submitted; break;
      case "VERIFIED"  : myClass = classes.verified; break;
      default:           myClass = classes.pending; break; 
    }
    return (
      <Typography align="left">
        <span>ID Proof KYC </span><span className={myClass}>{kycId}</span>
      </Typography>
    );
  }

  function BankKYC() {
    let myClass;
    switch (kycBank) {
      case "DOCPENDING": myClass = classes.docpending; break;
      case "SUBMITTED" : myClass = classes.submitted; break;
      case "VERIFIED"  : myClass = classes.verified; break;
      default:           myClass = classes.pending; break; 
    }
    return (
      <Typography align="left">
        <span>Bank Proof KYC </span><span className={myClass}>{kycBank}</span>
      </Typography>
    );
  }

  function handleKyc() {
    setTab(process.env.REACT_APP_KYCBANK);
  }

  function KycForm() {
    return (
      <div>
        <Typography component="h1" variant="h5">KYC Status</Typography>
        <IdKYC/>
        <BankKYC />
        <Button variant="contained" color="primary" className={gClasses.submit}
        onClick={handleKyc}
        >
        Submit Kyc
        </Button>
      </div>
    )
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div align="center" className={gClasses.paper}>
      <KycForm />
      <BlankArea />
      <Typography component="h1" variant="h5">
        Withdraw from Wallet
      </Typography>
      
      <ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
      <TextValidator variant="outlined" required       
          label="Amount to add"
          onChange={(event) => setAmount(event.target.value)}
          type="number"
          validators={['required', 'minNumber:100',]}
          errorMessages={['Amount to be provided', 'Minimum amount 100']}
          value={amount}
      />
      <BlankArea/>
      <ShowResisterStatus/>
      <BlankArea/>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={gClasses.submit}
      >
        Add
    </Button>
    </ValidatorForm>
    <BlankArea/>
    <Grid key="jp1" container >
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={process.env.REACT_APP_HOME} text="Home" />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={process.env.REACT_APP_WALLET} text="Wallet" />
      </Grid>
    </Grid>
    </div>
    <ValidComp/>    
    </Container>
  );
}
