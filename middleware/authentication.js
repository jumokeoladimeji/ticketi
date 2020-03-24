const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const secret = require('../config').secret;
const User = require('../database/models').User;
const bcrypt = require('bcryptjs');

function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

module.exports = {
  hashPassword(password) {
    return bcrypt.hashSync(password, 12);
  },
  validPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  },
  required(req) {
    return expressJwt({
      secret: secret,
      requestProperty: 'payload',
      getToken: getTokenFromHeader(req)
    })
  },
  optional() { 
    return expressJwt({
      secret: secret,
      requestProperty: 'payload',
      credentialsRequired: false,
      getToken: getTokenFromHeader
    })
  },
  /**
  * @description - Generates token for user authentication
  * @param {object} user - object containing user details
  * @returns {object} token - jwt token
  */
  generateToken(user) {
    return jwt.sign({
      userId: user.id
    }, secret, { expiresIn: '1 day' });
  },
  /**
  *
  * @desciption - Verifies admin access
  * @param {object} request - request object received from the client
  * @param {object} response object served to the client
  * @param {function} next - express callback function which invokes the next
   * middleware or route-handler
  * @returns {object} message - error response
  */
  verifyAdminAccess(req, res, next) {
    User.findByPk(req.decoded.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found, cannot be authorized.',
          });
        }
        if (user.role === 'admin') {
          return next();
        }
        return res.status(403).json({
          message: 'Sorry, You are not authorized to perform this action',
        });
      })
  },
   /**
  *
  * @desciption - Verifies admin access
  * @param {object} request - request object received from the client
  * @param {object} response object served to the client
  * @param {function} next - express callback function which invokes the next
   * middleware or route-handler
  * @returns {object} message - error response
  */
 verifyAdminOrAgentAccess(req, res, next) {
  User.findByPk(req.decoded.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found, cannot be authorized.',
        });
      }
      if (user.role === 'admin' || user.role === 'agent') {
        return next();
      }
      return res.status(403).json({
        message: 'Sorry, You are not authorized to perform this action',
      });
    })
},
  /**
   * @description - Validates registered users' token
   * @param {object} request - request object received from the client
   * @param {object} response - response object served to the client
   * @param {function} next - express callback function which invokes the next
   * middleware or route-handler
   * @returns {object} message - error response
   */
  verifyToken(request, response, next) {
    const token = request.headers.authorization ||
    request.headers['x-access-token'];
    request.decoded = {};
    if (token) {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          return response.status(401).json({
            message: 'Session expired. Please login to continue',
          });
        }
        User.findByPk(decoded.userId).then((user) => {
          if (!user) { return response.sendStatus(401).send({message: 'Unauthorized'}); }
          request.decoded = decoded;
          request.decoded.role = user.role;
          next();
        });
      });
    } else {
      return response.status(401).json({
        message: 'Token required for access',
      });
    }
  },
};