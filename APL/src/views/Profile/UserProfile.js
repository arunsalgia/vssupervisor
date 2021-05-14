import React, { useState ,useContex, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { UserContext } from "../../UserContext";
import axios from "axios";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {blue, red, deepOrange } from '@material-ui/core/colors';
import { useHistory } from "react-router-dom";
import { 
  encrypt, decrypt,
  validateSpecialCharacters, validateEmail,
} from "views/functions.js";
import { BlankArea, ValidComp, DisplayPageHeader } from 'CustomComponents/CustomComponents.js';
import { setTab } from "CustomComponents/CricDreamTabs.js"

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  textColor: {
    color: blue[700],
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
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: blue[700]
  },
  helpMessage: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  th: { 
    spacing: 0,
    align: "center",
    padding: "none",
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    // border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },    
}));


export default function Profile() {
  const classes = useStyles();
  const history = useHistory();
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({});
  const [registerStatus, setRegisterStatus] = useState(199);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [emptyRows, setEmptyRows] = React.useState(0);
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    const profileInfo = async () => {
      try {
        // get user details
        var userRes = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricprofile/${localStorage.getItem("uid")}`);
        setProfile(userRes.data); // master data for comparision if changed by user
        // setLoginName(userRes.data.loginName);
        setUserName(userRes.data.userName);
        setGroupName(userRes.data.defaultGroup);
        let tmp = decrypt(userRes.data.email);

        // get wallet transaction and also calculate balance
        let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${localStorage.getItem("uid")}`);
        setTransactions(response.data);
        let myempty = rowsPerPage - Math.min(rowsPerPage, response.data.length - page * rowsPerPage);
        setEmptyRows(myempty);

        let myBalance = response.data.reduce((accum,item) => accum + item.amount, 0);
        setBalance(myBalance);

        setEmail(tmp);
      } catch (e) {
          console.log(e)
      }
    }
    profileInfo();
  }, []);

  // const { setUser } = useContext(UserContext);

  
  const handleProfileSubmit = async() => {
    // console.log("Submit command provided"); 
    let myUserName = document.getElementById("username").value;
    let myEmail = document.getElementById("email").value;
    console.log(myUserName, myEmail);

    setUserName(myUserName);
    setEmail(myEmail);

    console.log(userName, email);

    if (myUserName.length < 6) {
      setRegisterStatus(1000);
      return;
    }

    if (!validateSpecialCharacters(myUserName)) {
      setRegisterStatus(1001);
      return;
    }


    if (!validateEmail(myEmail)) {
      setRegisterStatus(1002);
      return;
    }

    // console.log(profile);

    if ((profile.email !== myEmail) || (profile.userName !== userName)) {
      // console.log("New EMail or user name");
      let tmp1 = encrypt(myEmail)
      let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricupdateprofile/${localStorage.getItem("uid")}/${myUserName}/${tmp1}`);
      
      localStorage.setItem("userName", myUserName);
      setRegisterStatus(response.status);
    }
  }

  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
        break;
      case 200:
        myMsg = `User details successfully updated`;
        break;
      case 601:
        myMsg = "Invalid current password";
        break;
      case 602:
        myMsg = "Email id already in use";
        break;
      case 701:
        myMsg = "Incorrect current password";
        break;
      case 702:
        myMsg = "New and repeat password mismatch";
        break;
      case 703:
          myMsg = "Curent and  new password are identical";
          break;
      case 1000:
        myMsg = "Minimum 6 characters required";
        break;
      case 1001:
        myMsg = "Special characters not permitted";
        break;
      case 1002:
        myMsg = "Invalid Email id";
        break;
      case 1003:
        myMsg = "Invalid current password";
        break;
      case 199:
        myMsg = ``;
        break;
      default:
        myMsg = "unKnown error";
        break;
    }
    return(
      <Typography className={(registerStatus === 200) ? classes.root : classes.error}>{myMsg}</Typography>
    )
  }

  function UserProfile() {
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">User Profile</Typography>
        <ValidatorForm className={classes.form} onSubmit={handleProfileSubmit}>
          <TextValidator
              className={classes.textColor}
              variant="outlined"
              required
              fullWidth      
              label="User Name"
              // onChange={(event) => setUserName(event.target.value)}
              id="username"
              name="username"
              // validators={['required', 'minLength', 'noSpecialCharacters']}
              // errorMessages={['User Name to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
              // value={userName}
              defaultValue={userName}
          />
          <BlankArea/>
          <TextValidator
              variant="outlined"
              required
              fullWidth      
              label="Email"
              // onChange={(event) => setEmail(event.target.value)}
              id="email"
              name="email"
              type="email"
              // validators={['isEmailOK', 'required']}
              // errorMessages={['Invalid Email', 'Email to be provided']}
              // value={email}
              defaultValue={email}
          />
          {/* <BlankArea/> */}
          {/* <TextValidator
              variant="outlined"
              // required
              fullWidth      
              // readonly
              disabled
              label="Default Group"
              name="groupName"
              value={groupName}
          /> */}
          <ShowResisterStatus/>
          <BlankArea/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update
        </Button>
        </ValidatorForm>
      </div>
      <ValidComp />    
      </Container>
    );
  }   

  function ShowAllWallet() {
    return (
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">Wallet Details (Balance: {balance})</Typography>
        <Table>
        <TableHead p={0}>
            <TableRow align="center">
            <TableCell className={classes.th} p={0} align="center">Date</TableCell>      
            <TableCell className={classes.th} p={0} align="center">Type</TableCell>
            <TableCell className={classes.th} p={0} align="center">Amount</TableCell>
            </TableRow>
        </TableHead>
        < TableBody p={0}>
            {transactions.map( (item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.date}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.type}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.amount}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody> 
        </Table>
      </div>
    );
  }

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    setEmptyRows(myempty);

  };

  function ShowWallet() {
    return (
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">Wallet Details (Balance: {balance})</Typography>
        <TableContainer>
        <Table>
        <TableHead p={0}>
            <TableRow align="center">
            <TableCell className={classes.th} p={0} align="center">Date</TableCell>      
            <TableCell className={classes.th} p={0} align="center">Type</TableCell>
            <TableCell className={classes.th} p={0} align="center">Amount</TableCell>
            </TableRow>
        </TableHead>
        < TableBody>
            {transactions.slice(page * rowsPerPage, (page + 1) * rowsPerPage )
            .map( (item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.date}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.type}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.amount}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody> 
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    );
  }


  const handlePasswordSubmit = async() => {
    console.log("Submit command provided");

    let origPassword = document.getElementById("currentPassword").value;
    let pass1 = document.getElementById("newPassword").value;
    let pass2 = document.getElementById("repeatPassword").value;
    console.log(origPassword, pass1, pass2);

    setCurrentPassword(origPassword)
    setNewPassword(pass1);
    setRepeatPassword(pass2);
    console.log(currentPassword, newPassword, repeatPassword);


    if ( (origPassword.length < 6) ||
      (pass1.length < 6) ||
      (pass2.length < 6) ) {
      setRegisterStatus(1000);
      return;
    }

    if ( (!validateSpecialCharacters(origPassword)) ||
      (!validateSpecialCharacters(pass1)) ||
      (!validateSpecialCharacters(pass2))
    ) {
      setRegisterStatus(1001);
      return;
    }

    if (pass1 !== pass2) {
      setRegisterStatus(702);
      return;
    }

    if (origPassword  === pass1) {
      setRegisterStatus(703);
      return;
    }

    setRegisterStatus(0);

    let tmp1 = encrypt(origPassword);
    let tmp2 = encrypt(pass1);

    let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricreset/${localStorage.getItem("uid")}/${tmp1}/${tmp2}`);
    if (response.status === 200) {
      // setTab(0);
      setRegisterStatus(200);
    } else {
      // error
      setRegisterStatus(response.status);
      console.log(`Status is ${response.status}`);
    }
  }

  function ShowPassword() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <Typography component="h1" variant="h5">Change Password</Typography>
        <ValidatorForm className={classes.form} onSubmit={handlePasswordSubmit}>
        <TextValidator
            variant="outlined"
            required
            fullWidth      
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type="password"
            // validators={['required', 'noSpecialCharacters']}
            // errorMessages={['Current Password to be provided', 'Special characters not permitted']}
            defaultValue={currentPassword}
            // value={currentPassword}
            // onChange={(event) => setCurrentPassword(event.target.value)}
        />
        <BlankArea/>
        <TextValidator
            variant="outlined"
            required
            fullWidth      
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            // validators={['required', 'minLength', 'noSpecialCharacters']}
            // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
            defaultValue={newPassword}
            // value={newPassword}
            // onChange={(event) => setNewPassword(event.target.value)}
        />
        <BlankArea/>
        <TextValidator
            variant="outlined"
            required
            fullWidth      
            label="Repeat password"
            id="repeatPassword"
            name="repeatPassword"
            type="password"
            // validators={['isPasswordMatch', 'required']}
            // errorMessages={['password mismatch', 'this field is required']}
            // validators={['required', 'minLength', 'noSpecialCharacters']}
            // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
            defaultValue={repeatPassword}
            // value={repeatPassword}
            // onChange={(event) => setRepeatPassword(event.target.value)}
        />
        <ShowResisterStatus/>
        <BlankArea/>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Update
      </Button>
      </ValidatorForm>
      </div>
      <ValidComp p1={newPassword}/>    
      </Container>
    );  
  }

  const [expandedPanel, setExpandedPanel] = useState("");
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };


  function DisplayAccordian() {
  return (
    <div>
    <Accordion expanded={expandedPanel === "userprofile"} onChange={handleAccordionChange("userprofile")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography className={classes.heading}>View/Edit Profile</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <UserProfile />
      </AccordionDetails>
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>Update Profile</Typography>
    <BlankArea />
    <Accordion expanded={expandedPanel === "wallet"} onChange={handleAccordionChange("wallet")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={classes.heading}>Wallet Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ShowWallet />
      </AccordionDetails>
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>View Wallet details</Typography>
    <BlankArea />
    <Accordion expanded={expandedPanel === "password"} onChange={handleAccordionChange("password")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography className={classes.heading}>Change Password</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ShowPassword />
      </AccordionDetails>
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>Change Password</Typography>
    <BlankArea />
    </div>
  )
  }
  

  let headerText = localStorage.getItem("userName") + "\`s Profile";
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <BlankArea />
      <DisplayPageHeader headerName={headerText} groupName="" tournament=""/>
      <BlankArea />
      <DisplayAccordian />
      {/* <ShowResisterStatus/> */}
    </Container>
  );

}
