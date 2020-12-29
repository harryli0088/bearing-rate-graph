<script lang="ts">
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

          <line x1={0} y1={-halfHeight} x2={0} y2={0}/>
          <line x1={0} y1={0} x2={0} y2={halfHeight}/>
          <line x1={-halfWidth} y1={0} x2={0} y2={0}/>
          <line x1={0} y1={0} x2={halfWidth} y2={0}/>
          <line x1={-halfWidth*DIAG_CONSTANT} y1={-halfHeight*DIAG_CONSTANT} x2={0} y2={0}/>
          <line x1={0} y1={0} x2={halfWidth*DIAG_CONSTANT} y2={halfHeight*DIAG_CONSTANT}/>
          <line x1={halfWidth*DIAG_CONSTANT} y1={-halfHeight*DIAG_CONSTANT} x2={0} y2={0}/>
          <line x1={0} y1={0} x2={-halfWidth*DIAG_CONSTANT} y2={halfHeight*DIAG_CONSTANT}/>

          <text x={0} y={-halfHeight} dy={-5}>0° (360°)</text>
          <text x={halfWidth} y={0} dy={-5}>90°</text>
          <text x={0} y={halfHeight} dy={15}>180°</text>
          <text x={-halfWidth} y={0} dy={-5}>270°</text>
        </g>
      </g>
    </svg>
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
