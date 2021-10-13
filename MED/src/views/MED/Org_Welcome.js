import React, { useState, useEffect } from 'react';
// import './App.css';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import Avatar from "@material-ui/core/Avatar"
// import download from 'js-file-download';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import globalStyles from "assets/globalStyles";
// import modalStyles from "assets/modalStyles";
//import Header from "CustomComponents/Header";
import useScript from './useScript';
import VsButton from "CustomComponents/VsButton";

import { downloadApk, decrypt } from "views/functions";
import { BlankArea, CricDreamLogo } from 'CustomComponents/CustomComponents';
import { isMobile, cdRefresh } from "views/functions.js"
import { red, blue, deepOrange, yellow } from '@material-ui/core/colors';

// const APPNAME  = process.env.REACT_APP_NAME;
// const APLAXIOS = process.env.REACT_APP_APLAXIOS;
const BRHEIGHT = 8;


//const QUOTESCRIPT = "https://theysaidso.com/gadgets/v3/theysaidso.js";

//const QUOTESTYPE = ["inspire", "life", "tod"];
//var rand = 1;  //Math.floor(Math.random() * 100) % 2;
//var quoteCat = QUOTESTYPE[rand];
//console.log(quoteCat);
//const QODSERVER = `https://quotes.rest/qod?category=${quoteCat}&language=en`;

const useStyles = makeStyles((theme) => ({
	avatar: {
		backgroundColor: deepOrange[300],
		color: 'blue',
		fontSize: theme.typography.pxToRem(36),
		fontWeight: theme.typography.fontWeightBold,
		height: '70px',
		width: '70px',
	},
	selIndex: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
	},
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	docClinic: {
		align: "center",
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold, 
		paddingBottom: "15px", 
	},
	docName: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(24),
		fontWeight: theme.typography.fontWeightBold, 
	},
	docType: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		paddingBottom: "15px", 
		//margin: "10px 10px", 
	},
	docMobile: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		//paddingBottom: "15px", 
		//margin: "10px 10px", 
	},
	docAddr: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	unselIndex: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
	},
	welcomeMESSAGE: {
    align: "center",
		color: blue[700],
		fontSize: theme.typography.pxToRem(48),
		fontWeight: theme.typography.fontWeightBold,
	},
	quote: {
		border: 5,
		borderRadius: 7,
		borderWidth: 2,
		align: "center",
		position: "fixed",
		justifyContent: "center",
		top: "20%",
		width: '40%',
		left: "30%",
		//left: "10%",
		//width: '80%',
		//display: "flex",
		//justifyContent: "center",
		//alignItems: "center",
		backgroundColor: 'yellow',
	},
	quoteMobile: {
		border: 5,
		borderRadius: 7,
		borderWidth: 2,
		align: "center",
		position: "fixed",
		justifyContent: "center",
		top: "20%",
		width: '90%',
		left: "5%",
		//left: "10%",
		//width: '80%',
		//display: "flex",
		//justifyContent: "center",
		//alignItems: "center",
		backgroundColor: 'yellow',
	},
	quoteMessage: {
		fontSize: '16px',
		fontWeight: theme.typography.fontWeightBold,
	},
	quoteAuthor: {
		fontSize: '20px',
		fontWeight: theme.typography.fontWeightBold,
	},
	loginButton: {
		position: "fixed",
		top: "8%",
		right: "2%"
	},
	doctorButton: {
		position: "fixed",
		top: "2%",
		right: "2%"
	},
	background: {
		backgroundImage:  `${process.env.PUBLIC_URL}/image/WELCOME.JPG`,
	},
	container: {
		backgroundImage: `${process.env.PUBLIC_URL}/image/WELCOME.JPG`,   //`url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		width: '100vw',
		height: '100vh'
	},
	buttonLeft: {
		position: "fixed",
		top: "1%",
		left: "2%"
	},
	
	buttonRight2: {
		position: "fixed",
		top: "1%",
		right: "1%"
	},
	dlm: {
		position: "fixed",
		top: "6%",
		left: "1%",
		//right: 'auto',
		color: blue[900],
		fontSize: '3px',
		fontWeight: theme.typography.fontWeightBold,
	},
	dlm2: {
		left: "1%",
		//right: 'auto',
		color: blue[900],
		fontSize: '3px',
		fontWeight: theme.typography.fontWeightBold,
	},
	left: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: red[900],
		//align: "right",
	  },
	right: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[900]
	},
	oContainer: {
		display: "flex",
		alignItems: 'center',
		justifyContent: 'center',
	},
	oImage: {
		flexBasis: '40%',
	},
	oText1: {
		fontSize: "20px",
		fontWeight: theme.typography.fontWeightBold,
		paddingLeft: "0px",
		align: "center"
	},
	oText2: {
		fontSize: "16px",
		align: "left",
		fontWeight: theme.typography.fontWeightBold,
		paddingLeft: "0px",
	}
}));

