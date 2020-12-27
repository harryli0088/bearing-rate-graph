<script lang="ts">
  import PhysicsObject from '../Classes/PhysicsObject.ts';

  export let colors: string[]
  export let otherActors:PhysicsObject[]
  export let player:PhysicsObject

  let height:number = 500
  let width:number = 1000
</script>

<main>
  <svg {width} {height} viewBox={`${player.positionX-width/2} ${player.positionY-height/2} ${width} ${height}`}>
    {#each otherActors as actor, i}
      <line
      stroke={colors[i]}
        x1={player.positionX}
        x2={actor.positionX}
        y1={player.positionY}
        y2={actor.positionY}
      />
    {/each}

    {#each otherActors as actor, i}
      <circle
        cx={actor.positionX}
        cy={actor.positionY}
        r={1000 / actor.distanceFromPlayer}
        stroke={colors[i]}
      />
    {/each}

    <circle id="player" cx={player.positionX} cy={player.positionY} r={8}/>
  </svg>
</main>

<style>
  svg {
    background-color: lightblue;
  }

  line {
    stroke-width: 2px;
  }

  circle {
    fill: none;
    stroke-width: 2px;
  }

  #player {
    stroke: black;
    fill: black;
  }
</style>
