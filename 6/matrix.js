window.m3 = {
    identity: function () {
        return [
            1, 0 ,0,
            0, 1, 0,
            0, 0, 1
        ]
    },
    projection: function (width, height) {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    },
    translation: function (tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ]
    },
    rotation: function (rx, ry) {
        const c = Math.cos(rx * Math.PI / 180)
        const s = Math.sin(ry * Math.PI / 180)
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]
    },
    scaling: function (sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]
    },
    multiply: function (a, b) {
        const a00 = a[0 * 3 + 0],
            a01 = a[0 * 3 + 1],
            a02 = a[0 * 3 + 2],
            a10 = a[1 * 3 + 0],
            a11 = a[1 * 3 + 1],
            a12 = a[1 * 3 + 2],
            a20 = a[2 * 3 + 0],
            a21 = a[2 * 3 + 1],
            a22 = a[2 * 3 + 2],
            b00 = b[0 * 3 + 0],
            b01 = b[0 * 3 + 1],
            b02 = b[0 * 3 + 2],
            b10 = b[1 * 3 + 0],
            b11 = b[1 * 3 + 1],
            b12 = b[1 * 3 + 2],
            b20 = b[2 * 3 + 0],
            b21 = b[2 * 3 + 1],
            b22 = b[2 * 3 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22
        ]
    },
    translate: function(m, w, h) {
        return m3.multiply(m, m3.translation(w, h))
    },
    rotate: function(m, rx, ry) {
        return m3.multiply(m, m3.rotation(rx, ry))
    },
    scale: function(m, sx, sy) {
        return m3.multiply(m, m3.scaling(sx, sy))
    }
}

window.m4 = {
    identity: function () {
        return [
            1, 0 ,0, 0,
            0, 1, 0, 0,
            0, 0, 0, 1
        ]
    },
    projection: function (width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1
        ];
    },
    translation: function (tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ]
    },
    xRotation: function (ry, rz) {
        const c = Math.cos(ry * Math.PI / 180)
        const s = Math.sin(rz * Math.PI / 180)
        return [
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ]
    },
    yRotation: function (rx, rz) {
        const c = Math.cos(rx * Math.PI / 180)
        const s = Math.sin(rz * Math.PI / 180)
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]
    },
    zRotation: function (rx, ry) {
        const c = Math.cos(rx * Math.PI / 180)
        const s = Math.sin(ry * Math.PI / 180)
        return [
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    },
    scaling: function (sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]
    },
    multiply: function (a, b) {
        const a00 = a[0 * 4 + 0],
            a01 = a[0 * 4 + 1],
            a02 = a[0 * 4 + 2],
            a03 = a[0 * 4 + 3],
            a10 = a[1 * 4 + 0],
            a11 = a[1 * 4 + 1],
            a12 = a[1 * 4 + 2],
            a13 = a[1 * 4 + 3],
            a20 = a[2 * 4 + 0],
            a21 = a[2 * 4 + 1],
            a22 = a[2 * 4 + 2],
            a23 = a[2 * 4 + 3],
            a30 = a[3 * 4 + 0],
            a31 = a[3 * 4 + 1],
            a32 = a[3 * 4 + 2],
            a33 = a[3 * 4 + 3],
            b00 = b[0 * 4 + 0],
            b01 = b[0 * 4 + 1],
            b02 = b[0 * 4 + 2],
            b03 = b[0 * 4 + 3],
            b10 = b[1 * 4 + 0],
            b11 = b[1 * 4 + 1],
            b12 = b[1 * 4 + 2],
            b13 = b[1 * 4 + 3],
            b20 = b[2 * 4 + 0],
            b21 = b[2 * 4 + 1],
            b22 = b[2 * 4 + 2],
            b23 = b[2 * 4 + 3],
            b30 = b[3 * 4 + 0],
            b31 = b[3 * 4 + 1],
            b32 = b[3 * 4 + 2],
            b33 = b[3 * 4 + 3];

        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        ]
    },
    translate: function(m, w, h, d) {
        return m4.multiply(m, m4.translation(w, h, d))
    },
    xRotate: function(m, ry, rz) {
        return m4.multiply(m, m4.xRotation(ry, rz))
    },
    yRotate: function(m, rx, rz) {
        return m4.multiply(m, m4.yRotation(rx, rz))
    },
    zRotate: function(m, rx, ry) {
        return m4.multiply(m, m4.zRotation(rx, ry))
    },
    scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz))
    }
}