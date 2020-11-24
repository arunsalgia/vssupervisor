import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Table from "components/Table/Table.js";
import Typography from '@material-ui/core/Typography';
// import TableRow from '@material-ui/core/TableRow';
// import TableCell from '@material-ui/core/TableCell';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
// import Grid from "@material-ui/core/Grid";
// import GridItem from "components/Grid/GridItem.js";
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";
import { UserContext } from "../../UserContext";
import { NoGroup, DisplayPageHeader } from 'CustomComponents/CustomComponents.js';
import { hasGroup } from 'views/functions';
import red from '@material-ui/core/colors/red';
const vcPrefix = "vicecaptain-"
const cPrefix = "captain-"


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    captain: {
        color: "yellow",
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



export default function Group() {

    window.onbeforeunload = () => setUser(null)
    const { setUser } = useContext(UserContext);
    const classes = useStyles();
    const [selectedViceCaptain, SetSelectedViceCaptain] = useState("");
    const [selectedCaptain, SetSelectedCaptain] = useState("");
    const [myTeamTableData, setMyTeamTableData] = useState([]);
    const [tournamentStated, setTournamentStarted] = useState(false);


      
    useEffect(() => {
        const a = async () => {
            if  (!hasGroup()) {
                // handle if not a member of any group
                return;
            }

            // console.log("Calling getcaptain")
            // get start of tournamnet (i.e. start of 1st match)
            var gameStarted = false;  
            var mygroup  = localStorage.getItem("gid")
            var response = await axios.get(`/user/getcaptain/${mygroup}/${localStorage.getItem("uid")}`);
            // console.log(response.data[0]);
            if (response.data.length > 0) {
                SetSelectedCaptain(response.data[0].captainName);
                SetSelectedViceCaptain(response.data[0].viceCaptainName)
            }

            // get list of player purchased by user for aelecting captain / vice captain
            var myUrl = `/user/myteamwos/${mygroup}/${localStorage.getItem("uid")}`;
            const teamResponse = await axios.get(myUrl);
            setMyTeamTableData(teamResponse.data[0].players);
            // console.log(teamResponse.data[0].players) ;

            response = await axios.get(`/group/gamestarted/${localStorage.getItem("gid")}`);
            gameStarted = (response.data.length > 0);
            // gameStarted = false;
            setTournamentStarted(gameStarted);
        }
        a();
    }, [])

   
    function handleSelectedCaptain(newCap) {
        if (!tournamentStated)
        if (newCap !== selectedViceCaptain)
            SetSelectedCaptain(newCap);
    };

    function handleSelectedViceCaptain(newViceCap) {
        if (!tournamentStated)
        if (newViceCap !== selectedCaptain)
            SetSelectedViceCaptain(newViceCap);
    };

    function updateCaptain() {
        console.log("upd captin vc details");
    }

    function DisplayCaptainSelectButton() {
    return (
        <div align="center">
        <Button variant="contained" color="primary" size="small"
            disabled={tournamentStated}
            className={classes.button} onClick={updateCaptain}>Update
        </Button>
        </div>
        );
    }

    function ShowCaptainViceCaptain() {
        return(
        <Table
            tableKey="t-cvc"
            id="t-cvc"
            size="small"
            tableHeaderColor="warning"
            tableHead={["Player Name", "Captain", "Vice Captain"]}
            tableData={myTeamTableData.map(x => {
                const arr = [
                    x.playerName,
                    <FormControlLabel 
                    key={cPrefix+x.playerName}
                    id={cPrefix+x.playerName}
                    className={classes.captain} 
                    value={x.playerName}    
                    control={<Radio color="primary" key={cPrefix+x.playerName} id={cPrefix+x.playerName} defaultChecked={x.playerName === selectedCaptain}/>}
                    onClick={() => handleSelectedCaptain(x.playerName)}
                    checked={selectedCaptain === x.playerName}
                    disabled={tournamentStated}
                    />,
                    <FormControlLabel 
                    key={vcPrefix+x.playerName}
                    id={vcPrefix+x.playerName}
                    className={classes.captain} 
                    value={x.playerName}    
                    control={<Radio color="primary" key={vcPrefix+x.playerName} id={cPrefix+x.playerName} defaultChecked={x.playerName === selectedViceCaptain}/>}
                    onClick={() => handleSelectedViceCaptain(x.playerName)}
                    checked={selectedViceCaptain === x.playerName}
                    disabled={tournamentStated}
                    />
                ]
                return { data: arr, key: "pid", collapse: [] }
            })}
        />
        );
    };

    function DisplayTournamentStarted() {
        if (tournamentStated)
            return (
                <Typography className={classes.error} align="center">(cannot update after tournament has started.)</Typography>
            );
        else
            return(<div></div>);
    }


    if (hasGroup())
        return (
        <div className={classes.root} key="cpataininfo">
            {/* <h3 align="center">Captain and Vice Captain ({localStorage.getItem("tournament")})</h3> */}
            {/* <h3 className={classes.hdrText} align="center">Captain/ViceCaptain</h3> */}
            {/* <Typography align="center" component="h1" variant="h5">Captain/ViceCaptain</Typography> */}
            {/* <DisplayGroupName groupName={localStorage.getItem("groupName")}/> */}
            <DisplayPageHeader headerName="Captain/ViceCaptain" groupName={localStorage.getItem("groupName")}/>
            <DisplayTournamentStarted/>
            <ShowCaptainViceCaptain/>
            <DisplayCaptainSelectButton/>
        </div>
        );
    else
        return <NoGroup/>;
}