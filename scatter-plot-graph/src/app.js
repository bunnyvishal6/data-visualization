let margin = { top: 20, right: 100, bottom: 50, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


//tooltip
let tooltip = d3.select("body")
    .append("div")
    .styles({
        "position": "absolute",
        "z-index": "10",
        "visibility": "hidden",
        "background-color": "rgba(140, 55, 225, 0.8)",
        //"height": "100px",
        "max-width": "180px",
        //"line-height": '6px',
        "text-align": "center",
        "padding": "0px 8px",
        "border-radius": "2px",
        "color": "white"
    });


//ranges for x and y
let x = d3.scaleLinear()
    .range([0, width]);
let y = d3.scaleLinear()
    .range([height, 0]);
//to convert minutes into a date for the scaleTime
let formatTime = d3.timeFormat("%H:%M"),
    formatMinutes = d => { return formatTime(new Date(2016, 0, 1, 0, d)); };

//append svg to frame 
let svg = d3.select('#frame')
    .append('svg')
    .attrs({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom,
    })
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//get data
d3.json('data.json', (err, data) => {
    if (err) { throw err; }

    let values = data.map(d => d.Seconds);

    //getting min value
    let fastest = d3.min(values);

    //makes elements of values array the difference between their min value and the element 
    values = values.map(d => d - fastest);

    //defining domains for x and y
    x.domain([d3.max(values) + 30, 0]); //added 30 seconds to max value to make some distance between y axis and minimum value.
    y.domain([d3.max(data, d => d.Place) + 1, 1]); //added 1 to min value for maintaining some space between plotted value and x axis.

    //append circles to svg
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attrs({
            cx: d => x(d.Seconds - fastest),
            cy: d => y(d.Place),
            r: 5
        })
        .styles({
            cursor: 'pointer',
            fill: d => d.Doping ? 'red' : '#03B85B'
        })
        .on("mouseover", function (d) {
            d3.select(this).style('fill', 'rgb(140, 55, 225)');
            tooltip.html(`<div><p>${d.Name} : ${d.Nationality} \n Year: ${d.Year}, Time: ${d.Time}</p></div><div><p>${d.Doping}</p></div>`);
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () { return tooltip.style("top", (event.pageY - 60) + "px").style("left", (event.pageX + 20) + "px"); })
        .on("mouseout", function (d) {
            d3.select(this).styles({ fill: d => d.Doping ? 'red' : '#03B85B' });
            tooltip.text('');
            return tooltip.style("visibility", "hidden");
        });
    //Insert names into svg for each scatter point.
    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.Name)
        .attrs({
            x: d => x(d.Seconds - fastest),
            y: d => y(d.Place),
            "transform": "translate(10,+4)"
        })
        .styles({
            fill: d => d.Doping ? 'red' : '#3FBF7F',
            'font-size': '12px',
            'font-family': 'sans-serif'
        });

    //append x axis to svg
    svg.append('g')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(d3.axisBottom(x)
            .ticks(5)
            .tickFormat(formatMinutes)
        )
        .styles({
            'font-size': '15px',
            'font-family': 'sans-serif'
        });

    //adding y axis to svg
    svg.append('g')
        .call(d3.axisLeft(y))
        .styles({
            'font-size': '15px',
            'font-family': 'sans-serif'
        });

    //append color details for the graph
    //red circle
    svg.append('circle')
        .attrs({
            cx: width + margin.left + margin.right - 260,
            cy: height + margin.top + margin.bottom - 300,
            r: 5
        })
        .styles({
            fill: 'red'
        });
    //text for red color
    svg.append('text')
        .attrs({
            x: width + margin.left + margin.right - 250,
            y: height + margin.top + margin.bottom - 295
        })
        .style('font-size', '14px')
        .text('Riders with Doping aligations');
    //green circle
    svg.append('circle')
        .attrs({
            cx: width + margin.left + margin.right - 260,
            cy: height + margin.top + margin.bottom - 280,
            r: 5
        })
        .styles({
            fill: '#03B85B'
        });
     //text for green circle
    svg.append('text')
        .attrs({
            x: width + margin.left + margin.right - 250,
            y: height + margin.top + margin.bottom - 275
        })
        .style('font-size', '14px')
        .text('No Doping aligations');

    //append text below x axis
    svg.append('text')
        .attrs({
            x: 300,
            y: height + margin.top + margin.bottom - 30,
        })
        .styles({
            'text-anchor': 'middle',
            'font-size': '20px'
        })
        .text('Minutes behind fastest time');
    //append text beside y axis
    svg.append('text')
        .attrs({
            x: -100,
            y: -30,
            transform: 'rotate(-90)'
        })
        .styles({
            'text-anchor': 'middle',
            'font-size': '20px'
        })
        .text('Ranking');
});
