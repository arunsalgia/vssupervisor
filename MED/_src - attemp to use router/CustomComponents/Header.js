import React, { useState ,useContext} from 'react';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Logo from 'CustomComponents/Logo.js';
import globalStyles from "assets/globalStyles";
import IconButton from '@material-ui/core/IconButton';
import NavMenu from 'CustomComponents/NavMenu.js';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from "react-router-dom";

// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import { Switch, Route } from 'react-router-dom';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
//import { UserContext } from "../../UserContext";
//import axios from "axios";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { TextField, InputAdornment } from "@material-ui/core";
import red from '@material-ui/core/colors/red';
// import { useHistory } from "react-router-dom";
// import SignIn from "./SignIn.js";
import { 
	isUserLogged,
	cdRefresh, encrypt, decrypt, isMobile,
  validateSpecialCharacters, validateMobile, validateEmail,
} from "views/functions.js";

import { CricDreamLogo, BlankArea, ValidComp } from 'CustomComponents/CustomComponents.js';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


// should always be at the top

let headerTitle = "Dr Arun Salgia Dental Clinic";
export default function Header() {
	const history = useHistory();
  const gClasses = globalStyles();
  const [userName, setUserName] = useState(sessionStorage.getItem("userName"));
	const [isLogged, setIsLogged] = useState(isUserLogged());
	//console.log(gClasses);
	
	function handleLogin() {
		//console.log("about to call login");
		history.push('/signin');
	}
	
	/*
			<Typography align="center"  className={gClasses.webHeaderUser}>
			<Link href="#" onClick={handleLogin} variant="body2"></Link>
			{userName}
		</Typography>
*/	

	function DisplayLogin() {
		//console.log("in llgin");
		return (
			<Link href="#" className={gClasses.webHeaderUser} onClick={handleLogin} variant="body2">
				Login
			</Link>
		)
	}

	function DisplayNoLogin() {
		console.log("Logout", userName);
		return (
			<Typography align="center"  className={gClasses.webHeaderUser}>
			{userName}
		</Typography>
		)
	}
	
	console.log(isLogged);
	
	function handleHome() {
			alert("Home to be added");
	}
	
  return (
    <Container component="main" align="center" className={gClasses.webHeader}>
    <Grid key="Header" style={{ display: "flex", justifyContent: "flex-start" }} container justify="center" alignItems="center">
			<Grid align="center" item xs={1} sm={1} md={1} lg={1}>
				<NavMenu />
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<Logo />
			</Grid>
			<Grid align="center" item xs={1} sm={1} md={1} lg={1}>
				<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleHome}
							color="inherit"
						>
							<HomeIcon className={gClasses.icon}/>
				</IconButton>
			</Grid>
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<Typography align="center" className={gClasses.webHeaderTitle}>{headerTitle}</Typography>
			</Grid>
			<Grid item xs={3} sm={3} md={3} lg={3} >
				{(isLogged) &&  <DisplayNoLogin />}
				{(!isLogged) && <DisplayLogin   />}
			</Grid>
		</Grid>
    </Container>
  );
}
