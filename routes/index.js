var express = require('express');
var router = express.Router();
var sc = require('scorocode');

// Initialize Scorocode 
sc.Init({
	ApplicationID: '3196b2e873234547ad8b06ed636d3538',
	JavaScriptKey: '5e85f685a23e44e6abad95accc1dd2ea',
	MasterKey: '659d718ff9664f6fafbdb79efc93cb34'
});

// Get a collection "buildings"
router.get('/', function(req, res, next) {
	var buildings = new sc.Query('buildings');
	buildings.findAll().then((finded) => {
		res.render('index', {
			"data" : finded,
			title: 'Equipment Tools'
		});
	});
});

// Select equipment by ID
router.post('/', function(req, res, next) {
	var equip = new sc.Query('equipment');
    equip.equalTo('room', req.body.id)
    	.findAll()
        	.then((finded) => {
        		res.json(finded); 
    		});
});

// Save new equipment
router.post('/set', function(req, res, next) {
	var equip = new sc.Object('equipment');
	equip.set('name', req.body.name);
	equip.set('room', req.body.room);
	equip.set('count', +req.body.count);
	equip.save().then((saved) => {
		res.send(true);
	})
});

// Edit equipment
router.post('/edit', function(req, res, next) {
	var equip = new sc.Object('equipment');
    equip.set('_id', req.body.id)
    	.set('name', req.body.name)
		.set('count', +req.body.count);
	equip.save().then((saved) => {
		res.send(true);
	})
});

// Remove equipment
router.post('/delete', function(req, res, next) {
	var equip = new sc.Object('equipment');
	equip.getById(req.body.id)
		.then((success) => {
			equip.remove(success)
				.then((removed) => {
					res.send(true);
				})
		})
});

module.exports = router;
