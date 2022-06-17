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
  [reMap(25), 0, 30, 'Spongebob', 'https://cdn.shopify.com/s/files/1/0150/0643/3380/products/Viacom_Spongebob_U111SC119_U111SC87_00040_RO_600x.jpg?v=1563223167'],
  [reMap(25), 0.2, 30, 'Patrick', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/330px-Patrick_Star.svg.png'],
  [reMap(105), 0.4, 30, 'Sandy', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Sandy_Cheeks.svg/330px-Sandy_Cheeks.svg.png'],
  [reMap(266), 1, 30, 'Squidward', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Squidward_Tentacles.svg/330px-Squidward_Tentacles.svg.png'],
  [reMap(8), 0.4, 30, 'Mr. Krab', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Mr._Krabs.svg/330px-Mr._Krabs.svg.png'],
  [reMap(189), 0.6, 30, 'Flying Dutchman', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/330px-Patrick_Star.svg.png'],
  [reMap(350), 0.6, 30, 'Plankton', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Plankton_and_Karen.svg/330px-Plankton_and_Karen.svg.png'],
  [reMap(119), 0.4, 30, 'Gary The Snail', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/330px-Patrick_Star.svg.png'],
  [reMap(305), 1, 30, 'Mrs. Puff', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Mrs._Puff.svg/1024px-Mrs._Puff.svg.png']
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
const width = 1024
const height = 1024
const radius = Math.min(width, height) / 2 - 30

const r = d3.scaleLinear()
  .domain([0, 1])
  .range([0, radius])

// Turn radial elements to x, y lines
const line = d3.lineRadial()
  .radius(function(d) {
    return r(d[1]);
  })
  .angle(function(d) {
    return -d[0] + Math.PI / 2;
  });

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
  })
  // Add label for each circle percentage
  .select(function () { return this.parentNode })
  .append('text')
  .attr('transform', (d => {
    var coors = line([[reMap(180), d]]).slice(1).slice(0, -1).split(',')
    console.log('coors', coors)
    coors[1] -= 8
    return `translate(${coors})`
  }))
  .attr('text-anchor', 'middle')
  .attr('fill', '#ffffff')
  .text((d) => {
    const num = (1 - d) * 100
    return `${Math.round(num)}% - ${num + 20}%`
  })

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

// Tooltip
const tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("a simple tooltip");
// console.log(tooltip)

// Add the circle based on data and its colors
svg.selectAll('avatar')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'avatar')
  .attr('transform', function(d) {
    // console.log('avatar d', d);
    var coors = line([d]).slice(1).slice(0, -1).split(','); // removes 'M' and 'Z' from string
    // console.log('coors', coors);
    coors[0] -= 50
    coors[1] -= 50
    return 'translate(' + coors + ')'
  })
  .append('defs')
  // Idk, https://stackoverflow.com/questions/11496734/add-a-background-image-png-to-a-svg-circle-shape
  .append('pattern')
  .attr('id', (d, i) => 'avatar-image-' + i)
  .attr('x', 0)
  .attr('y', 0)
  .attr('patternUnits', 'userSpaceOnUse')
  .attr('width', '100')
  .attr('height', '100')
  // Add the image
  .append('image')
  .attr('x', '0')
  .attr('y', '0')
  .attr('width', '100')
  .attr('height', '100')
  .attr('xlink:href', (d, i) => d[4])
  .select(function () { return this.parentNode.parentNode.parentNode })
  .append('circle')
  .attr('cx', '50')
  .attr('cy', '50')
  .attr('r', function(d) {
    return d[2];
  })
  .attr('fill',function(d,i){
    return 'url(#avatar-image-' + i + ')'
  })
  .on("click", function(d){
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
  .attr('fill', d => d[1] > 0.6 ? '#0E2F4C' : '#ffffff')
  .text(function(d) {         
    return d[3]; 
  });