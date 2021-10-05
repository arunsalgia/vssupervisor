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
import {red, blue, green, deepOrange, white} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';

import Visit from "views/Visit/Visit"
import Appointment from "views/Appointment/Appointment"
import Medicine from "views/Medicine/Medicine.js" 
import Patient from "views/Patient/Patient.js" 
import NextVisit from "views/NextVisit/NextVisit";
import Report from "views/Report/Report.js" 
import Wallet from "views/Wallet/Wallet.js"

import Customer from "views/SuperUser/Customer";
import Sample from "views/SuperUser/Sample.js"

// cd items import
//import Dash from "views/Dashboard/Dashboard"
//import Stats from "views/Statistics/Statistics"
//import MyTeam from "views/MyTeam/MyTeam"
//import Auction from "views/Auction/Auction"
//import Captain from "views/Captain/Captain"
//import Match from "views/UpcomingMatch/UpcomingMatch"
//import Group from "views/Group/Group"

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
import ContactUs from "views/MED/ContactUs.js";
import PointSystem from "views/MED/PointSystem.js";

import WorkingHours from "views/Settings/WorkingHours";
import Holiday from "views/Holiday/Holiday";


import Modal from 'react-modal';
// import download from 'js-file-downloader';
import { BlankArea } from './CustomComponents';
import {cdRefresh, specialSetPos, upGradeRequired, isMobile,
  downloadApk, clearBackupData,
  checkIdle, setIdle,
  internalToText, textToInternal,
	handleLogout,
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
	doctor: {
		fontSize: theme.typography.pxToRem(28),
    fontWeight: theme.typography.fontWeightBold,
    color: 'white',
		backgroundColor: green[800],
	},
	ankit: {
		fontSize: theme.typography.pxToRem(22),
    fontWeight: theme.typography.fontWeightBold,
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
  visitButton: {
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

export function CricDreamTabs() {
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
	// check if mobile
	const [itIsMobile, SetItIsMobile] = React.useState(isMobile());
	
  const [value, setValue] = React.useState(0);
  const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
  const [userGroup, setUserGroup] = React.useState([]);
  const [latestApk, setLatestApk] = React.useState(null);

  //console.log(location.pathname);

  useEffect(() => {       
    const checkVersion = async () => {
      //console.log("about to call upgrade");
      let upg = await upGradeRequired();
      // console.log(upg);
      if (upg.latest) setLatestApk(upg.latest);

      setUpgrade(upg.status);
      if (upg.status) setIsOpen(true);
    }
		
    function setMenuValue() {
      setValue(parseInt(localStorage.getItem("menuValue")));
      setIdle(false);
    }
    setMenuValue();
}, []);


  //console.log(`in Tab function  ${localStorage.getItem("menuValue")}`);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleGrpMenu(event) {
    setGrpAnchorEl(event.currentTarget);
    // console.log(event.currentTarget);
    var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${localStorage.getItem("uid")}`;
    axios.get(myUrl).then((response) => {
      let allGroups = response.data[0].groups;
      if (allGroups.length > 0) {
        let tmp = allGroups.find(x => x.defaultGroup == true);
        if (!tmp) {
          tmp = allGroups[0];
          tmp.defaultGroup = true;
          localStorage.setItem("gid", tmp.gid.toString());
          localStorage.setItem("groupName", tmp.groupName);
          localStorage.setItem("tournament", tmp.tournament);
          localStorage.setItem("admin", tmp.admin);
          // clearBackupData();
        }
      }
      setUserGroup(allGroups);
      // console.log('Everything is awesome.');
      setArunGroup(true);
    }).catch((error) => {
      console.log('Not good man :(');
      console.log(error);
      setUserGroup([]);
      setArunGroup(true);
    })
  };

  async function handleGroupSelect(index) {
    setArunGroup(false);
    let gRec = userGroup[index];
    try {
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${gRec.gid}`);
      localStorage.setItem("gid", gRec.gid);
      localStorage.setItem("groupName", gRec.groupName);
      localStorage.setItem("tournament", gRec.tournament);
      localStorage.setItem("admin", gRec.admin);
      clearBackupData();
      cdRefresh();
    } catch (e) {
      console.log(e);
      console.log("error setting default group");
    }
  }
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGrpClose = () => {
    setGrpAnchorEl(null);
    setArunGroup(false);
  };

  function setMenuValue(num) {
    setValue(num);
    handleClose();
    localStorage.setItem("menuValue", num);
  }


	const handleHome = () => { setMenuValue(1);  }
  const handleAppointment = () => { setMenuValue(2);  }
  const handleVisit = () => { setMenuValue(3);  }

  const handlePatient = () => { handleClose(); setMenuValue(901);}
	const handleMedicine = () => { handleClose(); setMenuValue(902);}
	const handleNextVisit = () => { handleClose(); setMenuValue(904);}
	const handleReport = () => { handleClose(); setMenuValue(905);}
	
  const handleProfile = () => { handleClose(); setMenuValue(101);}
	const handleWallet = () => { handleClose(); setMenuValue(102);}
	const handleContactUs = () => { handleClose(); setMenuValue(202);}
	
	const handleSample = () => { handleClose(); setMenuValue(801);}
	const handleCustomer = () => { handleClose(); setMenuValue(802);}
	
	const handleWorkingHours = () => { handleClose(); setMenuValue(701);}
	const handleHoliday = () => { handleClose(); setMenuValue(702);}
  

  function DisplayCdItems() {
		//console.log("CD Value", value);
    switch(value) {
      case 1: return <Home />;
      case 2: return <Appointment/>;
      case 3: return <Visit/>; 
			
      case 101: return <Profile />;
      case 102: return <Wallet />;

			case 801: return <Sample />
			case 802: return <Customer />

      case 901: return <Patient />;
      case 902: return <Medicine />;
			//case 903: return <Sample />
			case 904: return <NextVisit />
			case 905: return <Report />

			case 701: return <WorkingHours />
			case 702: return <Holiday />
/*
      //case 4: 
      //case 101: return <Match />;
      //case 102: return <Auction />;
      //case 103: return <Captain />;
      //case 104: return <Group />;
      //case 105: return <Wallet />;

//      case 107: return <ChangePassword />;
     // case 108: return <AddWallet />
      //case 109: return <WithdrawWallet />
      // case 110: return <KycBank />;
      // case 111: return <KycDocs />
  //    case 201: return <About />;
  //    case 203: return <PointSystem />;
			
      //case 303: return <SU_Image />;
      //case 1001: return <NewGroup />;
      //case 1002: return <JoinGroup />;
      //case 1003: return <GroupDetails />;
     // case 1004: return <PlayerInfo />;
		*/
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

  function DisplayUpgrade() {
    //console.log(`Upgrate: ${upgrade} Menu Item:   ${value}`)
    // console.log("Current",process.env.REACT_APP_VERSION);
    if (upgrade)
      return(
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        {/* <Typography className={classes.new} align="center">
          Current Version {process.env.REACT_APP_VERSION}
        </Typography> */}
        <Typography className={classes.new} align="center">
          Latest Version {latestApk.version}
        </Typography>
        <BlankArea/>
        <Typography className={classes.new} align="center">
          What is new
        </Typography>
        <TextField variant="outlined" multiline fullWidth disabled
          id="producttext"
          // label="What is new" 
          className={classes.whatIsNew}
          defaultValue={latestApk.text} 
        />
        <BlankArea />
        <Button align="center" key="upgrade" variant="contained" color="primary" size="medium"
        className={classes.visitButton} onClick={handleUpgrade}>Update Now
        </Button>
      </Modal>
      )
    else
      return(null);
  }

  function DisplayGroupMenu() {
    // console.log("Group length", userGroup.length);
    return (
      <div key="usergroups">
      {userGroup.map( (item, index) => {
        return (
        <MenuItem key={index} onClick={() => handleGroupSelect(index)}>{item.groupName}</MenuItem>
        )
      })}
      </div>
    );
  }
    
  let mylogo = `${process.env.PUBLIC_URL}/favicon.ico`;
  let groupCharacter="G";
  let currencyChar = '₹';
  let myName = localStorage.getItem("userName");
	
	//console.log("menuValue", localStorage.getItem("menuValue"));
	//console.log("value", value);
	//console.log("Is it Mobile", isMobile());
  return (
    <div className={classes.root}>
      <AppBar position="static">
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
								{(window.sessionStorage.getItem("userType") === "Doctor") &&
									<MenuItem onClick={handleWallet}>Wallet</MenuItem>
								}
                <Divider/>
								<MenuItem onClick={handlePatient}>Patient</MenuItem>
								<MenuItem onClick={handleMedicine}>Medicine</MenuItem>
								<MenuItem onClick={handleNextVisit}>Next Visit</MenuItem>	
								<MenuItem onClick={handleReport}>Report</MenuItem>	
								<Divider />
								<Typography>Settings</Typography>
								<MenuItem onClick={handleWorkingHours}>WorkingHours</MenuItem>	
								<MenuItem onClick={handleHoliday}>Set Holidays</MenuItem>
                <Divider/>
								{(window.sessionStorage.getItem("userType") === "Developer") &&
									<div>
									<MenuItem onClick={handleSample}>Sample</MenuItem>
									<MenuItem onClick={handleCustomer}>Customer</MenuItem>
									<Divider/>
									</div>
								}
                <MenuItem onClick={handleContactUs}>Contact Us</MenuItem>       
                <Divider/>
                <MenuItem onClick={() => {handleClose(); handleLogout(); }}>Logout</MenuItem>
              </Menu>
            </div>
          )}
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
					<Typography>
						<span className={classes.doctor}>+</span>
						<span className={classes.ankit}> Viraag Dental</span>
					</Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleHome}
            color="inherit"
          >
            <HomeIcon className={classes.icon}/>
          </IconButton>
          <Button color="inherit" className={classes.statButton} onClick={handleAppointment}>Appt</Button>
					<Button color="inherit" className={classes.visitButton} onClick={handleVisit}>Visit</Button>
					{(itIsMobile === false) && <Button color="inherit" className={classes.visitButton} onClick={handlePatient}>Patient</Button>}
					{(itIsMobile === false) && <Button color="inherit" className={classes.visitButton} onClick={handleReport}>Report</Button>}
					{(itIsMobile === false) && <Button color="inherit" className={classes.visitButton} onClick={handleMedicine}>Medicine</Button>}
          {/* <IconButton
            aria-label="account of current group"
            aria-controls="group-appbar"
            aria-haspopup="true"
            onClick={handleGrpMenu}
            color="inherit"
          >
            <GroupIcon className={classes.icon}/>
          </IconButton> */}
          {/* <Avatar 
            aria-label="account of current user"
            aria-controls="user-appbar"
            aria-haspopup="true"
            onClick={handleGrpMenu}
            color="inherit"
            variant="circular" className={classes.avatar1}>{groupCharacter}
          </Avatar> */}
          {/* <Menu
            id="group-appbar"
            anchorEl={grpAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            // keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={arunGroup}
            onClose={handleGrpClose}
          >
            <DisplayGroupMenu />
          </Menu> */}
        {/* </div> */}
       </Toolbar>
      </AppBar>
      <DisplayCdItems/>
      {/* <DisplayUpgrade/> */}
    </div>
  );
}