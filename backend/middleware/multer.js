const multer = require('multer');
const app = require('express');

const mimetype = {
  'image/png' : 'png',
  'image/jpeg': 'jpg',
  'image/jpg' : 'jpg'
}
// const storage = multer({
//   destination: 'backend/images',
// });

  const storage = multer.diskStorage({
    destination: (req,file,cb) => {
      const isvalid = mimetype[file.mimetype];
      let err = new Error('invalid type');
      if(isvalid){
        err = null;
      }
      cb(err,'backend/images');
    },
    filename: (req,file,cb) => {

      const name = file.originalname.split(' ').join('-');
      // const ext = mimetype[file.mimetype];

      cb(null, `${name}`);
    }
  });

  module.exports = multer({storage: storage}).single('image');
