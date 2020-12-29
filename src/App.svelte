<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import Tutorial from 'Components/Tutorial.svelte'
	import Sandbox from 'Components/Sandbox.svelte'
</script>

<main>
	<h1>Bearing Rate Graph</h1>



	<Tutorial/>
	<section>
		<h2>Sandbox</h2>
		<Sandbox/>
	</section>

	<section id="video">
		<h2>Smarter Every Day's Video</h2>

		<div id="limitWidth">
			<div id="videoContainer">
				<iframe width="560" height="315" src="https://www.youtube.com/embed/AqqaYs7LjlM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			</div>
		</div>

		<br/><br/>
	</section>

	<footer>
		<p>This site was inspired by Smarter Every Day's video about sonar (linked above)</p>
		<p>Built using <a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer">Svelte</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">Typescript</a></p>
	</footer>
</main>

<style>
	main {
		margin: 0 auto;
		overflow-x: hidden;
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
	iframe, object, embed {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	footer {
		background-color: #222;
		border-top: 1px solid black;
		margin-left: -1em;
		margin-right: -1em;
		margin-bottom: -1em;
		padding: 1em;
	}
</style>
