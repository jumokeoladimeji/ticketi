/* eslint-disable func-style */
const { check, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    check('email', 'You must enter an email address.').notEmpty()
    .isEmail()
    .withMessage('Provide a valid email'),
    check('fullName', 'You must enter your full name.').notEmpty(),
    check('password', 'You must enter a password.').notEmpty(),
    check('password', 'Password must be at least 7 chars long and contain at least one number')
    .isLength({ min: 7 })
  ]
};

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}