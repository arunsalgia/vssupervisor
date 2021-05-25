import React, { useState, useEffect} from 'react';
// import Button from '@material-ui/core/Button';
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
// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { red, deepOrange } from '@material-ui/core/colors';
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";

const COUNTPERPAGE=20;
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
  // const classes = useStyles();
  const gClasses = globalStyles();

  // const history = useHistory();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  // const [registerStatus, setRegisterStatus] = useState(0);

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

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    setEmptyRows(myempty);

  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={gClasses.paper}>
      <Typography component="h1" variant="h5">Wallet Balance: {balance}</Typography>
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
