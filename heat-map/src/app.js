//Dimensions
let margin = { top: 20, right: 30, bottom: 120, left: 80 },
    height = 600 - margin.top - margin.bottom,
    width = 1200 - margin.left - margin.right;

//tooltip
let tooltip = d3.select("body")
    .append("div")
    .styles({
        "position": "absolute",
        "z-index": "10",
        "visibility": "hidden",
        "background-color": "rgba(0, 0, 0, 0.7)",
        "max-width": "180px",
        //"line-height": '6px',
        "padding": "0px 4px",
        "font-family": "sans-serif",
        "text-align": "center",
        "border-radius": "5px",
        "color": "white"
    });


//range for x scale
let x = d3.scaleBand()
    .range([0, width]);

//range for y scale
let y = d3.scaleBand()
    .range([0, height]);

//append svg into frame
let svg = d3.select('#frame')
    .append('svg')
    .attrs({
        height: height + margin.top + margin.bottom,
        width: width + margin.left + margin.right,
    })
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//defining months
let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// colors
let colors = d3.schemeCategory20.reverse();


d3.json('data.json', (err, response) => {
    if (err) { throw err; }

    //get required data into a variable called data
    let data = response.monthlyVariance;
    let variances = data.map(d => d.variance);
    let colorScale = d3.scaleQuantile()
        .range(colors)
        .domain([response.baseTemperature + d3.min(variances), response.baseTemperature + d3.max(variances)]);

    //get all the years of data into an array
    let years = data.map(d => d.year),
        monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    //Inset domain for xscale
    x.domain(years);
    //Insert domain for y scale
    y.domain(monthNames);

    //Insert data into svg
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attrs({
            x: d => x(d.year),
            y: d => (d.month - 1) * height / 12,
            height: d => height / 12,
            width: d => x.bandwidth()
        })
        .styles({
            fill: d => colorScale(response.baseTemperature + d.variance),
            cursor: 'pointer'
        })
        .on("mouseover", function(d) {
            d3.select(this).style('fill', 'white');
            tooltip.html(`<p><span style="font-size: 18px"><b>${d.year} - ${monthNames[d.month - 1]}</b> </span> <br> <span style="font-size: 16px"><b>${(response.baseTemperature + d.variance).toFixed(3)} ℃</b></span><br><span style="font-size:14px">${d.variance} ℃</span></p>`);
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() { return tooltip.style("top", (event.pageY - 120) + "px").style("left", (event.pageX - 50) + "px"); })
        .on("mouseout", function(d) {
            d3.select(this).styles({ fill: d => colorScale(response.baseTemperature + d.variance) });
            tooltip.text('');
            return tooltip.style("visibility", "hidden");
        });

    //an array for tick values on x-axis
    let array = [], count = 0;
    while (count < years.length) {
        array.push(years[count]);
        count += 147;
    }

    //append axis to svg
    svg.append('g')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(d3.axisBottom(x)
            .tickValues(array)
        )
        .styles({
            'font-size': '12px',
            'font-family': 'sans-serif'
        });

    //append text below x axis
    svg.append('text')
        .attrs({
            x: 500,
            y: height + margin.top + margin.bottom - 90,
        })
        .styles({
            'text-anchor': 'middle',
            'font-size': '20px'
        })
        .text('Years');

    //adding y axis to svg
    svg.append('g')
        .call(d3.axisLeft(y))
        .styles({
            'font-size': '15px',
            'font-family': 'sans-serif'
        });
    //append text beside y axis
    svg.append('text')
        .attrs({
            x: -200,
            y: -60,
            transform: 'rotate(-90)'
        })
        .styles({
            'text-anchor': 'middle',
            'font-size': '20px'
        })
        .text('Months');
    
    //remove a color from colors as the color scale generated 19 quantiles only
    colors.splice(-1,1);

    //add details about color scale bottom 
    svg.append('g')
        .selectAll('rect')
        .data(colors)
        .enter()
        .append('rect')
        .attrs({
            x: (c,i) => 300 + i * 40,
            y: height + margin.top + margin.bottom - 60,
            width: 40,
            height: 20
        })
        .styles({
            fill: c => c
        });
    //get quantiles
    let quantiles = colorScale.quantiles();

    //insert quantiles
    svg.append('g')
        .selectAll('text')
        .data(quantiles)
        .enter()
        .append('text')
        .attrs({
            x: (q,i) => 300 + i * 40,
            y: height + margin.top + margin.bottom - 20,
            width: 40,
            height: 20,
            transform: 'translate(+4, -1)'
        })
        .text(q => q.toFixed(2))
        .styles({
            fill: (q, i) => colors[i]
        })
});