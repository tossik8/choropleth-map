const width = 960;
const height = 600;
const margins = {top: 40, right: 40, bottom: 40, left: 40};

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  .then(data => createMap(data));

function createMap(data){

    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const map = svg.append("g");

    const path = d3.geoPath();

    const counties = topojson.feature(data, data.objects.counties);

    map.selectAll(".states")
       .data(counties.features)
       .enter()
       .append("path")
       .attr("class", "county")
       .attr("d", path);
}

// d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
//     .then(data => data);
