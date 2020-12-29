<script lang="ts">
  import { beforeUpdate, afterUpdate } from 'svelte'

  import PhysicsObject from '../Classes/PhysicsObject.ts'
  import drawLine from '../utils/canvas/drawLine.ts'
  import getActorSize from '../utils/getActorSize.ts'

  export let colors: string[]
  export let otherActors:PhysicsObject[]
  export let player:PhysicsObject
  export let width:number = 1000

  let controlBarHeight:number = 100
  $: height = 500 - controlBarHeight
  $: diagonal = Math.hypot(width, height) //we need this to make sure we draw a background big enough to cover the screen, even when the background is rotated

  let canvas
  let maintainPlayerPerspective = false
  let overlayPolarGrid = false

  function incrementGridPosition(position:number) {
    return Math.ceil((position + 1) / 100) * 100
  }

  afterUpdate(() => {
    const ctx = canvas.getContext('2d')
  	const requestId = requestAnimationFrame(draw)

  	function draw() {
      ctx.save()

      //center the canvas on the player
      ctx.translate(width/2 - player.positionX, height/2 - player.positionY)

      if(maintainPlayerPerspective) {
        //rotate the canvas to keep the player pointing up
        ctx.translate(player.positionX, player.positionY)
        ctx.rotate(-player.heading * Math.PI / 180)
        ctx.translate(-player.positionX, -player.positionY)
      }

      //redraw the background, making sure it's big enough to cover the canvas even if it is rotated
      const leftX = player.positionX - diagonal/2
      const topY = player.positionY - diagonal/2
      ctx.clearRect(leftX, topY, diagonal, diagonal)
      ctx.fillStyle = "lightblue"
      ctx.fillRect(leftX, topY, diagonal, diagonal)

      //grid lines
      ctx.strokeStyle = "gray"
      ctx.lineWidth = 0.5
      const rightX = leftX + diagonal
      const bottomY = topY + diagonal
      let gridPosition = leftX //start on the left of the canvas
      while(gridPosition < rightX) { //horizontal grid lines
        gridPosition = incrementGridPosition(gridPosition)
        drawLine(ctx, gridPosition, topY, gridPosition, bottomY)
      }
      gridPosition = topY //start on the top of the canvas
      while(gridPosition < bottomY) { //vertical grid lines
        gridPosition = incrementGridPosition(gridPosition)
        drawLine(ctx, leftX, gridPosition, rightX, gridPosition)
      }


      //actor lines
      ctx.lineWidth = 2
      otherActors.forEach((actor, i) => {
        ctx.strokeStyle = colors[i]
        drawLine(ctx, player.positionX, player.positionY, actor.positionX, actor.positionY)
      })

      //actors
      otherActors.forEach((actor, i) => {
        ctx.fillStyle = colors[i]
        ctx.beginPath()
        ctx.arc(actor.positionX, actor.positionY, getActorSize(actor.distanceFromPlayer), 0, 2 * Math.PI)
        ctx.stroke()
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
  	}
  })
</script>

<main>
  <div class="controlBar" bind:clientHeight={controlBarHeight}>
    <label for="playerPerspectiveCheckbox">Rotate with Player's Perspective:</label>
    <input
      id="playerPerspectiveCheckbox"
      type="checkbox"
      bind:checked={maintainPlayerPerspective}
    />
  </div>
  <canvas
    bind:this={canvas}
    {width}
    {height}
  />
</main>

<style>
  .controlBar {
    padding: 1em;
    background: #222;
  }
</style>
