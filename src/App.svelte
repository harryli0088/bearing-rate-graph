<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import PhysicsObject from './Classes/PhysicsObject';
	import BearingChartGraph from 'Components/BearingChartGraph.svelte';
	import getBearing from './utils/getBearing';
	export let name: string;

	const MAX_HISTORY_LENGTH = 50

	let player = new PhysicsObject({
		maxHistoryLength: MAX_HISTORY_LENGTH,
		positionX: 0,
		positionY: 0,
	})
	let otherActors: PhysicsObject[] = [
		new PhysicsObject({
			maxHistoryLength: MAX_HISTORY_LENGTH,
			positionX: 100,
			positionY: 100,
		})
	]

	let b = 0

	function run() {
		player.update()
    otherActors.forEach(actor => {
      actor.update()
      actor.addBearing(getBearing(
				player.positionX,
				player.positionY,
				actor.positionX,
				actor.positionY,
			))
    })
		otherActors = otherActors
	}
	const interval = setInterval(run, 500);

	onDestroy(() => clearInterval(interval));
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<BearingChartGraph
		bearingHistories={otherActors.map(a => a.bearingHistories)}
		maxHistoryLength={MAX_HISTORY_LENGTH}
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
