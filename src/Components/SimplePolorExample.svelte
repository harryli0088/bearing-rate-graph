<script lang="ts">
  import PhysicsObject from '../Classes/PhysicsObject.ts'
	import Polar from 'Components/Polar.svelte'
  import Row from 'Components/Row.svelte'
	import getBearing from '../utils/getBearing.ts'

  const MAX_HISTORY_LENGTH = 100

  const PADDING = 30
	let actor: PhysicsObject = new PhysicsObject({
    maxHistoryLength: MAX_HISTORY_LENGTH,
    positionX: 0,
    positionY: (-500/2 + PADDING)*3/4,
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
    <Polar
      {actor}
      {updateActorPositionCallback}
    />

  	<div class="showBearing">
      <div>
        <div class="label">Bearing of Target: </div>
        <br/><br/>
        <div class="bearingValue"><b>{parseInt(currentBearing)}°</b></div>
      </div>
    </div>
  </Row>
</main>

<style>
  .showBearing {
    display:flex;
    align-items: center;
    justify-content:center;
    text-align: center;
  }

  .label {
    font-size: 1.5em;
  }

  .bearingValue {
    font-size: 5em;
  }
</style>
