//pull all dependencies 
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var port = 3000; 

//create your express app
var app = express(); 

// Integrate body-parser with our App to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

//tell servers where views are and what templating engine is in use 
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
 
//connect to mongoose 
var connection = mongoose.connect('mongodb://localhost/corgi_db');

//creating our schemas in mongoose
var CorgiSchema = new mongoose.Schema({
	name: String, 
	weight: Number, 
	color: String
});

var Corgi = mongoose.model('Corgi', CorgiSchema);



//various routes
app.get('/', function(req, res){
	Corgi.find({}, function(err, results){
		if (err) { console.log(err); }
		res.render('index', { corgis: results });
	});
});

//route to create corgi in database 
app.post('/', function(req, res){
	Corgi.create(req.body, function(err, result){
		if (err) { console.log(err); }
		res.redirect('/')
	})
});
//new
app.get('/new', function(req, res){
	res.render('new');
});
//show 
app.get('/:id', function(req, res){
	Corgi.find({_id: req.params.id}, function(err, response){
		if (err) { console.log(err); }
		res.render('show', { corgi: response[0] });
	})
})
//editing a specific corgi
app.get('/:id/edit', function(req, res){
	Corgi.find({_id: req.params.id}, function(err, response){
		if (err) { console.log(err); }
		res.render('edit', { corgi: response[0] });
	})
});
//update
app.post('/:id', function(req, res){
	Corgi.update({ _id: req.params.id }, req.body, function(err, result){
		if (err) { console.log(err); }
		res.redirect('/')
	})
	res.redirect('/')
});
//delete
app.post('/:id/delete', function(req, res){
	Corgi.remove({_id: req.params.id}, function(err, response){
		if (err) { console.log(err); }
		res.redirect('/')
	})
})

app.listen(port, function(){
	console.log("Running on ", port);
});