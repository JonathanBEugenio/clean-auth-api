const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

class LoadUseByEmailRepositorySpy {
  async load (email) {
    this.email = email
    return this.user
  }
}

const makeSut = () => {
  const loadUseByEmailRepository = new LoadUseByEmailRepositorySpy()
  loadUseByEmailRepository.user = {}
  const sut = new AuthUseCase(loadUseByEmailRepository)

  return {
    sut,
    loadUseByEmailRepository
  }
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
    const { sut } = makeSut()
    const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
})
