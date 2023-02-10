const width = 960;
const height = 600;
const margins = {top: 40, right: 40, bottom: 40, left: 40};

const coordinates = d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json");
const info = d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json");

Promise.all([coordinates, info]).then(values => createMap(values));

function createMap(values){
    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const map = svg.append("g");

    const path = d3.geoPath();

    const counties = topojson.feature(values[0], values[0].objects.counties);

    console.log(values[1])

    map.selectAll(".county")
       .data(counties.features)
       .enter()
       .append("path")
       .attr("class", "county")
       .attr("d", path)
       .attr("data-fips", d => d.id)
       .attr("data-education", d => binarySearch(values[1], d.id));
}

function binarySearch(data, id){
  let start = 0, end = data.length - 1;
  while(start < end){
    let index = Math.floor((start + end)/2);
    if(data[index].fips === id) return data[index].bachelorsOrHigher;
    if(data[index].fips > id) end = index - 1;
    else start = index + 1;
  }
  return -1;
}
