const width = 960;
const height = 600;

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  .then(data => createMap(data));

function createMap(data){
    console.log(data);
    d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    d3.geoEqualEarth();
    console.log(topojson.feature(data, data.objects.counties));

}

// d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
//     .then(data => data);
