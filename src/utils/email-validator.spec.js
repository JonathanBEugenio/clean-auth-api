const validator = require('validator')

class EmailValidator {
  validate (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  const sut = new EmailValidator()
  return sut
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const email = 'valid_email@email.com'
    const isValid = sut.validate(email)
    expect(isValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    validator.isValid = false
    const email = 'invalid_email@email.com'
    const isValid = sut.validate(email)
    expect(isValid).toBe(false)
  })

  test('Should call validator with correct params', () => {
    const sut = makeSut()
    const email = 'valid_email@email.com'
    sut.validate(email)
    expect(validator.email).toBe(email)
  })
})
