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

    const pos_buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer)

    const translate = [100, 100]
    const rotate = [30, 60]
    const scale = [.9, .8]
    let width = 100
    let height = 100
    
    // setRectangle(translate[0], translate[1], width, height)
    setGeometry()

    const a_Position = gl.getAttribLocation(program, 'a_Position')
    gl.enableVertexAttribArray(a_Position)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    const u_Color = gl.getUniformLocation(program, 'u_Color')
    const u_Matrix = gl.getUniformLocation(program, 'u_Matrix')

    gl.uniform4fv(u_Color, [random(), random(), random(), 1])

    let matrix = m3.projection(gl.canvas.width, gl.canvas.height)
    matrix = m3.translate(matrix, translate[0], translate[1])
    matrix = m3.rotate(matrix, rotate[0], rotate[1])
    matrix = m3.scale(matrix, scale[0], scale[1])
    gl.uniformMatrix3fv(u_Matrix, false, matrix)

    gl.drawArrays(gl.TRIANGLES, 0, 18)
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

function setRectangle (x, y, w, h) {
    let x1 = x + w,
        y1 = y + h
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x, y,
        x1, y,
        x, y1,
        x1, y,
        x1, y1,
        x, y1,
    ]), gl.STATIC_DRAW)
}

function setGeometry () {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,
  
            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,
  
            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW
    );
}