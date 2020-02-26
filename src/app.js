import express from 'express'
import { getParkingData } from './lib/location/locationService'

const app = express()

app.get('/', (req, res, next) => {
  try {
    console.log(getParkingData(1, 2, 3))
    res.send('hej')
  } catch (err) {
    next(err)
  }
})

app.use((req, res, next) => {
  try {
    res.status(404).json({ error: `route '${req.originalUrl}' is not defined` })
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})

module.exports = app
