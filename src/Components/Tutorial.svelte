<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
  import PhysicsObject from '../Classes/PhysicsObject.ts'
	import BearingRateGraph from 'Components/BearingRateGraph.svelte'
	import getBearing from '../utils/getBearing.ts'

  const MAX_HISTORY_LENGTH = 50

	let actor: PhysicsObject = new PhysicsObject({
    maxHistoryLength: MAX_HISTORY_LENGTH,
    positionX: 0,
    positionY: -1,
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
  function mousemove(e) {
    const dimensions = svg.getBoundingClientRect()
    const x = e.clientX - dimensions.left - halfWidth
    const y = e.clientY - dimensions.top - halfHeight

    const hypot = Math.hypot(x, y)
    const unitX = x / hypot
    const unitY = y / hypot

    actor.positionX = unitX
    actor.positionY = unitY
  }


	onMount(() => {
	})

	onDestroy(() => {
		clearInterval(interval)
	})

  let fullWidth:number = 500
  let fullHeight:number = 500
  const DIAG_CONSTANT = Math.sqrt(2)/2
  const PADDING = 30
  $: width = fullWidth - 2*PADDING
  $: height = fullHeight - 2*PADDING
  $: halfWidth = width/2
  $: halfHeight = height/2
</script>

<main>
  <svg bind:this={svg} width={fullWidth} height={fullHeight} on:mousemove={mousemove}>
    <g transform={`translate(${fullWidth/2},${fullHeight/2})`}>
      <g class="grid">
        <circle cx={0} cy={0} r={halfWidth*3/4}/>
        <line x1={0} y1={-halfHeight} x2={0} y2={halfHeight}/>
        <line x1={-halfWidth} y1={0} x2={halfWidth} y2={0}/>
        <line x1={-halfWidth*DIAG_CONSTANT} y1={-halfHeight*DIAG_CONSTANT} x2={halfWidth*DIAG_CONSTANT} y2={halfHeight*DIAG_CONSTANT}/>
        <line x1={halfWidth*DIAG_CONSTANT} y1={-halfHeight*DIAG_CONSTANT} x2={-halfWidth*DIAG_CONSTANT} y2={halfHeight*DIAG_CONSTANT}/>
      </g>

      <g>
        <line x1={0} y1={0} x2={actor.positionX * halfWidth} y2={actor.positionY * halfHeight} stroke="red" stroke-width="2px"/>
        <circle cx={actor.positionX * halfWidth} cy={actor.positionY * halfHeight} r={10} fill="none" stroke="red" stroke-width="2px"/>
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
</style>
