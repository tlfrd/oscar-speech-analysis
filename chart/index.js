const jsonUrl = '../results/allSpeeches_thankThanks.json';

const initWidth = 800;
const initHeight = 418;

const margin = {top: 75, right: 75, bottom: 75, left: 75};

const width = initWidth - margin.left - margin.right;
const height = initHeight - margin.top - margin.bottom;

const svg = d3.select('body')
  .append('svg')
  .attr('width', initWidth)
  .attr('height', initHeight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(jsonUrl, (err, data) => {
  drawGraph(data, 'totalCount', 'mean', []);
});

function drawGraph(data, attr, avg, drawLines) {
  const nested = d3.nest()
    .key(d => d.year)
    .entries(data);

  nested.forEach(year => {
    const mean = d3.mean(year.values, d => d[attr]);
    const median = d3.median(year.values, d => d[attr]);
    year.mean = mean;
    year.median = median;
  });

  const x = d3.scaleLinear()
    .domain(d3.extent(nested, d => d.key))
    .range([0, width])

  const y = d3.scaleLinear()
    .domain(d3.extent(nested, d => d[avg]))
    .range([height, 0])
    .nice();

  const xAxis = d3.axisBottom(x)
    .tickFormat(d3.format('d'));

  const yAxis = d3.axisLeft(y);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  const line = d3.line()
    .x(d => x(d.key))
    .y(d => y(d[avg]));

  const yearLines = svg.append('g')
    .attr('class', 'yearLines')
    .selectAll('line')
    .data(drawLines)
    .enter()
    .append('line')
    .attr('x1', d => x(d))
    .attr('x2', d => x(d))
    .attr('y1', 0)
    .attr('y2', height);

  const lineChart = svg.append('g')
    .append('path')
    .attr('class', 'lineChart')
    .datum(nested)
    .attr('d', line);

}
