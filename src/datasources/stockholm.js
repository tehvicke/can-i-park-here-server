import axios from 'axios'
import CityAPI from './cityAPI.js'
import dotenv from 'dotenv'

dotenv.config()

class StockholmAPI extends CityAPI {
  constructor() {
    super()
    this.baseURL = 'https://openparking.stockholm.se/LTF-Tolken/v1/ptillaten/within/'
    this.maxFeatures = 200
    this.format = 'json'
    this.apiKey = process.env.STOCKHOLM_API_KEY
  }

  stockholmReducer(data) {
    return data
  }

  getDataWithin(lat, long, radius) {
    const url = `${this.baseURL}?radius=${radius}&lat=${lat}&lng=${long}&maxFeatures=${this.maxFeatures}&outputFormat=${this.format}&apiKey=${this.apiKey}`
    console.log(url)
    return axios.get(url).then(response => response.data)
  }
}

module.exports = StockholmAPI
