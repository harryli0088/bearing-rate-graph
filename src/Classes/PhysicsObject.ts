export default class PhysicsObject {
  acceleration:number
  bearingHistories: number[] = []
  heading: number
  maxHistoryLength: number
  positionX: number
  positionY: number
  velocityX: number
  velocityY: number

  constructor(options:{
    acceleration?: number,
    heading?: number,
    maxHistoryLength?: number,
    positionX?: number,
    positionY?: number,
    velocityX?: number,
    velocityY?: number,
  }) {
    this.acceleration = options.acceleration ?? 0
    this.heading = options.heading ?? 0
    this.maxHistoryLength = options.maxHistoryLength ?? 50
    this.positionX = options.positionX ?? 0
    this.positionY = options.positionY ?? 0
    this.velocityX = options.velocityX ?? 0
    this.velocityY = options.velocityY ?? 0
  }

  update = () => {
    this.velocityX += this.acceleration * Math.cos(this.heading)
    this.velocityY += this.acceleration * Math.sin(this.heading)
    this.positionX += this.velocityX
    this.positionY += this.velocityY
  }

  addBearing = (bearing: number) => {
    this.bearingHistories.unshift(bearing)
    if(this.bearingHistories.length > this.maxHistoryLength) {
      this.bearingHistories.pop()
    }
  }
}
