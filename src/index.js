import * as d3 from 'd3'
import './index.css'

// Organize data
const reMap = function(oldValue) {
  var oldMin = 0,
    oldMax = -359,
    newMin = 0,
    newMax = (Math.PI * 2),
    newValue = (((oldValue - 90 - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
  return newValue;
}

const data = [
  [reMap(25), 1, 20, 'label 1'],
  [reMap(105), 0.8, 10, 'label 2'],
  [reMap(266), 1, 8, 'label 3'],
  [reMap(8), 0.2, 22, 'label 4'],
  [reMap(189), 1, 28, 'label 5'],
  [reMap(350), 0.6, 15, 'label 6'],
  [reMap(119), 0.4, 24, 'label 7'],
  [reMap(305), 0.8, 31, 'label 8']
];
const polarCircleBackground = [
  '#96C6F1',
  '#6FACE2',
  '#4196E1',
  '#2571B4',
  '#0E2F4C',
]
console.log('data', data);

// Draw the polar chart
const width = 600
const height = 600
const radius = Math.min(width, height) / 2 - 30

const r = d3.scaleLinear()
  .domain([0, 1])
  .range([0, radius])

// Actually draw the board
const svg = d3.select('body')
  .append('svg')
  // .call(zoom)
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

// Draw the circles in the polar chart
const gr = svg
  .append('g')
  .attr('class', 'r axis')
  .selectAll('g')
  .data(r.ticks(5).slice(1).reverse())
  .enter()
  .append('g')

gr.append('circle')
  .attr('r', r)
  .attr('fill', (d, i) => {
    return polarCircleBackground[i]
  });

const ga = svg.append('g')
  .attr('class', 'a axis')
  .selectAll('g')
  .data(d3.range(0, 360, 30)) // line density
  .enter().append('g')
  .attr('transform', function(d) {
    return 'rotate(' + -d + ')';
  });

ga.append('line')
  .attr('x2', radius);
// End of adding polar chart

// Outdated API d3 v3
// const color = d3.scale.category20();
const color = d3.schemeCategory10
// console.log(color)

// Turn radial elements to x, y lines
const line = d3.lineRadial()
  .radius(function(d) {
    console.log('line.radius', d)
    return r(d[1]);
  })
  .angle(function(d) {
    return -d[0] + Math.PI / 2;
  });

// Tooltip
const tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("a simple tooltip");
// console.log(tooltip)

// Add the circle based on data and its colors
svg.selectAll('point')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'point')
  .attr('transform', function(d) {
    //console.log(d);
    var coors = line([d]).slice(1).slice(0, -1); // removes 'M' and 'Z' from string
    console.log('coors', coors);
    return 'translate(' + coors + ')'
  })
  .attr('r', function(d) {
    return d[2];
  })
  .attr('fill',function(d,i){
    return color[i];
  }).on("click", function(d){
    console.log('clickEvent', d);
    //return tooltip.style("visibility", "visible");
  });

// adding labels
svg.selectAll('point')
  .data(data)
  .enter()
  .append("text")
  .attr('transform', function(d) {
    let coors = line([d]).slice(1).slice(0, -1)
      .split(',')
    coors[1] = parseFloat(coors[1]) - d[2] - 4
    return 'translate(' + coors + ')'
  })
  .attr('text-anchor', 'middle')
  .text(function(d) {         
    return d[3]; 
  }); 