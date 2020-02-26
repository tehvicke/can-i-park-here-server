/* TODO: Implement function to retrieve city to determine which API to use */
const getCity = (lat, long) => {
  return 'STOCKHOLM'
}

const getParkingData = (lat, long) => {
  const city = getCity(lat, long)

  switch (city) {
    case 'STOCKHOLM':
      return StockholmAPI.getDataWithin(lat, long, radius)
    default:
      throw new Error(`API for parking data in ${City} is not yet defined.`)
  }
}

module.exports = getParkingData
