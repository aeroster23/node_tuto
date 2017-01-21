var Model = require('./models/models.js');
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

// Create new instance of application
var app = express();

/*************** DO NOT PUT AFTER ROUTER *******************/
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
/***********************************************************/

// Creating of the database
var db = "mongodb://localhost/mean_stack_tuto";

// Connection to MongoDB
mongoose.connect(db, function(err, response){
  if(err){
    console.log('Failed to connect to ' + db);
  }
  else{
    console.log('Connected to ' + db);
  }
});

var router = express.Router();

// GET

router.get('/api/users', function(request, response){
	// Return all users
	Model.find({}, function(err, users){
		if(err){
			response.status(404).send(err);
		}
		else{
			response.status(200).send(users);
		}
	});
});

// PUT

router.put('/api/users', function(request, response){
	Model.findById(request.body._id, function(err, user){
		if(err){
			response.status(404).send(err);
		}
		else{
			user.update(request.body,function(err, user){
				if(err){
					response.send(err);
				}
				else{
					response.status(200).send({message: 'success'});
				}
			});
		}
	});
});

// DELETE - only takes :id parames

router.delete('/api/users/:id', function(request, response){
	var id = request.params.id;
	Model.remove({_id: id}, function(err){
		if(err){
			response.status(500).send(err);
		}
		else{
			response.status(200).send('Deleted user successfully');
		}
	})
});
// POST

router.post('/api/users', function(request, response){
	var model = new Model(request.body);
	model.save(function(err, user){
		if(err){
			response.status(500).send(err);
		}
		else{
			// Status 201 = Successfully created
			response.status(201).send(user);
		}
	});
});

app.use('/', router);



app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3001
app.listen(port, function(){
  console.log('Listening on port ' + port);
});
