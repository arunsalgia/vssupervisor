import React, { useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
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
// import { UserContext } from "../../UserContext";
import axios from "axios";
import useScript from './useScript';
var request= require('request');
// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { red, deepOrange } from '@material-ui/core/colors';
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";
//include();
// var Insta = require('instamojo-nodejs');

const API_KEY = "test_122c89dd87b24c3977474e3e82f";
const AUTH_KEY = "test_4c814766fd46608724119f04929";
const headers = { 
  'X-Api-Key': API_KEY, 'X-Auth-Token': AUTH_KEY,
  "Content-Type": "application/json",
  'Access-Control-Allow-Origin': '*',
  "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
};


const INSTAMOJOSCRIPT="https://js.instamojo.com/v1/checkout.js";
const COUNTPERPAGE=5;


// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(8),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: '100%', // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
//   error:  {
//       // right: 0,
//       fontSize: '12px',
//       color: red[700],
//       // position: 'absolute',
//       alignItems: 'center',
//       marginTop: '0px',
//   },
//   th: { 
//     spacing: 0,
//     align: "center",
//     padding: "none",
//     backgroundColor: '#EEEEEE', 
//     color: deepOrange[700], 
//     // border: "1px solid black",
//     fontWeight: theme.typography.fontWeightBold,
//   },
//   td : {
//     spacing: 0,
//     // border: 5,
//     align: "center",
//     padding: "none",
//     height: 10,
//   },    
// }));


export default function Wallet() {
  useScript(INSTAMOJOSCRIPT);
  // const classes = useStyles();
  const gClasses = globalStyles();

  // const history = useHistory();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [registerStatus, setRegisterStatus] = useState(0);
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(COUNTPERPAGE);
  const [emptyRows, setEmptyRows] = React.useState(0);
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    const WalletInfo = async () => {
      try {
        // get user details
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${localStorage.getItem("uid")}`);
        setTransactions(response.data);
        let myempty = rowsPerPage - Math.min(rowsPerPage, response.data.length - page * rowsPerPage);
        setEmptyRows(myempty);

        let myBalance = response.data.reduce((accum,item) => accum + item.amount, 0);
        setBalance(myBalance);
      } catch (e) {
          console.log(e)
      }
    }
    WalletInfo();
  }, []);

  function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
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
  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    setEmptyRows(myempty);

  };

  function handleOpen() {
    console.log("Connection Opened");
  }

  function handleClose() {
    console.log("Connection Closed");
  }

  function handleSucces(response) {
    console.log("Success", response);
    setMessage(`Transaction ${response.paymentId} Success`);
    setRegisterStatus(1001);
  }

  function handleFailure(response) {
    console.log("Failure", response);
    setMessage(`Transaction ${response.paymentId} Failed`);
    setRegisterStatus(1002);
  }
  
  function org_handleSubmit() {
    try {
      Insta.setKeys(API_KEY, AUTH_KEY);
      Insta.isSandboxMode(true);
      console.log(Insta);
      
      var data = new Insta.PaymentData();
      //data.setRedirectUrl(REDIRECT_URL);
      console.log("before", data);
      data.purpose = "Test";            // REQUIRED
      data.amount = 9;                  // REQUIRED
      // data.currency                = 'INR';
      // data.buyer_name              = 'Arun Salgia';
      // data.email                   = 'arunsalgia@gmail.com';
      // data.phone                   = 1234567890;
      // data.send_sms                = 'False';
      // data.send_email              = 'True';
      // data.allow_repeated_payments = 'False';
      // data.webhook                 = 'Your endpoint to capture POST data from a payment';
      // data.redirect_url            = 'Your endpoint where instamojo redirects user to after payment';
      console.log("after", data);

      Insta.createPayment(data, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          // Payment redirection link at response.payment_request.longurl
          console.log(response);
        }
      });
    } catch (e) {
      console.log(e);
      console.log("Error tyring InstaMojo pay");
    }
  }

  function handleSubmit() {
    try {
      Instamojo.configure({
        handlers: {
          onOpen: handleOpen,
          onClose: handleClose,
          onSuccess: handleSucces,
          onFailure: handleFailure
        }
      });

      Instamojo.open('https://test.instamojo.com/@arun_salgia/ -data "allow_repeated_payments=False&amount=2500&buyer_name=John+Doe&purpose=FIFA+16&phone=9999999999&send_email=True&send_sms=False&email=arunsalgia%40gmail.com"');

    } catch (e) {
      console.log(e);
      console.log("Error tyring InstaMojo pay");
    }
  }

  function viamail_handleSubmit() {
    try {
      var payload = {
        purpose: 'FIFA 16',
        amount: '2500',
        phone: '9999999999',
        buyer_name: 'John Doe',
        redirect_url: '',
        send_email: true,
        webhook: '',
        send_sms: false,
        email: 'arunsalgi@gmail.com',
        allow_repeated_payments: false
      };
      
      request.post('https://www.instamojo.com/api/1.1/payment-requests/', 
        {form: payload,  headers: headers}, 
        function(error, response, body) {
        if(!error && response.statusCode == 201){
          console.log(body);
        }
      })
    } catch (e) {
      console.log(e);
      console.log("Error tyring InstaMojo pay");
    }
  }

  function AddToWallet() {
    return (
      <Button type="submit" variant="contained" color="primary" 
        onClick={handleSubmit}
        className={gClasses.button}>Add to Wallet
    </Button>

    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={gClasses.paper}>
        <Typography component="h1" variant="h5">Wallet Balance: {balance}</Typography>
        {/* <AddToWallet />
        <ShowResisterStatus /> */}
        <TableContainer>
        <Table>
        <TableHead p={0}>
            <TableRow align="center">
            <TableCell className={gClasses.th} p={0} align="center">Date</TableCell>      
            <TableCell className={gClasses.th} p={0} align="center">Type</TableCell>
            <TableCell className={gClasses.th} p={0} align="center">Amount</TableCell>
            </TableRow>
        </TableHead>
        < TableBody>
            {transactions.slice(page * rowsPerPage, (page + 1) * rowsPerPage )
            .map( (item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.date}
                  </TableCell>
                  <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.type}
                  </TableCell>
                  <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.amount}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody> 
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[COUNTPERPAGE]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </Container>
  );
}
