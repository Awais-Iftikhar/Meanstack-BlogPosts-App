const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');

router.post('/signup' , UserController.signupuser);

router.post('/login' , UserController.loginuser);

module.exports = router;
