
let width = 1000, height = 800;

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

let svg = d3.select('#frame')
    .append('svg')
    .attrs({
        width: width,
        height: height
    });


d3.json('data.json', (err, data) => {
    let nodes = data.nodes;
    let links = data.links;
    let link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attrs({
            class: 'link',
        });


    let node = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attrs({
            class: 'node'
        })
        .on("mouseover", function (d) {
            tooltip.html(`<p>${d.country}</p>`);
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () { return tooltip.style("top", (event.pageY - 100) + "px").style("left", (event.pageX - 50) + "px"); })
        .on("mouseout", function (d) {
            tooltip.text('');
            return tooltip.style("visibility", "hidden");
        });

        node.append('image')    
            .attrs({
                'xlink:href': d => 'https://www.ip2location.com/images/flags_16/'+ d.code +'_16.png',
                class: d=> 'flag flag-' + d.code,
                x: d => -10,
                y: d => -5,
                height: 11,
                width: 16,
            })
            .styles({
                //'background-color': 'black'
            })

    let force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .on('tick', tick)
        .gravity(0.1)
        .charge(-100)
        .linkDistance(50)
        .start();


    function tick() {
        node.attrs({
            transform: d=> 'translate(' + d.x + ',' + d.y + ')'
        })
            .call(force.drag);
        link.attrs({
            x1: d => d.source.x,
            y1: d => d.source.y,
            x2: d => d.target.x,
            y2: d => d.target.y
        });
    }
});