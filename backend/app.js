const express = require('express');
const mongoose = require('mongoose');
const bodyparse = require('body-parser');
const postroutes = require('./routes/posts');
const userroutes = require('./routes/users');
const path = require('path');
const app = express();
mongoose.connect(`mongodb+srv://awais:${process.env.mongodb_pwd}@cluster0-cwpaz.mongodb.net/meanapp?retryWrites=true&w=majority`,{ useUnifiedTopology: true ,useNewUrlParser: true})
.then(() => {
  console.log('connected');
})
.catch(() => {
  console.log('conn failure');
})

app.use(bodyparse.urlencoded({extended: true}));
app.use(bodyparse.json());
app.use('/images' , express.static(path.join('backend/images')));
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin" , "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, Authorization , X-Requested-With,Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET , PUT , POST,PATCH, DELETE");
  next();
});

app.use('/api' ,postroutes);
app.use('/api/users' , userroutes);




module.exports = app;
