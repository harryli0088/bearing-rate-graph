<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import Tutorial from 'Components/Tutorial.svelte'
	import Sandbox from 'Components/Sandbox.svelte'
</script>

<main>
	<Tutorial/>
	<Sandbox/>
</main>

<style>
	main {
		margin: 0 auto;
		overflow-x: hidden;
		padding: 1em;
	}
</style>
