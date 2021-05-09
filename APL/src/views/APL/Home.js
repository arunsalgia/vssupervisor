import React, { useEffect, useState, useContext } from 'react';
import { spacing } from '@material-ui/system';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { UserContext } from "../../UserContext";
import { NoGroup, DisplayPageHeader, MessageToUser, BlankArea, JumpButton } from 'CustomComponents/CustomComponents.js';
import { hasGroup } from 'views/functions';
import { red, blue } from '@material-ui/core/colors';
// import { updateLanguageServiceSourceFile } from 'typescript';
import Card from '@material-ui/core/Card';
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


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    ngCard: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightBold,
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
    error:  {
        // right: 0,
        fontSize: '12px',
        color: red[700],
        alignItems: 'center',
        marginTop: '0px',
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



export default function Home() {

    window.onbeforeunload = () => setUser("")
    // const { setUser } = useContext(UserContext);
    const classes = useStyles();
    const [tournamentList, setTournamentList] = useState([]);
    const [registerStatus, setRegisterStatus] = useState(0);
    const [currentTournament, setCurrentTournament] = useState(0);

    useEffect(() => {
        const a = async () => {
            var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/list/notstarted`); 
            setTournamentList(response.data);
            if (response.data.length > 0) {
              setCurrentTournament(0);
            }
        }
        a();
    }, [])

    function ShowResisterStatus() {
        // console.log(`Status is ${registerStatus}`);
        let myMsg;
        let errmsg = true;
        switch (registerStatus) { 
          case 200:
            myMsg = "Successfully updated Captain / ViceCaptain details";
            errmsg = false;
            break;
          case 0:
            myMsg = "";
            errmsg = false;
            break;
          default:
            myMsg = "Error updating Captain / ViceCaptain details";
            break;
        }
        let myClass = (errmsg) ? classes.error : classes.root;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
    }
    
    function handleCreate() {
      // console.log(currentTournament);
      // console.log(tournamentList[currentTournament]);
      localStorage.setItem("cGroup", tournamentList[currentTournament].name);
      setTab(process.env.REACT_APP_GROUPNEW);
    }

    function handleJoin() {
      //console.log("Join group");
      setTab(process.env.REACT_APP_GROUPJOIN);
    }

    function handleLeft() {
      if (currentTournament > 0)  
        setCurrentTournament(currentTournament - 1);
    }

    function handleRight() {
      if (currentTournament < (tournamentList.length-1))
        setCurrentTournament(currentTournament + 1);
    }

    function OrgShowTournamentCards() {
      if (tournamentList.length === 0) return null;

      let tmp = tournamentList[currentTournament];
      return (
        <Box paddingLeft={2} paddingRight={2} borderColor="primary" border={0}>
      <Card m={2} raised variant="outlined">
      <CardContent>
      <Table>
        <TableBody p={0}>
          <TableRow key={tmp.name}>
            <TableCell p={0} m={0} align="left" >
            <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handleLeft}
              disabled={currentTournament === 0}
              aria-label="left" color="primary">
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
            </TableCell>
            <TableCell p={0} m={0} align="center" >
              <Typography className={classes.ngCard} align="center">{tmp.name}</Typography>
            </TableCell>
            <TableCell p={0} m={0} align="right" >
              <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handleRight}
                disabled={currentTournament === (tournamentList.length-1)}
                aria-label="right" color="primary">
                <ArrowRightIcon fontSize="large" />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </CardContent>
      <CardActions>
      <Grid key="gr-group" container justify="center" alignItems="center" >
        <Grid item xs={4} sm={4} md={4} lg={4} >
          <Button  
            align="left"
            variant="contained"
            size="small" color="primary"
            className={classes.submit}
            onClick={handleCreate}>
            New Group
          </Button>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} />
        <Grid item xs={4} sm={4} md={4} lg={4} >
          <Button 
            align="right"
            variant="contained"
            size="small" color="primary"
            className={classes.submit}
            onClick={handleJoin}>
            Join Group
          </Button>
        </Grid>
      </Grid>
      </CardActions>
      </Card>
      </Box>
      )
    }

    function ShowTournamentCards() {
      if (tournamentList.length === 0) return null;

      let tmp = tournamentList[currentTournament];
      return (
        <Box paddingLeft={2} paddingRight={2} borderColor="primary" border={0}>
      <Card m={2} raised variant="outlined">
      <CardContent>
      <Grid key="gr-groupname" container justify="center" alignItems="center" >
        <Grid item xs={2} sm={2} md={2} lg={2} >
        <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handleLeft}
              disabled={currentTournament === 0}
              aria-label="left" color="primary">
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
        </Grid>
        <Grid align="center" item xs={8} sm={8} md={8} lg={8} >
          <Typography className={classes.ngCard} align="center">{tmp.name}</Typography>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} >
        <IconButton 
              // iconStyle={{width: '24px', height: '24px'}}
              onClick={handleRight}
                disabled={currentTournament === (tournamentList.length-1)}
                aria-label="right" color="primary">
                <ArrowRightIcon fontSize="large" />
              </IconButton>
        </Grid>
      </Grid>
      </CardContent>
      <CardActions>
      <Grid key="gr-group" container justify="center" alignItems="center" >
        <Grid item xs={4} sm={4} md={4} lg={4} >
          <Button  
            align="left"
            variant="contained"
            size="small" color="primary"
            className={classes.submit}
            onClick={handleCreate}>
            New Group
          </Button>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} />
        <Grid item xs={4} sm={4} md={4} lg={4} >
          <Button 
            align="right"
            variant="contained"
            size="small" color="primary"
            className={classes.submit}
            onClick={handleJoin}>
            Join Group
          </Button>
        </Grid>
      </Grid>
      </CardActions>
      </Card>
      </Box>
      )
    }

  
    function ShowJumpButtons() {
      return (
        <div>
          <BlankArea />
          <JumpButton page={process.env.REACT_APP_DASHBOARD} text="DashBoard" />
          <BlankArea />
          <JumpButton page={process.env.REACT_APP_STAT} text="Statistics" />
          <BlankArea />
          <JumpButton page={process.env.REACT_APP_TEAM} text="My Team" />
          <BlankArea />
          <JumpButton page={process.env.REACT_APP_CAPTAIN} text="Captain and ViceCaptain" />
        </div>
      )
    }
  
  
    return (
    <div className={classes.root} key="uctournament">
      {/* <BlankArea/> */}
      <DisplayPageHeader headerName="Upcoming Tournament" groupName="" tournament=""/>
      <BlankArea/>
      <ShowTournamentCards/>
      <BlankArea/>
      <ShowJumpButtons />
    </div>
    );
    }
