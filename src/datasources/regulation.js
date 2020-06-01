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

  setParkingAllowedTime(data) {
    this.parkingAllowedTime.start = data.start
    this.parkingAllowedTime.end = data.end
  }
}

module.exports = Regulation
