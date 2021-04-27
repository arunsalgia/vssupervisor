import React, { useEffect, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardBody from "components/Card/CardBody.js";
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

// import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {orange, deepOrange}  from '@material-ui/core/colors';

import socketIOClient from "socket.io-client";
import { NoGroup, DisplayPageHeader, 
  ShowCreateGroup, ShowJoinGroup, ShowAuctionGroup, ShowCaptainGroup, ShowMultipleGroup
} from 'CustomComponents/CustomComponents.js';
// import {socketPoint} from "views/functions.js";

const dashStyles = makeStyles(styles);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  th: { 
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    // border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
    align: "center",
  },
  td : {
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },
  cardContent: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: '#18FFFF',   //deepOrange[500],
    margin: 0,
    padding: "none",
    //height: 20,
  },
  cc0: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '12px',
    margin: theme.spacing(0, 0, 0),
    padding: "none",
  },
  cc1: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    fontWeight: theme.typography.fontWeightBold,
    margin: theme.spacing(0, 0, 0),
    padding: "none",
  },
  cc2: {
    margin: theme.spacing(0, 0, 0),
    fontSize: '12px',
    padding: "none",
    // color: theme.palette.getContrastText(deepOrange[500]),
    // fontWeight: theme.typography.fontWeightBold,
  },
})); 
  

function leavingStatistics(myConn) {
  console.log("Leaving Statistics wah wah ");
  myConn.disconnect();
}

