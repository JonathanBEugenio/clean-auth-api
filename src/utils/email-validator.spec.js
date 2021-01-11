const validator = require('validator')

class EmailValidator {
  validate (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const email = 'valid_email@email.com'
    const isValid = sut.validate(email)
    expect(isValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = new EmailValidator()
    validator.isValid = false
    const email = 'invalid_email@email.com'
    const isValid = sut.validate(email)
    expect(isValid).toBe(false)
  })
})
