<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import Tutorial from 'Components/Tutorial.svelte'
	import Sandbox from 'Components/Sandbox.svelte'
	import SimplePolorExample from 'Components/SimplePolorExample.svelte'
	import PolarTransition from 'Components/PolarTransition.svelte'
</script>

<main>
	<header>
		<div>
			<h1>Bearing Rate Graphs</h1>
			<p>How submariners visualize the world around them</p>
		</div>
	</header>

	<section></section>

	<section>
		<p>Submarines can use <a href="https://en.wikipedia.org/wiki/Sonar" target="_blank" rel="noopener noreferrer">sonar</a> to locate the relative angular positions of nearby vessels, called <b>bearings</b>. We can represent the front of the submarine as being 0°, then move 360° clockwise around the ship to complete a full circle. So 90° is right, 180° is behind, and 270° is left.</p>

		<SimplePolorExample/>
	</section>

	<section>
		<p>What if we wanted to visualize how a target moves relative to us <b>over time</b>? We can "unwrap" the polar coordinate graph into a rectangle, then add a vertical time axis. This visualization, called a <b>bearing rate graph</b>, represents the bearings of targets as they move around us over time.</p>

		<PolarTransition/>
	</section>

	<section>
		<p>In the example below, you can change the bearing of the target and see how the bearing rate graph changes!</p>

		<Tutorial/>
	</section>

	<section>
		<h2>Sandbox</h2>
		<p>In this sandbox, there are a few targets: one following you, one moving in a circle, and one stationary. You can move around with arrow keys or WASD. See if you can intepret the bearing rate graph based on your movements!</p>

		<Sandbox/>

		<p>Notice that when you stay still, the red and green lines in the bearing rate chart straighten out. This is because the bearings of those targets are relatively constant. If you were operating a real submarine, a straight line on your bearing rate chart could indicate something stationary or someone following you!</p>
	</section>

	<section id="video">
		<h2>Smarter Every Day's Video</h2>

		<div id="limitWidth">
			<div id="videoContainer">
				<iframe title="video" width="560" height="315" src="https://www.youtube.com/embed/AqqaYs7LjlM?start=477" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			</div>
		</div>
	</section>

	<section>
		<h2>Encoding more variables</h2>
		<p>It's difficult to determine, based on SED's unclassified video, the exact implementation of the bearing rate graphs used on the submarines. I built my BRGs based off his examples, and also encoded the distance of the target to scale inversely with the circle size and opacity.</p>
		<p>Other variables about the target(s) that could potentially be encoded into BRGs include:</p>
		<ul>
			<li>Relative Depth</li>
			<li>Classification based on the sound or loudness</li>
			<li>Change in distance (ie moving away vs coming towards)</li>
		</ul>
	</section>

	<footer>
		<p>This site was inspired by Smarter Every Day's video about sonar</p>
		<p>Built using <a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer">Svelte</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">Typescript</a></p>
		<p>Github Repo: <a href="https://github.com/harryli0088/bearing-rate-graph" target="_blank" rel="noopener noreferrer">https://github.com/harryli0088/bearing-rate-graph</a></p>
		<p><b>Disclaimer:</b> I am not an expert on bearing rate graphs or submarine operations. This website's purpose is to interactively explore the concept of a bearing rate graph and may differ from real-world usage. You are welcome to give me feedback by opening an issue in the <a href="https://github.com/harryli0088/bearing-rate-graph" target="_blank" rel="noopener noreferrer">repo</a>!</p>
	</footer>
</main>

<style>
	main {
		margin: 0 auto;
		overflow-x: hidden;
	}

	header {
		height: 50vh;
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
		background-color: black;
		padding: 1em;
	}

	header p {
		font-style: italic;
	}

	section {
		padding: 1em;
	}

	#video {
    text-align: center;
  }
	#limitWidth {
		margin-left: auto;
		margin-right: auto;
		max-width: 700px;
	}
	#videoContainer {
		position: relative;
		padding-bottom: 56.25%;
		padding-top: 30px;
		height: 0;
		overflow: hidden;
	}
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	footer {
		background-color: #222;
		border-top: 1px solid black;
		padding: 1em;
	}
</style>
