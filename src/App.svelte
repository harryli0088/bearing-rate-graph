<script lang="ts">
	import Router from 'svelte-spa-router'
	import Home from "Components/Home.svelte"

	const routes = {
    '/': Home,
		'*': Home,
	}
</script>

<Router {routes}/>
