export default class PhysicsObject {
  acceleration:number
  angularAcceleration: number
  angularVelocity: number
  bearingHistories: number[] = []
  distanceFromPlayer: number = 100
  heading: number
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
    this.maxHistoryLength = options.maxHistoryLength ?? 50
    this.positionX = options.positionX ?? 0
    this.positionY = options.positionY ?? 0
    this.velocityX = options.velocityX ?? 0
    this.velocityY = options.velocityY ?? 0
  }

  update = (player?:PhysicsObject) => {
    //update the angular/heading data
    this.angularVelocity += this.angularAcceleration
    this.angularVelocity *= 0.9 //simple model for drag
    this.heading += this.angularVelocity

    //update the coordinate data
    const rad = (this.heading - 90) * Math.PI / 180
    this.velocityX += this.acceleration * Math.cos(rad)
    this.velocityY += this.acceleration * Math.sin(rad)
    this.velocityX *= 0.9 //simple model for drag
    this.velocityY *= 0.9
    this.positionX += this.velocityX
    this.positionY += this.velocityY

    //if applicable, update the distance this object is from the player
    if(player) {
      this.distanceFromPlayer = Math.hypot(
        this.positionX - player.positionX,
        this.positionY - player.positionY,
      )
    }
  }

  addBearing = (bearing: number) => {
    this.bearingHistories.unshift(bearing)
    if(this.bearingHistories.length > this.maxHistoryLength) {
      this.bearingHistories.pop()
    }
  }
}
