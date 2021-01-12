const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUseByEmailRepository, encrypter) {
    this.loadUseByEmailRepository = loadUseByEmailRepository
    this.encrypter = encrypter
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUseByEmailRepository.load(email)

    if (!user) {
      return null
    }

    const isValid = await this.encrypter.compare(password, user.password)

    if (!isValid) {
      return null
    }
  }
}
