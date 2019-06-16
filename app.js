const vertexShaderSource = `#version 300 es
 
// attribute is an input (in) to a vertex shader, will receive data from a buffer
in vec2 a_position;

uniform vec2 u_resolution;
 
// all shaders have a main function
void main() {
    // convert position to 0-1
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;

    vec2 clipSpace = zeroToTwo - 1.0;
 
    gl_Position = vec4(clipSpace * vec2(1, -1.0), 0, 1);
}
`;

const fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

uniform vec4 u_color;
 
// output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant redish-purple
  outColor = u_color; //vec4(0, 0.6, 0.6, 1);
}
`;

// get canvas
const canvas = document.getElementById('canvas');
// full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl2');

if (!gl) {
    alert('no support');
}

function createShader(gl, type, source) {
    let shader = gl.createShader(type); // create new shader
    gl.shaderSource(shader, source); // send source to shader
    gl.compileShader(shader); // compile shader
    
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { // if shader is compiled successsfully
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    alert('error, see console');
    gl.deleteShader(shader);
    return null;
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);  
    return null;      
}

// create shaders
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
// create webgl program
let program = createProgram(gl, vertexShader, fragmentShader);
// end setting up ---------------------------------------------

const positionLocation = gl.getAttribLocation(program, 'a_position');
const uniformLocation = gl.getUniformLocation(program, 'u_resolution');
let color = gl.getUniformLocation(program, 'u_color');

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
const size = 2; // 2 components 2D xyzw
const type = gl.FLOAT; //data is float
const normalize = false;
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0; //start at the beginning of the buffer
gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

//current size of screen
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
console.log(canvas.width);

// clear canvas
gl.clearColor(0.2, 0.2, 0.2, 0.4); // rgba
gl.clear(gl.COLOR_BUFFER_BIT);

// which program gl should use
gl.useProgram(program);

// bind attribute/buffer
gl.bindVertexArray(va);

gl.uniform2f(uniformLocation, gl.canvas.width, gl.canvas.height);

for (let i = 0; i < 10; i++) {
    

// put rectangle into buffer
drawRectangle(gl, randomInt(gl.canvas.width), randomInt(gl.canvas.width), randomInt(gl.canvas.height), randomInt(gl.canvas.height));
//set color
gl.uniform4f(color, Math.random(), Math.random(), Math.random(), 1)

//draw
const primitiveType = gl.TRIANGLES;
const o = 0;
const count = 6; // how many calls
gl.drawArrays(primitiveType, o, count);
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}

function drawRectangle (gl, x, y, width, height) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = height;

    let points = [
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
}