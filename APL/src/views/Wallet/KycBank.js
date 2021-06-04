import React, { useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
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
import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea, JumpButton } from 'CustomComponents/CustomComponents';
import Modal from 'react-modal';
import modalStyles from 'assets/modalStyles';
import {validateSpecialCharacters, validateEmail, cdRefresh,
  ifscBank, ifscBranch, ifscCity, ifscNeft, validateAadhar
} from "views/functions.js";
import { Divider } from '@material-ui/core';
import { blue, red, deepOrange } from '@material-ui/core/colors';

const Number = /^[0-9]+$/;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // backgroundColor: '#84FFFF'
    // backgroundColor: '#A1887F'
  },
  withTopSpacing: {
    marginTop: theme.spacing(1),
  },
  jumpButton: {
    marginTop: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: deepOrange[700],
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(40),
  },

  dashButton: {
    // marginRight: theme.spacing(2),
    //marginLeft: theme.spacing(2),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: blue[900],
  },
  text: {
    backgroundColor: '#FFFF00',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },  
  data: {
    backgroundColor: '#FFFF00',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },  
  ngCard: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    color: deepOrange[900],
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  groupName:  {
    // right: 0,
    fontSize: '16px',
    fontWeight: theme.typography.fontWeightBold,
    color: deepOrange[700],
    alignItems: 'center',
    marginTop: '0px',
  },
  error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      alignItems: 'center',
      marginTop: '0px',
  },
  updatemsg:  {
      // right: 0,
      fontSize: '12px',
      color: blue[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
  hdrText:  {
      // right: 0,
      // fontSize: '12px',
      // color: red[700],
      // // position: 'absolute',
      align: 'center',
      marginTop: '0px',
      marginBottom: '0px',
  },

}));