export default function Stats() { 
  const classes = useStyles();
  const dashClasses = dashStyles();

  const [teamArray, setTeamArray] = useState([]);
  const [iplovers, setIPLOvers] = useState("0");
  const [ipltitle, setIPLTitle] = useState("");
  const [iplmatch, setIPLMatch] = useState("");
  const [updTime, setUpdTime] = useState("");
  // const [statData, setStatData] = useState([]);

  useEffect(() => {  
    if (localStorage.getItem("statData"))
      setTeamArray(JSON.parse(localStorage.getItem("statData")));

    const makeconnection = async () => {
      await socket.connect();
    }

    const socket = socketIOClient(process.env.REACT_APP_ENDPOINT);

    makeconnection();

    socket.on("connect", () => {
      // console.log(`STATS gis ${localStorage.getItem("gid")}`);
      var sendMessage = {page: "STAT", gid: localStorage.getItem("gid"), uid: localStorage.getItem("uid") };
      socket.emit("page", sendMessage);
      // console.log("stat connected")

      socket.on("brief", (stat) => {
        var gStat = stat.filter(x => x.gid === parseInt(localStorage.getItem("gid")));
        if (gStat.length > 0) {
          setTeamArray(gStat)
          localStorage.setItem("statData", JSON.stringify(gStat));
          // console.log(gStat);
        }
        let myTime = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        setUpdTime(myTime);
      })

      socket.on("overs", (myOvers) => {
        // console.log(myOvers);
        if (myOvers.tournament !== "") {
          let currOver = 0;
          let currTitle = "";
          let currMatch = myOvers.team1 + " Vs. " + myOvers.team2;
          if (myOvers.bowl4) { currOver = myOvers.bowl4;  currTitle = myOvers.title4 }
          if (myOvers.bowl3) { currOver = myOvers.bowl3;  currTitle = myOvers.title3 }
          if (myOvers.bowl2) { currOver = myOvers.bowl2;  currTitle = myOvers.title2 }
          if (myOvers.bowl1) { currOver = myOvers.bowl1;  currTitle = myOvers.title1 }
          // currOver = currOver / 10;
          setIPLOvers(currOver);
          setIPLTitle(currTitle);
          setIPLMatch(currMatch);
        } else {
          setIPLOvers(0);
          setIPLTitle("");
          setIPLMatch("");
        }
      })
    });

    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      leavingStatistics(socket);
    }
  }, []);


  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };

  const [noGroupPanel, setNGExpandedPanel] = useState(false);
  const handleNoGroupChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setNGExpandedPanel(isExpanded ? panel : false);
  };

  const NGStyles = makeStyles((theme) => ({
    ngHeader: {
      fontSize: theme.typography.pxToRem(18),
      fontWeight: theme.typography.fontWeightBold,
    },
    ngCard: {
      backgroundColor: '#B3E5FC',
    },
  }));
  
  
  function ShowNoGroup() {
    const classes = NGStyles();
    return (
      <Card className={classes.ngCard}>
      <CardContent>
      <Typography paragraph>
      Welcome to Aution Premier League (APL).
      </Typography>
      <Typography paragraph>
      You need to be a member of the group. You can Create New Group by clicking on "Group Icon" (on right hand side) and select "New Group".
      </Typography>
      <Typography paragraph>
      If your friend has created the group and shared the groupcode, just click on "Group Icon" (on right hand side) and select "Join Group".
      </Typography>
      <Typography paragraph>
      Once you join the group, enjoy the game. Auction Players, select Captain and Vice Captain.
      </Typography>
      <Typography paragraph>
      Once the tournament starts, APL will automatically assign the points based on performance of players.
      </Typography>
      <Typography paragraph>
      Dashbord will show the details of your group and Stats will show the point allocation.
      </Typography>
      <Accordion expanded={noGroupPanel === "CREATE"} onChange={handleNoGroupChange("CREATE")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Create Group</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowCreateGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "JOIN"} onChange={handleNoGroupChange("JOIN")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Join Group</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowJoinGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "AUCTION"} onChange={handleNoGroupChange("AUCTION")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Auction</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowAuctionGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "CAPTAIN"} onChange={handleNoGroupChange("CAPTAIN")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Captain and ViceCaptain</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowCaptainGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "MULTIPLE"} onChange={handleNoGroupChange("MULTIPLE")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Multiple Group</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowMultipleGroup/></AccordionDetails>
      </Accordion>
      </CardContent>
      </Card>
    )
  };
  
  function ShowCurrent() {
    if (iplovers > 0)
      return (
        <div>
          <Typography className={classes.cc0}>{iplmatch}</Typography>
          <Typography className={classes.cc1}>Points last updated after {iplovers} overs</Typography>
        </div>
      )
    else
        return null;
  }

  function ShowStatCard() {
    // console.log("DIsplay Board");
    return(
        <Card key="db_card">
          {/* <CardHeader key="db_cheader" color="warning"> */}
            {/* <h4>Statistics after ${overs}</h4> */}
            {/* <h4 className={dashClasses.cardTitleWhite}>Statistics after ${overs}</h4> */}
            {/* <p className={dashClasses.cardCategoryWhite}>
              {`Updated as of ${updTime}`}
            </p> */}
          {/* </CardHeader> */}
          <CardContent className={classes.cardContent}>
            <ShowCurrent />
            <Typography className={classes.cc2}>Updated as of {updTime}</Typography>
          </CardContent>
          {/* <CardBody key="db_cbody"> */}
            {/* <Table
              tableHeaderColor="warning"
              tableHead={["Rank", "Franchise", "Owner", "Score"]}
              tableData={rankArray}
            /> */}
          {/* </CardBody> */}
        </Card>
    )
  }

  function DisplayFranchiseeDetails(props) {
    return (
      <Grid container justify="center" alignItems="center" >
      <GridItem xs={12} sm={12} md={12} lg={12} >
      <Table>
        <TableHead>
          <TableRow align="center">
            <TableCell className={classes.th} align="center">Player Name</TableCell>
            <TableCell className={classes.th} align="center">Score</TableCell>      
          </TableRow>
        </TableHead>
        <TableBody>
          {props.franchisee.map(item => {
            return (
              <TableRow key={item.playerName}>
                <TableCell  className={classes.td} align="center" >
                  {item.playerName}
                </TableCell>
                <TableCell className={classes.td} align="center" >
                  {item.playerScore}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody> 
      </Table>
      </GridItem>
      </Grid>
    )
  }

  function ShowStats() {  
      // console.log(teamArray);
      return (teamArray.map(team =>
      <Accordion key={"AC"+team.displayName} expanded={expandedPanel === team.displayName} onChange={handleAccordionChange(team.displayName)}>
          <AccordionSummary key={"AS"+team.displayName} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.heading}>{team.displayName} ({team.userScore})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DisplayFranchiseeDetails franchisee={team.playerStat} />
              {/* <Grid container justify="center" alignItems="center" >
                  <GridItem xs={12} sm={12} md={12} lg={12} >
                      <Table
                          tableHeaderColor="warning"
                          tableHead={["Player Name", "Score"]}
                          tableData={team.playerStat.map(player => {
                              const arr = [player.playerName, player.playerScore]
                              return { data: arr, collapse: [] }
                          })}
                      />
                  </GridItem>
              </Grid> */}
          </AccordionDetails>
      </Accordion>
      ))
  }
  if (localStorage.getItem("tournament").length > 0)
  return (
    <div className={classes.root}>
      <DisplayPageHeader headerName="Statistics" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
      <ShowStatCard />
      <ShowStats/>
    </div>
  );
  else
    return <NoGroup/>;
};


