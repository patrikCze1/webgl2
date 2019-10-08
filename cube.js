class Cube { 
    constructor() { }

    points = [
        // Front
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,

        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,

        // Left
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, -1.0,

        0.0, 1.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 1.0, 0.0,

        // Back
        0.0, 0.0, -1.0,
        0.0, 1.0, -1.0,
        1.0, 0.0, -1.0,

        0.0, 1.0, -1.0,
        1.0, 0.0, -1.0,
        1.0, 1.0, -1.0,

        // Right
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 0.0, -1.0,

        1.0, 1.0, -1.0,
        1.0, 0.0, -1.0,
        1.0, 1.0, 0.0,

        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, -1.0,
        1.0, 1.0, 0.0,

        1.0, 1.0, 0.0,
        0.0, 1.0, -1.0,
        1.0, 1.0, -1.0,

        // Bottom
        0.0, 0.0, 0.0,
        0.0, 0.0, -1.0,
        1.0, 0.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 0.0, -1.0,
        1.0, 0.0, -1.0,
    ];

    colors = [
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,  

        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0, 

        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0, 

        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0, 

        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0, 

        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,
        .7,  .7,  .7,  1.0,  
    ];
    
    normals = [
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

    setColors(gl, colorLocation) {
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(colorLocation);

        const size = 4; 
        const type = gl.FLOAT; 
        const normalize = false; 
        const stride = 0; 
        const offset = 0; 
        gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
    }

    setPoints(gl, positionLocation) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);    
        // draw object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);        
        // turn on
        gl.enableVertexAttribArray(positionLocation);
    
        // how to get data from buffer
        const size = 3; // 3 components 3D xyz
        const type = gl.FLOAT; //data is float
        const normalize = false;
        const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0; //start at the beginning of the buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
    }

    setNormals(gl, normalLocation) {
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalLocation);

        const size = 3; 
        const type = gl.FLOAT; 
        const normalize = false; 
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);
    }

    draw(gl, positionLocation, colorLocation, normalLocation) {
        this.setPoints(gl, positionLocation);
        this.setColors(gl, colorLocation);
        this.setNormals(gl, normalLocation);
    }
}