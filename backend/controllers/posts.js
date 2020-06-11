const Post = require('../models/post');

exports.getposts = (req,res,next) => {
  const pagesize = +req.query.pagesize;
  const page = +req.query.page;
  const postdata = Post.find();
  let fetchedpost;
  if(pagesize && page){
    postdata.skip(pagesize * (page - 1))
    .limit(pagesize);
  }
  postdata
  .then(posts => {
    fetchedpost = posts;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: 'recieved successfully',
      body: fetchedpost,
      postcount: count
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'failed to load posts',
    });
  });

}


//get single post
exports.getpost = (req,res,next) => {
  const getid = req.params.id;
  Post.findById({_id: getid})
  .then(post => {
    if(post){
      res.status(200).json(post);
    } else{
    res.status(404).json({message: 'Post not found'});
    }
  })
  .catch(err => {
    res.status(500).json({message: 'failed to load post'});
  })
}


//add posts
exports.addposts =  (req, res, next) => {

  const data = req.body;
  const file = req.file;

  const url = `${req.protocol}://${req.get('host')}`

  const post = new Post({
    title: data.title,
    content: data.content,
    imagepath: `${url}/images/${req.file.filename}`,
    userid : req.authuser.userid
  });
  post.save().then(result => {
    console.log(result);
    res.status(201).json(result);

  })
  .catch(err => {
    res.status(500).json({
      message: 'failed to save post'
    })
  })
}


//update posts
exports.updatepost = (req,res,next) => {
  let imgpath;
  if(req.file === undefined){
    imgpath = req.body.image;
  }
  else{
    const url = `${req.protocol}://${req.get('host')}`
    imgpath = `${url}/images/${req.file.filename}`;

  }
  const updateid = req.params.id;
  const post = new Post({
    _id: updateid,
    title: req.body.title,
    content: req.body.content,
    imagepath: imgpath,
    userid: req.authuser.userid
  });

  Post.findOne({_id: updateid}).then(result => {
    const id1 = result.userid.toString();
    const id2 = req.authuser.userid.toString();

    if(id1 === id2){
      Post.updateOne({_id:  updateid}, post)
      .then(result => {
        res.status(200).json({body: post});
      })
      .catch(err => {
        res.status(500).json({
          message: 'update failure'
        });
      });
    }
    else{
      res.status(401).json({
        message: 'unauthorized'
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'failed to update post'
    })
  })

  // Post.updateOne({_id:  updateid}, post)
  // .then(result => {
  //   res.status(200).json({body: post});
  // })
  // .catch(err => {
  //   console.log('error updating', err);
  // })
}


//delete posts

exports.deletepost = (req,res,next) => {

  const pid = req.params.postid;
  Post.deleteOne({_id: pid , userid: req.authuser.userid})
  .then((data) => {
    if(data.deletedCount > 0){
      res.status(200).json({
        message: 'Post deleted successfully'
      });
    }
    else{
      res.status(401).json({
        message: 'not authorized'
      });
    }

  })
  .catch(err => {
    res.status(500).json({
      message: 'Error Deleting Post'
    });
  })
}
