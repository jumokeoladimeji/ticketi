const commentController = require('../controllers/comment')
const ticketController = require('../controllers/ticket')
const auth = require('../middleware/authentication');

module.exports = (app) => {
  app.route('/api/v1/users/:userId([0-9]+)/tickets/:ticketId([0-9]+)/comments') 
    .post(auth.verifyToken, ticketController.checkIfTicketHasCommentsByAssigned, commentController.create)
    .get(auth.verifyToken, commentController.list);
  app.route('/api/v1/users/:userId([0-9]+)/tickets/:ticketId([0-9]+)/comments/:commentId([0-9]+)')
    .get(commentController.getOne)
    .put(commentController.update)
}