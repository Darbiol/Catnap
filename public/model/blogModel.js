var mongoose = require('mongoose');

//SCHEMA
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

 var blogsSchema = new Schema({
 	 _id	: ObjectId,
 	 user	: String,
 	 title	: String,
 	 entry	: String,
 	 added	: Date,
 	 comments :[{
 	 	username	: String,
 	 	body		: String,
 	 	dateComment	: Date

 	 }]
 });

 //model reference
 module.exports = mongoose.model('blogs', blogsSchema);