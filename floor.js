class Floor {
    constructor () { }

    points = [
        0, 0, 0,
        0, 0, 10,
        10, 0, 0,

        0, 0, 10,
        10, 0, 10,
        10, 0, 0,
    ];

    colors = [
        0.9,  .9,  .9,  1.0,
        0.9,  .9,  .9,  1.0,
        0.9,  .9,  .9,  1.0,

        0.9,  .9,  .9,  1.0,
        0.9,  .9,  .9,  1.0,
        0.9,  .9,  .9,  1.0,
    ];

    normals = [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
    ];

    setPoints (gl, positionLocation) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
    
        const size = 3; 
        const type = gl.FLOAT; 
        const normalize = false;
        const stride = 0; 
        const offset = 0;
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
    }

    setColors (gl, colorLocation) {
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

    setNormals (gl, normalLocation) {
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

    draw (gl, positionLocation, colorLocation, normalLocation) {
        this.setPoints(gl, positionLocation);
        this.setColors(gl, colorLocation);
        this.setNormals(gl, normalLocation);
    }
}