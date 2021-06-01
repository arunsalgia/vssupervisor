import React, { useState ,useContext} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import red from '@material-ui/core/colors/red';
import { useHistory } from "react-router-dom";
import {ValidComp, BlankArea, CricDreamLogo} from "CustomComponents/CustomComponents.js"
import {encrypt} from "views/functions.js"
import { SettingsCellOutlined } from '@material-ui/icons';
import axios from "axios";
import { setTab } from 'CustomComponents/CricDreamTabs copy';

const MappingData = {
  walletdetails: process.env.REACT_APP_WALLET,
  walletadd: process.env.REACT_APP_ADDWALLET
}

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
  textData: {
    fontSize: '14px',
    margin: theme.spacing(0),
  },
}));


export default function Dummy(props) {
  const classes = useStyles();
  console.log("in dummy");
  console.log(props.location);
  let x = props.location.pathname.split("/");
  console.log(x[2]);
  let newPath;
  switch (x[2]) {
    case "walletdetails":  newPath = process.env.REACT_APP_WALLET; break;
    default:               newPath = process.env.REACT_APP_HOME; break;
  }
  if (newPath !== localStorage.getItem("menuValue"))
    setTab(newPath);
  return null;
}
