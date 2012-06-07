###
    Ulam Death Spiral
    Daniel C. Jones <dcjones@cs.washington.edu>
###


# Point shorthand
p = (x, y) -> {x: x, y: y}


# Compute a divisors array of length n.
div_count = (n) ->
    max_div = Math.floor Math.sqrt n
    ds = new Uint32Array(n)
    ds[k] = 0 for k in [0..n]
    for k in [2..max_div+1]
        for d in [2*k..n] by k
            ds[d] += 1
    return ds


# Sequentially generate cartesian coordinates in a spiral,
# filling an m-by-m square.
spiral_coords = (m) ->
    deltas = [p(0, -1), p(-1, 0), p(0, 1), p(1, 0)]
    d  = 0
    r  = 1

    i = 0
    psx = new Uint32Array(m * m)
    psy = new Uint32Array(m * m)

    ps_push = (pt) ->
        psx[i] = pt.x
        psy[i] = pt.y
        i += 1

    xy = p(m / 2, m / 2)
    ps_push xy

    make_side = ->
        delta = deltas[d]
        for j in [0..r-1]
            if i >= m * m
                break
            xy.x += delta.x
            xy.y += delta.y
            ps_push xy
        d = (d + 1) % 4

    while i < m * m
        make_side()
        make_side()
        r += 1

    return [psx, psy]


# Choose a color for a number with k divisors
colork = (k) ->
    max_k = 20
    k = Math.min(k, max_k)
    c = 255 - Math.floor (255 * k / max_k)
    return "rgb(#{c},#{c},#{c})"


class Ulam_ctx
    constructor : (n) ->
        @n  = n
        [@psx, @psy] = spiral_coords n
        @ds = div_count n * n + 1 


    resize : (n) ->
        @n  = n
        [@psx, @psy] = spiral_coords n
        @ds = div_count n * n + 1 


    # Given x, y corrdinates, figure out what natural number they correspond to
    # on the spiral. There is probably a clever way to do this, but Ive resorted
    # to linear search, which seems to be plenty fast enough.
    xy_to_k : (x, y) ->
        canvas   = document.getElementById 'ulam'
        ctx      = canvas.getContext('2d')
        [sx, sy] = [canvas.width / @n, canvas.height / @n]
        k = 0
        while k < @n * @n and
              not (@psx[k] * sx <= x and x <= (@psx[k] + 1) * sx and
                   @psy[k] * sy <= y and y <= (@psy[k] + 1) * sy)
            k += 1

        return k + 1


    # Render the ulam spiral.
    render : ->
        canvas   = document.getElementById 'ulam_base'
        ctx      = canvas.getContext '2d'
        [sx, sy] = [canvas.width / @n, canvas.height / @n]

        ctx.strokeStyle = '#fff'
        for k in [0..@n * @n]
            ctx.fillStyle = colork @ds[k + 1]
            ctx.fillRect(@psx[k] * sx, @psy[k] * sy, sx, sy)
            ctx.strokeRect(@psx[k] * sx, @psy[k] * sy, sx, sy)

        document.getElementById('ulam').getContext('2d').drawImage(canvas, 0, 0)


    # Overlay the ulam spiral, highlighting all multiples of d.
    # If called on `undefined`, clear any highlighting.
    render_highlights : (d) ->
        canvas   = document.getElementById 'ulam'
        ctx      = canvas.getContext '2d'
        [sx, sy] = [canvas.width / @n, canvas.height / @n]

        if typeof d == 'undefined'
            src = document.getElementById 'ulam_base'
            ctx.drawImage(src, 0, 0)
            return

        ctx.fillStyle   = "#f5a"
        ctx.strokeStyle = "#fff"

        for k in [0..@n * @n]
            if k + 1 == d
                ctx.strokeStyle = '#000'
                ctx.fillRect(@psx[k] * sx, @psy[k] * sy, sx, sy)
                ctx.strokeRect(@psx[k] * sx, @psy[k] * sy, sx, sy)
                ctx.fillStyle = "#f5a"
                ctx.strokeStyle = "#fff"
            else if (k + 1) % d == 0
                ctx.fillRect(@psx[k] * sx, @psy[k] * sy, sx, sy)

        return


$(document).ready ->
    ctx = new Ulam_ctx 100
    ctx.render()

    $('#more').click((event) ->
        ctx.resize ctx.n + 30
        ctx.render()
        event.preventDefault()
        return
        )

    $('#less').click((event) ->
        if ctx.n > 30
            ctx.resize ctx.n - 30
            ctx.render()
        event.preventDefault()
        return
        )

    $('#ulam').mousemove((event) ->
        canvas = document.getElementById('ulam')

        offx = $('#ulam').offset().left - $(document).scrollLeft()
        offy = $('#ulam').offset().top  - $(document).scrollTop()

        x = event.clientX - offx
        y = event.clientY - offy

        if 0 <= x <= canvas.width and 0 <= y <= canvas.height
            d = ctx.xy_to_k(x, y)
            ctx.render_highlights(undefined)
            ctx.render_highlights(d)
        else
            ctx.render_highlights(undefined)

        return
    )

    $('#ulam').mouseout((event) ->
        ctx.render_highlights(undefined)
    )

    return
