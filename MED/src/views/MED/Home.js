import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import VsButton from "CustomComponents/VsButton";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Avatar from '@material-ui/core/Avatar';
import { spacing } from '@material-ui/system';
import globalStyles from "assets/globalStyles";
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
// import { Switch, Route, Link } from 'react-router-dom';
// import Table from "components/Table/Table.js";
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { UserContext } from "../../UserContext";
import { DisplayPageHeader, BlankArea, JumpButton } from 'CustomComponents/CustomComponents.js';
import { encrypt, clearBackupData, hasGroup, upGradeRequired, downloadApk } from 'views/functions';
import { red, blue, deepOrange } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from "@material-ui/core/CardActions";
import CardFooter from "components/Card/CardFooter.js";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {setTab} from "CustomComponents/CricDreamTabs.js"
import Divider from '@material-ui/core/Divider';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import Modal from 'react-modal';
import modalStyles from 'assets/modalStyles';


// import NEWTOURNAMENTIMAGE from `${process.env.PUBLIC_URL}/NEWTOURNAMENT.JPG`;

const cardStyles = {
  cardImage: {
      // backgroundImage: `url(${process.env.PUBLIC_URL}/NEWTOURNAMENT.JPG)`,
      height: '20px'
  }
};


const useStyles = makeStyles((theme) => ({
	avatar: {
		margin: 10,
	},
	bigAvatar: {
		margin: 10,
		width: 60,
		height: 60,
		//padding: "10px 10px", 
		margin: "10px 10px",
		},
    root: {
      width: '100%',
      // backgroundColor: '#84FFFF'
      // backgroundColor: '#A1887F'
    },
    withTopSpacing: {
      marginTop: theme.spacing(1),
    },
    jumpButton: {
      marginTop: theme.spacing(1),
      backgroundColor: '#FFFFFF',
      color: deepOrange[700],
      fontWeight: theme.typography.fontWeightBold,
      fontSize: '16px',
      width: theme.spacing(40),
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
    ngCard: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightBold,
      color: deepOrange[900],
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    clinicName:  {
      // right: 0,
      fontSize: theme.typography.pxToRem(28),
      fontWeight: theme.typography.fontWeightBold,
      color: deepOrange[700],
      alignItems: 'center',
      marginTop: '5px',
			marginBottom: '5px',
    },
		itemMessage:  {
      // right: 0,
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightBold,
      //color: blue[700],
      alignItems: 'center',

    },
    error:  {
        // right: 0,
        fontSize: '12px',
        color: red[700],
        alignItems: 'center',
        marginTop: '0px',
    },
		nonerror:  {
			// right: 0,
			fontSize: '12px',
			color: blue[700],
			alignItems: 'center',
			marginTop: '0px',
			fontWeight: theme.typography.fontWeightBold,
    },
    updatemsg:  {
        // right: 0,
        fontSize: '12px',
        color: blue[700],
        // position: 'absolute',
        alignItems: 'center',
        marginTop: '0px',
    },
    hdrText:  {
        // right: 0,
        // fontSize: '12px',
        // color: red[700],
        // // position: 'absolute',
        align: 'center',
        marginTop: '0px',
        marginBottom: '0px',
    },

    }));


//const PATIENTMSG="The patient's anatomy always always should be respected, even if it is absolutely contrary - the decision is contrary to best medical advice and what the physician wahts";
const PATIENTMSG=      "The patient's anatomy always always should be respected, even if it is absolutely contrary.";
const APPOINTMENTMSG = "Events do not just happen, but arrive by appointment. Don't make a wish, make an appointment."
const VISITMSG =       "Remember visit to Dentist is a two-way street, you are in clinic for your Dental health and so is the Doctor."
const REPORTMSG =      "The medical report card helps give us a focus and it frames the dialogue for moving forward.";
const MEDICINEMSG =    "Wherever the art of Medicine is loved, there is also a love of Humanity.";

const cardStyle = {padding: "5px 10px", margin: "4px 4px", backgroundColor: blue[100], color: 'black', fontSize:'14px', borderRadius:7, border: 2};	

export default function Home() {
    // const { setUser } = useContext(UserContext);
    // window.onbeforeunload = () => setUser("")
	const classes = useStyles();
	const gClasses = globalStyles();
	const [custInfo, setCustInfo] = useState({});

    useEffect(() => {
		const getCustomerInfo = async () => {		
			try {
				var myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/customer/getinfo/${sessionStorage.getItem("cid")}`
				var resp = await axios.get(myURL);
				setCustInfo(resp.data)
			} catch (e) {
				console.log(e);
			}
		}
		console.log(sessionStorage.getItem("cid"));
		getCustomerInfo();
    }, [])

	function ShowAllCards() {
 
	return (
	 <GridContainer key="db_gc_ub">
			<GridItem key="db_gi_ub1" xs={12} sm={6} md={6}>
			<Card style={cardStyle} key="db_card_ub1">
      {/*<CardMedia
        component="img"
        height="70%"
        image={`${process.env.PUBLIC_URL}/image/PATIENT.JPG`}
        alt="green iguana"
      />*/}
			<CardIcon color="warning">
			<Avatar variant="rounded" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/image/PATIENT.JPG`} className={classes.bigAvatar} />
			</CardIcon>
      <CardContent>
        <Typography color="primary" gutterBottom variant="h5" component="div">
          Patient
        </Typography>
        <Typography className={classes.itemMessage} variant="body2" >
				{PATIENTMSG}
        </Typography>
      </CardContent>
      <CardActions>
       <VsButton name="Patient Directory" onClick={() => {setTab(process.env.REACT_APP_PATIENT)}}/>
      </CardActions>
    </Card>
		</GridItem>
			<GridItem key="db_gi_ub2" xs={12} sm={6} md={6}>
			<Card style={cardStyle} key="db_card_ub1">
      {/*<CardMedia
        component="img"
        height="70%"
        image={`${process.env.PUBLIC_URL}/image/PATIENT.JPG`}
        alt="green iguana"
      />*/}
			<CardIcon color="warning">
			<Avatar variant="rounded" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/image/APPOINTMENT.JPG`} className={classes.bigAvatar} />
			</CardIcon>
      <CardContent>
        <Typography color="primary"  gutterBottom variant="h5" component="div">
          Appointment
        </Typography>
        <Typography className={classes.itemMessage} variant="body2" >
				{APPOINTMENTMSG}
        </Typography>
      </CardContent>
      <CardActions>
       <VsButton name="Appointment Directory" onClick={() => {setTab(process.env.REACT_APP_APPT)}}/>
      </CardActions>
    </Card>
		</GridItem>
			<GridItem key="db_gi_ub3" xs={12} sm={6} md={6}>
			<Card style={cardStyle} key="db_card_ub1">
      {/*<CardMedia
        component="img"
        height="70%"
        image={`${process.env.PUBLIC_URL}/image/PATIENT.JPG`}
        alt="green iguana"
      />*/}
			<CardIcon color="warning">
			<Avatar variant="rounded" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/image/VISIT.JPG`} className={classes.bigAvatar} />
			</CardIcon>
      <CardContent>
        <Typography color="primary"  gutterBottom variant="h5" component="div">
          Visit
        </Typography>
        <Typography className={classes.itemMessage} variant="body2" >
				{VISITMSG}
        </Typography>
      </CardContent>
      <CardActions>
       <VsButton name="Visit Directory" onClick={() => {setTab(process.env.REACT_APP_VISIT)}}/>
      </CardActions>
    </Card>
		</GridItem>
		<GridItem key="db_gi_ub4" xs={12} sm={6} md={6}>
			<Card style={cardStyle} key="db_card_ub1">
      {/*<CardMedia
        component="img"
        height="70%"
        image={`${process.env.PUBLIC_URL}/image/PATIENT.JPG`}
        alt="green iguana"
      />*/}
			<CardIcon variant="rounded" color="warning">
			<Avatar variant="rounded" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/image/REPORT.JPG`} className={classes.bigAvatar} />
			</CardIcon>
      <CardContent>
        <Typography color="primary"  gutterBottom variant="h5" component="div">
          Reports
        </Typography>
        <Typography className={classes.itemMessage} variant="body2">
				{REPORTMSG}
        </Typography>
      </CardContent>
      <CardActions>
       <VsButton name="Report Directory" onClick={() => {setTab(905)}}/>
      </CardActions>
    </Card>
		</GridItem>
		<GridItem key="db_gi_ub5" xs={12} sm={6} md={6}>
			<Card style={cardStyle} key="db_card_ub1">
			<CardIcon variant="rounded" color="warning">
			<Avatar variant="rounded" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/image/MEDICINE.JPG`} className={classes.bigAvatar} />
			</CardIcon>
      <CardContent>
        <Typography color="primary"  gutterBottom variant="h5" component="div">
          Medicine
        </Typography>
        <Typography className={classes.itemMessage} variant="body2">
				{MEDICINEMSG}
        </Typography>
      </CardContent>
      <CardActions>
       <VsButton name="Medicine Directory" onClick={() => {setTab(process.env.REACT_APP_MEDICINE)}}/>
      </CardActions>
    </Card>
		</GridItem>
	</GridContainer>
  )}

  
	console.log(custInfo);
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	<Typography className={classes.clinicName}>{custInfo.welcomeMessage}</Typography>
	<BlankArea />
	<ShowAllCards />
	</Container>
	</div>
	);
}
