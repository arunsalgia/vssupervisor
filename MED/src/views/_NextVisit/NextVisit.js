import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import VsButton from "CustomComponents/VsButton";
import { borders } from '@material-ui/system';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Avatar from "@material-ui/core/Avatar"
//import validator from 'validator'

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";
import {dynamicModal } from "assets/dynamicModal";


import Switch from "@material-ui/core/Switch";
import Link from '@material-ui/core/Link';

import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
DisplayPatientDetails,
} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';


// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

//colors 
import { 
red, blue, yellow, orange, pink, green, brown, deepOrange, lightGreen,
} from '@material-ui/core/colors';

import { 
	isMobile, callYesNo,
	disablePastDt, disableFutureDt, disableAllDt,
	validateInteger,
	encrypt, decrypt, 
	left, right,
	intString,
	updatePatientByFilter,
	dispAge, dispEmail, dispMobile,
	ordinalSuffix,
	getOnlyDate,
} from "views/functions.js";


const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	}, 
	dateTime: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		backgroundColor: pink[100],
		align: 'center',
		width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
	}, 
	info: {
			color: blue[700],
	}, 
	filterRadio: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
			color: '#000000',	
	},
	switchText: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	}, 
		orange: {
			backgroundColor: orange[300],
			color: '#000000',
		},
    header: {
			color: '#D84315',
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
		},
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
		},
		NoMedicines: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		medicine: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		modalHeader: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},
		messageText: {
			color: '#4CC417',
			fontSize: 12,
			// backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
			margin: theme.spacing(0, 1, 0),
    },
		title: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		accordianSummary: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			//backgroundColor: pink[100],
		},
		zeroAppt: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		normalAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		selectedAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: yellow[100],
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: "none", 
		},
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[700]
	},  
	newAppt: {
		backgroundColor: pink[100],
	},
	allAppt: {
		backgroundColor: blue[100],
	},
	select: {
		padding: "none", 
		backgroundColor: '#B3E5FC',
		margin: "none",
	},
	table: {
    //minWidth: 750,
  },
  td : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdPending : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdCancel : {
		backgroundColor: pink[100],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdVisit : {
		backgroundColor: lightGreen[300],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	th: { 
		border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA726',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	wd: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#E0E0E0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	we: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#F8BBD0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	today: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: green[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	noday: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	ho: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: yellow[400],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
}));

const VISITTYPE = {pending: "pending", cancelled: "cancelled", visit: ""};

const ROWSPERPAGE = 10;
let dense = false;

const yesNoModal = dynamicModal('60%');

let searchText = "";
function setSearchText(sss) { searchText = sss;}


const userCid = sessionStorage.getItem("cid");
export default function NextVisit() {
  const classes = useStyles();
	const gClasses = globalStyles();

	const [nextVisitArray, setNextVisitArray] = useState([]);
	
  useEffect(() => {	
		const getAllNextVisits = async () => {		
			try {
				let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/visit/nextVisit/list/${userCid}`;
				let resp = await axios.get(myURL);
				console.log(resp.data);
				setNextVisitArray(resp.data);
			} catch(e) {
				console.log(e);
			}
		}
		getAllNextVisits();
  }, []);

	
	
	return (
  <div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Next Visit" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	<Box className={classes.allAppt} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Patient
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
						Next Visit Date
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Visit Date
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Status
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{nextVisitArray.map( (a, index) => {
				let myName = a.displayName + (isMobile() ? "" : " (ID: " + a.pid + ")");
				let myNextVisit = getOnlyDate(a.nextVisit);
				let myVisit = (a.status === VISITTYPE.pending) ? "-" : getOnlyDate(a.visitDate);
				return(
					<TableRow key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.tdPending}>
						<Typography className={classes.apptName}>
							{myName}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.tdPending}>
						<Typography className={classes.apptName}>
							{myNextVisit}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.tdPending}>
						<Typography className={classes.apptName}>
							{myVisit}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={classes.tdPending}>
						<Typography className={classes.apptName}>
							{a.status}
						</Typography>
					</TableCell>
					</TableRow>
				)}
			)}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>	
		</Container>
  </div>
  );    
}