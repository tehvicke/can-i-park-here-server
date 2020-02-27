import StockholmAPI from '../../datasources/stockholm'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const sthlm = new StockholmAPI()
const apiKey = process.env.MAPBOX_API_KEY

/* TODO: Implement function to retrieve city to determine which API to use */
const getCity = async (lat, long) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?types=place&access_token=${apiKey}`
  console.log(url)
  const data = await axios.get(url).then(response => response.data)
  return data.features[0].text
}

const getParkingData = async (lat, long, radius) => {
  const city = await getCity(lat, long)
  console.log(city)
  switch (city) {
    case 'Stockholm':
      const hej = sthlm.getDataWithin(lat, long, radius)
      return hej
    default:
      throw new Error(`API for parking data in ${city} is not yet defined.`)
  }
}

module.exports = { getParkingData: getParkingData }
