const validator = require('validator')

module.exports = class EmailValidator {
  validate (email) {
    return validator.isEmail(email)
  }
}
