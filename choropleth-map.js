const width = 960;
const height = 600;
const margins = {top: 40, right: 40, bottom: 40, left: 40};

const coordinates = d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json");
const info = d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json");

Promise.all([coordinates, info]).then(values => createMap(values));

function createMap(values){
  values[1].sort((a,b) => a.fips - b.fips);
    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const map = svg.append("g");

    const path = d3.geoPath();

    const counties = topojson.feature(values[0], values[0].objects.counties);

    map.selectAll(".county")
       .data(counties.features)
       .enter()
       .append("path")
       .attr("data-fips", d => d.id)
       .attr("data-education", d => values[1][binarySearch(values[1], d.id)].bachelorsOrHigher)
       .attr("class", d=> `county ${assignColor(values[1][binarySearch(values[1], d.id)].bachelorsOrHigher)}`)
       .attr("d", path);

    const states = topojson.feature(values[0], values[0].objects.states);
    map.selectAll(".state")
       .data(states.features)
       .enter()
       .append("path")
       .attr("class", "state")
       .attr("d", path);

    const xScale = d3.scaleLinear()
                     .domain([0.03, 0.66])
                     .range([width-margins.right*9, width - margins.right * 3]);

    const xAxis = d3.axisBottom(xScale).tickValues([0.03,0.12,0.21,0.30,0.39,0.48,0.57,0.66]).tickFormat(d3.format("~%")).tickSize(12);


    const legend = svg.append("g")
       .attr("id", "legend")
       .attr("transform", `translate(0, ${margins.top})`)
       .call(xAxis);

    generateLegend(legend);
    makeTooltip(values[1]);
}

function generateLegend(legend){
  const colours = ["ultra-light-green", "light-green", "green", "green-2", "darker-green", "darker-green-2", "dark-green"];
  for(let i = 0; i < colours.length; ++i){
    legend.append("rect")
       .attr("width", 33.15)
       .attr("height", 7)
       .attr("y", 0)
       .attr("x", width - margins.right * 8.9865+ i * 34.29)
       .attr("class", `colour ${colours[i]}`);
  }
}

function makeTooltip(data){
  const paths = document.getElementsByClassName("county");
  console.log(data);
  for(let path of paths){
    path.addEventListener("mouseover", () => {
      const rect = path.getBoundingClientRect();
      const index = binarySearch(data, parseInt(path.attributes.getNamedItem("data-fips").value));
      document.getElementById("info").textContent = data[index].area_name + ", " + data[index].state + ": " + path.attributes.getNamedItem("data-education").value + "%";
      document.getElementById("tooltip").style.top = rect.top - 30 + "px";
      document.getElementById("tooltip").style.left = rect.right + "px";
      document.getElementById("tooltip").setAttribute("data-education", path.attributes.getNamedItem("data-education").value);
      document.getElementById("tooltip").classList.remove("invisible");
      document.getElementById("tooltip").classList.add("visible");
    });
    path.addEventListener("mouseleave", () => {
      document.getElementById("tooltip").classList.remove("visible");
      document.getElementById("tooltip").classList.add("invisible");
    });
  }
}

function assignColor(x){
  if(x < 12) {
    return "ultra-light-green";
  }
  else if(x < 21){
    return "light-green";
  }
  else if(x < 30){
    return "green";
  }
  else if(x < 39){
    return "green-2";
  }
  else if(x < 48){
    return "darker-green";
  }
  else if(x < 57){
    return "darker-green-2";
  }
  else{
    return "dark-green";
  }
}

function binarySearch(data, id){
  let start = 0, end = data.length;
  let index;
  while(start <= end){
    index = Math.floor((start + end)/2);
    if(data[index].fips === id) return index;
    if(data[index].fips > id) end = index - 1;
    else start = index + 1;
  }
  return -1;
}
