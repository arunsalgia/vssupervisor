import React,{useState, useEffect } from 'react';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import axios from 'axios';
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

// icons
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

// styles
import globalStyles from "assets/globalStyles";


import {DisplayPageHeader, ValidComp, BlankArea,
	DisplayPatientDetails,
	DisplayImage,
	DisplayPDF,
	LoadingMessage,
	DisplayDocumentDetails,
} from "CustomComponents/CustomComponents.js"

import { 
red, blue, yellow, orange, pink, green, deepOrange, lightGreen,
} from '@material-ui/core/colors';

import { 
	isMobile, validateInteger,
	getPatientDocument,
	vsDialog,
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
 
export default function Document(props) {
	const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [stepNo, setStepNo] = useState(0);
	//const [showProgress, setShowProgress] = useState(false);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [selectPatient, setSelectPatient] = useState(false);
  const [patientArray, setPatientArray] = useState([])
	const [patientMasterArray, setPatientMasterArray] = useState([])
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [isAddEdit, setIsAddEdit] = useState(false);
	const [newDocument, setNewDocument] = useState(false);
	
	const [startLoading, setStartLoading] = useState(false);
	const [emurName, setEmurName] = useState("");
	const [modalRegister, setModalRegister] = useState(0);

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
		const checkPatient = async () => {		
			let ppp = await getAllPatients();
			setPatientMasterArray(ppp);
			try {
				//console.log("About to parse share data");
				let patRec = props.patient;		//JSON.parse(sessionStorage.getItem("shareData"));
				// has come from patient page
				//console.log(patRec);
				setSearchText(patRec.displayName);
				setPatientArray([patRec]);
				let ddd = await getPatientDocument(userCid, patRec.pid);
				setDocumentArray(ddd);
				setCurrentPatientData(patRec);
				setCurrentPatient(patRec.displayName);
			} catch {
				setPatientArray(ppp);
			}
			sessionStorage.setItem("shareData", "");
			
		}
		userCid = sessionStorage.getItem("cid");
		checkPatient();
		//getDocumentList()
  }, []);

	async  function getAllPatients() {
		if (process.env.REACT_APP_DIRECTREPORT !== 'true')
				return [];
			
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/list/${userCid}`;
			let resp = await axios.get(myUrl);
			return resp.data;
		} catch (e) {
			return [];
		}	
	}
		
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  break;
			case 100: myMsg = "Success"; break;
			case 101: myMsg = "Report not selected"; break;
			case 102: myMsg = "Only Report of type JPG/PNG/PDF supported"; break;
			case 103: myMsg = "Duplicate Report Title"; break;
			case 104: myMsg = "Error loading document"; break;
			case 105: myMsg = "Report file size permitted only up to 1MB"; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={((registerStatus % 100) != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
	
	
	async function handleFileView(d) {
		let pdfReport;
		setStartLoading(true);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/downloadimage/${userCid}/${d.pid}/${d.title}`
			let resp = await axios.get(myUrl);
			setIsDrawerOpened((d.type === "PDF") ? "PDF" : "IMG");
			if (d.type === "PDF") {
				// pdf file
				// file={`data:application/pdf;base64,${this.state.base64}`}
				const b64 = Buffer.from(resp.data.data).toString('base64');
				//console.log(b64)
				setDlFile(b64);
				pdfReport = true;
			} else {
				//image file
				const b64 = Buffer.from(resp.data.data).toString('base64');
				//console.log(b64);
				setDlFile(b64);
				pdfReport = false
			} 
			setDlDoc(d);
			let idx = SupportedExtensions.indexOf(d.type);
			setDlMime(SupportedMimeTypes[idx]);
			setViewImage(true);
		} catch (e) {
			console.log(e);
		}
		setStartLoading(false);			
	}
	
	async function deleteDoc(d) {
		vsDialog("Delete Report", `Are you sure you want to delete report ${d.title}?`,
			{label: "Yes", onClick: () => deleteDocConfirm(d) },
			{label: "No" }
		);
	}
	
		async function deleteDocConfirm(d) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/delete/${userCid}/${currentPatientData.pid}/${d.title}`
			let resp = await axios.get(myUrl);
			let tmpArray = documentArray.filter(x => x.title !== d.title);
			setDocumentArray(tmpArray);
			alert.success("Removed document "+d.title);
		} catch (e) {
			console.log(e);
			alert.error("Error removing document "+d.title);
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
	

	// On file select (from the pop up)
	function onFileChange(event) {
		if ((event.target.files[0].size / (1024*1024)) > 1) {
			console.log(event.target.files[0].size / (1024*1024));
			setRegisterStatus(105);
		} else {
			setRegisterStatus(0);
			setState({ selectedFile: event.target.files[0] });
			//console.log(event.target.files[0]);
		}
	};
    
  
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
	
	function setFilter(myArray, filterStr) {
		filterStr = filterStr.trim().toLowerCase();
		let tmpArray;
		if (filterStr !== "") {
		if (validateInteger(filterStr)) {
			// it is integer. Thus has to be Id
			tmpArray = myArray.filter(x => x.pidStr.includes(filterStr));
		} else {
			tmpArray = myArray.filter(x => x.displayName.toLowerCase().includes(filterStr));
		}
		} else {
			tmpArray = myArray;
		}
		setPatientArray(tmpArray);
	}
	
	function filterPatients(filterStr) {
		setSearchText(filterStr);
		setFilter(patientMasterArray, filterStr);
	}


	async function handleSelectPatient(rec) {
		setSelectPatient(false);
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		let ddd = await getPatientDocument(userCid, rec.pid);
		setDocumentArray(ddd);
	}
	
	function DisplayAllPatients() {
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientDetails 
			patient={m} 
			button1={
				<IconButton className={gClasses.deepOrange} size="small" onClick={() => { handleSelectPatient(m)}}  >
					<NoteAddIcon />
				</IconButton>
			}
		/>
		</Grid>
	)}
	</Grid>	
	)}
	
	function addDoc() {
		setRegisterStatus(0); 
		setTitle(""); 
		setDesc(""); 
		setState({selectedFile: null});
		setIsDrawerOpened("ADD");  
	}
	
	function editDoc(a) {
		setRegisterStatus(0); 
		setTitle(a.title); 
		setDesc(a.desc); 
		setState({selectedFile: null}); 
		setIsDrawerOpened("EDIT");  
	}
	
	async function  addUpdateDocumentSubmit()  {
		if (!state.selectedFile) {
			setRegisterStatus(101);
			return;
		}
		
		// if new doc then validate title is not duplicate
		if (isDrawerOpened === "ADD") {
			let tmp = documentArray.filter(x => x.title.toLowerCase() === title.toLowerCase())
			if (tmp.length > 0) {
				alert.error("Report title cannot be blank");
				return;
			}
		}
		
		// check for supported file types
		if (!SupportedMimeTypes.includes(state.selectedFile.type)) {
			alert.error("Report type "+state.selectedFile.type+" not support");
			return;
		}

    // All okay. now prepare to send 
		// Update the formData object
		const formData = new FormData();
		formData.append("file", state.selectedFile, state.selectedFile.name);

		// Request made to the back end api
		// Send formData object
		let myTitle = title.trim();
		let myDesc = (desc.trim() !== "") ? desc.trim() : "ARUNANKIT";
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/image/uploadimage/${userCid}/${currentPatientData.pid}/${currentPatientData.displayName}/${state.selectedFile.name}/${myTitle}/${myDesc}`
			let resp = await axios.post(myUrl, formData);
			//console.log(resp.data);
			setIsDrawerOpened("");		// done
			let ddd = await getPatientDocument(userCid, currentPatientData.pid);
			setDocumentArray(ddd);
			alert.success("Report "+title+" successfully added")
		} catch (e) {
			console.log(e);
			alert.success("Error adding report "+title);
		}
	};
  
	function DisplayAllReports() {
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsButton align="right" name="Add new Medical Report" onClick={addDoc} />
		{(documentArray.length === 0) &&
			<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
				<Grid key={"VISIST"} item xs={12} sm={12} md={12} lg={12} >
					<Typography className={gClasses.slotTitle} >
						{"No Reports available"}
					</Typography>
				</Grid>
			</Grid>	
		}
		{(startLoading) &&
					<Typography className={gClasses.title}>Loading report...</Typography>
		}
		{(documentArray.length > 0) &&
			<Grid className={gClasses.noPadding} key="AllDOCS" container alignItems="center" >
			{documentArray.map( (d, index) => 
				<Grid key={"DOC"+index} item xs={12} sm={6} md={3} lg={3} >
				<DisplayDocumentDetails
					document={d} 
					button1={
						<IconButton color="primary" size="small" onClick={() => {handleFileView(d)}} >
							<VisibilityIcon	 />
						</IconButton>	
					}
					button2={
						<IconButton color="primary" size="small" onClick={() => {editDoc(d)}}  >
							<EditIcon  />
						</IconButton>
					}
					button3={
						<IconButton color="secondary" size="small" onClick={() => {deleteDoc(d)}}  >
							<CancelIcon  />
						</IconButton>
					}
				/>
				</Grid>
			)}
			</Grid>
		}
	</Box>
	)}
	

	
	return (
	<div>
	{(sessionStorage.getItem("userType") === "Assistant") &&
		<Typography className={gClasses.indexSelection} >
			{"Only Doctors are permitted to Add / View / Edit patient Reports"}
		</Typography>
	}
	{(sessionStorage.getItem("userType") !== "Assistant") &&
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
		{((currentPatient === "") && (process.env.REACT_APP_DIRECTREPORT === 'true')) &&
			<div>
			<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
			<Grid key={"F1"} item xs={false} sm={false} md={2} lg={2} />
			<Grid key={"F2"} item xs={12} sm={12} md={4} lg={4} >
				<TextField id="filter"  padding={5} fullWidth label="Search Patient by name or Id" 
					defaultValue={searchText}
					onChange={(event) => filterPatients(event.target.value)}
					InputProps={{endAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>)}}
				/>
			</Grid>
			<Grid key={"F6"} item xs={false} sm={false} md={2} lg={2} />
			</Grid>
			<DisplayAllPatients />
			</div>
		}
		{((currentPatient !== "") && (process.env.REACT_APP_DIRECTREPORT === 'true')) &&
			<VsButton align="right" name="Select Patient" onClick={() => { setCurrentPatient("")}} />	
		}
		{(currentPatient !== "") &&
			<div>
			<DisplayAllReports />
			</div>
		}
		<Drawer className={classes.drawer}
			anchor="right"
			variant="temporary"
			open={isDrawerOpened !== ""}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
			{(startLoading) && <LoadingMessage />}
			{((!startLoading) && (isDrawerOpened === "PDF")) &&
				<DisplayPDF 
					title={dlDoc.title} file={dlFile}
					handleCancel={() => setViewImage(false)}
				/>
			}
			{((!startLoading) && (isDrawerOpened === "IMG")) &&
				<DisplayImage 
					title={dlDoc.title} mime={dlMime} file={dlFile}
					handleCancel={() => setViewImage(false)}
				/> 
			}
			{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&   
				<ValidatorForm className={gClasses.form} onSubmit={addUpdateDocumentSubmit}>
					<Typography className={classes.title}>
						{(isDrawerOpened === "ADD") ? "New Medical Report" : "Update Medical Report"}
					</Typography>
					<TextValidator fullWidth  className={gClasses.vgSpacing}
						id="newDocument" label="Title" type="text"
						value={title}
						disabled={isDrawerOpened === "EDIT"}
						onChange={() => { setTitle(event.target.value) }}
						validators={['required', 'noSpecialCharacters']}
						errorMessages={['Report title to be provided', 'Special characters not permitted', ]}
					/>
					<TextValidator fullWidth  className={gClasses.vgSpacing}
						id="descDocument" label="Description" type="text"
						value={desc} 
						onChange={() => { setDesc(event.target.value) }}
						validators={['noSpecialCharacters']}
						errorMessages={['Special characters not permitted', ]}
					/>
					<input className={gClasses.vgSpacing} type="file" id="newFile" onChange={onFileChange} />
					<ShowResisterStatus/>
					<BlankArea />
					<VsButton align="center" 
						name={(isDrawerOpened === "ADD") ? "Add" : "Update"} 
					/>
					<ValidComp />  			
				</ValidatorForm>
			}
		</Box>
		</Drawer>
  </div>
	}
	</div>
  );    
}
 