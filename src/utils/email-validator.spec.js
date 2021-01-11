class EmailValidator {
  validate (email) {
    return true
  }
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const email = 'valid_email@email.com'
    const isValid = sut.validate(email)
    expect(isValid).toBe(true)
  })
})
