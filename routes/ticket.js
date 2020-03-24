const ticketController = require('../controllers/ticket')
const auth = require('../middleware/authentication');

module.exports = (app) => {
  app.route('/api/v1/tickets') 
    .get(auth.verifyToken, auth.verifyAdminOrAgentAccess, ticketController.list);
  app.route('/api/v1/tickets/ticketsClosedInPastMonth') 
    .get(auth.verifyToken, auth.verifyAdminOrAgentAccess, ticketController.ticketsClosedInPastMonth);
  app.route('/api/v1/tickets/:ticketId([0-9]+)/assign') 
    .put(auth.verifyToken, auth.verifyAdminOrAgentAccess, ticketController.update);
  app.route('/api/v1/users/:userId([0-9]+)/tickets') 
    .post(auth.verifyToken, ticketController.create)
    .get(auth.verifyToken, ticketController.listByUserId);
  app.route('/api/v1/users/:userId([0-9]+)/tickets/assignedToTickets') 
    .get(auth.verifyToken, auth.verifyAdminOrAgentAccess, ticketController.listAssignedToTickets);
  app.route('/api/v1/users/:userId([0-9]+)/tickets/assignedToTickets/:ticketId([0-9]+)') 
    .get(auth.verifyToken, auth.verifyAdminOrAgentAccess, ticketController.getOneAssignedToTicket)
    .put(auth.verifyToken, auth.verifyAdminOrAgentAccess, ticketController.markAsClosed);
  app.route('/api/v1/users/:userId([0-9]+)/tickets/:ticketId([0-9]+)')
    .get(auth.verifyToken, ticketController.getOne) 
    .put(auth.verifyToken, ticketController.update)
}