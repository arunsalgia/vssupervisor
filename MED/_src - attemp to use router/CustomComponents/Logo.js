import React from 'react';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import Avatar from "@material-ui/core/Avatar"
/*
import Box from '@material-ui/core/Box';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState ,useContext} from 'react';
*/

/*
<Avatar padding='none' variant="square" className={gClasses.logoAvatar}>
	</Avatar>
  );
*/

export default function Logo() {
  const gClasses = globalStyles();	
  return (<Typography className={gClasses.logoText}> + </Typography>);
}
