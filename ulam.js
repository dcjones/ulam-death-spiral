


// count divisors
var div_count = function(n)
{
    var ds = [], i, k, d
    var max_div = Math.sqrt(n)
    for (i = 0; i < n; i += 1) { ds[i] = 0; }
    for (k = 2; k < max_div + 1; k += 1) {
        d = 2 * k
        while (d < n) {
            ds[d] += 1
            d += k
        }
    }

    return ds;
}


// point shorthand
var p = function(x, y)
{
    return {x: x, y: y};
}


// choose a color for a number with k divisors
var colork = function(k)
{
    var max_k = 30;
    if (k > max_k) {
        k = max_k;
    }

    c = 255 - Math.floor(255 * (k / max_k))

    return "rgb(" + c + "," + c + "," + c + ")";
}


// sequentially generate x,y coordinates in a spiral
// filling an m-by-m square
var spiral_coords = function(m)
{
    var deltas = [p(0, -1), p(-1, 0), p(0, 1), p(1, 0)];

    var j, ps = [], d = 0, r = 1, xy = p(m / 2, m / 2)

    var make_side = function()
    {
        for (j = 0; j < r; j += 1) {
            xy.x += deltas[d].x;
            xy.y += deltas[d].y;
            if (xy.x >= m || xy.y >= m) {
                return;
            }
            ps.push(p(xy.x, xy.y))
        }
        d = (d + 1) % 4
    }

    while (xy.x < m && xy.y < m) {
        make_side();
        make_side();
        r += 1
    }

    return ps;
}


// render the ulam spiral
var render = function()
{
    var canvas = document.getElementById("ulam_canvas");
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var n = 300;
    var sx = w / n, sy = h / n;

    var ds = div_count(n * n + 1);

    var ps = spiral_coords(n);
    var k;

    for (k = 0; k < ps.length; k += 1) {
        ctx.fillStyle = colork(ds[k + 1])
        ctx.fillRect(ps[k].x * sx, ps[k].y * sy, sx, sy)
    }
}

var n = 100;
render();




