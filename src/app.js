import express from 'express'
import { getParkingData } from './lib/location/locationService'

/* Lat/Long Fredhäll, Adlerbethsgatan 17 */
const testA = {
  lat: 59.331117,
  long: 18.005072,
  radius: 50
}
/* Lat/Long Oslo, Rubina Ranas gate 14-12 */
const testB = {
  lat: 59.911311,
  long: 10.764739,
  radius: 100
}
const app = express()

app.get('/', async (req, res, next) => {
  // const { lat, long, radius } = testA
  const { lat, long, radius } = req.query
  console.log(req.query)
  try {
    const data = await getParkingData(lat, long, radius)
    res.send(data)
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
