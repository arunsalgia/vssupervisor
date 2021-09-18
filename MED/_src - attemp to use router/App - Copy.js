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





import { 
isUserLogged,
isMobile, cdRefresh, specialSetPos, 
encrypt, 
} from "views/functions.js"



const hist = createBrowserHistory();


function AppRouter() {
	let history={hist}

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

	return (
	<Router history={hist}>
	<div >
	{/*<Redirect  exact from='/' to="/welcome/" />*/}
	
		<Route path="/welcome" 			component={Welcome} />

		<Route path="/signin" 			component={SignIn} />
		<Route path="/signout" 			component={SignUp} />

		<Route path="/medicine" 		component={Medicine} />
		<Route path="/patient" 			component={Patient} />

		<Route path="/visit" 				component={Visit} />
		<Route path="/appointment" 	component={Appointment} />
	</div>
   </Router>
);
}

export default AppRouter;
