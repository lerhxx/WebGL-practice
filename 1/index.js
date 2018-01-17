;let gl = null

window.onload  = () => {
    main('canvas')
}

function main (id) {
    const canavs = document.getElementById(id)
    if (!canvas) {
        return null
    }

    gl = getWebGLContext(canavs)
    if (!gl) {
        return
    }

    gl.clearColor(0, 0, 0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const program = createProgram('vs', 'fs')

    const pos_loc = gl.getAttribLocation(program, 'position')

    const pos_buffer = createBuffer()

    gl.enableVertexAttribArray(pos_loc)

    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)

    const size_loc = gl.getAttribLocation(program, 'a_PointSize')
    gl.vertexAttrib1f(size_loc, 20.0)

    bindClickEvent(canvas, pos_buffer)
    gl.flush()
}

function getWebGLContext (canavs) {
    canvas.width = '500'
    canvas.height = '500'

    const gl = canvas.getContext('webgl') || null

    return gl
}

function setCanvasSize(canvas, w = 500, h = 500) {
    if (!canvas) {
        return
    }
    canvas.width = w
    canvas.height = h
}

function createShader (id) {
    const ele = document.getElementById(id)
    let shader

    switch(ele.type) {
        case 'x-shader/x-vertext':
            shader = gl.createShader(gl.VERTEX_SHADER)
            break
        case 'x-shader/x-fragment':
            shader = gl.createShader(gl.FRAGMENT_SHADER)
            break
        default:
            return
    }

    gl.shaderSource(shader, ele.text)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader
    } else {
        console.log(gl.getShaderInfoLog(shader))
    }
}

function createProgram (vsId, fsId) {
    const vs = createShader(vsId)
    const fs = createShader(fsId)
    const program = gl.createProgram()

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)

    gl.linkProgram(program)

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program)
        return program
    } else {
        console.log(gl.getProgramInfoLog(program))
    }
}

function createBuffer (data = []) {
    const buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

    return buffer
}

function bindClickEvent (ele, pos_buffer) {
    const rect = ele.getBoundingClientRect()
    const hw = rect.width / 2
    const hh = rect.height / 2

    const points = []
    const colors = []

    ele.addEventListener('mousedown', e => {
        const x = e.clientX
        const y = e.clientY
        
        const rx = (x - rect.left - hw) / hw
        const ry = (hh -y - rect.top) / hh
        
        points.push(rx)
        points.push(ry)
        points.push(0)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)

        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.POINTS, 0, points.length / 3)
    })
}

function random (min = 0, max = 1) {
    return Math.random() * ( max - min ) + min
}