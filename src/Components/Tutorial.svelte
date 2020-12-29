<script lang="ts">
	import { onDestroy } from 'svelte'
  import PhysicsObject from '../Classes/PhysicsObject.ts'
  import BearingRateGraph from 'Components/BearingRateGraph.svelte'
	import Polar from 'Components/Polar.svelte'
  import Row from 'Components/Row.svelte'
	import getBearing from '../utils/getBearing.ts'

  const MAX_HISTORY_LENGTH = 100

  let polarWidth:number = 500
  const PADDING = 30
	let actor: PhysicsObject = new PhysicsObject({
    maxHistoryLength: MAX_HISTORY_LENGTH,
    positionX: 0,
    positionY: (-Math.min(500, polarWidth)/2 + PADDING)*3/4,
  })

  let intervalCount = 0
  function run() {
    actor.addBearing(getBearing(
      0, 0, 0,
      actor.positionX,
      actor.positionY,
    ))
		actor = actor
    intervalCount++
	}
  const INTERVAL_TIME = 50
	const interval = setInterval(run, INTERVAL_TIME)
	onDestroy(() => {
		clearInterval(interval)
	})

  let bearingRateGraphWidth:number
</script>

<main>
  <Row>
    <div class="polarContainer" bind:clientWidth={polarWidth}>
      <Polar
        {actor}
        fullWidth={polarWidth}
      />
    </div>

  	<div bind:clientWidth={bearingRateGraphWidth}>
      <BearingRateGraph
        colors={["red"]}
        {intervalCount}
        intervalTime={INTERVAL_TIME}
        maxHistoryLength={MAX_HISTORY_LENGTH}
        otherActors={[actor]}
        width={bearingRateGraphWidth}
      />
    </div>
  </Row>
</main>

<style>
  .polarContainer {
    text-align: center;
  }
</style>
