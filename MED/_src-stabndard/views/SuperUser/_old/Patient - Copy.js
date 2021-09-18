import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import globalStyles from "assets/globalStyles";


import Switch from "@material-ui/core/Switch";
//import  from '@material-ui/core/Container';
//import  from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
// import Table from "components/Table/Table.js";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from "@material-ui/core/Avatar"
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";
import { getImageName } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"
import {red, blue } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
// import {setTab} from "CustomComponents/CricDreamTabs.js"
import { 
	encrypt, decrypt, 
	validateInteger,
} from "views/functions.js";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
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
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));

const COUNTPERPAGE=10;

export default function Patient() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [old, setOld] = useState(true);
	
	// for old medicine
	const [searchText,setSearchText] = useState("")
  const [patientArray, setPatientArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	
	// for new patient to be added
	// or patient to be modified
	const	[patientName, setPatientName] = useState("");
	const [patientEmail, setPatientEmail] = useState("");
	const [patientMobile, setPatientMobile] = useState("");
	const [patientGender, setPatientGender] = useState("Male");
	const [patientAge, setPatientAge] = useState(30);
	
	
	const [edit, setEdit] = useState(false);
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  const [page, setPage] = useState(0);
	
  useEffect(() => {
      const us = async () => {
				//getPatientList("");	
      }
      us();
  }, [])


  
  
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
  
	function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
        break;
      case 701:
        myMsg = `Successfully added ${patientName} details`;
        break;
      case 702:
        myMsg = `Successfully update ${patientName} details`;
        break;
      case 703:
        myMsg = `Successfully removed ${patientName} details`;
        break;
        myMsg = `Patient ${patientName} already in database`;
        break;
      case 601:
        myMsg = `Error adding ${patientName} details`;
        break;
      case 602:
        myMsg = `Error updating ${patientName} details`;
        break;
      case 603:
        myMsg = `Error removing ${patientName} details`;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(registerStatus === 200) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
      </div>
    )
  }

	async function getPatientList(filter) {
		filter = filter.trim();
		var subcmd = "list"
		if (filter != "") {
			// if it is complete numeric then it must by ID
			subcmd = (validateInteger(filter))	? "listbyid" : subcmd = "listbyname";
		} else
			subcmd = "list"
		
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/${subcmd}/${filter}`)
			//console.log(resp.data);
			let tmp = resp.data;
			tmp.forEach(ttt => {
				ttt.email = decrypt(ttt.email);
			});
			//console.log(tmp);
			setPatientArray(tmp);
		} catch (e) {
			console.log(e);
			setPatientArray([]);
		}
	}
	
	async function selectFilter() {
		//console.log("Filter:", searchText);
		getPatientList(searchText);
		setCurrentPatient("");
		setRegisterStatus(0);
	}

	async function handleNewSubmit() {
		var tmp = encrypt(patientEmail);
		axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/add/${patientName}/${patientAge}/${patientGender}/${tmp}/${patientMobile}`)
		.then((response) =>{
			setRegisterStatus(701);
		})
		.catch ( (e) => {
			console.log(e);
			setRegisterStatus(601);
		});
	}
	
	async function handleOldNew() {
		if (old) {
			// now chance for new patiend
			setOld(false);
			setEdit(false);
			setPatientName("");
			setPatientEmail("");
			setPatientAge(30);
			setPatientGender("Male");
			setPatientMobile("");
			setRegisterStatus(0);
		} else {
			//now chance for old
			setOld(true);
			setEdit(false);
			setCurrentPatient("");
			setPatientArray([]);
			setRegisterStatus(0);
		}
	}
	
	async function handleDelete() {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/delete/${currentPatient}`)
			var newList = patientArray.filter(x => x.name !== currentPatient);
			console.log(newList);
			setPatientArray(newList);
			setCurrentPatient("");
			setRegisterStatus(703);
		} catch (e) {
			console.log("Delete error");
			setRegisterStatus(603);
		}
	}
	
	function selectPatient(name) {
		setCurrentPatient(name);
		var myPat = patientArray.find( x => x.displayName == name);
		setPatientName(myPat.displayName);
		setPatientGender(myPat.gender);
		setPatientAge(myPat.age);
		setPatientEmail(myPat.email);
		setPatientMobile(myPat.mobile);
		setEdit(false);
	}
	
	async function handleEdit() {
		//console.log("Edit button");
		if (edit) {
			// Update given by user
			try {
				var etmp = encrypt(patientEmail);
				var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/update/${patientName}/${patientAge}/${patientGender}/${etmp}/${patientMobile}`);
				//console.log(resp.data);
				let tmp = patientArray.find(x => x.displayName == patientName);
				
				tmp.gender = patientGender;
				tmp.age = patientAge;
				tmp.description = patientEmail;
				tmp.precaution = patientMobile;
				setEdit(false);		// Update complete. Now disable EDIT
				
				setRegisterStatus(702)
			} catch (e) {
				console.log("Update error");
				setRegisterStatus(602);
				//setPatientArray([]);
			}
		} else {
			// Edit selected by user. Nothing special to be done
			setEdit(true);
		} 
	}
	
	function SelectGender(props) {
		//console.log(props);
		return (
		<div align="left">
		<Select labelId='gender' id='gender'
			variant="outlined" required fullWidth label="gender" name="gender" id="gender"
			value={patientGender}
			disabled={props.disabled}
			onChange={(event) => setPatientGender(event.target.value)}
		>
		<MenuItem key="Male" value="Male">Male</MenuItem>
		<MenuItem key="Female" value="Female">Female</MenuItem>
		<MenuItem key="Other" value="Other">Other</MenuItem>
		</Select>
		</div>
		);
	}
	
  return (
  <div className={classes.paper} align="center" key="groupinfo">
      <DisplayPageHeader headerName="Patient" groupName="" tournament=""/>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
			<BlankArea />
			<FormControlLabel
				className={classes.radio}
        control={
          <SwitchBtn
						className={classes.radio}
            checked={!old}
            onChange={handleOldNew}
            color="primary"
          />
        }
        label="New Patient"
      />
			<BlankArea />
			{ old && <div>
				<TextField
					variant="outlined"
					fullWidth
					label="Search Patient(s)"
					value={searchText}
					onChange={(event) => setSearchText(event.target.value)}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<SearchIcon onClick={selectFilter}/>
							</InputAdornment>
					)}}
				/>
				<BlankArea/>
				{(patientArray.length == 0) &&	
					<Typography className={classes.NoMedicines}>No Patient Selected</Typography>
				}
				{(patientArray.length > 0) && <div align="left">
					<Select labelId='team' id='team'
						variant="outlined" required fullWidth label="Group" name="team" id="team"
						value={currentPatient}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => selectPatient(event.target.value)}
					>
					{patientArray.map(x =>	<MenuItem key={x.displayName} value={x.displayName}>{x.displayName}</MenuItem>)}
					</Select>
					<BlankArea/>
					{currentPatient.length > 0 && <div>
						<ValidatorForm className={gClasses.form} onSubmit={handleEdit}>
						<TextValidator variant="outlined" required fullWidth color="primary"
							id="newName" label="Patient Name" name="newName"
							disabled={true}
							value={patientName}
						/>
						<BlankArea />
						<SelectGender disabled={!edit}/>
						<BlankArea />
						<TextValidator variant="outlined" fullWidth required color="primary"
							id="age" label="Patient Age" name="age"
							type="number"
							onChange={(event) => setPatientAge(event.target.value)}
							validators={['required', 'minNumber:10', 'maxNumber:100', 'isNumeric']}
							errorMessages={['Member count to be provided', 'Invalid Patient age', 'Invalid Patient age', 'Invalid Patient age']}
							value={patientAge}
							disabled={!edit}
						/>
						<BlankArea />
						<TextValidator variant="outlined" required fullWidth color="primary"
							id="newEmail" label="Patient Email" name="newEmail"
							onChange={(event) => setPatientEmail(event.target.value)}
							validators={['isEmailOK']}
							errorMessages={["Invalid Email"]}
							value={patientEmail}
							disabled={!edit}
						/>
						<BlankArea />
						<TextValidator variant="outlined" required fullWidth color="primary"      
							id="newMobile" label="Patient Mobile Number" name="newMobile"
							onChange={(event) => setPatientMobile(event.target.value)}
							validators={['mobile']}
							errorMessages={['10 digit mobile number required']}
							value={patientMobile}
							disabled={!edit}
						/>
						<BlankArea />
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={gClasses.editdelete}
						>
						{edit ? "Update" : "Edit"}
						</Button>
						<Button
							variant="contained"
							color="primary"
							className={gClasses.editdelete}
							onClick={handleDelete}
						>
						Delete
						</Button>
						</ValidatorForm>
					</div>}
				</div>}
			</div>}
			
			{ !old && <div>
				<ValidatorForm className={gClasses.form} onSubmit={handleNewSubmit}>
				<TextValidator variant="outlined" required fullWidth color="primary"
          id="newName" label="Patient Name" name="newName"
          onChange={(event) => setPatientName(event.target.value)}
          validators={['required', 'noSpecialCharacters']}
          errorMessages={['Patient Name to be provided', "No Special Characters permitted"]}
          value={patientName}
				/>
				<BlankArea />
				<SelectGender disabled={false} />
				<BlankArea />
				<TextValidator variant="outlined" required fullWidth color="primary"
          id="age" label="Patient Age" name="age"
					type="number"
          onChange={(event) => setPatientAge(event.target.value)}
          validators={['required', 'minNumber:10', 'maxNumber:100', 'isNumeric']}
					errorMessages={['Member count to be provided', 'Invalid Patient age', 'Invalid Patient age', 'Invalid Patient age']}
          value={patientAge}
				/>
				<BlankArea />
				<TextValidator variant="outlined" required fullWidth color="primary"
          id="newEmail" label="Patient Email" name="newEmail"
          onChange={(event) => setPatientEmail(event.target.value)}
          validators={['isEmailOK']}
          errorMessages={["Invalid Email"]}
          value={patientEmail}
				/>
				<BlankArea />
				<TextValidator variant="outlined" required fullWidth color="primary"      
          id="newMobile" label="Patient Mobile Number" name="newMobile"
          onChange={(event) => setPatientMobile(event.target.value)}
          validators={['mobile']}
          errorMessages={['10 digit mobile number required']}
          value={patientMobile}
				/>
				<BlankArea />
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={gClasses.submit}
				>
					Add
				</Button>
				</ValidatorForm>
			</div>}
				<ShowResisterStatus/>
        <BlankArea />
				<ValidComp />    			
      </Container>
  </div>
  );    
}

