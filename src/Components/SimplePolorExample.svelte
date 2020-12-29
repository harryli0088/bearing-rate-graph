<script lang="ts">
  import PhysicsObject from '../Classes/PhysicsObject.ts'
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

  let currentBearing = 0
  function updateActorPositionCallback() {
    currentBearing = getBearing(
      0, 0, 0,
      actor.positionX,
      actor.positionY,
    )
  }
</script>

<main>
  <Row>
    <div class="polarContainer" bind:clientWidth={polarWidth}>
      <Polar
        {actor}
        fullWidth={polarWidth}
        {updateActorPositionCallback}
      />
    </div>

  	<div>
      <p>Bearing of Target: <b>{parseInt(currentBearing)}°</b></p>
    </div>
  </Row>
</main>

<style>
  .polarContainer {
    text-align: center;
  }
</style>
