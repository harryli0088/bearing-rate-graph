<script lang="ts">
</script>

<main>
	<div class="row">
    <slot></slot>
  </div>
</main>

<style>
	.row {
		display: flex;
	}
  .row > :global(div) {
    width: 50%;
  }

  @media only screen and (max-width: 1000px) {
    .row {
  		flex-direction: column;
  	}
    .row > :global(div) {
      width: 100%;
    }
  }
</style>
