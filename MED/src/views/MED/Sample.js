import React,  { useEffect, useState, useContext } from 'react';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import VsButton from "CustomComponents/VsButton"

import Datetime from "react-datetime";
import DatePicker from "react-datetime";
import "react-datetime/css/react-datetime.css";
//import './date-picker.component.bootstrap.css';
import moment from "moment";

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// eslint-disable-next-line no-confusing-arrow
const buildClassNames = (touched, isInvalid) =>
touched && isInvalid ? 'form-control is-invalid' : 'form-control';

//colours 
import { red, blue, white,
} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#FAF5E9',
  },
	blueButton: {
		backgroundColor: blue[700],
		color: '#FFFFFF',
	},
	buttonStyle: {padding: "5px 10px", margin: "4px 2px", color: 'white', fontWeight: theme.typography.fontWeightBold, fontSize:'16px', borderRadius: 7, border: 2},
}));


/*<style>
.button1 {
background-color: red;
border: none;
border-radius: 5px;
color: black;
padding: 15px 32px;
text-align: center;
font-size: 16px;
margin: 4px 2px;
}
.button2 {
background-color: Blue;
border: dotted;
border-radius: 9px;
color: black;
padding: 15px 32px;
text-align: center;
font-size: 16px;
margin: 4px 2px;
}
.button3 {
background-color: green;
border: double;
border-radius: 9px;
color: black;
padding: 15px 32px;
text-align: center;
font-size: 16px;
margin: 4px 2px;
}
</style>
*/

// disable future dates
const today = moment();
const yesterday = moment().subtract(1, 'day');

// disable past dates

export function disablePastDt(current) {
  return current.isAfter(yesterday);
};


export function disableFutureDt(current) {
  return current.isBefore(today)
}

export function disableAllDt(current) {
  return false;
}

function customFuncyion() {
	alert("Custome handler for Button Clicked");
}

function disabled() {
	alert("Button disabled");
}

export function GoodButton(props) {
var bSTyle = {padding: "5px 10px", margin: "4px 2px", color: 'white', fontSize:'16px', borderRadius: 7, border: 2};
bSTyle.backgroundColor = (props.color) ? props.color: blue[700];
//console.log(bSTyle);
let _disabled=true;
let handler=disabled

if (props.disabled) {
	// job done
} else {
	if (props.onClick)
		handler=props.onClick
}
return(	
	<button style={bSTyle} onClick={handler} >{props.name}</button>
)}


export function Sample()  {
	const [startDate, setStartDate] = useState(new Date());

	const [myDate, setMyDate] = useState(new Date());
	let yyy = new Date();
	yyy.setMinutes(0);
	
	const [myTime, setMyTime] = useState(yyy);
	
function handleDate(d) {
	console.log("Date handler");
	let xxx = d.toDate();
	console.log(xxx);
}


let myName = "Click Me";
function MyCustomButton () {

    return (
      <button>
        {myName}
      </button>
    );
  }


function VsButton1(props) {
return (
	<Box borderColor="primary.main" borderRadius={7} border={2}>
	<button onClick={dummy}>Button</button>
	</Box>
)}

// border: double;
//border-radius: 9px;

var liStyle = {padding: "5px 10px", margin: "4px 2px", color: 'black', fontSize:'16px', borderRadius: 7, border: 2};



//<button disabled style={liStyle} onClick={dummy} >Button1</button>
	//<button style={liStyle} onClick={dummy}>Button2</button>
return (
<div className="form-group">
	<VsButton name="VS 1" disabled />
	<VsButton name="VS 2" color={red[700]} />
	<VsButton name="VS 3" onClick={customFuncyion} />
	
	
 <Datetime 
	timeFormat={false} 
	initialValue={new Date()}
	dateFormat="DD / MM / yyyy"
	isValidDate={disableAllDt}
	onChange={handleDate}
	/>
	
	<Datetime 
	timeFormat={false} 
	initialValue={new Date()}
	dateFormat="DD/MM/yyyy"
	isValidDate={disablePastDt}
	onChange={handleDate}
	/>
	
	<Datetime 
		autoWidth
		dateFormat={false} 
		timeFormat="HH:mm"
		initialValue={yyy}
		timeConstraints={{minutes: { step: 15, }}}
		/>
</div>
);
};

export default Sample;