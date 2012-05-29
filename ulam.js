

// coordinates for each square
var ps = [];

// divisors
var ds = []


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
    var max_k = 20;
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

    ps.push(p(xy.x, xy.y))


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


// Render the ulam spiral of size n-by-n.
// If d is defined, highlight all squares that are multiples of d.
var render = function(n)
{
    var canvas = document.getElementById("ulam_base");
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var sx = w / n, sy = h / n;

    ds = div_count(n * n + 1);
    ps = spiral_coords(n);

    var k;

    ctx.strokeStyle = "#fff"

    for (k = 0; k < ps.length; k += 1) {
        ctx.fillStyle = colork(ds[k + 1]);
        ctx.fillRect(ps[k].x * sx, ps[k].y * sy, sx, sy);
        ctx.strokeRect(ps[k].x * sx, ps[k].y * sy, sx, sy);
    }

    var dest = document.getElementById("ulam");
    var dest_ctx = dest.getContext("2d");
    dest_ctx.drawImage(canvas, 0, 0);
}


// highlight squares that are multiples of d
var highlight = function(d)
{
    var canvas = document.getElementById("ulam");
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var sx = w / n, sy = h / n;

    if (typeof d == "undefined") {
        var src = document.getElementById("ulam_base");
        ctx.drawImage(src, 0, 0);
        return;
    }

    ctx.fillStyle = "#f5a";
    ctx.strokeStyle = "#fff"

    var k;
    for (k = 0; k < ps.length; k += 1) {
        if (k + 1 == d) {
            ctx.strokeStyle = "#000"
            ctx.fillRect(ps[k].x * sx, ps[k].y * sy, sx, sy);
            ctx.strokeRect(ps[k].x * sx, ps[k].y * sy, sx, sy);
            ctx.fillStyle = "#f5a";
            ctx.strokeStyle = "#fff"
        }
        else {
            if ((k + 1) % d == 0) {
                ctx.fillRect(ps[k].x * sx, ps[k].y * sy, sx, sy);
                // ctx.strokeRect(ps[k].x * sx, ps[k].y * sy, sx, sy);
            }
        }
    }
}


// map x, y coordinates to a spiral number using binary search
var xy_to_k = function(x, y)
{
    var canvas = document.getElementById("ulam");
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var sx = w / n, sy = h / n;

    var k = 0;
    while (k < ps.length &&
           !(ps[k].x * sx <= x && x <= (ps[k].x + 1) * sx &&
           ps[k].y * sy <= y && y <= (ps[k].y + 1) *sy)) {

        k += 1;
    }

    return k + 1;
}




var n = 100;
var d = 1;
render(n);

// setInterval(
//     function() {
//         if (d < n * n) {
//             highlight(undefined);
//             highlight(d);
//             d += 1;
//         }
//     }, 100);

document.getElementById("more").addEventListener("click",
    function(event) {
        n += 30;
        render(n);
        event.preventDefault()
    })


document.getElementById("less").addEventListener("click",
    function(event) {
        if (n > 30) {
            n -= 30;
            render(n);
        }
        event.preventDefault()
    })


document.getElementById("ulam").addEventListener("mousemove",
    function(event) {
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft
        var scrolly = document.documentElement.scrollTop || document.body.scrollTop

        var body      = document.getElementsByTagName("body")[0]
        var container = document.getElementById("primary");
        var canvas    = document.getElementById("ulam");

        var offx = canvas.offsetLeft + container.offsetLeft + body.offsetLeft - scrollx;
        var offy = canvas.offsetTop  + container.offsetTop  + body.offsetTop  - scrolly;

        var x = event.clientX - offx
        var y = event.clientY - offy

        var w = canvas.width;
        var h = canvas.height;

        if (x < 0 || x > w || y < 0 || y > h) {
            highlight(undefined)
        }
        else {
            if (typeof d != "undefined") {
                highlight(undefined);
            }

            d = xy_to_k(x, y);
            highlight(d);
        }
    })


document.getElementById("ulam").addEventListener("mouseout",
    function(event) {
        highlight(undefined);
    })



