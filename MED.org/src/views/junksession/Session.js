import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import SwitchBtn from '@material-ui/core/Switch';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import TextField from '@material-ui/core/TextField';
import { TextField, InputAdornment } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { Switch, Route } from 'react-router-dom';
// import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
// import SignUp from "../Login/SignUp.js";
// import ForgotPassword from "./ForgotPassword.js";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserContext";
import axios from "axios";
import {red, green, blue, yellow } from '@material-ui/core/colors';
import { DesktopWindows } from '@material-ui/icons';
import { isMobile, cdRefresh, specialSetPos, encrypt, clearBackupData, downloadApk } from "views/functions.js"
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { CricDreamLogo } from 'CustomComponents/CustomComponents.js';
import { BlankArea, ValidComp } from 'CustomComponents/CustomComponents';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
	radio: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: "blue",
	},
  android: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  download: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  downloadButon: {
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
  error:  {
    // right: 0,
    fontSize: '12px',
    color: blue[700],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
},
}));

const StringValidator = ['required', 'minLength', 'noSpecialCharacters'];
const StringErrorMessage = ['User Name to be provided', 'Mimumum 6 characters required', "No Special Char permitted"];

const NumberValidator = ['required', 'noSpecialCharacters', 'isNumeric'];
const NumberErrorMessage = ['Patient Id to be provided', "No Special Char permitted", "Numberic input required"];

export default function Session() {
  const classes = useStyles();
  const gClasses = globalStyles();
  const history = useHistory();
  const [userName, setUserName] = useState("");
	const [ id, setId] = useState("");
	const [old, setOld] = useState(true);
	const [registerStatus, setRegisterStatus] = useState(0);
	const [labelText, setLabelText] = useState("Patient Name")
	const [userValidators, setUserValidators] = useState(StringValidator);
	const [userErrors, setUserErrors] = useState(StringErrorMessage);
	
	/**
  const [password, setPassword] = useState();
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ downloadMessage, setDownloadMessage ] = useState("");
	**/
	
  // const [errorFound, setErrorFound] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("logout")) {
      localStorage.clear();
    }
    if (window.localStorage.getItem("uid")) {
      // setUser({ uid: window.localStorage.getItem("uid"), admin: window.localStorage.getItem("admin") })
      // history.push("/admin")
    } else {
      // setShowPage(true)
    }
  });

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
      case 601:
        myMsg = "User Name Invalid / Blank";
        break;
      case 602:
        myMsg = "Patient Id Invalid / Blank";
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


  function setError(msg, isError) {
    setErrorMessage({msg: msg, isError: isError});
  }

	function handleOldNewChange()  {
		if (old) {
			setOld(false);
			setLabelText("Patient Id");
			setUserValidators(NumberValidator);
			setUserErrors(NumberErrorMessage);
		} else {
			setOld(true);
			setLabelText("Patient Name");
			setUserValidators(StringValidator);
			setUserErrors(StringErrorMessage);
		}
		setUserName("");	// blank the input field of name / id
  };
	
	function SelectOldNew() {
		return (
			<div>
				<FormControlLabel
				className={classes.radio}
        control={
          <SwitchBtn
            checked={!old}
            onChange={handleOldNewChange}
            color="primary"
          />
        }
        label="New Patient"
      />
    </div>
		)
	}
	
	function ShowId() {
		if (old) 
			return (
				<div>
				<TextField
					id="id"
					label="Patient Id"
					variant="outlined"
					required
					fullWidth
					defaultValue={id}
					// autoFocus
					//onChange={(event) => setId(event.target.value)}
          />
				</div>
			)
		else
			return (
				<div>
				</div>
			)
	}
  

	const handleSubmit = async () => {
		let err = 0;
		let myData = userName;
		console.log(myData);
		if (old)	{
			if (myData == "Arun Salgia") {
				//setUserName(myData);
			} else {
				err = 601;	
			}
		}
		else	{
			if (myData == "123456") {
				//setId(myData);
			} else {
				err = 602;	
			} 
		}
		setRegisterStatus(err);
		if (err == 0) {
			alert("in new page");
		}
		console.log("Reg", err);
	};

	return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
       <div className={gClasses.paper}>  
				<Typography component="h1" variant="h5">Appointments</Typography>
				<SelectOldNew />
				<ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
					<TextValidator variant="outlined" required fullWidth color="primary"
          id="userName" label={labelText} name="userName"
          onChange={(event) => setUserName(event.target.value)}
          validators={userValidators}
          errorMessages={userErrors}
          value={userName}
					/>
					<BlankArea />
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={gClasses.submit}
					>
						Continue
					</Button>
				</ValidatorForm>
				<ShowResisterStatus/>
        <BlankArea />
				<ValidComp />    
      </div>
      {/*<Route  path='/admin/emailpassword' component={Reset} key="MemberList"/>*/}
    </Container>
  );
}
