<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import PhysicsObject from '../Classes/PhysicsObject.ts'

  let fullWidth:number = 500
  $: centeredWidth = Math.min(500, fullWidth)
  $: fullHeight = centeredWidth
  const DIAG_CONSTANT = Math.sqrt(2)/2
  const PADDING = 30
  $: width = centeredWidth - 2*PADDING
  $: height = fullHeight - 2*PADDING
  $: halfWidth = width/2
  $: halfHeight = height/2

	export let actor: PhysicsObject = new PhysicsObject({
    positionX: 0,
    positionY: -10,
  })

  //initialize a dummy player at the origin for the actor to reference
  const dummyPlayer = new PhysicsObject({})

  let svg
  function onMouseMove(e) {
    updateActorPosition(e.clientX, e.clientY)
  }
  function onTouchMove(e) {
    e.preventDefault()
    updateActorPosition(e.touches[0].clientX, e.touches[0].clientY)
  }

  const dispatch = createEventDispatcher()
  function updateActorPosition(clientX:number, clientY:number) {
    //update the actor position relative to the svg
    const dimensions = svg.getBoundingClientRect()
    actor.positionX = clientX - dimensions.left - fullWidth/2
    actor.positionY = clientY - dimensions.top - fullHeight/2

    actor.updateDistanceFromPlayer(dummyPlayer)

    dispatch('update') //tell the parent the player position was updated
  }

</script>

<main>
  <div class="polarContainer" bind:clientWidth={fullWidth}>
    <svg
      bind:this={svg}
      width={fullWidth}
      height={fullHeight}
    >
      <g transform={`translate(${fullWidth/2},${fullHeight/2})`}>
        <circle
          cx={0}
          cy={0}
          r={Math.min(fullHeight, fullWidth)/2}
          fill="#1B2631"
        />

        <g class="grid">
          <circle cx={0} cy={0} r={halfWidth*3/4}/>

          <line x1={0} y1={-halfHeight} x2={0} y2={halfHeight}/>
          <line x1={-halfWidth} y1={0} x2={halfWidth} y2={0}/>
          <line x1={-halfWidth*DIAG_CONSTANT} y1={-halfHeight*DIAG_CONSTANT} x2={halfWidth*DIAG_CONSTANT} y2={halfHeight*DIAG_CONSTANT}/>
          <line x1={halfWidth*DIAG_CONSTANT} y1={-halfHeight*DIAG_CONSTANT} x2={-halfWidth*DIAG_CONSTANT} y2={halfHeight*DIAG_CONSTANT}/>

          <text x={0} y={-halfHeight} dy={-5}>0° (360°)</text>
          <text x={halfWidth} y={0} dy={-5}>90°</text>
          <text x={0} y={halfHeight} dy={15}>180°</text>
          <text x={-halfWidth} y={0} dy={-5}>270°</text>
        </g>

        <g>
          <line
            opacity={actor.getOpacity()}
            stroke="red"
            stroke-width="2px"
            x1={0}
            y1={0}
            x2={actor.positionX}
            y2={actor.positionY}
          />

          <circle
            cx={actor.positionX}
            cy={actor.positionY}
            fill="none"
            opacity={actor.getOpacity()}
            r={actor.getSize()}
            stroke="red"
            stroke-width="2px"
          />
        </g>

        <circle
          cx={0}
          cy={0}
          r={Math.min(fullHeight, fullWidth)/2}
          on:mousemove={onMouseMove}
          on:touchmove={onTouchMove}
          fill="transparent"
        />
      </g>
    </svg>
  </div>
</main>

<style>
  .polarContainer {
    text-align: center;
  }

  .grid line, .grid circle {
    fill: none;
    stroke: gray;
    stroke-width: 1px;
  }
  .grid text {
    text-anchor: middle;
  }
</style>
