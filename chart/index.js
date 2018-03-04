const svg = d3.select('body')
  .append('svg')
  .attr('width', 960)
  .attr('height', 500);

console.log(svg);

svg.append("text")
  .text("Edit the code below to change me!")
  .attr("y", 200)
  .attr("x", 120)
  .attr("font-size", 36)
  .attr("font-family", "monospace")
