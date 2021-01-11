module.exports = {
  isValid: true,
  isEmail (email) {
    this.email = email
    return this.isValid
  }
}
