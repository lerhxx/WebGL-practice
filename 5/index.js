;let gl = null
let img0Loaded = false
let img1Loaded = false

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

    const vertexSizes = new Float32Array([
        0, .5, -.4, .4, 1, .4,
        -.5, -.5, -.4, .4, 1, .4,
        .5, .5, -.4, 1, .4, .4,

        .5, .4, -.2, 1, .4, .4,
        -.5, .4, -.2, 1, 1, .4,
        0, -.6, -.2, 1, 1, .4,

        0, .5, 0, .4, .4, 1,
        -.5, -.5, 0, .4, .4, 1,
        .5, -.5, 0, 1, .4, .4
    ])

    const FSIZE = vertexSizes.BYTES_PER_ELEMENT

    const pos_buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexSizes, gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(program, 'a_Position')
    gl.enableVertexAttribArray(a_Position)
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)

    const a_Color = gl.getAttribLocation(program, 'a_Color')
    gl.enableVertexAttribArray(a_Color)
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)

    const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')

    const viewMatrix = new Float32Array([
        .2, 0, 0, 0,
        .25, 0, 1, 0,
        .25, 0, 0, 0,
        0, 0, 0, 1
    ])
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix)

    gl.drawArrays(gl.TRIANGLES, 0, 9)
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

function initAttribute ({
    program,
    attribute,
    size,
    type,
    normalized = false,
    stride = 0,
    offset = 0
}) {
    const location = gl.getAttribLocation(program, attribute)
    const buffer = createBuffer()
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, type, normalized, stride, offset)

    return {
        location,
        buffer
    }
}

function loadTexture (texture, u_Sampler, img, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl[`TEXTURE${texUnit}`])
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)

    gl.uniform1i(u_Sampler, texUnit)
    img0Loaded && img1Loaded && gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function random (min = 0, max = 1) {
    return Math.random() * ( max - min ) + min
}