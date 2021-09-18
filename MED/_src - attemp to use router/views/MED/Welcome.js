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
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
// import modalStyles from "assets/modalStyles";
import Header from "CustomComponents/Header";


import { downloadApk } from "views/functions";
import { BlankArea } from 'CustomComponents/CustomComponents';
import { isMobile, cdRefresh } from "views/functions.js"
import { red, blue, deepOrange, yellow } from '@material-ui/core/colors';

// const APPNAME  = process.env.REACT_APP_NAME;
// const APLAXIOS = process.env.REACT_APP_APLAXIOS;
const BRHEIGHT = 8;

const useStyles = makeStyles((theme) => ({
	welcomeMessage: {
    align: "center",
		position: "fixed",
		top: "20%",
		left: "25%",
		color: blue[700],
		backgroundColor: yellow[100],
		fontSize: theme.typography.pxToRem(42),
		fontWeight: theme.typography.fontWeightBold,
		border: 5,
		borderWidth: 2,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	loginButton: {
    align: "center",
		position: "fixed",
		top: "30%",
		left: "40%",
		color: blue[700],
		backgroundColor: yellow[500],
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		border: 5,
		borderWidth: 2,
		borderColor: 'black',
		borderStyle: 'solid',
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
	buttonRight1: {
		position: "fixed",
		top: "40%",
		right: "45%"
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
		fontSize: '12px',
		fontWeight: theme.typography.fontWeightBold,
	},
	dlm2: {
		left: "1%",
		//right: 'auto',
		color: blue[900],
		fontSize: '12px',
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

let WELCOMEMESSAGE = "Welcome to the clinic of Dr Arun Salgia";
let image1= `${process.env.PUBLIC_URL}/image/WELCOME.JPG`;

const Welcome = () => {
	let classes = useStyles();
	let gClasses = globalStyles();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [bgImage, setBgImage] = useState("APLIMAGE")
	const [ downloadMessage, setDownloadMessage ] = useState("");
	const [allOffer, setAllOffer] = useState([]);

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

		const getOffer = async () => {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getoffer/ALL`); 
				setAllOffer(resp.data);
			} catch (e) {
				console.log(e);
			}
		}

		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
		window.addEventListener('resize', handleWindowResize);
		calculateBR();
		//getOffer();
		
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
			setDownloadMessage("Error encountred while downloading APL Android app", true)
		}
		setTimeout(() => setDownloadMessage(""), 5000);    
	}

	
	function DisplayWelcome() {
	return (
		<Typography className={classes.welcomeMessage} >{WELCOMEMESSAGE}</Typography>	
	)};
	
	function handleLogin() {
		sessionStorage.setItem("currentLogin", "SIGNIN");
		cdRefresh();
	}
	
	function ContinueLoginButton() {
	return (
		<Button type="submit" variant="contained" color="primary" 
		onClick={handleLogin}
		className={classes.buttonRight1}
		>
		Continue to Login
		</Button>
	)};
	
	return (
	<div align="center">
	{/*<Header />*/}
		<img src={image1} alt="ARUN" height={windowHeight} width={windowWidth}/>
		<DisplayWelcome />
		<ContinueLoginButton />
	</div>
	);
};

export default Welcome;
