const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts');
const checkauth = require('../middleware/checkauth');
const multer = require('../middleware/multer');

router.get('/posts' , PostController.getposts);

router.get('/posts/:id' , PostController.getpost);

router.post('/posts', checkauth , multer, PostController.addposts);

router.put('/posts/:id', checkauth ,multer, PostController.updatepost);

router.delete('/posts/:postid',checkauth , PostController.deletepost);

module.exports = router;
