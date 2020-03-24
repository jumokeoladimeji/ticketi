/* eslint-disable max-lines-per-function */
/* eslint-disable no-ternary */
const { User } = require('../database/models');
const auth = require('../middleware/authentication');
const passport = require('passport');

module.exports = {
    /**
     * @description - Creates a new user
     * @param {object} request - request object containing the user's email, username, password
     received from the client
    * @param {object} response - response object served to the client
    * @returns {promise} user - new user created
    */
    signup(req, res) {
        const userDetails = req.body;
        User
        .findOne({
            where: {
                email: userDetails.email,
            },
        })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(422).send({ message: 'That email address is already in use.' });
            }
            const userToCreate = {
                fullName: userDetails.fullName,
                email: userDetails.email,
                hashedPassword: auth.hashPassword(userDetails.password),
            };
            if (userDetails.role) {
                userToCreate.role = userDetails.role;
            }
            User
            .create(userToCreate)
            .then(newUser => res.status(200)
            .send({
                data: newUser, 
                token: auth.generateToken(newUser)
            }))
            .catch((err) => {
                res.status(500).send({ message: err });
            })
        })
        .catch((err) => {
            res.status(500).send({ message: err });
        })
    },
    /**
     * @description - signs in a new user
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} user - user details
     */
    signin(req, res) {
        const userDetails = req.body;
        if (!userDetails.email) {
            return res.status(422).send({ message: 'You must enter an email address.' });
        }
        if (!userDetails.password) {
            return res.status(422).send({ message: 'You must enter a password.' });
        }
        passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) { return res.status(500).json(err); }
        if (user) {
            return res.status(200).send({
            data: user,
            token: auth.generateToken(user),
            });
        }
        return res.status(422).json(info);
        })(req, res);
    },
    /**
     * @description - signs in a new user
     * @param {object} request - request object received from the client
     * @param {object} response - response object served to the client
     * @returns {json} user - user details
     */
    updateUser(req, res) {
        User
        .findByPk(req.params.userId)
        .then((user) => {
            if (!user) {
            return res.json({
                message: 'User does not exist',
            });
            }
            const userDetails = req.body;
            // eslint-disable-next-line multiline-ternary
            const hashedPasswordToSave = userDetails.password ? auth.hashPassword(userDetails.password, 12) : user.hashedPassword
            user
            .update({
                role: userDetails.role || user.role,
                fullName: userDetails.fullName || user.fullName,
                email: userDetails.email || user.email,
                hashedPassword: hashedPasswordToSave,
            })
            .then((updatedUser) => {
                res.status(200).send(updatedUser);
            });
        })
        .catch((error) => {
            res.json({
            message: error,
            });
        });
    },
    signout(req, res) {
        res.redirect('/');
    }
};