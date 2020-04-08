import moment from 'moment'
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
    const usersTimeFormatted = moment(usersTime)

    const todayWeekday = usersTimeFormatted.isoWeekday()

    //console.log(`StartWeekday: ${startWeekday}, TodaysWeekday: ${todayWeekday}, EndWeekday: ${endWeekday}`)

    const startWeekdayDiff = startWeekday - todayWeekday
    const endWeekdayDiff = endWeekday - todayWeekday

    const startDateString = moment(usersTimeFormatted.format()).add(startWeekdayDiff, 'd').format('YYYY-MM-DD')
    const endDateString = moment(usersTimeFormatted.format()).add(endWeekdayDiff, 'd').format('YYYY-MM-DD')

    let startDate = moment(
      startDateString + ' ' + startTime + ' ' + usersTimeFormatted.format('ZZ'),
      'YYYY-MM-DD hhmm ZZ'
    )
    let endDate = moment(endDateString + ' ' + endTime + ' ' + usersTimeFormatted.format('ZZ'), 'YYYY-MM-DD hhmm ZZ')

    /* Adjust period to the week before if startTime is after the users time */
    if (usersTimeFormatted < startDate) {
      startDate.subtract(7, 'd')
      endDate.subtract(7, 'd')
    }

    this.parkingAllowedTime.start = startDate.format()
    this.parkingAllowedTime.end = endDate.format()
    // console.log(
    //   `StartDate: ${startDate.format()}, , Today: ${usersTimeFormatted.format()}, EndDate: ${endDate.format()}`
    // )
  }
}

module.exports = Regulation
