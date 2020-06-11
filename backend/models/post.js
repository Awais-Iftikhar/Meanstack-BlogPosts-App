const mongoose = require('mongoose');
const postschema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagepath: {type: String, required: true},
  userid : {type: mongoose.Schema.Types.ObjectId,  ref: 'User',required: true}


});

module.exports = mongoose.model('Post', postschema);
