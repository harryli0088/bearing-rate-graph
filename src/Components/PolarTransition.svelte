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

  let svg


  const animation = tweened(0, {
    duration: 2000,
    easing: cubicOut
  })

  const interval = setInterval(() => {
    animation.set($animation===1 ? 0 : 1)
  }, 3000)
  onDestroy(() => clearInterval(interval))

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

  $: getLineDataFromAngle = (angle, radius=halfWidth) => {
    const x2 = x2Scale(angle)
    const theta = thetaScale(angle) * degToRadFactor

    return {
      x1: x2 + radius * Math.sin(theta),
      y1: - radius * Math.cos(theta),
      x2, y2,
    }
  }


  const degToRadFactor = Math.PI/180

  const circleDegrees:number[] = []
  for(let i=180; i<360; ++i) {
    circleDegrees.push(i)
  }
  for(let i=0; i<180; ++i) {
    circleDegrees.push(i)
  }
  $: circlePathRadius = halfWidth * (12 + 3*$animation) / 16
  $: circlePath = circleDegrees.reduce(
    (d, degree) => {
      const { x1, y1 } = getLineDataFromAngle(degree, circlePathRadius)
      d += ` ${x1},${y1}`
      return d
    },
    "M"
  )

  const ticks:{angle:number,label:string, dy:number}[] = [
    {angle:180.1, label: "180", dy: 15},
    {angle:225,   label: "",    dy: 0},
    {angle:270,   label: "270", dy: -5},
    {angle:315,   label: "",    dy: 0},
    {angle:0,     label: "",    dy: 0},
    {angle:45,    label: "",    dy: 0},
    {angle:90,    label: "90",  dy: -5},
    {angle:135,   label: "",    dy: 0},
    {angle:179.999, label: "180", dy: 15},
  ]

  $: lineData = ticks.map(t => getLineDataFromAngle(t.angle))

  const ticksWithLabels = ticks.filter(t => t.label.length > 0)
  const tickEndDy = -5
  $: textData = ticksWithLabels.map(t => {
    const { x1, y1 } = getLineDataFromAngle(t.angle)

    return {
      attr: {
        x: x1,
        y: y1,
        dy: tickEndDy*$animation + (1 - $animation)*t.dy
      },
      text: t.label,
    }
  })

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
          <path d={circlePath}/>

          {#each lineData as line}
            <line {...line}/>
          {/each}

          <line x1={x2Scale(180)} y1={y2} x2={x2Scale(179.9)} {y2}/>

          <text x={0} y={-halfHeight} dy={-5}>0° (360°)</text>
          {#each textData as text}
            <text {...text.attr}>{text.text}</text>
          {/each}
        </g>
      </g>
    </svg>
    <div>{Math.round(100*$animation)}</div>
  </div>
</main>

<style>
  .grid line, .grid path {
    fill: none;
    stroke: gray;
    stroke-width: 1px;
  }
  .grid text {
    text-anchor: middle;
  }
</style>
