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
  getVehicleType,
  getParkingAllowedTime,
} from '../lib/helpers/stockholmHelper.js'
dotenv.config()

class StockholmAPI extends CityAPI {
  constructor() {
    super()
    this.baseURL = 'https://openparking.stockholm.se/LTF-Tolken/v1/ptillaten/within/'
    this.maxFeatures = 100
    this.format = 'json'
    this.apiKey = process.env.STOCKHOLM_API_KEY
    this.time = undefined
  }

  regulationIsValid(prop) {
    /* Check that the date is within start & end month. If they don't exist then it's valid all year round */
    if (prop.START_MONTH && prop.END_MONTH) {
      const today = moment()
      const validFrom = moment(`${today.year()}-${prop.START_MONTH}-${prop.START_DAY}`, 'YYYY-M-D')
      const validTo = moment(`${today.year()}-${prop.END_MONTH}-${prop.END_DAY}`, 'YYYY-M-D')
      if (validFrom > validTo) validFrom.subtract(1, 'y')

      if (validFrom > today || validTo < today) return false
    }

    return true
  }

  stockholmReducer(featureGroup) {
    let data = featureGroup
    // if (featureGroup.length === 1) data = featureGroup[0]
    // const oddEven = checkOddEvenWeek(data.properties.ODD_EVEN)

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
        .START_WEEKDAY /* In most cases start and end weekday will be the same, so end will get value of start_weekday */

    /* New stuff */

    const parkingTimes = getParkingAllowedTime(
      getWeekday(data.properties.START_WEEKDAY),
      getTime(data.properties.START_TIME),
      getWeekday(endWeekday) + 7,
      getTime(data.properties.END_TIME),
      this.time,
      getRegulationType(data.properties.VF_PLATS_TYP)
    )

    regulation.setParkingAllowedTime(parkingTimes)
    data.properties = regulation

    const mergedFeature = {
      type: 'Feature',
      id: 'XXX',
      geometry: { 1: 1 },
      geometry_name: 'GEOMETRY',
      properties: { 1: 1 },
    }

    /* End new stuff */
    return data
  }

  /*
   * Algoritm
   * Om JÄMN vecka (får stå hela veckan) - så blir det START_WEEKDAY - 7 dagar som start och START_WEEKDAY + 7 dagar som slut (med tid också)
   * Om UDDA vecka INNAN end time (dvs innan tiden på START_WEEKDAY) så blir det START_WEEKDAY - 14 som start och START_WEEKDAY som slut
   * Om UDDA vecka EFTER end time (dvs efter tiden på START_WEEKDAY) så blir det START_WEEKDAY som start och START_WEEKDAY + 14 som slut
   *
   */

  getDataWithin(lat, long, radius, time, apiVersion) {
    const url = `${this.baseURL}?radius=${radius}&lat=${lat}&lng=${long}&maxFeatures=${this.maxFeatures}&outputFormat=${this.format}&apiKey=${this.apiKey}`
    this.time = time
    console.log(url)

    return axios.get(url).then((response) => {
      if (apiVersion === 'v1') {
        return response.data
      } else if (apiVersion === 'v2') {
        /* Filter out all non valid (i.e. 'winter' regulations if during summer, and vice versa) */
        let newFormat = response.data.features.filter((feature) => this.regulationIsValid(feature.properties))

        // /* New stuff for two weeks */

        /* Group all regulations that regard the same feature (i.e. group odd+even week regulations) */

        const groups = newFormat.reduce((citationGroups, citation) => {
          // if (citation.id === 'LTFR_P_TILLATEN.30808590') console.log(citation)
          const featureId = citation.properties.FEATURE_OBJECT_ID

          if (!citationGroups[featureId]) {
            citationGroups[featureId] = []
          }
          citationGroups[featureId].push(citation)
          // console.log(citationGroups[featureId])

          return citationGroups
        }, {})

        /* Loop over each group to create final set of regulation (i.e. odd+even merged into one) */
        Object.keys(groups).forEach((key) => {
          console.log('key: ', key) // the name of the current key.

          const group = groups[key]
          console.log('group:')
          console.log(group) // the value of the current key.
        })

        // /* End new stuff */

        return newFormat.map((feature) => {
          const res = this.stockholmReducer(feature)
          // console.log(res)
          return res
        })
      }
    })
  }
}

module.exports = StockholmAPI
