const jsonUrl = '../results/allSpeeches_thankThanks.json';
const jsonUrl2 = '../results/allSpeeches_wordCount.json';

const initWidth = 800;
const initHeight = 418;

const margin = {top: 75, right: 40, bottom: 75, left: 10};

const width = initWidth - margin.left - margin.right;
const height = initHeight - margin.top - margin.bottom;

const svg = d3.select('body')
  .append('svg')
  .attr('width', initWidth)
  .attr('height', initHeight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const config = {
  title: "I'd like to thank...",
  subtitle: "Mean occurrences per speech of 'thanks' or 'thank', by year",
  source: 'Academy Awards Acceptance Speech Database'
};

const config2 = {
  title: "Oscar speeches are getting longer",
  subtitle: "Median word count of speeches, by year",
  source: 'Academy Awards Acceptance Speech Database'
};

// d3.json(jsonUrl, (err, data) => {
//   drawGraph(data, 'totalCount', 'mean', [], config);
// });

d3.json(jsonUrl2, (err, data) => {
  drawGraph(data, 'speechLength', 'median', [], config2);
});

function drawGraph(data, attr, avg, drawLines, chartConfig) {
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
    .domain([0, d3.max(nested, d => d[avg])])
    .range([height, 0])
    .nice();

  const xAxis = d3.axisBottom(x)
    .tickFormat(d3.format('d'));

  const yAxis = d3.axisRight(y)
    .ticks(5)
    .tickSize(-width);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${width},0)`)
    .call(yAxis)
    .selectAll('text')
    .attr('x', 10)

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

  svg.append('text')
    .attr('class', 'title')
    .attr('y', -margin.top * 0.7)
    .text(chartConfig.title);

  svg.append('text')
    .attr('class', 'subtitle')
    .attr('y', -margin.top * 0.35)
    .text(chartConfig.subtitle);

  svg.append('text')
    .attr('class', 'source')
    .attr('y', height + margin.bottom * 0.7)
    .text(`Source: ${chartConfig.source}`);

  svg.append('text')
    .attr('class', 'source')
    .attr('y', height + margin.bottom * 0.9)
    .text('@caletilford');

}
