var router = express.Router();

const { 
	getLoginName, 
} = require('./functions'); 


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});



router.get('/add/:cid/:newInventory', async function(req, res, next) {
  setHeader(res);
  
  var {cid, newInventory } = req.params;
	newInventory = newInventory.trim();
	
	var tmp = getLoginName(newInventory);

  var iRec = await M_Inventory.findOne({cid: cid, loginName: tmp});
	if (iRec) return senderr(res, 601, "Duplicate Inventory Name");
	
	var tmpRec = await M_Inventory.find({cid: cid}).limit(1).sort({id: -1});
	iRec = new M_Inventory();
	iRec.cid = cid;
	iRec.id = (tmpRec.length > 0) ? tmpRec[0].id + 1 : 1;
	iRec.loginName = tmp;
	iRec.name = newInventory;
	iRec.enabled = true;
	iRec.save();
	sendok(res, iRec);

	
});

router.get('/edit/:cid/:oldInventory/:newInventory', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldInventory, newInventory} = req.params;
	oldInventory = oldInventory.trim();
	newInventory = newInventory.trim();
	
	let old_lname = getLoginName(oldInventory);
	let new_lname = getLoginName(newInventory);
	
	
	// check if old name really exists!!!! Only then we can modify it
	var mRec = await M_Inventory.findOne({cid: cid, loginName: old_lname});
	if (!mRec) return senderr(res, 601, "Inventory name not found");
	
	// good. now update the details
	mRec.loginName = new_lname;
	mRec.name = newInventory;
	mRec.enabled = true;
	mRec.save();
	sendok(res, mRec);
});

router.get('/delete/:cid/:delInventory', async function(req, res, next) {
  setHeader(res);
  
  var { cid, delInventory } = req.params;
	delInventory = delInventory.trim();
	
	let old_lname = getLoginName(delInventory);
	//console.log(old_lname);
	
	// check if old name really exists!!!! Only then we can delete it
	var mRec = await M_Inventory.findOne({cid: cid, loginName: old_lname});
	if (!mRec) return senderr(res, 601, "Inventory name not found");
	
	await M_Inventory.deleteOne({cid: cid, loginName: old_lname});
	await InventoryListSchema.deleteMany({cid: cid, id: mRec.id});
	
	sendok(res, "Delete successful");
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
 let allRecs = await M_Inventory.find({cid: cid}).sort({loginName: 1});
 sendok(res, allRecs);
});


router.get('/inventorysummary/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid  } = req.params;
	
	let inventoryQuery = [
		{$match: { cid: cid }},
		{ $group: { _id: '$inventoryNumber', summary: { $sum: '$quantity' } } }
  ];
	
	let inventoryRecs = await M_InventoryList.aggregate(inventoryQuery).sort({_id: 1});

	sendok(res, inventoryRecs);
});

router.get('/listinventory/:cid/:inventoryNumber', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryNumber } = req.params;
	
	let allRecs = await M_InventoryList.find({cid: cid, inventoryNumber: Number(inventoryNumber)}).sort({date: -1});
	sendok(res, allRecs);
});



router.get('/addinventory/:cid/:inventoryNumber/:quantity', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryNumber,  quantity } = req.params;
	
	let tmpRec = await M_InventoryList.find({cid: cid, inventoryNumber: Number(inventoryNumber)}).limit(1).sort({id: -1});
	
	let iRec = new M_InventoryList();
	iRec.cid = cid;
	iRec.id = (tmpRec.length > 0) ? tmpRec[0].id + 1 : 1;
	iRec.inventoryNumber = Number(inventoryNumber);
	iRec.quantity = Number(quantity);
	iRec.date = new Date();
	iRec.enabled = true;
	iRec.save();
	
	sendok(res, iRec);
});

router.get('/subinventory/:cid/:inventoryNumber/:quantity', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryNumber, quantity} = req.params;
	
	let tmpRec = await M_InventoryList.find({cid: cid, inventoryNumber: Number(inventoryNumber)}).limit(1).sort({id: -1});
	
	let iRec = new M_InventoryList();
	iRec.cid = cid;
	iRec.id = (tmpRec.length > 0) ? tmpRec[0].id + 1 : 1;
	iRec.inventoryNumber = Number(inventoryNumber);
	iRec.quantity = -Number(quantity);
	iRec.date = new Date();
	iRec.enabled = true;
	iRec.save();
	
	sendok(res, iRec);
});

router.get('/editinventory/:cid/:inventoryNumber/:id/:quantity', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryNumber,  id, quantity} = req.params;
	inventoryNumber = Number(inventoryNumber);
	id = Number(id);
	
	let iRec = await M_InventoryList.findOne({cid: cid, inventoryNumber: inventoryNumber, id: id});
	if (!iRec) return senderr(res, 601, "Invalid Inventory number or Id");
	
	iRec.quantity = (iRec.quantity > 0) ? Number(quantity) : -Number(quantity);
	iRec.enabled = true;
	iRec.save();
	
	sendok(res, iRec);
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;