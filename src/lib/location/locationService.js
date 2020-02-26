import StockholmAPI from '../../datasources/stockholm'

const sthlm = new StockholmAPI()

/* TODO: Implement function to retrieve city to determine which API to use */
const getCity = (lat, long) => {
  return 'STOCKHOLM'
}

const getParkingData = (lat, long, radius) => {
  const city = getCity(lat, long)

  switch (city) {
    case 'STOCKHOLM':
      return sthlm.getDataWithin(lat, long, radius)
    default:
      throw new Error(`API for parking data in ${ity} is not yet defined.`)
  }
}

module.exports = { getParkingData: getParkingData }
