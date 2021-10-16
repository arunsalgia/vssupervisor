var router = express.Router();
const QODSERVER = "https://quotes.rest/qod?category=life&language=en";

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list', async function(req, res, next) {
  setHeader(res);
	let rec = await M_Quote.find({});
	//console.log(rec);
	sendok(res, rec);
});

router.get('/listbyqid/:qid', async function(req, res, next) {
  setHeader(res);
	var {qid} = req.params;
	
	let rec = await M_Quote.findOne({qid: Number(qid)});
	//console.log(rec);
	sendok(res, rec);
});

router.get('/listbysequence/:seq', async function(req, res, next) {
  setHeader(res);
	var {seq} = req.params;
	
	let rec = await M_Quote.findOne({sequence: Number(seq)});
	//console.log(rec);
	sendok(res, rec);
});


router.get('/random', async function(req, res, next) {
  setHeader(res);
  
	let lastRec = await M_Quote.find({}).limit(1).sort({sequence: -1});
	//console.log(lastRec[0]);
	let randomSequence = Math.floor(Math.random() * lastRec[0].sequence) + 1 ;
	console.log(randomSequence);
	lastRec = await M_Quote.find({sequence: randomSequence})
	sendok(res, lastRec[0]);
});


router.get('/add', async function(req, res, next) {
  setHeader(res);

	let nextQuote = await addNewQuote();
	if (nextQuote != null) {
		sendok(res, newQuote);
	} else
		sendok(res, "Failed");
});

router.get('/junk', async function(req, res, next) {
  setHeader(res);

	let newQuote = new M_Quote();
	newQuote.qid = "0dzDlCr3MHcglyOEBJ875weF";
	newQuote.author = "Larry Page";
	newQuote.category = "life";
	newQuote.quote = "If you're changing the world, you're working on important things. You're excited to get up in the morning.";
	newQuote.save();
	sendok(res, newQuote);
});

async function addNewQuote() {
	try {
		let resp = await axios.get(QODSERVER); 
		if (resp.data.contents.quotes.length > 0) {
			let fetchedQuote = resp.data.contents.quotes[0];
			console.log("new quote fetch Success");
			// just check if this 
			let newQuote = await M_Quote.findOne({qid: fetchedQuote.id});
			if (!newQuote) {
				let lastQuote = await M_Quote.find({}).limit(1).sort({sequence: -1});
				newQuote = new M_Quote();
				newQuote.sequence = lastQuote[0].sequence + 1;
				newQuote.qid = fetchedQuote.id;
				newQuote.author = fetchedQuote.author;
				newQuote.category = fetchedQuote.category;
				newQuote.quote = fetchedQuote.quote;
				newQuote.save();
			} else
				console.log("New Quote already in database");
			
			return newQuote
		} else {
			return null;
		}
	} catch (e) {
		console.log("Failed");
		return null;
	}

}


/*
cron.schedule('10 9 * * *', async () => {	
  if (db_connection) {
    await addNewQuote();
  }
});
*/


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;