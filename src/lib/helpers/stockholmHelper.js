/* Helper functions for the Stockholm API implementation */

const checkOddEvenWeek = (oddEven) => {
  switch (oddEven) {
    case undefined:
      return undefined
    case 'udda veckor':
      return 1
    case 'jämna veckor':
      return 0
  }
}
const getRegulationType = (type) => {
  switch (type) {
    case 'P Avgift, boende':
      return 'TIME_RESTRICTED'
    case 'Tidsreglerad lastplats':
      return 'TIME_RESTRICTED_LOADING'
    case 'Reserverad p-plats motorcykel':
      return 'ALWAYS_RESTRICTED'
    case 'Reserverad p-plats rörelsehindrad':
      return 'ALWAYS_RESTRICTED'
    case 'Tidsreglerat parkerings-/stoppförbud':
      return 'TIME_RESTRICTED'
  }
}
const getWeekday = (weekday) => {
  switch (weekday) {
    case 'måndag':
      return 1
    case 'tisdag':
      return 2
    case 'onsdag':
      return 3
    case 'torsdag':
      return 4
    case 'fredag':
      return 5
    default:
      return undefined
  }
}

const getTime = (time) => {
  if (time === undefined) return undefined
  time = '' + time
  switch (time.length) {
    case 1:
      return '0000'
    case 2:
      throw new Error('TIME has 2 digits')
    case 3:
      return `0${time}`
    case 4:
      return time
  }
}

const getVehicleType = (vehicle) => {
  switch (vehicle) {
    case 'fordon':
      return 'CAR'
    case 'handikapp':
      return 'DISABLED'
    case 'motorcykel':
      return 'MOTORBIKE'
  }
}
module.exports = {
  checkOddEvenWeek: checkOddEvenWeek,
  getRegulationType: getRegulationType,
  getWeekday: getWeekday,
  getTime: getTime,
  getVehicleType: getVehicleType,
}