let welcomeMESSAGE = `${process.env.REACT_APP_WELCOME}`;
let welcomeImage= `${process.env.PUBLIC_URL}/image/WELCOME.JPG`;

const Welcome = () => {
	let classes = useStyles();
	let gClasses = globalStyles();
	
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [bgImage, setBgImage] = useState("APLIMAGE")
	const [ downloadMessage, setDownloadMessage ] = useState("");
	const [allOffer, setAllOffer] = useState([]);

	const [quoteMessage, setQuoteMessage] = useState("If you're changing the world, you're working on important things. You're excited to get up in the morning.");
	const [quoteAuthor, setQuoteAuthor] = useState("Larry Page");
	
	const [doctorArray, setDoctorArray] = useState([]);
	const [masterDoctorArray, setMasterDoctorArray] = useState([])
	const [categary, setCategary] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	
	function calculateBR() {
		// console.log(window.innerHeight, BRHEIGHT);
		// let myCount = Math.floor(window.innerHeight / BRHEIGHT) - 10;
		// if (myCount < 1) myCount = 1;
		// if (myCount > (200-1)) myCount = (200-1);
		// setBreakCount(myCount);
		// console.log(breakCount);
		// let tmp = (window.innerWidth >= 650) ? "WELCOME" : "MOBILE";
		// console.log("Imgae is", tmp);
		// setBgImage(tmp);
	}


	useEffect(() => {
		
		const handleWindowResize = () => {
			console.log(window.innerHeight, window.innerWidth);
			calculateBR();
			setWindowWidth(window.innerWidth);
			setWindowHeight(window.innerHeight-40);
			// console.log()
		};

		const getQuote = async () => {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/quote/random`); 
				console.log(resp.data);
				setQuoteAuthor(resp.data.author)
				setQuoteMessage(resp.data.quote)
			} catch (e) {
				console.log(e);
			}
		}
		
		const getDoctor = async () => {
			let done=false;
			while (!done) {
				try {
					var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/customer/list`);
					setMasterDoctorArray(response.data);
					setDoctorArray(response.data);
					let allCat = [...new Set(response.data.map(item => item.type))]; // [ 'A', 'B']
					allCat = ["All"].concat(allCat);
					allCat.push("Paediatrics");
					console.log(allCat);
					setCategary(allCat);
					setMasterDoctorArray(response.data);
					setDoctorArray(response.data);
					setCurrentIndex(0);
					done = true;
				} catch (e) {
					console.log(e);
					done = true;
				}
			}
	
		}
		
		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
		window.addEventListener('resize', handleWindowResize);
		calculateBR();
		//getQuote();
		getDoctor();
		
		return () => {
				window.removeEventListener('resize', handleWindowResize);
		}
	}, []);
    
    
	function handleSignin() {
		sessionStorage.setItem("currentLogin", "SIGNIN");
		cdRefresh();
	}
	
	function handleSignup() {
		sessionStorage.setItem("currentLogin", "SIGNUP");
		cdRefresh();
	}


	async function handleAndroid() {
		try {
			setDownloadMessage("APL Android app download started. Please wait...")
			// console.log("Download Android app");
			await downloadApk();
			setDownloadMessage("APL Android app download complete.")
			// console.log("APK has to be downloaded");
		} catch (e) {
			setDownloadMessage("Error encountered while downloading APL Android app", true)
		}
		setTimeout(() => setDownloadMessage(""), 5000);    
	}

	
	function DisplayWelcome() {
	return (
	<div align="center">
		<Typography className={(isMobile()) ?  classes.welcomeMobileMESSAGE : classes.welcomeMESSAGE } >{welcomeMESSAGE}</Typography>	
	</div>
	)};
	
	function handleLogin() {
		sessionStorage.setItem("currentLogin", "SIGNIN");
		cdRefresh();
	}
	
	function orgContinueLoginButton() {
	return (
		<div>
		<Button variant="contained" color="primary" 
		onClick={() => {sessionStorage.setItem("currentLogin","DOCTOR"); cdRefresh();}}
		className={classes.doctorButton}
		>
		Doctor Directory
		</Button>
		<Button variant="contained" color="primary" 
		onClick={handleLogin}
		className={classes.loginButton}
		>
		Continue to Login
		</Button>
		</div>
	)};
	
	function DisplayQOD() {
	return (
	<div className={(isMobile()) ? classes.quoteMobile : classes.quote}> 
		<Typography className={classes.quoteAuthor}>Quote of the day</Typography>
		<BlankArea />
		<Typography className={classes.quoteMessage} >{quoteMessage}</Typography>
		<BlankArea />
		<Typography className={classes.quoteAuthor}>
			<span className={classes.quoteMessage}>Author: </span>
			<span className={classes.quoteAuthor}>{quoteAuthor}</span>
		</Typography>
	</div> 

	)}

	function handleCategoryClick(cat, index) {
		let myArray = [].concat(masterDoctorArray);
		if (cat !== "All")
			myArray = masterDoctorArray.filter(x => x.type === cat);
		setDoctorArray(myArray);
		setCurrentIndex(index);
	}
	
	function DisplayDoctorCategory() {
	//console.log(categary);
	return (
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="DOCTYPE" container alignItems="center" >
		<Grid key="DOCTYPETITLE" item xs={12} sm={12} md={12} lg={12} >
			<div align="center">
			<Typography className={classes.slotTitle} >{"Category of Doctors"}</Typography>
			</div>
		</Grid>		
		<Grid key="LEFT" item xs={1} sm={1} md={1} lg={1} />
		{categary.map( (c, index) => {
			let myClass = (index === currentIndex) ? classes.selIndex : classes.unselIndex;
			return (
				<Grid key={"DOC"+index} item xs={3} sm={3} md={2} lg={2} >
					<Typography className={myClass} 
						onClick={() => {handleCategoryClick(c, index)}}
					>
					{c}
					</Typography>
				</Grid>
			)}
		)}
		<Grid key="RIGHT" item xs={1} sm={1} md={1} lg={1} />
	</Grid>
	</Box>
	)};


	function DisplayAllDoctors() {
	//console.log(doctorArray);
	return (
	<div>
	{doctorArray.map( (d, index) => {
		//let myDoc = d.name.substr(3);
		return (
			<Box key={"BOX"+index} className={gClasses.boxStyle} borderRadius={7} border={1} >
			<Grid key={"DOCCONT"+index} container alignItems="center" >
			<Grid key={"DOC11"+index} item xs={2} sm={2} md={2} lg={2} >
				<div align="center">
				<Avatar className={classes.avatar}>{d.name.substr(3,2)}</Avatar>
				</div>
			</Grid>
			<Grid key={"DOC12"+index} item xs={8} sm={8} md={8} lg={8} >
				<div align="center">
				<Typography className={classes.docClinic}>{d.clinicName}</Typography>
				</div>
				<Typography className={classes.docName}>{d.name}</Typography>
				<Typography className={classes.docType}>{d.type}</Typography>
				<Typography className={classes.docMobile}>{"Mobile : "+d.mobile}</Typography>
				<Typography className={classes.docMobile}>{"Email  : "+decrypt(d.email)}</Typography>
				<Typography className={classes.docMobile}>{"Addr  : "}</Typography>
				<Typography className={classes.docAddr}>{d.addr1}</Typography>
				<Typography className={classes.docAddr}>{d.addr2}</Typography>
				<Typography className={classes.docAddr}>{d.addr3}</Typography>
				
			</Grid>
			<Grid key={"DOC13"+index} item xs={2} sm={2} md={2} lg={2} >
				<Typography>{"button"}</Typography>
			</Grid>
			</Grid>
			</Box>
		)}
	)}
	</div>
	)}


	return (
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	<div className={classes.paper}>
		<div align="center">
		<Typography className={classes.welcomeMESSAGE} >{"Welcome to Doctor Viraag"}</Typography>	
		</div>
		<VsButton name="Continue to Login" align="right" 
			onClick={() => {sessionStorage.setItem("currentLogin","SIGNIN"); cdRefresh();}}
		/>		
	<DisplayDoctorCategory />
	<DisplayAllDoctors />
	</div>
	</Container>
	);
};

export default Welcome;
