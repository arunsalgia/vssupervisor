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
import { encrypt, decrypt} from "views/functions.js";
import { BlankArea, ValidComp, DisplayPageHeader } from 'CustomComponents/CustomComponents.js';


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

/***
class ChildComp extends React.Component {

  componentDidMount()  {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return (value === this.props.p1)
    });

    ValidatorForm.addValidationRule('minLength', (value) => {
      return (value.length >= 6)
    });

    ValidatorForm.addValidationRule('noSpecialCharacters', (value) => {
      return validateSpecialCharacters(value);
    });

    ValidatorForm.addValidationRule('isEmailOK', (value) => {
      return validateEmail(value);
    });
  }

  
  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
    ValidatorForm.removeValidationRule('isEmailOK');
    ValidatorForm.removeValidationRule('minLength');
    ValidatorForm.removeValidationRule('noSpecialCharacters');   
  }

  render() {
    return <br/>;
  }

}
***/
// const handleSubmit = e => {
//   e.preventDefault();
// };



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
    if ((profile.email !== email) || (profile.userName !== userName)) {
      // console.log("New EMail or use name");
      let tmp1 = encrypt(email)
      let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricupdateprofile/${localStorage.getItem("uid")}/${userName}/${tmp1}`);
      setRegisterStatus(response.status);
      localStorage.setItem("userName", userName);
      // console.log(`Status is ${response.status}`);
    }
  }

  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 200:
        myMsg = `User Profile successfully regisitered.`;
        break;
      case 601:
        myMsg = "Invalid User Id";
        break;
      case 602:
        myMsg = "Email id already in use";
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
              autoFocus
              required
              fullWidth      
              label="User Name"
              onChange={(event) => setUserName(event.target.value)}
              name="username"
              // type=""
              validators={['required', 'minLength', 'noSpecialCharacters']}
              errorMessages={['User Name to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
              value={userName}
          />
          <BlankArea/>
          <TextValidator
              variant="outlined"
              required
              autoFocus
              fullWidth      
              label="Email"
              onChange={(event) => setEmail(event.target.value)}
              name="email"
              type="email"
              validators={['isEmailOK', 'required']}
              errorMessages={['Invalid Email', 'Email to be provided']}
              value={email}
          />
          <BlankArea/>
          <TextValidator
              variant="outlined"
              // required
              fullWidth      
              // readonly
              disabled
              label="Default Group"
              name="groupName"
              value={groupName}
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
      <ValidComp />    
      </Container>
    );
  }   

  function ShowWallet() {
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
  const [expandedPanel, setExpandedPanel] = useState("");
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
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
        <UserProfile />
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
      <ShowResisterStatus/>
    </Container>
  );

}
