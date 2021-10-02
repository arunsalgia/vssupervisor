import React,{useState, useEffect } from 'react';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import axios from 'axios';
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Modal from 'react-modal'; 


// icons
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";
import {dynamicModal } from "assets/dynamicModal";

import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
	DisplayPatientDetails,
	DisplayDocumentList,
	DisplayImage,
	DisplayPDF,
	LoadingMessage,
} from "CustomComponents/CustomComponents.js"

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
	getOnlyDate, getDateTime,
	getPatientDocument,
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

const SupportedMimeTypes = [
"image/png",  "image/jpeg", "application/pdf"
]

const SupportedExtensions = [
"PNG",  "JPG", "PDF"
];

let searchText = "";
function setSearchText(sss) { searchText = sss;}

let userCid;
 
export default function Document() {
	const classes = useStyles();
	const gClasses = globalStyles();
	
	const [startLoading, setStartLoading] = useState(false);
	const [emurName, setEmurName] = useState("");
	const [modalRegister, setModalRegister] = useState(0);
	
	const [selectPatient, setSelectPatient] = useState(false);
  const [patientArray, setPatientArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	
	const [dlMime, setDlMime] = useState("");
	const [dlFile, setDlFile] = useState("");
	const [isPdf, setIsPdf] = useState(false);
	const [dlSrc, setDlSrc] = useState("");
	const [dlDoc, setDlDoc] = useState({});
	
	const [viewImage, setViewImage] = useState(false);
	
	const [registerStatus, setRegisterStatus] = useState(0);
	const [state, setState] = useState({
	selectedFile: null // Initially, no file is selected 
	})
  const [documentArray, setDocumentArray] = useState([]);
	
	const [edit, setEdit] = useState(false);
	const [newDocument, setNewDocument] = useState(false);
	const [title, setTitle] = useState("")
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [radioDocumentType, setRadioDocumentType] = useState("JPG");
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	
  useEffect(() => {		
		userCid = sessionStorage.getItem("cid");
		//getDocumentList()
  }, []);

	async function orggetPatientDocument(rec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/list/${userCid}/${rec.pid}`;
			let resp = await axios.get(myUrl);
			setDocumentArray(resp.data);
			console.log(resp.data);
		} catch (e) {
			console.log(e);
			setDocumentArray([]);
		}
	}
		
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  break;
			case 100: myMsg = "Success"; break;
			case 101: myMsg = "Document file not selected"; break;
			case 102: myMsg = "Only document of type JPG/PNG/PDF supported"; break;
			case 103: myMsg = "Medical Report Title already exists"; break;
			case 104: myMsg = "Error loading document"; break;
			case 105: myMsg = "Medical report file size permitted only up to 1MB"; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={((registerStatus % 100) != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
	
	async function handleFileView(d) {	
		//console.log(d.title);
		//setStartLoading(true);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/downloadimage/${userCid}/${currentPatientData.pid}/${d.title}`
			let resp = await axios.get(myUrl);
			//console.log(resp.data.data);
			
			if (d.type === "PDF") {
				const b64 = Buffer.from(resp.data.data).toString('base64');
				//console.log(b64)
				setDlFile(b64);
				//console.log(b64.length);
				setIsPdf(true);
			} else {
				//image file
				const b64 = Buffer.from(resp.data.data).toString('base64');
				//console.log(b64);
				setDlFile(b64);
				setIsPdf(false);
			} 
			setDlDoc(d);
			let idx = SupportedExtensions.indexOf(d.type);
			setDlMime(SupportedMimeTypes[idx]);
			setViewImage(true);
			
		} catch (e) {
			console.log(e);
		}
		//setStartLoading(false);
	}
	
	async function deleteDoc(d) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/delete/${userCid}/${currentPatientData.pid}/${d.title}`
			let resp = await axios.get(myUrl);
			let tmpArray = documentArray.filter(x => x.title !== d.title);
			setDocumentArray(tmpArray);
		} catch (e) {
			console.log(e);
		}
	}
	
	function reloadDoc(a) {
		setRegisterStatus(0); 
		setEdit(true); 
		setTitle(a.title); 
		setDesc(a.desc); 
		setState({selectedFile: null}); 
		setNewDocument(true);
	}
	
	function orgDisplayDocumentList() {
	return (	
	<Box className={classes.allAppt} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} colSpan={8} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Document List
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH21"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Date
					</TableCell>
					<TableCell key={"TH22"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
						Title
					</TableCell>
					<TableCell key={"TH23"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Description
					</TableCell>
					<TableCell key={"TH24"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Type
					</TableCell>
					<TableCell key={"TH25"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					Name
					</TableCell>
					<TableCell colSpan={3} key={"TH31"} component="th" scope="row" align="center" padding="none"
					className={classes.th} >
					cmds
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>  
			{documentArray.map( (a, index) => {
				//let myExpiry = getOnlyDate(a.expiryDate);
				let myClass = classes.tdPending;
				return(
					<TableRow align="center" key={"TROW"+index}>
					<TableCell key={"TD1"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{getOnlyDate(a.date)}
						</Typography>
					</TableCell>
					<TableCell key={"TD2"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{a.title}
						</Typography>
					</TableCell>
					<TableCell key={"TD3"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{a.desc}
						</Typography>
					</TableCell>
					<TableCell key={"TD4"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{a.type}
						</Typography>
					</TableCell>
					<TableCell key={"TD5"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.apptName}>
							{a.name}
						</Typography>
					</TableCell>
					<TableCell key={"TD11"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
							<Link href="#" variant="body2" onClick={() => handleFileView(a)}>View</Link>
						</Typography>
					</TableCell>
					<TableCell key={"TD12"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<Typography className={classes.link}>
						<Link href="#" variant="body2" onClick={() => {setRegisterStatus(0); setEdit(true); setTitle(a.title); setDesc(a.desc); setState({selectedFile: null}); setNewDocument(true)}}>Reload</Link>
						</Typography>
					</TableCell>
					<TableCell key={"TD13"+index} align="center" component="td" scope="row" align="center" padding="none"
						className={myClass}>
						<IconButton color="secondary" size="small" onClick={() => { deleteDoc(a) } } >
							<DeleteIcon	 />
						</IconButton>
					</TableCell>
					</TableRow>
			)})}
			</TableBody> 
			</Table>
			</TableContainer>
		</Box>	
	)}
	
	// On file select (from the pop up)
	function onFileChange(event) {
		if ((event.target.files[0].size / (1024*1024)) > 1) {
			console.log(event.target.files[0].size / (1024*1024));
			setRegisterStatus(105);
		} else {
			setRegisterStatus(0);
			setState({ selectedFile: event.target.files[0] });
			console.log(event.target.files[0]);
		}
	};
    
    // On file upload (click the upload button)
	async function old_onFileUpload() {
    
		// Create an object of formData
		const formData = new FormData();
	
		// Update the formData object
		formData.append(
      "file",
      state.selectedFile,
      state.selectedFile.name
    );
	
				
		// Details of the uploaded file
		console.log(formData);
    
		// Request made to the backend api
		// Send formData object
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/oldimage/uploadimage/${userCid}/${state.selectedFile.name}/Sample`
    let resp = await axios.post(myUrl, formData);
		console.log(resp);
	};
    
    // File content to be displayed after
    // file upload is complete
  async function  addNewDocumentSubmit()  {
		// validate file is selected
		if (!state.selectedFile) {
			setRegisterStatus(101);
			return;
		}
		
		// if new doc thena validate title is not duplicate
		if (!edit) {
			let tmp = documentArray.filter(x => x.title.toLowerCase() === title.toLowerCase())
			if (tmp.length > 0) {
				setRegisterStatus(103);
				return;
			}
		}
		
		// check for supported file types
		if (!SupportedMimeTypes.includes(state.selectedFile.type)) {
			setRegisterStatus(102);
			return;
		}

    // All okay. now prepare to send 
		// Update the formData object
		const formData = new FormData();
		formData.append("file", state.selectedFile, state.selectedFile.name);

		// Request made to the back end api
		// Send formData object
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/uploadimage/${userCid}/${currentPatientData.pid}/${currentPatientData.displayName}/${state.selectedFile.name}/${title}/${desc}`
			let resp = await axios.post(myUrl, formData);
			console.log(resp.data);
			setNewDocument(false);		// done
			let ddd = await getPatientDocument(userCid, currentPatientData.pid);
			setDocumentArray(ddd);
		} catch (e) {
			console.log(e);
			setRegisterStatus(104);
		}
	};
  
	
	
	
	
	function DisplayFilter() {
	return (	
	<Grid className={classes.noPadding} key="Filter" container justify="center" alignItems="center" >
		<Grid item xs={false} sm={false} md={3} lg={3} />
		<Grid item xs={9} sm={9} md={6} lg={6} >
			<TextField id="filter"  padding={5} variant="outlined" fullWidth label="Patient Name / Id" 
				defaultValue={searchText}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<SearchIcon onClick={selectFilter}/>
						</InputAdornment>
				)}}
			/>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
			<VsButton name="New Patient" onClick={() => { setEmurName(""); openModal("NEWPATIENT")}} />	
		</Grid>	
	</Grid>
	)}
	
	async function selectFilter() {
		let myText = document.getElementById("filter").value;
		setSearchText(myText);
		let ppp = await updatePatientByFilter(searchText, userCid);
		setPatientArray(ppp);
	}
	
	async function handleSelectPatient(rec) {
		setSelectPatient(false);
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		let ddd = await getPatientDocument(userCid, rec.pid);
		setDocumentArray(ddd);
	}
	
	async function addNewPatient() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/new/${userCid}/${emurName}`;
			let resp = await axios.get(myUrl);
			closeModal();
			setPatientArray([resp.data]);
		} catch(e) {
			console.log(e);
			setModalRegister(401);
		}
	}
	
	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 100:
        myMsg = "Medicine successfully updated";
				regerr = false;
        break;
      case 101:
        myMsg = `All the doses cannot be 0`;
        break;
      case 102:
        myMsg = `No Medicine selected`;
        break;
      case 200:
        myMsg = "Note successfully updated";
				regerr = false;
        break;
      case 201:
        myMsg = `All notes cannot be 0`;
        break;
      case 202:
        myMsg = `Notes cannot be blank`;
        break;
      case 300:
        myMsg = "Remark successfully updated";
				regerr = false;
        break;
      case 301:
        myMsg = `All notes cannot be 0`;
        break;
      case 302:
        myMsg = `Remark cannot be blank`;
        break;
			case 401:
        myMsg = `Patient name already in database`;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }
	
	function DisplayNewPatient() {
	return (	
	<Container component="main" maxWidth="md">
		<VsCancel align="right" onClick={closeModal} />
		<Typography align="center" className={classes.modalHeader}>"Input new Patient Name"</Typography>
		<BlankArea />
			<ValidatorForm align="center" className={gClasses.form} onSubmit={addNewPatient} >
			<Grid key="NewPatirnt" container justify="center" alignItems="center" >
				<Grid item xs={10} sm={10} md={10} lg={10} >
					<TextValidator variant="outlined" required fullWidth color="primary"
						id="emurName" label="New Patient Name" name="emurName"
						onChange={(event) => setEmurName(event.target.value)}
						autoFocus
						value={emurName}
					/>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<VsButton name="New Patient" />
				</Grid>
			</Grid>
			</ValidatorForm>
			<ModalResisterStatus />
	</Container>
	)}
	
	return (
	 <div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Medical Reports Directory" groupName="" tournament=""/>
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		{(!selectPatient) && 
			<Typography align="right" className={classes.link}>
				<Link href="#" variant="body2" onClick={() => { setCurrentPatient(""); setCurrentPatientData({}); setSelectPatient(true); }}>Select Patient</Link>
			</Typography>
		}
		{(selectPatient) && 
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right"onClick={() => {setSelectPatient(false)}} />
				<Typography>
					<span className={classes.patientName}>Select Patient</span>
				</Typography>
				<DisplayFilter />
				<Grid className={classes.noPadding} key="AllPatients" container alignItems="center" >
					{patientArray.map( (m, index) => 
						<Grid key={"PAT"+index} item xs={12} sm={6} md={4} lg={4} >
						<DisplayPatientDetails 
							patient={m} 
							button1={<VsButton name="Select"  color='green' onClick={() => { handleSelectPatient(m)}} />}
							/>
						</Grid>
					)}
				</Grid>
			</Box>
		}
		{(currentPatient !== "") &&
			<div>
			<Typography align="center" className={classes.modalHeader}>
			{currentPatientData.displayName+" ( Id: "+currentPatientData.pid+" ) "}
			</Typography>
			{(startLoading) && <LoadingMessage />}
			{(viewImage && !isPdf) && 
				<DisplayImage 
					title={dlDoc.title} mime={dlMime} file={dlFile}
					handleCancel={() => setViewImage(false)}
				/> 
			}
			{(viewImage && isPdf) && 
				<DisplayPDF 
					title={dlDoc.title} file={dlFile}
					handleCancel={() => setViewImage(false)}
				/>
			}
			{(!newDocument) &&
			<div  align="right">
			<Link href="#" variant="body2" onClick={() => {setRegisterStatus(0); setEdit(false); setTitle(""); setDesc(""); setState({selectedFile: null}); setNewDocument(true)}}>{"Add new Medical Report"}</Link>
			</div>
			}
			{(newDocument) &&
			<Box className={classes.tdPending} width="100%">
				<VsCancel align="right" onClick={() => {setNewDocument(false)}} />
				<Typography className={classes.title}>{(edit ? "Reload" : "Upload new")+" Medical Report"}</Typography>
				<BlankArea />
				<ValidatorForm className={gClasses.form} onSubmit={addNewDocumentSubmit}>
					<Grid key="editdoc" container justify="center" alignItems="center" >
					<Grid item xs={1} sm={1} md={1} lg={1} />
					<Grid item xs={3} sm={3} md={3} lg={3} >
						<TextValidator variant="outlined" required fullWidth
							id="title" label="Medical Report Title" name="title"
							value={title}
							disabled={edit}
							onChange={(event) => setTitle(event.target.value)}
							validators={['noSpecialCharacters']}
							errorMessages={[`Special Characters not permitted`]}
						/>
					</Grid>
					<Grid item xs={1} sm={1} md={1} lg={1} />
					<Grid item xs={3} sm={3} md={3} lg={3} >
						<TextValidator variant="outlined" required fullWidth
							id="desc" label="Medical Report Description" name="desc"
							value={desc}
							onChange={(event) => setDesc(event.target.value)}
							validators={['required', 'noSpecialCharacters']}
							errorMessages={['Medical report description to be provided', 'Special characters not permitted', ]}
						/>
					</Grid>
					<Grid item xs={3} sm={3} md={3} lg={3} >
						<input type="file" id="newFile" onChange={onFileChange} />
					</Grid>
					<Grid item xs={1} sm={1} md={1} lg={1} >
						<VsButton name="Upload" />
					</Grid>
				</Grid>
				<ShowResisterStatus/>
				</ValidatorForm>
				<ValidComp />  
			</Box>
		}	
			<DisplayDocumentList 
				documentArray={documentArray} 
				viewHandle={handleFileView}
				reloadHandle={reloadDoc}
				deleteHandle={deleteDoc}
			/>
			</div>
		}
		<Modal
			isOpen={modalIsOpen == "NEWPATIENT"}
			shouldCloseOnOverlayClick={false}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={modalStyles}
			contentLabel="Example Modal"
			aria-labelledby="modalTitle"
			aria-describedby="modalDescription"
			ariaHideApp={false}
		>
		<DisplayNewPatient />
		</Modal>
		</Container>
  </div>
  );    
}
 