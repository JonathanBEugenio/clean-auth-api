const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUseByEmailRepository, encrypter, tokenGenerator) {
    this.loadUseByEmailRepository = loadUseByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUseByEmailRepository.load(email)
    const isValid = user && await this.encrypter.compare(password, user.password)

    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user.id)

      return accessToken
    }
    return null
  }
}
