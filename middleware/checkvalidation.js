const  userAuth  = require('../services/auth');

const checkAuthentication = (cookieName) => {
  return (req, res, next) => {
    const reqCookie = req.cookies[cookieName];
    
    if (!reqCookie) {
      return next(); 
    }

    try {
      const userPayload = userAuth.validateToken(reqCookie);
      req.user = userPayload; 
      return next();
    } catch (err) {
      console.error('Invalid token:', err.message);
      return next(); 
    }
  };
};

module.exports = { checkAuthentication };
