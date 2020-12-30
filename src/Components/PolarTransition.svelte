<script lang="ts">
  import { onDestroy } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  export let fullWidth:number = 500
  $: centeredWidth = Math.min(500, fullWidth)
  $: fullHeight = centeredWidth
  const DIAG_CONSTANT = Math.sqrt(2)/2
  const PADDING = 30
  $: width = centeredWidth - 2*PADDING
  $: height = fullHeight - 2*PADDING
  $: halfWidth = width/2
  $: halfHeight = height/2


  const value = tweened(0, {
    duration: 2000,
    easing: cubicOut
  })

  let showPolar:boolean = true
  const interval = setInterval(() => {
    showPolar = !showPolar

    value.set(showPolar ? 0 : 1)
  }, 2000)
  onDestroy(() => clearInterval(interval))


  let svg

  type LineDataType = {x1: number, y1: number, x2: number, y2: number}
  type TransitionType = {start: LineDataType, end: LineDataType}
  $: lineDataStructure = [
    { //0
      start: {x1: 0, y1: -halfHeight, x2: 0, y2: 0},
      end: {x1: 0, y1: 0, x2: 0, y2: 0},
    },
    { //90
      start: {x1: 0, y1: 0, x2: halfWidth, y2: 0},
      end: {x1: halfWidth/2, y1: halfHeight, x2: halfWidth/2, y2: -halfHeight},
    },
    { //180 #1
      start: {x1: 0, y1: 0, x2: 0, y2: halfHeight},
      end: {x1: halfWidth, y1: halfHeight, x2: halfWidth, y2: -halfHeight},
    },
    { //180 #2
      start: {x1: 0, y1: 0, x2: 0, y2: halfHeight},
      end: {x1: 0, y1: 0, x2: 0, y2: 0},
    },
    { //270
      start: {x1: -halfWidth, y1: 0, x2: 0, y2: 0},
      end: {x1: -halfWidth/2, y1: -halfHeight, x2: -halfWidth/2, y2: halfHeight},
    },
    { //
      start: {x1: -halfWidth*DIAG_CONSTANT, y1: -halfHeight*DIAG_CONSTANT, x2: 0, y2: 0},
      end: {x1: 0, y1: 0, x2: 0, y2: 0},
    },
    { //
      start: {x1: 0, y1: 0, x2: halfWidth*DIAG_CONSTANT, y2: halfHeight*DIAG_CONSTANT},
      end: {x1: 0, y1: 0, x2: 0, y2: 0},
    },
    { //
      start: {x1: halfWidth*DIAG_CONSTANT, y1: -halfHeight*DIAG_CONSTANT, x2: 0, y2: 0},
      end: {x1: 0, y1: 0, x2: 0, y2: 0},
    },
    { //
      start: {x1: 0, y1: 0, x2: -halfWidth*DIAG_CONSTANT, y2: halfHeight*DIAG_CONSTANT},
      end: {x1: 0, y1: 0, x2: 0, y2: 0},
    },
  ]

  $: lineData = lineDataStructure.map(l => {
    const data = {}
    for(const attr in l.end) {
      data[attr] = l.start[attr] + $value*(l.end[attr] - l.start[attr])
    }

    return data
  })



  $: proxyValue = $value * 2
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

          <text x={0} y={-halfHeight} dy={-5}>0° (360°)</text>
          <text x={halfWidth} y={0} dy={-5}>90°</text>
          <text x={0} y={halfHeight} dy={15}>180°</text>
          <text x={-halfWidth} y={0} dy={-5}>270°</text>
        </g>
      </g>
    </svg>
    <div>{Math.round(100*$value)}, {Math.round(100*proxyValue)}</div>
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
