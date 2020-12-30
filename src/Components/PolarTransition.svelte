<script lang="ts">
  import { onDestroy } from 'svelte'
  import { beforeUpdate, afterUpdate } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { scaleLinear } from "d3-scale"

  export let fullWidth:number = 500
  $: centeredWidth = Math.min(500, fullWidth)
  $: fullHeight = centeredWidth
  const DIAG_CONSTANT = Math.sqrt(2)/2
  const PADDING = 30
  $: width = centeredWidth - 2*PADDING
  $: height = fullHeight - 2*PADDING
  $: halfWidth = width/2
  $: halfHeight = height/2


  const animation = tweened(0, {
    duration: 2000,
    easing: cubicOut
  })

  const interval = setInterval(() => {
    animation.set($animation===1 ? 0 : 1)
  }, 2000)
  onDestroy(() => clearInterval(interval))


  let svg

  type LineDataType = {x1: number, y1: number, x2: number, y2: number}
  const ticks:{angle:number,label:string}[] = [
    {angle:180.1, label: "180"},
    {angle:225, label: ""},
    {angle:270, label: "270"},
    {angle:315, label: ""},
    {angle:0, label: "0"},
    {angle:45, label: ""},
    {angle:90, label: "90"},
    {angle:135, label: ""},
    {angle:179.9, label: "180"},
  ]

  $: x2Scale = scaleLinear().domain(
    [0, 180, 180, 360]
  ).range(
    [0, $animation*halfWidth, -$animation*halfWidth, 0]
  )
  $: y2 = $animation * halfHeight
  $: thetaScale = scaleLinear().domain(
    [0, 180, 180, 360]
  ).range(
    [0, (1 - $animation)*180, ($animation - 1)*180, 0]
  )

  const degToRadFactor = Math.PI/180
  $: y1Offset = - halfWidth * $animation
  $: lineData = ticks.map(t => {
    const x2 = x2Scale(t.angle)
    const theta = thetaScale(t.angle) * degToRadFactor

    if($animation === 1) {
      console.log(
        t.angle,
        thetaScale(t.angle),
        Math.cos(theta)
      )
    }

    return {
      x1: x2 + halfWidth * Math.sin(theta),
      y1: y2 + y1Offset - halfWidth * Math.cos(theta),
      x2, y2,
    }
  })


  $: proxyValue = $animation * 2
</script>

<main>
  <div bind:clientWidth={fullWidth}>
    <svg
      bind:this={svg}
      width={fullWidth}
      height={fullHeight}
    >
      <g transform={`translate(${fullWidth/2},${fullHeight/2})`}>
        <g class="grid">
          <circle cx={0} cy={0} r={halfWidth*3/4}/>

          {#each lineData as line}
            <line {...line}/>
          {/each}

          <line x1={x2Scale(180)} y1={y2} x2={x2Scale(179.9)} {y2}/>

          <text x={0} y={-halfHeight} dy={-5}>0° (360°)</text>
          <text x={halfWidth} y={0} dy={-5}>90°</text>
          <text x={0} y={halfHeight} dy={15}>180°</text>
          <text x={-halfWidth} y={0} dy={-5}>270°</text>
        </g>
      </g>
    </svg>
    <div>{Math.round(100*$animation)}, {Math.round(100*proxyValue)}</div>
  </div>
</main>

<style>
  .grid line, .grid circle {
    fill: none;
    stroke: gray;
    stroke-width: 1px;
  }
  .grid text {
    text-anchor: middle;
  }
</style>
