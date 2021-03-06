/**
 * @jest-environment node
 */
import request from 'supertest'
import 'babel-polyfill'
import app from '../app.js'
import moment from 'moment'

/* import mongoose from 'mongoose'
const mongoUrl = 'mongodb://localhost/can-i-park-here-test'
*/

const PORT = 3001

let server

beforeAll(async () => {
  /* mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoose.Promise = Promise
  await Thought.deleteMany({}) */
  server = app.listen(PORT)
})

afterAll(done => {
  /* mongoose.connection.close() */
  server.close(done)
})

describe('server is up', () => {
  it('responds', async () => {
    const date = moment().format()
    await request(server)
      .get(`/api/v1/?lat=59.338547&long=18.067099&radius=100&time=${date}`)
      .expect(200)
  }),
    it('shows 404 error if using wrong endpoint', async () => {
      await request(server)
        .post('/fail')
        .expect(404)
    })
})
