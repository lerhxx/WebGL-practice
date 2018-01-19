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

    const { location: a_Position, buffer: pos_buffer } = initAttribute({
        program,
        attribute: 'a_Position',
        size: 3,
        type: gl.FLOAT
    })

    const u_matrix = gl.getUniformLocation(program, 'u_matrix')

    // 平移
    const tX = .5
    const tY = -.3
    // gl.uniformMatrix4fv(u_matrix, false, [
    //     1, 0, 0, tX,
    //     0, 1, 0, tY,
    //     0, 0, 0, 0,
    //     0, 0, 0, 1
    // ])

    // 旋转
    const deg = 30
    const r = 30 * Math.PI / 180
    const cosR = Math.cos(r)
    const sinR = Math.sin(r)
    // gl.uniformMatrix4fv(u_matrix, false, [
    //     cosR, -sinR, 0, 0,
    //     sinR, cosR, 0, 0,
    //     0, 0, 0, 0,
    //     0, 0, 0, 1
    // ])

    // 缩放
    const sizeX = sizeY = .5
    // gl.uniformMatrix4fv(u_matrix, false, [
    //     sizeX, 0, 0, 0,
    //     0, sizeY, 0, 0,
    //     0, 0, 0, 0,
    //     0, 0, 0, 1
    // ])

    // T * R
    gl.uniformMatrix4fv(u_matrix, false, [
        cosR, -sinR, 0, tX,
        sinR, cosR, 0, tY,
        0, 0, 0, 0,
        0, 0, 0, 1
    ])    

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -.5, 0, 0,
        0, 0, 0,
        0, .5, 0
    ]), gl.STATIC_DRAW)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
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

function bindClickEvent (ele, a_Position, pos_buffer, size_buffer) {
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
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3)
    })
}

function random (min = 0, max = 1) {
    return Math.random() * ( max - min ) + min
}