import axios from 'axios'
import CityAPI from './cityAPI.js'
import dotenv from 'dotenv'
import Regulation from './regulation.js'
import moment from 'moment'
import {
  checkOddEvenWeek,
  getRegulationType,
  getWeekday,
  getTime,
  getVehicleType
} from '../lib/helpers/stockholmHelper.js'
dotenv.config()

class StockholmAPI extends CityAPI {
  constructor() {
    super()
    this.baseURL = 'https://openparking.stockholm.se/LTF-Tolken/v1/ptillaten/within/'
    this.maxFeatures = 10
    this.format = 'json'
    this.apiKey = process.env.STOCKHOLM_API_KEY
  }

  regulationIsValid(prop) {
    /* Check that the odd/even week is correct */
    if (prop.ODD_EVEN) {
      if ((moment().week() + 1) % 2 !== checkOddEvenWeek(prop.ODD_EVEN)) return false
    }

    /* Check that the date is within start & end month. If they don't exist then it's valid all year round */
    if (prop.START_MONTH && prop.END_MONTH) {
      const today = moment()
      const validFrom = moment(`${today.year()}-${prop.START_MONTH}-${prop.START_DAY}`, 'YYYY-M-D')
      const validTo = moment(`${today.year()}-${prop.END_MONTH}-${prop.END_DAY}`, 'YYYY-M-D')
      if (validFrom > validTo) validFrom.subtract(1, 'y')

      // console.log('From: ', validFrom.format(), ', to: ', validTo.format())
      if (validFrom > today || validTo < today) return false
    }

    return true
  }

  stockholmReducer(data) {
    const regulation = new Regulation(
      data.id,
      getRegulationType(data.properties.VF_PLATS_TYP),
      data.properties.VF_PLATS_TYP,
      getVehicleType(data.properties.VEHICLE),
      data.properties.ADDRESS,
      data.properties.RDT_URL,
      data.geometry
    )

    /* Assign time when parking is allowed */
    const endWeekday =
      data.properties.END_WEEKDAY ||
      data.properties
        .START_WEEKDAY /* For most cases start and end weekday will be the same, so end will get value of start_weekday */
    regulation.setParkingAllowedTime(
      getWeekday(data.properties.START_WEEKDAY),
      getTime(data.properties.START_TIME),
      getWeekday(endWeekday),
      getTime(data.properties.END_TIME)
    )

    return regulation
  }

  getDataWithin(lat, long, radius, apiVersion) {
    const url = `${this.baseURL}?radius=${radius}&lat=${lat}&lng=${long}&maxFeatures=${this.maxFeatures}&outputFormat=${this.format}&apiKey=${this.apiKey}`
    console.log(url)

    return axios.get(url).then(response => {
      console.log(response.data.features.length)
      if (apiVersion === 'v1') {
        return response.data
      } else if (apiVersion === 'v2') {
        let newFormat = response.data.features.filter(feature => this.regulationIsValid(feature.properties))

        console.log(newFormat)
        return newFormat.map(feature => {
          return this.stockholmReducer(feature)
        })
      }
    })
  }
}

module.exports = StockholmAPI
