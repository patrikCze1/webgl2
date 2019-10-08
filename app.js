const vertexShaderSource = `#version 300 es
in vec4 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out vec4 vColor;
out vec3 vLighting;
 
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;

    // lightning
    vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    vec3 directionalLightColor = vec3(1, 1, 1);
    vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    vec4 transformedNormal = uNormalMatrix * vec4(aNormal, 1.0);

    float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
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
    const cube = new Cube();
    const grid = new Grid();

    //
    // create shaders
    //
    const vertexShader = pr.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = pr.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    //
    // create webgl program
    //
    const program = pr.createProgram(gl, vertexShader, fragmentShader);

    //
    // attributes
    //
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const colorLocation = gl.getAttribLocation(program, 'aColor');
    const normalLocation = gl.getAttribLocation(program, 'aNormal');
    
    const projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    const modelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
    const normalMatrix = gl.getUniformLocation(program, 'uNormalMatrix');

    //
    // Create a vertex array object
    //
    const cubeVa = gl.createVertexArray();
    const gridVa = gl.createVertexArray();

    // we are working with
    gl.bindVertexArray(gridVa);
    grid.draw(gl, positionLocation, colorLocation, normalLocation);

    gl.bindVertexArray(cubeVa);
    cube.draw(gl, positionLocation, colorLocation, normalLocation);

    //
    // variables
    //
    let move = [-1.5, 0, -2];
    let speed = 1;

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
        }
        if (e.keyCode == 39) { // >
            //translation[1] += 5;
            move[0] -= 0.2;
            console.log(move);
        }
        if (e.keyCode == 37) { // <
            move[0] += 0.2;
            console.log(move);
        }
        if (e.keyCode == 38) { // up
            move[2] += 0.2;
            console.log(move);
        }        
        if (e.keyCode == 40) { // down
            move[2] -= 0.2;
            console.log(move);
        }
    }

    function draw() {
        // current size of screen
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // clear canvas
        gl.clearColor(1, 1, 1, 1); // rgba
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // z-buffer
        gl.enable(gl.DEPTH_TEST);

        //gl.enable(gl.CULL_FACE);

        // which program gl should use
        gl.useProgram(program);

        // bind attribute/buffer
        gl.bindVertexArray(cubeVa);

        //
        // camera
        //
        const projectionM = glMatrix.mat4.create();
        const modelM = glMatrix.mat4.create();
        const viewM = glMatrix.mat4.create();
        const normalM = glMatrix.mat4.create();
        //glMatrix.mat4.ortho(projectionM, 0, canvas.width, canvas.height, 0, 1, 400);
        glMatrix.mat4.perspective(projectionM, 60 * Math.PI/180, canvas.width / canvas.height, 0.1, 2000);

        glMatrix.mat4.translate(modelM, modelM, move);
        glMatrix.mat4.translate(viewM, viewM, [-1, .1, 1]);
        glMatrix.mat4.invert(viewM, viewM);

        const modelViewM = glMatrix.mat4.create();

        
/*
        glMatrix.mat4.rotateX(modelViewM, modelViewM, speed / 60);
        glMatrix.mat4.rotateY(modelViewM, modelViewM, speed / 60);
        glMatrix.mat4.rotateZ(modelViewM, modelViewM, speed / 60);*/

        glMatrix.mat4.invert(normalM, modelViewM);
        glMatrix.mat4.transpose(normalM, normalM);    

        //
        // draw cubes
        //

        glMatrix.mat4.multiply(modelViewM, viewM, modelM);

        gl.uniformMatrix4fv(projectionMatrix, false, projectionM);
        gl.uniformMatrix4fv(modelViewMatrix, false, modelViewM);
        gl.uniformMatrix4fv(normalMatrix, false, normalM);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);                
        

        //
        // grid
        //
        gl.bindVertexArray(gridVa);
        
        glMatrix.mat4.identity(modelViewM);
        glMatrix.mat4.multiply(modelViewM, viewM, modelM);
        //glMatrix.mat4.multiply(modelViewM, modelViewM, [3,1,0,1, 2,2,0,0, 3,1,0,1, 0,0,0,1]);
        /*glMatrix.mat4.scale(modelViewM, modelViewM, [2, 0, 2])
        glMatrix.mat4.translate(modelViewM, modelViewM, [1, 0, 1])
        glMatrix.mat4.rotateY(modelViewM, modelViewM, speed / 100);
        glMatrix.mat4.translate(modelViewM, modelViewM, [0, 0, -1]);*/

        gl.uniformMatrix4fv(projectionMatrix, false, projectionM);
        gl.uniformMatrix4fv(modelViewMatrix, false, modelViewM);
        gl.uniformMatrix4fv(normalMatrix, false, normalM);

        gl.drawArrays(gl.LINES, 0, grid.getNumberOfPonits());

        speed += .6;
        if (speed > 600) {
            speed = 0;
        }
        console.log('speed: ' + speed);
        requestAnimationFrame(draw);
    }    
}

start();