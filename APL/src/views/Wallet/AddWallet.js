import React, { useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import { makeStyles } from '@material-ui/core/styles';
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
// import { red, deepOrange } from '@material-ui/core/colors';
// var Insta = require('instamojo-nodejs');

export default function AddWallet() {
  //useScript(INSTAMOJOSCRIPT);

  // const history = useHistory();
  // const classes = useStyles();
  const gClasses = globalStyles();
  const [amount, setAmount] = React.useState(100);
  const [registerStatus, setRegisterStatus] = useState(0);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [emptyRows, setEmptyRows] = React.useState(0);
  const [page, setPage] = React.useState(0);

  
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

  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div align="center" className={gClasses.paper}>
      <Typography component="h1" variant="h5">
        Add to Wallet
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
