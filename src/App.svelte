<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import PhysicsObject from './Classes/PhysicsObject'
	import BearingChartGraph from 'Components/BearingChartGraph.svelte'
	import Ocean from 'Components/Ocean.svelte'
	import getBearing from './utils/getBearing'
	export let name: string

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
				player.acceleration = 1
				break
			case 39: //right arrow
			case 68: //d
				player.angularAcceleration = 0.5
				break
			case 40: //down arrow
			case 83: //s
				player.acceleration = 0
				break
			case 37: //left arrow
			case 65: //a
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
	}
	const interval = setInterval(run, 50)


	onMount(() => {
		window.addEventListener("keydown", onKeyDown)
		window.addEventListener("keyup", onKeyUp)
	})

	onDestroy(() => {
		clearInterval(interval)
		window.removeEventListener("keydown", onKeyDown)
		window.removeEventListener("keyup", onKeyUp)
	})
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<BearingChartGraph
		colors={COLORS}
		maxHistoryLength={MAX_HISTORY_LENGTH}
		{otherActors}
	/>
	<Ocean
		colors={COLORS}
		{otherActors}
		{player}
	/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
