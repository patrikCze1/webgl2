const vertexShaderSource = `#version 300 es
in vec4 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out vec4 vColor;
out vec3 vNormal;

out vec3 vLighting;
 
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;

    // lightning
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
    vColor = aColor;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

// from vertex shader
in vec4 vColor;
in vec3 vLighting;
 
// output for the fragment shader
out vec4 outColor;
 
void main() {
    outColor = vColor;
    outColor.rgb *= vLighting;
}
`;
// todo stíny, rotace

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

    //
    // create shaders
    //
    const vertexShader = pr.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = pr.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    //
    // create webgl program
    //
    let program = pr.createProgram(gl, vertexShader, fragmentShader);

    //
    // attributes
    //
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const colorLocation = gl.getAttribLocation(program, 'aColor');
    const normalLocation = gl.getAttribLocation(program, 'aNormal');
    
    const projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    const modelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
    const normalMatrix = gl.getUniformLocation(program, 'uNormalMatrix');

    // Create a vertex array object
    const va = gl.createVertexArray();
    // we are working with
    gl.bindVertexArray(va);

    //
    // position
    //
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // draw object
    object.drawCube(gl);
    
    // turn on
    gl.enableVertexAttribArray(positionLocation);

    // how to get data from buffer
    let size = 3; // 3 components 3D xyz
    let type = gl.FLOAT; //data is float
    let normalize = false;
    let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0; //start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    //
    // color
    // 
    const colors = [
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,   

        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,

        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,

        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,

        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,

        0.0,  1.0,  1.0,  1.0,   
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
        0.0,  1.0,  1.0,  1.0,
    ];
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorLocation);

    size = 4; 
    type = gl.FLOAT; 
    normalize = false; 
    stride = 0; 
    offset = 0; 
    gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

    //
    // normals
    //    
    const normals = [
        // Front
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // Left
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // Back
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // Right
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // Top
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // Bottom
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ];

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalLocation);

    size = 3; 
    type = gl.FLOAT; 
    normalize = false; 
    stride = 0;
    offset = 0;
    gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);

    //
    // variables
    //
    let move = [-1.5, 0, -2];
    let speed = 1.2;

    //
    // draw scene
    //  
    requestAnimationFrame(draw);

    //
    // key handler
    //
    window.onkeyup = (e) => {
        if (e.keyCode == 32) { // space
            move[1] -= 0.3;
            return draw();
        }
        if (e.keyCode == 39) { // >
            //translation[1] += 5;
            move[0] -= 0.2;
            console.log(move);
            return draw();
        }
        if (e.keyCode == 37) { // <
            move[0] += 0.2;
            console.log(move);
            return draw();
        }
        if (e.keyCode == 38) { // up
            move[2] += 0.2;
            console.log(move);
            return draw();
        }        
        if (e.keyCode == 40) { // down
            move[2] -= 0.2;
            console.log(move);
            return draw();
        }
    }

    function draw() {
        // current size of screen
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // clear canvas
        gl.clearColor(0.7, 0.7, 0.7, 1); // rgba
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);

        //gl.enable(gl.CULL_FACE);

        // which program gl should use
        gl.useProgram(program);

        // bind attribute/buffer
        gl.bindVertexArray(va);

        //
        // camera
        //
        const projectionM = glMatrix.mat4.create();
        const modelM = glMatrix.mat4.create();
        const viewM = glMatrix.mat4.create();
        const normalM = glMatrix.mat4.create();
        //glMatrix.mat4.ortho(projectionM, 0, canvas.width, canvas.height, 0, 1, 400);
        glMatrix.mat4.perspective(projectionM, 75 * Math.PI/180, canvas.width / canvas.height, 0.1, 400);

        glMatrix.mat4.translate(modelM, modelM, move);
        glMatrix.mat4.translate(viewM, viewM, [-3, 0, 1]);
        glMatrix.mat4.invert(viewM, viewM);

        const modelViewM = glMatrix.mat4.create();
        //const modelViewProjectionM = glMatrix.mat4.create();

        glMatrix.mat4.multiply(modelViewM, viewM, modelM);
        //glMatrix.mat4.multiply(modelViewProjectionM, projectionM, modelViewM);

        glMatrix.mat4.invert(normalM, modelViewM);
        glMatrix.mat4.transpose(normalM, normalM);

        //for (let i = 0; i < 3; i++) {     
            
            glMatrix.mat4.rotateX(modelViewM, modelViewM, speed / 60);
            glMatrix.mat4.rotateY(modelViewM, modelViewM, speed / 60);
            glMatrix.mat4.rotateZ(modelViewM, modelViewM, speed / 60);
            
            // Set the translation.
            gl.uniformMatrix4fv(projectionMatrix, false, projectionM);
            gl.uniformMatrix4fv(modelViewMatrix, false, modelViewM);
            gl.uniformMatrix4fv(normalMatrix, false, normalM);

            //
            // draw scene
            //
            // type, offset, count
            gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
        //}
        speed += .7;
        console.log(speed);
        requestAnimationFrame(draw);
    }    
}

start();

