path = require('path');
cookieParser = require('cookie-parser');
const { promisify } = require('util')
const sleep = promisify(setTimeout);
logger = require('morgan');
axios = require('axios');


/// make mongoose connection



// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  process.exit(0);
});

function ProgramExit() {
	process.exit(0);
}



(async () => {
try {
	
	console.log(`Database connection status: Okay`);
	let myUrl = 'https://doctorviraag.herokuapp.com/customer/afternoon';
	console.log(myUrl);
	let resp = await axios.get(myUrl);
	console.log(resp.data);
	
	ProgramExit();
} catch (e) {
	console.log(e);
	ProgramExit();
}
})();




