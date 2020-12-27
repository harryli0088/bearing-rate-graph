export default class PhysicsObject {
  acceleration: number = 0
  bearingHistories: number[] = []
  heading: number = 0
  positionX: number = 0
  positionY: number = 0
  velocityX: number = 0
  velocityY: number = 0

  update = () => {
    this.velocityX += this.acceleration * Math.cos(this.heading)
    this.velocityY += this.acceleration * Math.sin(this.heading)
    this.positionX += this.velocityX
    this.positionY += this.velocityY
  }
}
