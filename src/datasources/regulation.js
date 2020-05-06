import moment from 'moment'
import momentTz from 'moment-timezone'
// var moment = require('moment-timezone')
import 'moment/locale/sv'

class Regulation {
  constructor(id, type, typeDesc, vehicle, address, url) {
    this.id = id
    this.type = type
    this.typeDesc = typeDesc
    this.vehicle = vehicle
    this.address = address
    this.url = url

    this.parkingAllowedTime = {
      start: undefined,
      end: undefined,
    }
  }

  /**
   * Start and end times for when it's forbidden to park
   * @param {Number Weekday when the citation is active (i.e. forbidden to park)} startWeekday
   * @param {Date Time on startWeekday wafter which the citation is active (i.e. forbidden to park). 1 = Monday} startTime
   * @param {Number Weekday when the citation is active (i.e. forbidden to park. Defaulsts to startWeekday if undefined} endWeekday
   * @param {Date Time on endWeekday after which the citation is no longer active (i.e. allowed to park again)} endTime
   */
  setParkingAllowedTime(startWeekday, startTime, endWeekday, endTime, usersTime) {
    if (!startWeekday && !startTime && !endWeekday && !endTime) {
      /* If these values are missing then parking is never allowed */
      startWeekday = 1
      startTime = '0000'
      endWeekday = 1
      endTime = '0000'
    }

    if (this.type === 'TIME_RESTRICTED') {
      endWeekday = 8
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

    this.parkingAllowedTime.start = startDateNew.format()
    this.parkingAllowedTime.end = endDateNew.format()
  }
}

module.exports = Regulation
