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
  setParkingAllowedTime(data) {
    this.parkingAllowedTime.start = data.start
    this.parkingAllowedTime.end = data.end
  }
}

module.exports = Regulation
