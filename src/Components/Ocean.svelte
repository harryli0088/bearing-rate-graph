<script lang="ts">
  import { beforeUpdate, afterUpdate } from 'svelte'

  import PhysicsObject from '../Classes/PhysicsObject.ts'
  import getActorSize from '../utils/getActorSize.ts'

  export let colors: string[]
  export let otherActors:PhysicsObject[]
  export let player:PhysicsObject

  let canvas


  let height:number = 500
  let width:number = 1000

  afterUpdate(() => {
    const ctx = canvas.getContext('2d')
  	const requestId = requestAnimationFrame(draw)

  	function draw() {
      ctx.save()
      const transform = ctx.getTransform()
      console.log(transform)

      const expectedLeftX = player.positionX - width / 2
      const expectedTopY = player.positionY - height / 2
      ctx.translate(-expectedLeftX, -expectedTopY)



      ctx.clearRect(expectedLeftX, expectedTopY, width + 2, height + 2)

      ctx.fillStyle = "lightblue"
      ctx.fillRect(expectedLeftX, expectedTopY, width + 2, height + 2)

      //grid lines
      ctx.strokeStyle = "gray"
      ctx.lineWidth = 0.5
      const expectedRightX = expectedLeftX + width
      const expectedBottomY = expectedTopY + height

      let gridPosition = expectedLeftX
      while(gridPosition < expectedRightX) {
        gridPosition = Math.ceil((gridPosition + 1) / 100) * 100
        ctx.beginPath()
        ctx.moveTo(gridPosition, expectedTopY)
        ctx.lineTo(gridPosition, expectedBottomY)
        ctx.stroke()
      }
      gridPosition = expectedTopY
      while(gridPosition < expectedBottomY) {
        gridPosition = Math.ceil((gridPosition + 1) / 100) * 100
        ctx.beginPath()
        ctx.moveTo(expectedLeftX, gridPosition)
        ctx.lineTo(expectedRightX, gridPosition)
        ctx.stroke()
      }


      //actor lines
      ctx.lineWidth = 2
      otherActors.forEach((actor, i) => {
        ctx.strokeStyle = colors[i]
        ctx.beginPath()
        ctx.moveTo(player.positionX, player.positionY)
        ctx.lineTo(actor.positionX, actor.positionY)
        ctx.stroke()
      })

      //actors
      otherActors.forEach((actor, i) => {
        ctx.fillStyle = colors[i]
        ctx.beginPath()
        ctx.arc(actor.positionX, actor.positionY, getActorSize(actor.distanceFromPlayer), 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
      })


      //player
      ctx.translate(player.positionX, player.positionY)
      ctx.rotate(player.heading * Math.PI / 180)
      ctx.translate(-player.positionX, -player.positionY)
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
      ctx.beginPath()
      ctx.moveTo(player.positionX, player.positionY - 6)
      ctx.lineTo(player.positionX + 5, player.positionY + 6)
      ctx.lineTo(player.positionX - 5, player.positionY + 6)
      ctx.fill()
      ctx.restore()


      // ctx.save()
      // let currentRotation = Math.atan2(transform.b, transform.a)
      // ctx.translate(player.positionX, player.positionY)
      // ctx.rotate(player.heading * Math.PI / 180)
      // ctx.translate(-player.positionX, -player.positionY)
      // ctx.restore()
  	}
  })
</script>

<main>
  <canvas
    bind:this={canvas}
    {width}
    {height}
  />
</main>

<style>
  svg {
    background-color: lightblue;
  }

  line {
    stroke-width: 2px;
  }

  circle {
    fill: none;
    stroke-width: 2px;
  }

  #player {
    stroke: black;
    fill: black;
  }
</style>
