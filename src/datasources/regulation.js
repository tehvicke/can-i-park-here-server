import moment from 'moment'
class Regulation {
  constructor(id, type, typeDesc, vehicle, address, url, geometry) {
    this.id = id
    this.type = type
    this.typeDesc = typeDesc
    this.vehicle = vehicle
    this.address = address
    this.url = url

    this.parkingAllowedTime = {
      start: undefined,
      end: undefined
    }
    this.geometry = geometry
  }

  /**
   * Start and end times for when it's forbidden to park
   * @param {Number Weekday when the citation is active (i.e. forbidden to park)} startWeekday
   * @param {Date Time on startWeekday wafter which the citation is active (i.e. forbidden to park). 1 = Monday} startTime
   * @param {Number Weekday when the citation is active (i.e. forbidden to park. Defaulsts to startWeekday if undefined} endWeekday
   * @param {Date Time on endWeekday after which the citation is no longer active (i.e. allowed to park again)} endTime
   */
  setParkingAllowedTime(startWeekday, startTime, endWeekday, endTime) {
    if (!startWeekday && !startTime && !endWeekday && !endTime) return

    const todayWeekday = moment().isoWeekday()

    const startWeekdayDiff = todayWeekday - startWeekday + 7
    const endWeekdayDiff = endWeekday - todayWeekday

    const startDateString = moment()
      .subtract(startWeekdayDiff, 'd')
      .format('YYYY-MM-DD')
    const endDateString = moment()
      .add(endWeekdayDiff, 'd')
      .format('YYYY-MM-DD')

    this.parkingAllowedTime.start = moment(startDateString + ' ' + startTime, 'YYYY-MM-DD hhmm').format()
    this.parkingAllowedTime.end = moment(endDateString + ' ' + endTime, 'YYYY-MM-DD hhmm').format()
  }
}

module.exports = Regulation
