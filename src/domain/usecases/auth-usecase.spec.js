const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  const loadUseByEmailRepository = makeLoadUseByEmailRepository()
  const encrypter = makeEncrypter()
  const tokenGenerator = makeTokenGenerator()
  const sut = new AuthUseCase(loadUseByEmailRepository, encrypter, tokenGenerator)

  return {
    sut,
    loadUseByEmailRepository,
    encrypter,
    tokenGenerator
  }
}

const makeLoadUseByEmailRepository = () => {
  class LoadUseByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUseByEmailRepository = new LoadUseByEmailRepositorySpy()
  loadUseByEmailRepository.user = {
    id: 'any_id',
    password: 'hashedPassword'
  }

  return loadUseByEmailRepository
}

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypter = new EncrypterSpy()
  encrypter.isValid = true

  return encrypter
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGenerator = new TokenGenerator()
  tokenGenerator.accessToken = 'any_token'
  return tokenGenerator
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUseByEmailRepository with correct email', async () => {
    const { sut, loadUseByEmailRepository } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')
    expect(loadUseByEmailRepository.email).toBe('any_email@email.com')
  })

  test('Should throw if no LoadUseByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadUseByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUseByEmailRepository } = makeSut()
    loadUseByEmailRepository.user = null
    const accessToken = await sut.auth('invalid_email@email.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypter } = makeSut()
    encrypter.isValid = false
    const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct params', async () => {
    const { sut, loadUseByEmailRepository, encrypter } = makeSut()
    await sut.auth('valid_email@email.com', 'any_password')
    expect(encrypter.password).toBe('any_password')
    expect(encrypter.hashedPassword).toBe(loadUseByEmailRepository.user.password)
  })

  test('Should call TokenGenerator with correct params', async () => {
    const { sut, loadUseByEmailRepository, tokenGenerator } = makeSut()
    await sut.auth('valid_email@email.com', 'valid_password')
    expect(tokenGenerator.userId).toBe(loadUseByEmailRepository.user.id)
  })

  test('Should return an accessToken if correct credential are provided', async () => {
    const { sut, tokenGenerator } = makeSut()
    const accessToken = await sut.auth('valid_email@email.com', 'valid_password')
    expect(accessToken).toBe(tokenGenerator.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
