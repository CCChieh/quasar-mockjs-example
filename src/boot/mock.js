export default async (/* { app, router, Vue ... } */) => {
  if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../../mock')
    mockXHR()
  }
}
