const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  email: {required: true, type: String , unique: true},
  password: {required: true, type: String},


});
userSchema.plugin(uniquevalidator);
const usermodel = mongoose.model('User', userSchema);

module.exports = usermodel;
