const jwt = require('jsonwebtoken');

exports.generateAccessToken = (username) => {
    return jwt.sign(username, secret, {expiresIn: '18000s'})
}

const secret = 'jsonwebtokensecret';

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, secret, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }
   
  