import React, { useEffect, useState } from 'react';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
// import { UserContext } from "../../UserContext";
// import { Typography } from '@material-ui/core';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import Avatar from "@material-ui/core/Avatar"
import { NoGroup, DisplayPageHeader, BlankArea, JumpButton } from 'CustomComponents/CustomComponents.js';
import { hasGroup } from 'views/functions';
import {orange, deepOrange}  from '@material-ui/core/colors';
import { Divider } from '@material-ui/core';


const drawerWidth = 100;
const useStyles = makeStyles((theme) => ({
  margin: {
      margin: theme.spacing(1),
  },
  image: {
      height: "200px"
  },
  container: {
      backgroundImage: "url(\"../RCB/5334.jpg\")",
      backgroundSize: 'cover'
  }, drawer: {
      width: drawerWidth,
      flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  sold: {
    color: "green"
  }, cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  medium: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  th: { 
    spacing: 0,
    align: "center",
    padding: "none",
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    // border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },    

}));


// const populateTable = (data) => {
//     const tableData = [];
//     data.forEach(element => {
//         tableData.push({ displayName: element.displayName, players: element.players })
//     });
//     return tableData;
// }

export default function MyTeam() {
    // const { user } = useContext(UserContext);
    // const theme = useTheme();

  const classes = useStyles();
  const [teamArray, setTeamArray] = useState([]);


  useEffect(() => {
    if (localStorage.getItem("team")) 
    setTeamArray(JSON.parse(localStorage.getItem("team")));

    const fetchTeam = async () => {
      try {
          var myTeamUrl = "";
          if (hasGroup())
          {
              var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/myteam/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}`);
              setTeamArray(response.data);
              localStorage.setItem("team", JSON.stringify(response.data));
          }
      } catch (e) {
          console.log(e)
      }
    }
    fetchTeam();
  }, []);


  function ShowJumpButtons() {
    return (
      <div>
        <BlankArea />
        <JumpButton page={process.env.REACT_APP_HOME} text="Home" />
      </div>
    )
  }



  if (hasGroup())
    return (
      teamArray.map(team => 
      <div>
        <DisplayPageHeader headerName="My Team" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
        <Table>
        <TableHead p={0}>
            <TableRow key="header" align="center">
            <TableCell className={classes.th} p={0} align="center">Player Name</TableCell>
            <TableCell className={classes.th} p={0} align="center">Team</TableCell>
            <TableCell className={classes.th} p={0} align="center">Bid Amount</TableCell>      
            </TableRow>
        </TableHead>
        <TableBody p={0}>
            {team.players.map(item => {
            return (
                <TableRow key={item.playerName}>
                <TableCell  className={classes.td} p={0} align="center" >
                    {item.playerName}
                </TableCell>
                <TableCell  className={classes.td} p={0} align="center" >
                    {item.team}
                </TableCell>
                <TableCell className={classes.td} p={0} align="center" >
                    {item.bidAmount}
                </TableCell>
                </TableRow>
            )
            })}
        </TableBody> 
        </Table>
        <Divider />
        <ShowJumpButtons />
        <BlankArea />
      </div>
      )
    )
  else
    return (
      <div>
        <NoGroup/>
        <Divider />
        <ShowJumpButtons />
      </div>
    )
};


