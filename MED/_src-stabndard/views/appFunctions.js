import axios from "axios";

async function getPendingAppointmentsByPatient(pid) {
  // console.log("Checking length");
  try {
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/prize/data`);
    prizeDetails = response.data;
  } catch(err)  {
    console.log("---------prize detail error");
    console.log(err);
  }
} 
