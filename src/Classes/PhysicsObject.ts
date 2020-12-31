import { DEG_PER_RAD } from 'utils/consts'

export default class PhysicsObject {
  acceleration:number
  angularAcceleration: number
  angularVelocity: number
  bearingHistories: number[] = [] //acts as a queue, with new values unshifted in front, and old values popped out
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

  getSize = () => Math.min(40, 1000 / (this.distanceFromPlayer + 10)) //scale size inversely with distance from player
  getOpacity = () => 400 / (this.distanceFromPlayer + 400) //scale size opacity with distance from player

  addBearing = (bearing: number) => {
    this.bearingHistories.unshift(bearing) //add the new bearing to the front of the array
    if(this.bearingHistories.length > this.maxHistoryLength) { //if we have too many bearings
      this.bearingHistories.pop() //remove the last value
    }
  }

  setHeading = (heading:number) => {
    this.heading = heading % 360 //keep the heading between 0 and 359
  }
  setHeadingFromDxDy = (dx: number, dy: number, accountHeading:boolean=false) => {
    //if appropriate, calculate the heading in radians
    const radHeading = accountHeading ? this.heading/DEG_PER_RAD : 0

    this.setHeading(
      (
        radHeading - Math.atan2(dx, dy) //subtract the heading by the bearing of dx and dy
      ) * DEG_PER_RAD //convert the radians into degrees
    )
  }
  incrementHeading = (increment:number) => {
    this.setHeading(this.heading + increment)
  }
}
