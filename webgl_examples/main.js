/**
 * @date   2014-10
 * @source http://cs.anu.edu.au/~Hugh.Fisher/webgl/index.html
 * @source https://developer.mozilla.org/en-US/docs/Web/WebGL/Adding_2D_content_to_a_WebGL_context
 **/


var gl;      // A global variable for the WebGL context


// Until requestAnimationFrame works everywhere, use this code from Google
var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) { window.setTimeout(callback, 1000 / 60); };
})();


// Cube geometry
var cubeVerts = new Float32Array([
    -0.5,  0.5,  0.5,   // 0
    -0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
    -0.5,  0.5, -0.5,   // 4
    -0.5, -0.5, -0.5,
    -0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,
     0.5,  0.5, -0.5,   // 8
    -0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,   // 12
     0.5, -0.5,  0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,   // 16
    -0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,   // 20
     0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,
]);

var cubeNorms = new Float32Array([
     0,  0,  1,
     0,  0,  1,
     0,  0,  1,
     0,  0,  1,
    -1,  0,  0,
    -1,  0,  0,
    -1,  0,  0,
    -1,  0,  0,
     0,  1,  0,
     0,  1,  0,
     0,  1,  0,
     0,  1,  0,
     1,  0,  0,
     1,  0,  0,
     1,  0,  0,
     1,  0,  0,
     0, -1,  0,
     0, -1,  0,
     0, -1,  0,
     0, -1,  0,
     0,  0, -1,
     0,  0, -1,
     0,  0, -1,
     0,  0, -1,
]);

var cubeIdx = new Uint16Array([
     0,  1,  2,  1,  3,  2,
     4,  5,  6,  5,  7,  6,
     8,  9, 10,  9, 11, 10,
    12, 13, 14, 13, 15, 14,
    16, 17, 18, 17, 19, 18,
    20, 21, 22, 21, 23, 22,
]);

// The scene. Really ought to be an object
var cubeVBuf   = -1;
var cubeNBuf   = -1;
var cubeIdxBuf = -1;

var pMatrix    = mat4.create();
var mvMatrix   = mat4.create();
var cubeColor  = [ 0, 1, 0, 1 ];
var cubeSpin   = 0;

// Shader program and handles to uniforms, attributes
// Also should be an object
var gpuShade          = null;
var hProjectionMatrix = -1;
var hModelViewMatrix  = -1;
var hNormalMatrix     = -1;
var hLightPos         = -1;
var hColor            = -1;
var vaPosition        = -1;
var vaNormal          = -1;


// Setting up WebGL
var initShaders = function() {
    var vShader, fShader;
    
    vShader = gpu.loadShader(gl.VERTEX_SHADER, "shade_vert");
    fShader = gpu.loadShader(gl.FRAGMENT_SHADER, "shade_frag");
    gpuShade = gpu.newProgram(vShader, fShader);
    
    hProjectionMatrix = gpu.getUniform(gpuShade, "gProjectionMatrix");
    hModelViewMatrix  = gpu.getUniform(gpuShade, "gModelViewMatrix");
    hNormalMatrix     = gpu.getUniform(gpuShade, "gNormalMatrix");
    hLightPos = gpu.getUniform(gpuShade, "gLightPos");
    hColor = gpu.getUniform(gpuShade, "gColor");
    
    vaPosition = gpu.getAttribute(gpuShade, "vPosition");
    vaNormal   = gpu.getAttribute(gpuShade, "vNormal");
};

var createCube = function() {
	// Transfer data to GPU
	cubeVBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuf);
	gl.bufferData(gl.ARRAY_BUFFER, cubeVerts, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	cubeNBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNBuf);
	gl.bufferData(gl.ARRAY_BUFFER, cubeNorms, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	cubeIdxBuf = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIdxBuf);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIdx, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

var initGL = function(canvas) {
    // Do we have a context?
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch(e) {
        gl = null;
    }
    if (! gl) {
        alert("Could not get WebGL context: does your browser support WebGL?");
    }
    // Regular OpenGL setup
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    mat4.identity(pMatrix);
    mat4.identity(mvMatrix);
    initShaders();
    createCube();
};

// Rendering the scene.
// I always separate into projection - viewpoint - world

var setProjection = function() {
    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 10.0, pMatrix);
}

var setViewpoint = function() {
    mat4.lookAt([0, 2, 4], [0, 0, 0], [0, 1, 0], mvMatrix);
}

var drawWorld = function() {
    mat4.rotate(mvMatrix, cubeSpin, [0, 1, 0], mvMatrix);
    
    var nv3 = mat4.toInverseMat3(mvMatrix);
    mat3.transpose(nv3, nv3);
    var nvMatrix = mat3.toMat4(nv3);
    
    gl.useProgram(gpuShade);
    gl.uniformMatrix4fv(hProjectionMatrix, false, pMatrix);
    gl.uniformMatrix4fv(hModelViewMatrix, false, mvMatrix);
    gl.uniformMatrix4fv(hNormalMatrix, false, nvMatrix);
    gl.uniform4f(hLightPos, 0.5, 1.0, 1.0, 0.0);
    gl.uniform4f(hColor, cubeColor[0], cubeColor[1], cubeColor[2], cubeColor[3]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuf);
	gl.enableVertexAttribArray(vaPosition);
	gl.vertexAttribPointer(vaPosition, 3, gl.FLOAT, false, 0, 0);
	
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNBuf);
	gl.enableVertexAttribArray(vaNormal);
	gl.vertexAttribPointer(vaNormal, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIdxBuf);
    gl.drawElements(gl.TRIANGLES, cubeIdx.length, gl.UNSIGNED_SHORT, 0);
}

var draw = function() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    try {
        setProjection();
        setViewpoint();
        drawWorld();
    } catch(e) {
        alert("draw: " + e.message);
    }
    
    cubeSpin += 0.5;
    requestAnimFrame(draw);
};

function cubeMain() {

    //window.alert( "jo" );

    var canvas = document.getElementById("my_canvas");
    try {
        initGL(canvas);
        draw();
    } catch(e) {
        alert("initGL: " + e.message);
    }
}


// Add the event listener
window.addEventListener( "load", cubeMain, false );