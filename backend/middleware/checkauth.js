const jwt = require('jsonwebtoken');

const middleware = ((req,res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedtoken = jwt.verify(token, process.env.jwt_secretkey);
    req.authuser = {email: decodedtoken.email, userid: decodedtoken.userId};
    next();


  } catch (error) {
    res.status(401).json({
      message: 'You are not Authenticated'
    })
  }
});

module.exports = middleware;
