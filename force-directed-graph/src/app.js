let width = 640,
    heihgt = 480,
    nodes = [
        { x: width / 3, y: heihgt / 2 },
        { x: 2 * width / 3, y: heihgt / 2 }
    ],
    links = [
        { source: 0, target: 1 }
    ];

let svg = d3.select("#frame")
            .append('svg')
            .attrs({
                width: width,
                heihgt: heihgt
            });

