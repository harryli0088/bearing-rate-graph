<script lang="ts">
	import { onDestroy } from 'svelte'
  import PhysicsObject from '../Classes/PhysicsObject.ts'
  import BearingRateGraph from 'Components/BearingRateGraph.svelte'
	import Polar from 'Components/Polar.svelte'
  import Row from 'Components/Row.svelte'
	import getBearing from '../utils/getBearing.ts'
	import { INTERVAL_TIME, MAX_HISTORY_LENGTH } from '../utils/consts.ts'


  let polarWidth:number = 500
  const PADDING = 30
	let actor: PhysicsObject = new PhysicsObject({
    maxHistoryLength: MAX_HISTORY_LENGTH,
    positionX: 0,
    positionY: (-500/2 + PADDING)*3/4,
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
	const interval = setInterval(run, INTERVAL_TIME)
	onDestroy(() => {
		clearInterval(interval)
	})

  let bearingRateGraphWidth:number
</script>

<main>
  <Row>
    <Polar {actor}/>

		<BearingRateGraph
			colors={["red"]}
			{intervalCount}
			intervalTime={INTERVAL_TIME}
			maxHistoryLength={MAX_HISTORY_LENGTH}
			otherActors={[actor]}
			width={bearingRateGraphWidth}
		/>
  </Row>
</main>

<style>
</style>
