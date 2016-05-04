var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

var bcrypt = require('bcrypt-nodejs');

module.exports = function(connection){
	var schema = Schema({
		name: String
		, email: String
		, hashed_password: String
		, others: {
			pocket: {
				token: String
				, userName: String
			}
		}
	});

	schema.methods = {
		encrypt: function(password){
			return bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model;
		}
		, authenticate: function(password){
			return bcrypt.compareSync(password, this.hashed_password)
		}
	};

	schema
		.virtual('password')
		.set(function(password){
			this.hashed_password = this.encrypt(password);
		});

	console.log('account model initialized.');
	connection.model('account', schema);
}