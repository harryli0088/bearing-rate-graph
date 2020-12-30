import { DEG_PER_RAD } from 'utils/consts'

export default class PhysicsObject {
  acceleration:number
  angularAcceleration: number
  angularVelocity: number
  bearingHistories: number[] = []
  distanceFromPlayer: number = 100
  heading: number
  label: string
  maxHistoryLength: number
  positionX: number
  positionY: number
  velocityX: number
  velocityY: number

  constructor(options:{
    acceleration?: number,
    angularAcceleration?: number
    angularVelocity?: number
    heading?: number,
    label?: string
    maxHistoryLength?: number,
    positionX?: number,
    positionY?: number,
    velocityX?: number,
    velocityY?: number,
  }) {
    this.acceleration = options.acceleration ?? 0
    this.angularAcceleration = options.angularAcceleration ?? 0
    this.angularVelocity = options.angularVelocity ?? 0
    this.heading = options.heading ?? 0
    this.label = options.label || ""
    this.maxHistoryLength = options.maxHistoryLength ?? 50
    this.positionX = options.positionX ?? 0
    this.positionY = options.positionY ?? 0
    this.velocityX = options.velocityX ?? 0
    this.velocityY = options.velocityY ?? 0
  }

  update = () => {
    //update the angular/heading data
    this.angularVelocity += this.angularAcceleration
    this.angularVelocity *= 0.9 //simple model for drag
    this.incrementHeading(this.angularVelocity)

    //update the coordinate data
    const rad = (this.heading - 90) / DEG_PER_RAD
    this.velocityX += this.acceleration * Math.cos(rad)
    this.velocityY += this.acceleration * Math.sin(rad)
    this.velocityX *= 0.9 //simple model for drag
    this.velocityY *= 0.9
    this.positionX += this.velocityX
    this.positionY += this.velocityY
  }

  updateDistanceFromPlayer = (player:PhysicsObject) => {
    this.distanceFromPlayer = Math.hypot(
      this.positionX - player.positionX,
      this.positionY - player.positionY,
    )
  }

  getSize = () => Math.min(40, 1000 / (this.distanceFromPlayer + 10))
  getOpacity = () => 400 / (this.distanceFromPlayer + 400)

  addBearing = (bearing: number) => {
    this.bearingHistories.unshift(bearing)
    if(this.bearingHistories.length > this.maxHistoryLength) {
      this.bearingHistories.pop()
    }
  }

  setHeading = (heading:number) => {
    this.heading = heading % 360
  }
  setHeadingFromDxDy = (dx: number, dy: number) => {
    this.setHeading(-Math.atan2(dx, dy)*DEG_PER_RAD)
  }
  incrementHeading = (increment:number) => {
    this.setHeading(this.heading + increment)
  }
}
