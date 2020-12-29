<script lang="ts">
	import { onDestroy } from 'svelte'
	import PhysicsObject from '../Classes/PhysicsObject.ts'
	import BearingRateGraph from 'Components/BearingRateGraph.svelte'
	import Ocean from 'Components/Ocean.svelte'
	import getBearing from '../utils/getBearing.ts'

	const COLORS = ["#EC7063", "#F39C12", "#F1C40F", "#2ECC71", "#3498DB", "#AF7AC5", "#7D3C98"]
	const MAX_HISTORY_LENGTH = 50

	let player = new PhysicsObject({
		maxHistoryLength: MAX_HISTORY_LENGTH,
		positionX: 0,
		positionY: 0,
	})
	let otherActors: PhysicsObject[] = [
		new PhysicsObject({
			acceleration: 0.5,
			maxHistoryLength: MAX_HISTORY_LENGTH,
			positionX: 100,
			positionY: 100,
		})
	]

	function onKeyDown(e) {
		switch(e.keyCode) {
			case 38: //up arrow
			case 97: //w
        e.preventDefault()
				player.acceleration = 1
				break
			case 39: //right arrow
			case 68: //d
        e.preventDefault()
				player.angularAcceleration = 0.5
				break
			case 40: //down arrow
			case 83: //s
        e.preventDefault()
				player.acceleration = 0
				break
			case 37: //left arrow
			case 65: //a
        e.preventDefault()
				player.angularAcceleration = -0.5
				break
			default:
		}
	}

	function onKeyUp(e) {
		switch(e.keyCode) {
			case 38: //up arrow
			case 97: //w
				player.acceleration = 0
				break
			case 39: //right arrow
			case 68: //d
				player.angularAcceleration = 0
				break
			// case 40: //down arrow
			// case 83: //s
			case 37: //left arrow
			case 65: //a
				player.angularAcceleration = 0
				break
			default:
		}
	}

  let intervalCount = 0
	function run() {
		player.update()
    otherActors.forEach(actor => {
      actor.update(player)
      actor.addBearing(getBearing(
				player.heading,
				player.positionX,
				player.positionY,
				actor.positionX,
				actor.positionY,
			))
    })
		otherActors = otherActors
    intervalCount++
	}

  let interval = -1
  const INTERVAL_TIME = 50
  function onFocus() {
    interval = setInterval(run, INTERVAL_TIME)
  }
  function onBlur() {
    clearInterval(interval)
  }

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<main>
	<div tabindex={1} on:focus={onFocus} on:blur={onBlur} on:keydown={onKeyDown} on:keyup={onKeyUp}>
    <BearingRateGraph
      colors={COLORS}
      {intervalCount}
      intervalTime={INTERVAL_TIME}
      maxHistoryLength={MAX_HISTORY_LENGTH}
      {otherActors}
    />
    <Ocean
      colors={COLORS}
      {otherActors}
      {player}
    />
  </div>
</main>

<style>

</style>
