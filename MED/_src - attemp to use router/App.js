import React, { useState, useMemo } from "react";
import { Redirect, Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext";

import SignIn from "views/Login/SignIn.js";
import SignUp from "views/Login/SignUp.js";

import Header from "CustomComponents/Header";

import Welcome from "views/MED/Welcome.js"
import Appointment from "views/Appointment/Appointment.js"
import Visit from "views/Visit/Visit.js"
import Patient from "views/Patient/Patient.js"
import Medicine from "views/Medicine/Medicine.js"

import "assets/css/material-dashboard-react.css?v=1.9.0";
// import { DesktopWindows } from "@material-ui/icons";
import { CricDreamTabs, setTab }from "CustomComponents/CricDreamTabs"
import axios from "axios";
import ResetPassword from "views/Login/ResetPassword";
//import JoinGroup from "views/Group/JoinGroup.js"
import ForgotPassword from "views/Login/ForgotPassword.js";
import IdleTimer from 'react-idle-timer'
import { setIdle }from "views/functions.js"
//import Wallet from "views/Wallet/Wallet";
import { PinDropSharp } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { 
isUserLogged,
isMobile, cdRefresh, specialSetPos, 
encrypt, 
} from "views/functions.js"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

const hist = createBrowserHistory();


function AppRouter() {
	let history={hist}
	const classes = useStyles();

  const [isLogged, setIsLogged] = useState(isUserLogged());
	
  //const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  var idleTimer = null;
  
  // console.log(`000. User is ${localStorage.getItem("uid")}`)
  
  async function handleOnActive (event) {
    // console.log('user is active', event);
  }

  async function handleOnAction (event) {
    // console.log(`Action from user ${sessionStorage.getItem("uid")}`);
  } 


  async function handleOnIdle (event) {
    // console.log('user is idle', event);
    // console.log('last active', idleTimer.getLastActiveTime());
    setIdle(true);
  }

	let xxx = sessionStorage.getItem("currentLogin");
	
	if (isUserLogged()) {
		return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            {"Dr Arun Clinic"}
          </Typography>
          <Button color="inherit">Appointment</Button>
          <Button color="inherit">Visit</Button>
					<Button color="inherit">Patient</Button>
					<Button color="inherit">Medicine</Button>
          <Typography variant="h6" className={classes.title}>
            Arun Salgia
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
	} else {
		let myCurrent = sessionStorage.getItem("currentLogin");
		console.log(myCurrent);
		sessionStorage.setItem("currentLogin", "");
		switch (myCurrent) {
			case "SIGNIN": return (<SignIn />); break;
			case "SIGNUP": return (<SignUp />); break;
			default:  return (<Welcome />); break;
		}
	}
}

export default AppRouter;
