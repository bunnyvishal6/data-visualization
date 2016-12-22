d3.select(window).on("resize", throttle);

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
        "padding": "5px 10px",
        "font-family": "sans-serif",
        "text-align": "left",
        "line-height": '22px',
        "border-radius": "5px",
        "color": "white"
    });

let zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", move);

let width = document.getElementById('container').offsetWidth - 60;
let height = width / 2;

let topo, projection, path, svg, g;

setup(width, height);

function setup(width, height) {
    projection = d3.geo.mercator()
        .translate([0, 0])
        .scale(width / 2 / Math.PI);

    path = d3.geo.path()
        .projection(projection);

    svg = d3.select("#container").append("svg")
        .attrs({
            width: width,
            height: height
        })
        .append("g")
        .attrs({
            "transform": "translate(" + width / 2 + "," + height / 2 + ")",
        })
        .call(zoom);

    g = svg.append("g");

}

d3.json("data.json", function (error, world) {
    //get countires.
    let countries = topojson.feature(world, world.objects.countries).features;
    topo = countries;
    //draw the world map.
    draw(topo);

});

//draw map function
function draw(topo) {
    //insert path 
    let globe = g.selectAll("path")
        .data(topo)
        .enter().append("path")
        .attrs({
            d: path,
        })
        .styles({
            fill: '#A0A0A0' /*'#6AAD8C'*/,
            cursor: '-webkit-grab'
        })


    d3.json('meteorites.json', (err, data) => {
        if (err) { return console.log(err) }
        //sort the meteorites in decending order of their masses.
        data.features.sort((a, b) => { return b.properties.mass - a.properties.mass });
        //get the masses of meteorites;
        let masses = [], years = [];
        data.features.map(m => {
            masses.push(+m.properties.mass);
            let year = new Date(m.properties.year);
            year = year.getFullYear();
            if (years.indexOf(year) < 0) {
                years.push(year);
            }
        });
        //sort years in ascending order.
        years.sort((a, b) => a - b);
        //define colors
        let colors = [
            'rgba(239, 87, 87, 0.6)', 'rgba(53, 242, 235, 0.6)', 'rgba(242, 235, 53, 0.6)',
            'rgba(17, 160, 237, 0.6)', 'rgba(239, 66, 202, 0.6)', 'rgba(153, 81, 224, 0.6)', 'rgba(108, 218, 108, 0.6)'
        ]
        //get an arbitrary number to divide the masses for visially looking good.
        let num = d3.max(masses) / 150;
        //a function to determine size of meteorite point.
        function potNum(m) {
            m = +m.properties.mass;
            if (m <= num) {
                return 2;
            } else if (m <= num * 2) {
                return 10;
            } else if (m <= num * 5) {
                return 20;
            } else if (m <= num * 10) {
                return 30;
            } else if (m <= num * 100) {
                return 40;
            } else {
                return 50;
            }
        }

        //get color function
        function getColor(y){
            y = new Date(y);
            y = y.getFullYear();
            let index = years.indexOf(y);
            if(index <= 40){
                return colors[0];
            }
            let indexNum =  40;
            for(let i=1; i<=colors.length; i++){
                if(index > indexNum && index <= indexNum + 40){
                    return colors[i];
                } else {
                    indexNum += 40;
                }
            }
        }

        //point the meteorites on map.
        g.selectAll('circle')
            .data(data.features)
            .enter()
            .append('circle')
            .attr({
                cx: d => {
                    if (d.geometry && d.geometry.coordinates) {
                        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
                    } else {
                        return -1
                    }
                },
                cy: d => {
                    if (d.geometry && d.geometry.coordinates) {
                        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
                    } else {
                        return -1
                    }
                },
                r: d => potNum(d)
            })
            .styles({
                fill: d => { d.pointColor = getColor(d.properties.year); return d.pointColor },
                stroke: 'white',
                'stroke-width': '1px',
                cursor: 'pointer'
            }).on("mouseover", function (d) {
                d3.select(this).style('fill', 'rgba(0, 0, 0, 0.6)');
                let tooltipHtml = '<p>';
                //get keys into an array
                let props = Object.keys(d.properties);
                //sort the properties array.
                props.sort();
                //loop through props array and if the prop in properties obj has a value the push it to tooltip html.
                for (let i = 0; i < props.length; i++) {
                    if (d.properties[props[i]]) {
                        if (props[i] == 'year') {
                            let date = new Date(d.properties[props[i]]);
                            tooltipHtml += '<b>' + props[i] + '</b>' + ': ' + date.getFullYear() + '<br />'
                        } else {
                            tooltipHtml += '<b>' + props[i] + '</b>' + ': ' + d.properties[props[i]] + '<br />'
                        }
                    }
                    if (i == props.length - 1) {
                        tooltipHtml += '</p>'
                        tooltip.html(tooltipHtml);
                        return tooltip.style("visibility", "visible");
                    }
                }

            })
            .on("mousemove", function () { return tooltip.style("top", (event.pageY - 50) + "px").style("left", (event.pageX + 30) + "px"); })
            .on("mouseout", function (d) {
                d3.select(this).style('fill', d.pointColor);
                tooltip.html('');
                return tooltip.style("visibility", "hidden");
            });
    });

    //ofsets plus width/height of transform, plus 20 px of padding, plus 20 extra for tooltip offset off mouse
    var offsetL = document.getElementById('container').offsetLeft + (width / 2) + 40;
    var offsetT = document.getElementById('container').offsetTop + (height / 2) + 20;


}

function redraw() {
    width = document.getElementById('container').offsetWidth - 60;
    height = width / 2;
    d3.select('svg').remove();
    setup(width, height);
    draw(topo);
}

function move() {

    let t = d3.event.translate;
    let s = d3.event.scale;
    let h = height / 3;

    t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
    t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

}

let throttleTimer;
function throttle() {
    window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function () {
        redraw();
    }, 200);
}
