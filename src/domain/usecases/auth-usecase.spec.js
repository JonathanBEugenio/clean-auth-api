const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUseByEmailRepository) {
    this.loadUseByEmailRepository = loadUseByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    await this.loadUseByEmailRepository.load(email)
  }
}

class LoadUseByEmailRepositorySpy {
  async load (email) {
    this.email = email
  }
}

const makeSut = () => {
  const loadUseByEmailRepository = new LoadUseByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUseByEmailRepository)

  return {
    sut,
    loadUseByEmailRepository
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUseByEmailRepository with correct email', async () => {
    const { sut, loadUseByEmailRepository } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')
    expect(loadUseByEmailRepository.email).toBe('any_email@email.com')
  })
})
