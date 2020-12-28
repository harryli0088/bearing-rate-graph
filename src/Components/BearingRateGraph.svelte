<script lang="ts">
	import { scaleLinear } from "d3-scale"
	import PhysicsObject from '../Classes/PhysicsObject.ts';
	import getActorSize from '../utils/getActorSize.ts'

	export let maxHistoryLength:number = 50
	export let otherActors: PhysicsObject[] = []
	export let colors:string[]

  let height:number = 500
  let width:number = 1000
  const margin = {
    top: 30,
    left: 20,
    right: 20,
    bottom: 0,
  }

  $: effectiveHeight = height - margin.top - margin.bottom
  $: effectiveWidth = width - margin.left - margin.right
  $: bearingLabels = [
    {text: 180, x: 0},
    {text: 270, x: effectiveWidth/4},
    {text: 0, x: effectiveWidth/2},
    {text: 90, x: effectiveWidth*3/4},
    {text: 180, x: effectiveWidth},
  ]

	$: xScale = scaleLinear().domain(
		[0,180,180,360]
	).range(
		[0.5,1,0,0.5].map(d => d*effectiveWidth + margin.left)
	)

	$: yScale = scaleLinear().domain(
		[0, maxHistoryLength]
	).range(
		[margin.top, margin.top + effectiveHeight]
	)

	$: pathData = otherActors.map(actor => { //generate path strings for each other actor
		let d = "M"

		let lastBearing:number = 0
		actor.bearingHistories.forEach((b,bearingIndex) => { //for each bearing in this actor's history
			//we want to make sure the path skips over jumps at 180, but not 359 to 0
			const max = Math.max(b, lastBearing)
			const min = Math.min(b, lastBearing)
			if(
				max >= 180 //if the max bearing is above 180
				&& max < 200 //and was below 200 (to avoid skipping from 359 to 0)
				&& min < 180 //and the min bearing was below 180
				&& min > 160 //and was above 160 (to avoid skipping from 359 to 0)
			) {
				d += " M" //add an M to draw a discontinuous path
			}
			lastBearing = b //record the this bearing for the next iteration

			d += ` ${xScale(b)},${yScale(bearingIndex)}` //append the next path coordinates
		})

		return d //return the path string
	})
</script>

<main>
	<svg {width} height={height}>
    <g>
      {#each bearingLabels as label}
        <text
          dy={-15}
          text-anchor="middle"
          x={label.x + margin.left}
          y={margin.top}
        >
          {label.text}°
        </text>
      {/each}
    </g>

    <g>
      {#each bearingLabels as label}
        <line
					x1={label.x + margin.left}
					x2={label.x + margin.left}
					y1={margin.top}
					y2={effectiveHeight + margin.top}
				/>
      {/each}
    </g>

		<g>
      {#each otherActors as actor, i}
				{#if true}
					<path
						d={pathData[i]}
						stroke={colors[i]}
					/>
				{/if}
      {/each}
    </g>

		<g>
      {#each otherActors as actor, i}
        <circle
					cx={xScale(actor.bearingHistories[0])}
					cy={yScale(0)}
					r={getActorSize(actor.distanceFromPlayer)}
					stroke={colors[i]}
				/>
      {/each}
    </g>
  </svg>
</main>

<style>
  line {
    stroke: gray;
    stroke-width: 1px;
  }
	path {
    stroke-width: 2px;
		fill: none;
  }
	circle {
    stroke-width: 2px;
		fill: none;
  }
</style>