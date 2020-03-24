const { Comment } = require('../database/models');

module.exports = {
  /**
  * @description - Creates a new Comment
  * @param {object} request - request object containing the Comment request
  * description received from the client
  * @param {object} response - response object served to the client
  * @returns {json} comment - new comment created
  */
    create(req, res) {
        const newComment = {
            content: req.body.content,
            userId: req.params.userId,
            ticketId: req.params.ticketId,
        };

        return Comment
        .create(newComment)
        .then(comment => res.status(200).send(comment))
        .catch((error) => {
            res.status(500).send({ message: error });
        });
    },
    /**
     * @description - Fetches all Comments
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} comments - comments fetched
     */
    list(req, res) {
        return Comment
        .findAll()
        .then(comments => res.status(200).send(comments))
        .catch(error => res.status(500).send({ message: error }));
    },

    /**
     * @description - Fetches an Comment
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} comment - fetched comment
     */
    getOne(req, res) {
        return Comment
        .findOne({ where: {
               id: req.params.CommentId
            }})
        .then((comment) => {
            if (!comment) {
            return res.status(404).send({
                message: 'Comment Not Found',
            });
            }
            return res.status(200).send(comment);
        })
        .catch((error) => {
            res.status(500).send({ message: error });
        });
    },

    /**
     * @description - Updates Comment details
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} Comment - updated Comment details
     */
    update(req, res) {
        return Comment
        .findOne({ where: {
               id: req.params.CommentId
            }})
        .then((comment) => {
            if (!comment) {
                return res.status(404).send({
                    message: 'Comment Not Found',
                });
            }
            return comment
                .update({
                    content: req.body.content,
                })
                .then(updatedComment => res.status(200).send(updatedComment));
        })
        .catch(error => res.status(500).send({ message: error }));
    },
    /**
     * @description - Deletes an Comment
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} message, response or error
     */
    destroy(req, res) {
        return Comment
        .findOne({ where: {
               id: req.params.CommentId
            }})
        .then((comment) => {
            if (!comment) {
                return res.status(500).send({
                    message: 'Comment Not Found',
                });
            }
            return comment
            .destroy()
            .then(() => res.status(200).send({ message: 'Comment deleted.' }));
        })
        .catch(error => res.status(500).send({ message: error }));
    },
};