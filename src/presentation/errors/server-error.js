module.exports = class ServerError extends Error {
  constructor (paramName) {
    super('Server internal error')
    this.name = 'ServerError'
  }
}
