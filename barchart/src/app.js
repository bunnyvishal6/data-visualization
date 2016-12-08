//dimensions for svg
let margin = { top: 20, right: 20, bottom: 30, left: 60 },
    width = 980 - margin.left - margin.right,
    months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    height = 500 - margin.top - margin.bottom;

//tooltip
let tooltip = d3.select("body")
    .append("div")
    .styles({
        "position": "absolute",
        "z-index": "10",
        "visibility": "hidden",
        "background-color": "rgba(228, 82, 82, 0.8)",
        "height": "60px",
        "width": "150px",
        "padding-left": "8px",
        "border-radius": "5px",
        "color": "white"
    });

function returnTime(date) {
    date = date.split('-');
    return months[+date[1]] + ', ' + date[0]
}

function currency(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//ranges for x and y
let x = d3.scaleBand()
    .range([0, width])
//.padding(0.1);
let y = d3.scaleLinear()
    .range([height, 0]);

//append svg into frame then append a group element then move group to top left margin.
let svg = d3.select('#frame')
    .append('svg')
    .attrs({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    })
    .append('g')
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// get data
d3.json('data.json', (err, response) => {
    if (err) { throw err; }
    let data = response.data;

    //Insert caption
    d3.select("#caption").html(response.description);

    //define doamins for x and y  
    x.domain(data.map(d => { d = d[0].split('-')[0]; return d; }));
    y.domain([0, d3.max(data, d => d[1])]);

    //append rect into svg
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attrs({
            x: (d, i) => i * width / data.length,
            y: d => y(d[1]),
            width: width / data.length,
            height: d => height - y(d[1]),
        })
        .styles({
            fill: '#33C17A',
            cursor: 'pointer'
        })
        .on("mouseover", function(d) {
            d3.select(this).style('fill', 'red');
            //tooltip.text('$' + currency(d[1]) + 'Billion.' + returnTime(d[0]));
            tooltip.html(
                '<h3 class="currency">' + '$' + currency(d[1]) + ' &nbsp;Billion' + '</h3><p class="date">' + returnTime(d[0]) + '</p>'

            );
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() { return tooltip.style("top", (event.pageY - 60) + "px").style("left", (event.pageX + 10) + "px"); })
        .on("mouseout", function() {
            d3.select(this).style('fill', '#33C17A');
            tooltip.text('');
            return tooltip.style("visibility", "hidden");
        });

    let array = [];
    for (let i = 0; i < data.length; i++) {
        let d = data[i][0].split('-')[0];
        if (d % 5 == 0) {
            array.push(d)
        }
    }

    //append x axis
    svg.append('g')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(d3.axisBottom(x)
            .tickValues(array)
        )
        .selectAll('text')
        .styles({
            fill: 'orange',
            'font-size': '15px',
            'font-family': 'sans-serif'
        });

    // add the y axis
    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .styles({
            fill: 'orange',
            'font-size': '15px',
            'font-family': 'sans-serif'
        });

    svg.append('text')
        .attrs({
            x: -120,
            y: 30,
            transform: 'rotate(-90)'
        })
        .styles({
            fill: '#7C15E4',
            'text-anchor': 'middle',
            'font-size': '20px'
        })
        .text('Gross Domestic Product, USA');
});