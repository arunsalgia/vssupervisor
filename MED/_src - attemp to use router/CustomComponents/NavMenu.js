import React, { useEffect } from 'react';
//import { createBrowserHistory } from "history";
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu'; 
import {red, blue, green, deepOrange} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
// cd items import

//import Dash from "views/Dashboard/Dashboard"
//import Stats from "views/Statistics/Statistics"
//import MyTeam from "views/MyTeam/MyTeam"

//import Auction from "views/Auction/Auction"
//import Captain from "views/Captain/Captain"
//import Match from "views/UpcomingMatch/UpcomingMatch"
//import Group from "views/Group/Group"

//import Wallet from "views/Wallet/Wallet.js"
//import AddWallet from "views/Wallet/AddWallet";
//import WithdrawWallet from "views/Wallet/WithdrawWallet";
// import KycBank from "views/Wallet/KycBank";
// import KycDocs from "views/Wallet/KycDocs";

//import PlayerInfo from "views/MED/PlayerInfo";
// import Profile from "views/Profile/Profile.js"
import Profile from "views/Profile/UserProfile"
import ChangePassword from "views/Login/ChangePassword.js"
import About from "views/MED/About.js";
import Home from "views/MED/Home.js";
//import ContactUs from "views/MED/ContactUs.js";
//import PointSystem from "views/MED/PointSystem.js";

//import SU_Tournament from "views/SuperUser/Tournament.js" 
//import SU_Player from "views/SuperUser/Player.js" 
//import SU_Image from "views/SuperUser/Image.js"

import Appointment from "views/Appointment/Appointment.js"
import Visit from "views/Visit/Visit.js"
import SU_Patient from "views/SuperUser/Patient.js"
import SU_Medicine from "views/SuperUser/Medicine.js"

//import NewGroup from "views/Group/NewGroup.js"
//import JoinGroup from "views/Group/JoinGroup.js"
//import GroupDetails from "views/Group/GroupDetails.js"

import Modal from 'react-modal';
// import download from 'js-file-downloader';
import { BlankArea } from './CustomComponents';
import {isUserLogged, cdRefresh,
	
	specialSetPos, upGradeRequired, 
  downloadApk, clearBackupData,
  checkIdle, setIdle,
  internalToText, textToInternal,
} from "views/functions.js"
import { LocalSee } from '@material-ui/icons';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#000000',
    color                 : '#FFFFFF',
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  noSpacing: { 
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon : {
    color: '#FFFFFF',
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  statButton: {
    //marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  teamButton: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  dashButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: '#FFFFFF'
  },
  whatIsNew: {
    backgroundColor: '#B3E5FC',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
    // width: theme.spacing(10),
    // height: theme.spacing(10),
  
  },
  avatar1: {
    margin: theme.spacing(0),
    backgroundColor: deepOrange[500],
    color: theme.palette.getContrastText(deepOrange[500]), 
    // width: theme.spacing(10),
    // height: theme.spacing(10),  
  },
}));

export function setTab(num) {
  
  //myTabPosition = num;
  //console.log(`Menu pos ${num}`);
  localStorage.setItem("menuValue", num);
  cdRefresh();
}

export default function NavMenu() {
  const history = useHistory();
  const classes = useStyles();
  // for menu 
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // for group menu
  const [grpAuth, setGrpAuth] = React.useState(true);
  const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
  const grpOpen = Boolean(grpAnchorEl);
  const [arunGroup, setArunGroup] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
  const [userGroup, setUserGroup] = React.useState([]);
  const [latestApk, setLatestApk] = React.useState(null);

  //console.log(location.pathname);

  useEffect(() => {       
  
	}, 
	[]);


  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  

  function setMenuValue(num) {
    setValue(num);
    handleClose();
    localStorage.setItem("menuValue", num);
  }

	function jumpToPage(sss) {
		handleClose();
		if (!isUserLogged()) sss = '/welcome';	
		console.log("SSS is", sss);
		history.push(sss);
	}
  const handleAppt = () => { setMenuValue(1);  }
  const handleVisit = () => { setMenuValue(2);  }

  const handleHome = () => { setMenuValue(4);  }
  const handleProfile = () => { handleClose(); setMenuValue(106);}
  const handlePassword = () => { handleClose(); setMenuValue(107);}
  // 108 for add wallet
  //const handleHelpDesk = () => { handleClose(); setMenuValue(201);}
 // const handleContactUs = () => { handleClose(); setMenuValue(202);}
  const handleSuPatient = () => { handleClose(); setMenuValue(301);}
  const handleSuMedicine = () => { handleClose(); setMenuValue(302);}


  //const handleGroupNew = () => { handleGrpClose(); setMenuValue(1001);}
  //const handleGroupJoin = () => { handleGrpClose(); setMenuValue(1002);}
  //const handleGroupDetails = () => { handleGrpClose(); setMenuValue(1003);}
  //const handlePlayerInfo = () => { handleGrpClose(); setMenuValue(1004);}

  const handleLogout = () => {
    handleClose();
    sessionStorage.setItem("uid", "");
		sessionStorage.setItem("userName", "Login");
		history.push("/welcome");
    cdRefresh();  
  };

  function Show_Supervisor_Options() {
	return (
		<div>
		<MenuItem onClick={handleSuPatient}>Patients</MenuItem>
		<MenuItem onClick={handleSuMedicine}>Medicines</MenuItem>
		<Divider />
		</div>
  )}

  function DisplayCdItems() {
    switch(value) {
      case 1: return <Appointment/>; 
      case 2: return <Visit/>;
      //case 3: return <MyTeam />;
      //case 4: return <Home />;
      //case 101: return <Match />;
      //case 102: return <Auction />;
      //case 103: return <Captain />;
      //case 104: return <Group />;
     // case 105: return <Wallet />;
      case 106: return <Profile />;
      case 107: return <ChangePassword />;
			
     // case 108: return <AddWallet />
     // case 109: return <WithdrawWallet />
      // case 110: return <KycBank />;
      // case 111: return <KycDocs />
     // case 201: return <About />;
    //  case 202: return <ContactUs />;
    //  case 203: return <PointSystem />;
			
      case 301: return <SU_Patient />;
      case 302: return <SU_Medicine />;
			
    //  case 1001: return <NewGroup />;
    //  case 1002: return <JoinGroup />;
    //  case 1003: return <GroupDetails />;
    //  case 1004: return <PlayerInfo />;
      default: return  null;
    }
  }

  async function handleUpgrade() {
    //console.log("upgrade requested");
    closeModal();
    await downloadApk();
    console.log("APK has to be downloaded");
  }

  function openModal() { setIsOpen(true); }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }


  let mylogo = `${process.env.PUBLIC_URL}/APLLOGO1.ICO`;
  let groupCharacter="G";
  let currencyChar = '₹';
  let myName = localStorage.getItem("userName");
  return (
    <div className={classes.root}>
			<Toolbar className={classes.noSpacing}>
				{auth && (
					<div>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<MenuIcon className={classes.icon}/>
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							// keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={handleProfile}>Profile</MenuItem>
							<Divider/>
							<MenuItem onClick={() => {jumpToPage('/patient')}}>Patients</MenuItem>
							<MenuItem onClick={() => {jumpToPage('/medicine')}}>Medicines</MenuItem>
							<Divider/>
							<MenuItem onClick={() => {jumpToPage('/appointment')}}>Appointments</MenuItem>
							<MenuItem onClick={() => {jumpToPage('/visit')}}>Visit</MenuItem>
							<Divider/>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</div>
				)}
		 </Toolbar>
    </div>
  );
}