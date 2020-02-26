import { request } from 'request'
import CityAPI from './cityAPI.js'

class StockholmAPI extends CityAPI {
  constructor() {
    super()
    this.baseURL = 'https://openparking.stockholm.se/LTF-Tolken/v1/'
    this.maxFeatures = 100
    this.format = 'json'
    this.apiKey = process.env.STOCKHOLM_API_KEY
  }

  stockholmReducer(data) {
    return data
  }

  getDataWithin(lat, long, radius) {
    return this.getTest()
  }
}

module.exports = StockholmAPI
