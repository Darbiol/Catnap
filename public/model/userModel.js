var mongoose = require('mongoose');


//SCHEMA
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var usersSchema = new Schema({
	user_id		: ObjectId,
	username	: String,
	password	: String,
	firstName	: String,
	lastName	: String,
	email		: String,
	joined		: Date
});

//model reference
module.exports = mongoose.model('Users', usersSchema);