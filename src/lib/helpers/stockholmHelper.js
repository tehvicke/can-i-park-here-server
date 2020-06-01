import moment from 'moment'
import momentTz from 'moment-timezone'
import 'moment/locale/sv'

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

const getParkingAllowedTime = (startWeekday, startTime, endWeekday, endTime, usersTime, type) => {
  if (!startWeekday && !startTime && !endWeekday && !endTime) {
    /* If these values are missing then parking is never allowed */
    startWeekday = 1
    startTime = '0000'
    endWeekday = 1
    endTime = '0000'

    if (type === 'TIME_RESTRICTED') {
      endWeekday = 8
    }
  }

  const usersTimeFormatted = momentTz.tz(usersTime, 'Europe/Stockholm')

  const todayWeekday = usersTimeFormatted.isoWeekday()

  const startWeekdayDiff = startWeekday - todayWeekday
  const endWeekdayDiff = endWeekday - todayWeekday

  const startDateString = moment(usersTimeFormatted.format()).add(startWeekdayDiff, 'd').format('YYYY-MM-DD')
  const endDateString = moment(usersTimeFormatted.format()).add(endWeekdayDiff, 'd').format('YYYY-MM-DD')

  let startDateNew = moment(usersTimeFormatted)
    .add(startWeekdayDiff, 'd')
    .set({ hour: startTime.substring(0, 2), minute: startTime.substring(2, 2) })
  let endDateNew = moment(usersTimeFormatted)
    .add(endWeekdayDiff, 'd')
    .set({ hour: endTime.substring(0, 2), minute: endTime.substring(2, 2) })

  let startDate = moment(startDateString + ' ' + startTime, 'YYYY-MM-DD hhmm')
  let endDate = moment(endDateString + ' ' + endTime, 'YYYY-MM-DD hhmm')

  /* Adjust period to the week before if startTime is after the users time */
  if (usersTimeFormatted < startDate) {
    startDate.subtract(7, 'd')
    endDate.subtract(7, 'd')
    startDateNew.subtract(7, 'd')
    endDateNew.subtract(7, 'd')
  }

  // console.log(
  //   `StartDateNew: ${startDateNew.format()}, , Today: ${usersTimeFormatted.format()}, EndDateNew: ${endDateNew.format()}`
  // )

  return {
    start: startDateNew.format(),
    end: endDateNew.format(),
  }
}

module.exports = {
  checkOddEvenWeek: checkOddEvenWeek,
  getRegulationType: getRegulationType,
  getWeekday: getWeekday,
  getTime: getTime,
  getVehicleType: getVehicleType,
  getParkingAllowedTime: getParkingAllowedTime,
}
