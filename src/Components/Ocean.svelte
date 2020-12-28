<script lang="ts">
  import { beforeUpdate, afterUpdate } from 'svelte'

  import PhysicsObject from '../Classes/PhysicsObject.ts'
  import getActorSize from '../utils/getActorSize.ts'

  export let colors: string[]
  export let otherActors:PhysicsObject[]
  export let player:PhysicsObject

  let canvas
  let maintainPlayerPerspective = false
  function handlePerspectiveChange() {
    maintainPlayerPerspective = !maintainPlayerPerspective
  }

  let overlayPolarGrid = false


  let height:number = 500
  let width:number = 1000
  $: diagonal = Math.hypot(width, height)

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

      //redraw the background
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

      let gridPosition = leftX
      while(gridPosition < rightX) {
        gridPosition = Math.ceil((gridPosition + 1) / 100) * 100
        ctx.beginPath()
        ctx.moveTo(gridPosition, topY)
        ctx.lineTo(gridPosition, bottomY)
        ctx.stroke()
      }
      gridPosition = topY
      while(gridPosition < bottomY) {
        gridPosition = Math.ceil((gridPosition + 1) / 100) * 100
        ctx.beginPath()
        ctx.moveTo(leftX, gridPosition)
        ctx.lineTo(rightX, gridPosition)
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
  	}
  })
</script>

<main>
  <div>
    <label for="playerPerspectiveCheckbox">Maintain Player Perspective?</label>
    <input
      id="playerPerspectiveCheckbox"
      type="checkbox"
      bind:checked={maintainPlayerPerspective}
      on:click{handlePerspectiveChange}
    />
  </div>
  <canvas
    bind:this={canvas}
    {width}
    {height}
  />
</main>

<style>

</style>