export default function KycBank(props) {

  //const history = useHistory();
  const classes = useStyles();
  const gClasses = globalStyles();

  const [error, setError] = useState({});
  const [helperText, setHelperText] = useState({});
  const [modalIsOpen,setIsOpen] = useState(false);

  const [account, setAccount] = useState("");
	const [repeatAccount, setRepeatAccount] = useState("");
	const [ifsc, setIfsc] = useState("");
  const [aadhar, setAadhar] = useState("")
  const [name, setName] = useState("");
	const [bank, setBank] = useState("");
	const [branch, setBranch] = useState("");
	const [city, setCity] = useState("");

  const [kycPending, setKycPending]  = useState(false);
  const [submitText, setSubmitText] = useState("Submit")
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [registerStatus, setRegisterStatus] = useState(0);
  const [message, setMessage] = useState("");

  
  function openModal() { setIsOpen(true); }
   
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }

  useEffect(() => {
    const WalletInfo = async () => {
      try {
        // get user details
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${localStorage.getItem("uid")}`);
        setTransactions(response.data);
      

        let myBalance = response.data.reduce((accum,item) => accum + item.amount, 0);
        setBalance(myBalance);
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
  
  function getInput() {
    let aadStr =  document.getElementById("aadhar").value;
    let namStr = document.getElementById("name").value;
		let accStr = document.getElementById("account").value;
    let repAccStr = document.getElementById("repeatAccount").value;
		let ifscStr = document.getElementById("ifsc").value.toUpperCase();
		
    setAadhar(aadStr);
    setName(namStr);
		setAccount(accStr);
    setRepeatAccount(repAccStr);
		setIfsc(ifscStr);
		return {
      aadhar: aadStr,
      name: namStr,
		  account: accStr,
      repeatAccount: repAccStr,
		  ifsc: ifscStr,
		};
  }
	
  async function validate(eid, eid2) {
    getInput();
    let e = document.getElementById(eid);
    let myValue = e.value; 
    //console.log(eid, myValue);
    let newError=false;
    let newText = "";

    // eslint-disable-next-line default-case
    switch (eid) {
      case "aadhar":
        let sts = await validateAadhar(myValue);
        //console.log("Aadhar Check:", sts);
        if (!sts) {
          newError = true;
          newText = 'Invalid Aadhar Number';
        } 
      break;
      case "name":
        if (!validateSpecialCharacters(myValue)) {
          newError = true;
          newText = 'Special characters not permitted';
        } 
      break;
      case "account":
        if (!myValue.match(Number)) {
          newError = true;
          newText = "Account Number has to be numberic";
        }
      break;
      case "repeatAccount":
        let orgAcc = document.getElementById(eid2).value;
        if (myValue !== orgAcc) {
          newError = true;
          newText = "Account Number mismatch";
        }
      break;
      case "ifsc":
      //console.log("Setting ifsc as ", myValue);
      // setPassword(myValue);
      let mybank = await ifscBank(myValue);
      if (mybank === "") {
        newError = true;
        newText = 'Invalid IFSC Code';
      } else if (!ifscNeft(myValue)) {
        newError = true;
        newText = 'Neft not enabled';
      }
      break;
    }
  
    let x = {};
    x[eid] = newError;
    setError(x);
    
    x = {};
    x[eid] = newText;
    setHelperText(x);
    //console.log(x);

    e.focus();
    // console.log("Iserror",newError)
    return newError;
  }
	
	const handleSubmit = async() => {
		let x = getInput();
		let sts;
    sts = await validate("aadhar");
    if (sts) return;
    sts = await validate("account")
		if (sts) return;
    sts = await validate("repeatAccount", "account")
		if (sts) return;
		sts = await validate("ifsc")
		if (sts) return;
    sts = await validate("name")
    if (sts) return;
	
		let code = x.ifsc.toUpperCase();
    let tmp = await ifscBank(code);
		setBank(tmp);
    tmp = await ifscBranch(code);
		setBranch(tmp);
    tmp = await ifscCity(code)
    setCity(tmp);

		//alert("All Ok");
    openModal();
  }
	


  function handleAddWallet() {
    setTab(process.env.REACT_APP_ADDWALLET);
  }

  function handleWithdraw() {
    setTab(process.env.REACT_APP_WITHDRAWWALLET);
  }


  function WalletButton() {
    return (
      <Grid key="jp1" container >
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={process.env.REACT_APP_HOME} text="Home" />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={process.env.REACT_APP_WALLET} text="Wallet" />
      </Grid>
    </Grid>
    )
  }

  function handleConfirm() {
    alert("Confirmed by user")
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={gClasses.paper} align="center">
        <Typography component="h1" variant="h5">Submit KYC</Typography>
        <ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
        <TextValidator variant="outlined" required fullWidth
          id="aadhar" label="Aadhar NUmber" name="aadhar"
          defaultValue={aadhar}
          onChange={(event) => setAadhar(event.target.value)}
          error={error.aadhar}
          helperText={helperText.aadhar}
        />
        <Divider />
		    <BlankArea/>
        <TextValidator variant="outlined" required fullWidth  type="password"
          id="account" label="Bank Account Number" name="account"
          defaultValue={account}
          onChange={(event) => setAccount(event.target.value)}
          error={error.account}
          helperText={helperText.account}
        />
		    <BlankArea/>
        <TextValidator variant="outlined" required fullWidth
          id="repeatAccount" label="Bank Account Number" name="repeatAccount"
          defaultValue={repeatAccount}
          onChange={(event) => setRepeatAccount(event.target.value)}
          error={error.repeatAccount}
          helperText={helperText.repeatAccount}
        />
		    <BlankArea/>
        <TextValidator variant="outlined" required fullWidth
          id="ifsc" label="Bank IFSC Code" name="ifsc"
          defaultValue={ifsc}
          onChange={(event) => setIfsc(event.target.value.toUpperCase())}
          error={error.ifsc}
          helperText={helperText.ifsc}
        />
		    <BlankArea/>
        <TextValidator variant="outlined" required fullWidth
          id="name" label="User Name" name="name"
          defaultValue={name}
          onChange={(event) => setName(event.target.value)}
          error={error.name}
          helperText={helperText.name}
        />
		    <BlankArea/>
	      {/* <ShowResisterStatus/> */}
        <Button  type="submit" variant="contained" color="primary" className={gClasses.submit}
        >
        Submit
        </Button>
	      </ValidatorForm>
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
          <Typography className={classes.new} align="center">
            Confirm Details
          </Typography>
          <BlankArea/>
          <Typography >
            <span className={classes.text}>Aaadhar Number: </span>
            <span className={classes.data}>{aadhar}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>Name: </span>
            <span className={classes.data}>{name}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>Account Number: </span>
            <span className={classes.data}>{account}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>IFSC Code: </span>
            <span className={classes.data}>{ifsc}</span>
          </Typography>
          <Typography>
            <span className={classes.text}>Bank Name: </span>
            <span className={classes.data}>{bank}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>Branch: </span>
            <span className={classes.data}>{branch}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>City: </span>
            <span className={classes.data}>{city}</span>
          </Typography>
          <BlankArea/>
          <Button align="center" variant="contained" color="primary" size="medium"
            // className={classes.dashButton} 
            onClick={handleConfirm}>Confirm
          </Button>
        </Modal>
        <BlankArea />
        <WalletButton />
      </div>
    </Container>
  );
}
