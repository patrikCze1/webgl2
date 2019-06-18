const vertexShaderSource = `#version 300 es
 
// attribute is an input (in) to a vertex shader, will receive data from a buffer
in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;
 
void main() {
    gl_Position = u_matrix * a_position;

    v_color = a_color;
}
`;

const fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

// from vs
in vec4 v_color;
 
// output for the fragment shader
out vec4 outColor;
 
void main() {
  outColor = v_color; //vec4(0, 0.6, 0.6, 1);
}
`;
//https://github.com/toji/gl-matrix/tree/master/src

function start() {
    // get canvas
    const canvas = document.getElementById('canvas');
    // full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        alert('No support.');
        return;
    }

    const pr = new Program();
    const helper = new Helper();
    const object = new Object();

    // create shaders
    const vertexShader = pr.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = pr.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // create webgl program
    let program = pr.createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    
    const matrixS = gl.getUniformLocation(program, 'u_matrix')
    //const colorS = gl.getUniformLocation(program, 'u_color');

    // create buffer
    let positionBuffer = gl.createBuffer();

    // Create a vertex array object
    const va = gl.createVertexArray();

    // we are working with
    gl.bindVertexArray(va);

    // turn on
    gl.enableVertexAttribArray(positionLocation);

    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // how to get data from buffer
    let size = 3; // 3 components 3D xyzw
    let type = gl.FLOAT; //data is float
    let normalize = false;
    let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0; //start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    object.drawF(gl);

    let translation = [150, 100, 10];
    let color = [Math.random(), Math.random(), Math.random(), 1];
    let scale = [1, 1, 1];
    let rotation = [helper.degToRad(40), helper.degToRad(25), helper.degToRad(325)];

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([
            // left column front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // top rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // middle rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // left column back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // top rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // middle rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // top
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
  
            // top rung right
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
  
            // under top rung
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
  
            // between top rung and middle
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
  
            // top of middle rung
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
  
            // right of middle rung
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
            // bottom of middle rung.
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
  
            // right of bottom
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
            // bottom
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
  
            // left side
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
        ]),
        gl.STATIC_DRAW);

    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(colorLocation);

    // how to get data from buffer
    size = 3; // 3 components 3D xyzw
    type = gl.UNSIGNED_BYTE; //data is float
    normalize = true; // convert 255 -> 1
    stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    offset = 0; //start at the beginning of the buffer
    gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

    draw();

    window.onkeyup = (e) => {
        if (e.keyCode == 32) { // space
            scale[0] += 10;
            scale[1] += 10;
            scale[2] += 10;
            return draw();
        }
        if (e.keyCode == 39) { // >
            rotation[0] += helper.degToRad(10);
            rotation[1] += helper.degToRad(10);
            rotation[2] += helper.degToRad(10);
            return draw();
        }
        if (e.keyCode == 37) { // <
            rotation[0] += helper.degToRad(10);
            rotation[1] += helper.degToRad(10);
            return draw();
        }
    }

    function draw() {
        // urrent size of screen
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // clear canvas
        gl.clearColor(0, 0, 0, 0); // rgba
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // which program gl should use
        gl.useProgram(program);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // bind attribute/buffer
        gl.bindVertexArray(va);

        const left = 0;
        const right = gl.canvas.clientWidth;
        const bottom = gl.canvas.clientHeight;
        const top = 0;
        const near = 1;
        const far = 400;
        let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);

        // Compute the matrix
        matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

        // update buffer
        //gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // put rectangle into buffer
        //object.drawRectangle(gl, translation[0], translation[1], width, height);
        

        // Set the translation.
        gl.uniformMatrix4fv(matrixS, false, matrix);

        //draw
        const primitiveType = gl.TRIANGLES;
        const o = 0;
        const count = 16 * 6; // how many calls
        gl.drawArrays(primitiveType, o, count);
        // todo ortho persp
    }
    
}

let m4 = {
    projection: function(width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
           2 / width, 0, 0, 0,
           0, -2 / height, 0, 0,
           0, 0, 2 / depth, 0,
          -1, 1, 0, 1,
        ];
    },

    ortho: function(left, right, bottom, top, near, far) {
        return [
            2 / (right - left), 0, 0, - (right + left) / (right - left),
            0, 2 / (top - bottom), 0, - (top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), - (far + near) / (far - near),       
            0, 0, 0, 1,
        ];
    },

    translate: function(m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },

    translation: function(tx, ty, tz) {
        return [
           1,  0,  0,  0,
           0,  1,  0,  0,
           0,  0,  1,  0,
           tx, ty, tz, 1,
        ];
    },

    xRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
          1, 0, 0, 0,
          0, c, s, 0,
          0, -s, c, 0,
          0, 0, 0, 1,
        ];
    },

    yRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
          c, 0, -s, 0,
          0, 1, 0, 0,
          s, 0, c, 0,
          0, 0, 0, 1,
        ];
    },
    
    zRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
           c, s, 0, 0,
          -s, c, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, 1,
        ];
    },

    scaling: function(sx, sy, sz) {
        return [
          sx, 0,  0,  0,
          0, sy,  0,  0,
          0,  0, sz,  0,
          0,  0,  0,  1,
        ];
    },

    xRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.xRotation(angleInRadians));
      },
    
    yRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.yRotation(angleInRadians));
    },
    
    zRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.zRotation(angleInRadians));
    },

    scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
    },

    multiply: function(a, b) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
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
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },
}

start();

