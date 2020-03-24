const userController = require('../controllers/user');
const auth = require('../middleware/authentication');
const { userValidationRules, validate } = require('../helper/user-validator')

module.exports = (app) => {
  app.route('/api/v1/user/signup')
    .post(userValidationRules(), validate, userController.signup);
  app.route('/api/v1/user/signin')
    .post(userController.signin);
  app.route('/api/v1/user/:userId([0-9]+)/changeRole')
    .put(auth.verifyToken, auth.verifyAdminAccess, userController.updateUser);
  app.route('/api/v1/user/signout')
    .put(userController.signout);
}