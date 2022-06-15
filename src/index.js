import * as d3 from 'd3'
/**
 * Tutorial on D3 Basics and Circle Packing (Heirarchical Bubble Charts)
 * https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb
 */
try {
  // Creating a Bubble Chart by Packing Data
  const data_as_json = await d3.csv('https://raw.githubusercontent.com/johnhaldeman/talk-on-d3-basics/master/Summary_sommaire_2017_2026.csv')
  console.log('data_as_json', data_as_json)
  
  let root = { children: data_as_json.slice(1) }
  const flatNodeHeirarchy = d3.hierarchy(root).sum(d => d.Employment)
  console.log('flatNodeHeirarchy', flatNodeHeirarchy)

  const width = 930
  const height = 930
  const pack = d3.pack()
    .size([width, height])
    .padding(3)
  const packedData = pack(flatNodeHeirarchy)
  console.log('packedData', packedData)

  // Drawing Circles using Packed Data
  const svg = d3.select('svg')
      .style("width", "100%")
      .style("height", "auto")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");

  const leaf = svg.selectAll("g")
    .data(packedData.leaves())
    .enter().append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  const circle = leaf.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => "#bbccff");
} catch (e) {
  console.error(e)
}