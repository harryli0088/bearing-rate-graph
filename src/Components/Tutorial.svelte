<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
  import PhysicsObject from '../Classes/PhysicsObject.ts'
	import BearingRateGraph from 'Components/BearingRateGraph.svelte'
	import getBearing from '../utils/getBearing.ts'

  const MAX_HISTORY_LENGTH = 50

  let fullWidth:number = 500
  let fullHeight:number = 500
  const DIAG_CONSTANT = Math.sqrt(2)/2
  const PADDING = 30
  $: width = fullWidth - 2*PADDING
  $: height = fullHeight - 2*PADDING
  $: halfWidth = width/2
  $: halfHeight = height/2

	let actor: PhysicsObject = new PhysicsObject({
    maxHistoryLength: MAX_HISTORY_LENGTH,
    positionX: 0,
    positionY: (-fullHeight/2 + PADDING)*3/4,
  })


  function run() {
    actor.addBearing(getBearing(
      0, 0, 0,
      actor.positionX,
      actor.positionY,
    ))
		actor = actor
	}
	const interval = setInterval(run, 50)

  let svg
  function onMouseMove(e) {
    updateActorPosition(e.clientX, e.clientY)
  }
  function onTouchMove(e) {
    e.preventDefault()
    updateActorPosition(e.touches[0].clientX, e.touches[0].clientY)
  }
  function updateActorPosition(clientX:number, clientY:number) {
    const dimensions = svg.getBoundingClientRect()
    actor.positionX = clientX - dimensions.left - fullWidth/2
    actor.positionY = clientY - dimensions.top - fullHeight/2
  }


	onMount(() => {
	})

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<main>
  <svg bind:this={svg} width={fullWidth} height={fullHeight} on:mousemove={onMouseMove} on:touchmove={onTouchMove}>
    <g transform={`translate(${fullWidth/2},${fullHeight/2})`}>
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
        <line x1={0} y1={0} x2={actor.positionX} y2={actor.positionY} stroke="red" stroke-width="2px"/>
        <circle cx={actor.positionX} cy={actor.positionY} r={10} fill="none" stroke="red" stroke-width="2px"/>
      </g>
    </g>
  </svg>

	<BearingRateGraph
		colors={["red"]}
		maxHistoryLength={MAX_HISTORY_LENGTH}
		otherActors={[actor]}
	/>
</main>

<style>
  svg {
    border: 1px solid black;
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
