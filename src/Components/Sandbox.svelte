<script lang="ts">
	import { onDestroy } from 'svelte'
	import PhysicsObject from '../Classes/PhysicsObject.ts'
	import BearingRateGraph from 'Components/BearingRateGraph.svelte'
  import Ocean from 'Components/Ocean.svelte'
	import Row from 'Components/Row.svelte'
	import getBearing from '../utils/getBearing.ts'
	import { DEG_PER_RAD, INTERVAL_TIME, MAX_HISTORY_LENGTH } from '../utils/consts.ts'

	const COLORS = ["#EC7063", "#2ECC71", "#3498DB", "#AF7AC5", "#7D3C98"] //"#F39C12", "#F1C40F"

	let player = new PhysicsObject({
		maxHistoryLength: MAX_HISTORY_LENGTH,
		positionX: 0,
		positionY: 0,
	})
	let otherActors: PhysicsObject[] = [
		new PhysicsObject({
			acceleration: 0.25,
			label: "Following",
			maxHistoryLength: MAX_HISTORY_LENGTH,
			positionX: -200,
			positionY: -75,
		}),
		new PhysicsObject({
			maxHistoryLength: MAX_HISTORY_LENGTH,
			label: "Stationary",
			positionX: 100,
			positionY: -150,
		}),
		new PhysicsObject({
			acceleration: 0.2,
			heading: 90,
			label: "Circle",
			maxHistoryLength: MAX_HISTORY_LENGTH,
			positionX: 0,
			positionY: 102,
		}),
	]

	const otherActorsIntervalBehaviors = [
		(actor:PhysicsObject, intervalCount:number) => {
			const distance = Math.hypot(actor.positionX - player.positionX, actor.positionY - player.positionY)
			actor.acceleration = distance > 50 ? 0.1 : 0

			actor.setHeadingFromDxDy(actor.positionX - player.positionX, actor.positionY - player.positionY)
		},
		() => {},
		(actor:PhysicsObject, intervalCount:number) => {
			actor.incrementHeading(-1)
		},
	]

	function onKeyDown(e) {
		switch(e.keyCode) {
			case 38: //up arrow
			case 87: //w
        e.preventDefault()
				player.acceleration = 0.6
				break
			case 39: //right arrow
			case 68: //d
        e.preventDefault()
				player.angularAcceleration = 0.4
				break
			case 40: //down arrow
			case 83: //s
        e.preventDefault()
				player.acceleration = 0
				break
			case 37: //left arrow
			case 65: //a
        e.preventDefault()
				player.angularAcceleration = -0.4
				break
			default:
		}
	}

	function onKeyUp(e) {
		switch(e.keyCode) {
			case 38: //up arrow
			case 87: //w
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
    otherActors.forEach((actor, actorIndex) => {
      actor.update()
			actor.updateDistanceFromPlayer(player)
      actor.addBearing(getBearing(
				player.heading,
				player.positionX,
				player.positionY,
				actor.positionX,
				actor.positionY,
			))

			otherActorsIntervalBehaviors[actorIndex](actor, intervalCount)
    })

		otherActors = otherActors
    intervalCount++
	}

	let running = false
  let interval = -1
  function onFocus() {
    if(running === false) { //if we are not running yet
			interval = setInterval(run, INTERVAL_TIME)
			running = true
		}
  }
  function onBlur(e) {
		//if the user triggered an event inside the container
		//ie the canvas control bar
		if(e.currentTarget.contains(e.relatedTarget)) {
			e.currentTarget.focus() //refocus on the container
    }
		else {
			//else stop running
			clearInterval(interval)
			running = false
		}
  }

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<main>
  <Row>
    <div
			id="oceanContainer"
      on:blur={onBlur}
      on:focus={onFocus}
      on:keydown={onKeyDown}
      on:keyup={onKeyUp}
      tabindex={1}
    >
      <Ocean
        colors={COLORS}
        {otherActors}
        {player}
      />

			{#if running === false}
				<div id="oceanModal">
					<div>Click on the ocean to start playing!</div>
				</div>
			{/if}
    </div>

		<BearingRateGraph
			colors={COLORS}
			{intervalCount}
			intervalTime={INTERVAL_TIME}
			maxHistoryLength={MAX_HISTORY_LENGTH}
			{otherActors}
		/>
  </Row>
</main>

<style>
	#oceanContainer {
		position: relative;
		outline: none;
	}

	#oceanModal {
		position: absolute;
		background: rgba(0,0,0,0.5);
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1em;
	}
</style>
