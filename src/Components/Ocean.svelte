<script lang="ts">
  import { afterUpdate } from 'svelte'

  import PhysicsObject from '../Classes/PhysicsObject.ts'
  import drawLine from '../utils/canvas/drawLine.ts'
  import { DEG_PER_RAD } from '../utils/consts.ts'

  export let colors: string[]
  export let otherActors:PhysicsObject[]
  export let player:PhysicsObject

  let width:number = 1000
  let controlBarHeight:number = 100
  $: height = 500 - controlBarHeight
  $: diagonal = Math.hypot(width, height) //we need this to make sure we draw a background big enough to cover the screen, even when the background is rotated

  //DPR is important for improving the picture quality of the canvas, especially for text
  //based off this fiddle http://jsfiddle.net/65maD/83/ from this stack answer https://stackoverflow.com/a/54027313
  const DPR = window.devicePixelRatio
  const legendWidth = 105
  const legendHeight = 80
  $: legendOffsetX = width - legendWidth
  $: legendOffsetY = height - legendHeight
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
      ctx.save() //initial save for DPR scaling
      ctx.scale(DPR, DPR)

      ctx.save() //second save for canvas centering and possible rotating

      //center the canvas on the player
      ctx.translate(width/2 - player.positionX, height/2 - player.positionY)

      if(maintainPlayerPerspective) {
        //rotate the canvas to keep the player pointing up
        ctx.translate(player.positionX, player.positionY)
        ctx.rotate(-player.heading / DEG_PER_RAD)
        ctx.translate(-player.positionX, -player.positionY)
      }

      //redraw the background, making sure it's big enough to cover the canvas even if it is rotated
      const leftX = player.positionX - diagonal/2
      const topY = player.positionY - diagonal/2
      ctx.clearRect(leftX, topY, diagonal, diagonal)
      ctx.fillStyle = "lightblue"
      ctx.fillRect(leftX, topY, diagonal, diagonal)

      //dynamically calculate grid lines
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

      //actors
      ctx.lineWidth = 2
      otherActors.forEach((actor, i) => {
        ctx.globalAlpha = actor.getOpacity()
        ctx.strokeStyle = colors[i]

        drawLine(ctx, player.positionX, player.positionY, actor.positionX, actor.positionY)

        ctx.beginPath()
        ctx.arc(actor.positionX, actor.positionY, actor.getSize(), 0, 2 * Math.PI)
        ctx.stroke()
      })
      ctx.globalAlpha = 1


      //player
      ctx.translate(player.positionX, player.positionY)
      ctx.rotate(player.heading / DEG_PER_RAD)
      ctx.translate(-player.positionX, -player.positionY)
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
      ctx.beginPath()
      ctx.moveTo(player.positionX, player.positionY - 8)
      ctx.lineTo(player.positionX + 6, player.positionY + 8)
      ctx.lineTo(player.positionX - 6, player.positionY + 8)
      ctx.fill()

      ctx.restore() //undo centering and possible rotation transforms


      //legend
      ctx.save()

      ctx.translate(legendOffsetX, legendOffsetY)
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      ctx.fillRect(0, 0, legendWidth, legendHeight)

      ctx.fillStyle = "black"
      ctx.fillText("Movement Type", 10, 20)

      otherActors.forEach((actor, i) => {
        const yPosition = i * 15 + 35
        ctx.lineWidth = 1.5
        ctx.strokeStyle = colors[i]
        ctx.beginPath()
        ctx.arc(15, yPosition, 5, 0, 2 * Math.PI)
        ctx.stroke()

        drawLine(ctx, 15, yPosition, 30, yPosition)

        ctx.fillStyle = colors[i]
        ctx.fillText(actor.label, 35, yPosition + 3)
      })

      ctx.restore() //undo legend transforms


      ctx.restore() //undo DPR transform
  	}
  })

  let lastAngle: number = -1 //used to track the last angle for mousemove and touchmove
  let move = false //tracks whether we should move the player on mousemove or touchmove
  function onMouseDown(e) {
    move = true //mark that we should move
    updatePlayer(e.clientX, e.clientY)
  }
  function onMouseMove(e) {
    if(move) { //if we should move
      updatePlayer(e.clientX, e.clientY)
    }
  }
  function onTouchStart(e) {
    e.preventDefault()
    move = true //mark that we should move
    updatePlayer(e.touches[0].clientX, e.touches[0].clientY)
  }
  function onTouchMove(e) {
    if(move) { //if we should move
      e.preventDefault()
      updatePlayer(e.touches[0].clientX, e.touches[0].clientY)
    }
  }
  function updatePlayer(clientX:number, clientY:number) {
    //get the coordinates of the event relative to the canvas
    const dimensions = canvas.getBoundingClientRect()
    const canvasX = clientX - dimensions.left
    const canvasY = clientY - dimensions.top
    const currentAngle = Math.atan2(width/2 - canvasX, height/2 - canvasY)

    //update the player's heading
    if(maintainPlayerPerspective) { //if we need to rotate with the player's perspective
      if(lastAngle === -1) { //if this is -1, we assume this is a mousedown or touchstart
        lastAngle = currentAngle //don't rotate on the mousedown or touchstart
      }
      player.incrementHeading((currentAngle - lastAngle) * DEG_PER_RAD) //increment the heading by the angular difference
    }
    else { //else simply use dx and dy to set the heading
      player.setHeadingFromDxDy(
        width/2 - canvasX,
        height/2 - canvasY,
        maintainPlayerPerspective,
      )
    }
    player.acceleration = 0.6 //give the player acceleration

    lastAngle = currentAngle //save the last angle
  }

  function onMouseUpTouchEnd(e) {
    lastAngle = -1
    move = false //mark that we should stop moving
    player.acceleration = 0 //remove the acceleration
  }
</script>

<main>
  <div bind:clientWidth={width}>
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
      height={height * DPR}
      oncontextmenu="return false;"
      on:mousedown={onMouseDown}
      on:mousemove={onMouseMove}
      on:mouseup={onMouseUpTouchEnd}
      on:mouseout={onMouseUpTouchEnd}
      on:touchstart={onTouchStart}
      on:touchmove={onTouchMove}
      on:touchend={onMouseUpTouchEnd}
      style={`width:${width}px;height:${height}px;`}
      width={width * DPR}
    />
  </div>
</main>

<style>
  .controlBar {
    padding: 1em;
    background: #222;
  }
</style>
