import React from 'react';
//import Typography from '@material-ui/core/Typography';
import BorderWrapper from 'react-border-wrapper'
import globalStyles from "assets/globalStyles";


import {ToothLeft, ToothRight, ToothNumber,} from "views/globals.js";

export default function VsTeeth(props) {
const gClasses = globalStyles();
let _Click = (props.onClick == null) ? dummy : props.onClick;
return (
	<div>
		<div align="center" className={gClasses.tooth}>
		<span className={gClasses.toothType}>UL: </span>
		{ToothNumber.upperLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
				)}
		<span className={gClasses.toothType}>UR: </span>
		{ToothNumber.upperRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
				)}
		</div>
		<div align="center" className={gClasses.tooth}>
		<span className={gClasses.toothType}>LL: </span>
		{ToothNumber.lowerLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
				)}
		<span className={gClasses.toothType}>LR: </span>
		{ToothNumber.lowerRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) } >{t}</span>
						</BorderWrapper>								
					)}
				)}
		</div>
	</div>
)
}