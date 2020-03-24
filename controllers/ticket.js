const { Op } = require("sequelize");
const { Ticket, Comment } = require('../database/models');
const { exportCSV } = require('../helper/json-csv')

module.exports = {
  /**
  * @description - Creates a new Ticket
  * @param {object} request - request object containing the ticket request
  * description received from the client
  * @param {object} response - response object served to the client
  * @returns {json} ticket - new ticket created
  */
    create(req, res) {
        const newTicket = {
            request: req.body.request,
            userId: req.params.userId,
        };

        return Ticket
        .create(newTicket)
        .then(ticket => res.status(200).send(ticket))
        .catch((error) => {
            res.status(500).send({ message: error });
        });
    },
    /**
     * @description - Fetches all tickets
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} tickets - tickets fetched
     */
    list(req, res) {
        return Ticket
        .findAll({
            order: [
                [
                    'createdAt',
                    'DESC'
                ]
            ],
            include: [
                {
                    model: Comment,
                    as: 'comments',
                },
            ]
        })
        .then(tickets => res.status(200).send(tickets))
        .catch(error => res.status(500).send({ message: error }));
    },

    /**
     * @description - Fetches all tickets created by a user
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} tickets - tickets fetched
     */
    listByUserId(req, res) {
        return Ticket
            .findAll({
                where: {
                    userId: 1,
                },
                order: [
                    [
                        'createdAt',
                        'DESC'
                    ]
                ],
                include: [
                    {
                        model: Comment,
                        as: 'comments',
                    },
                ]
            })
        .then(tickets => res.status(200).send(tickets))
        .catch(error => res.status(500).send({ message: error }));
    },

    /**
     * @description - Fetches all tickets assigned by an agent
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} tickets - tickets fetched
     */
    listAssignedToTickets(req, res) {
        return Ticket
            .findAll({
                where: {
                    assignedToId: req.params.userId,
                },
                order: [
                    [
                        'createdAt',
                        'DESC'
                    ]
                ],
                include: [
                    {
                        model: Comment,
                        as: 'comments',
                    },
                ]
            })
        .then(tickets => res.status(200).send(tickets))
        .catch(error => res.status(500).send({ message: error }));
    },

    /**
     * @description - Fetches all tickets closed in past month
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} tickets - tickets fetched
     */
    ticketsClosedInPastMonth(req, res) {
        return Ticket
            .findAll({
                where: {
                    // assignedToId: req.decoded.userId,
                    closedDate: {
                        [Op.lt]: new Date(),
                        [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                    }
                },
                order: [
                    [
                        'createdAt',
                        'DESC'
                    ]
                ],
                include: [
                    {
                        model: Comment,
                        as: 'comments',
                    },
                ]
            })
        .then(tickets => {
            // download csv;
            exportCSV(JSON.stringify(tickets));
            res.status(200).send({message: 'csv saved'})
        })
        .catch((error) => {
            res.status(500).send({ message: error });
        });
    },

    /**
     * @description - Fetches an ticket
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} ticket - fetched ticket
     */
    getOne(req, res) {
        return Ticket
        // .findByPk(req.params.userId)
        .findOne({
            where: {
                id: req.params.ticketId,
            },
            include: [
                {
                    model: Comment,
                    as: 'comments',
                },
            ]
        })
        .then((ticket) => {
            if (!ticket) {
                return res.status(404).send({
                    message: 'Ticket Not Found',
                });
            }
            return res.status(200).send(ticket);
        })
        .catch((error) => {
            res.status(500).send({ message: error });
        });
    },

    /**
     * @description - 
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} ticket - fetched ticket
     */
    checkIfTicketHasCommentsByAssigned(req, res, next) {
        try {
            return Ticket
            .findOne({
                where: {
                    id: req.params.ticketId,
                },
                include: [
                    {
                        model: Comment,
                        as: 'comments',
                    },
                ]
            })
            .then((ticket) => {
                if (!ticket) {
                    return res.status(404).send({
                        message: 'Ticket Not Found',
                    });
                }
                if (req.decoded.role === 'admin' || req.decoded.role === 'agent') {
                    return next();
                }
                if (ticket.comments.length !== 0 && ticket.assignedToId === ticket.comments[0].userId) {
                    return next();
                }
                return res.status(422).send({ message: 'assigned agent must make be first to make a comment' });
            })
            .catch((error) => {
                res.status(500).send({ message: error });
            });
        } catch (error) {
            res.status(500).send({ message: error });
        }
    },

     /**
     * @description - Fetches all tickets assigned by an agent
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} tickets - tickets fetched
     */
    getOneAssignedToTicket(req, res) {
        return Ticket
            .findOne({
                where: {
                    assignedToId: req.params.userId,
                    id: req.params.ticketId,
                },
                include: [
                    {
                        model: Comment,
                        as: 'comments',
                    },
                ]
            })
        .then(tickets => res.status(200).send(tickets))
        .catch(error => res.status(500).send({ message: error }));
    },

    /**
     * @description - Updates ticket details
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} ticket - updated ticket details
     */
    update(req, res) {
        return Ticket
        .findOne({
            where: {
                id: req.params.ticketId,
            },
            include: [
                {
                    model: Comment,
                    as: 'comments',
                },
            ]
        })
        .then((ticket) => {
            if (!ticket) {
                return res.status(404).send({
                    message: 'Ticket Not Found',
                });
            }
            if (ticket.userId === req.body.assignedToId) {
                return res.status(404).send({
                    message: 'Ticket cannot be assigned to requester',
                });
            }
            return ticket
            .update({
                request: req.body.request || ticket.request,
                status: req.body.status || ticket.status,
                assignedToId: req.body.assignedToId || ticket.assignedToId
            })
            .then(updatedticket => res.status(200).send(updatedticket))
            .catch((error) => {
                res.status(500).send({ message: error });
            });
        })
        .catch(error => res.status(500).send({ message: error }));
    },

    /**
     * @description - Marks ticket as closed
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} ticket - updated ticket details
     */
    markAsClosed(req, res) {
        return Ticket
        .findOne({
            where: {
                id: req.params.ticketId,
            },
        })
        .then((ticket) => {
            if (!ticket) {
                return res.status(404).send({
                    message: 'Ticket Not Found',
                });
            }
            return ticket
            .update({
                status: 'closed',
                closedDate: new Date(),
                // assignedToId: req.body.assignedToId
            })
            .then(updatedticket => res.status(200).send(updatedticket));
        })
        .catch(error => res.status(500).send({ message: error }));
    },
    /**
     * @description - Deletes an ticket
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} message, response or error
     */
    destroy(req, res) {
        return Ticket
            .findOne({
                where: {
                    id: req.params.ticketId,
                },
            })
            .then((ticket) => {
                if (!ticket) {
                    return res.status(500).send({
                        message: 'Ticket Not Found',
                    });
                }
                return ticket
                    .destroy()
                    .then(() => res.status(200).send({ message: 'Ticket deleted.' }));
            })
            .catch(error => res.status(500).send({ message: error }));
    },
};