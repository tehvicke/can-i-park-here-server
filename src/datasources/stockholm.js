import { request } from 'request'

class StockholmAPI => {
  constructor() {
    this.baseURL = 'https://openparking.stockholm.se/LTF-Tolken/v1/'
    this.maxFeatures = 100
    this.format = 'json'
    this.apiKey = process.env.STOCKHOLM_API_KEY
  }

  stockholmReducer(data) {
    return data
  }

  async getDataWithin(lat, long, radius) {
    return null
  }
}

module.exports = StockholmAPI
