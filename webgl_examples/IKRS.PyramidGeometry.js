/**
 *
 * 
 * @author Ikaros Kappler
 * @date 2014-10-16
 * @version 1.0.1
 **/


/**
 * The constructor.
 * 
 * @param size The size of the pyramid.
 **/
IKRS.PyramidGeometry = function( size ) {

    // Call super 'constructor'
    THREE.Geometry.call( this );
   
    var halfSize = size/2.0;
    
    // Add base points
    this.vertices.push( new THREE.Vector3(halfSize,0,halfSize) );    // at index 0
    this.vertices.push( new THREE.Vector3(halfSize,0,-halfSize) );   // at index 1
    this.vertices.push( new THREE.Vector3(-halfSize,0,-halfSize) );  // at index 2
    this.vertices.push( new THREE.Vector3(-halfSize,0,halfSize) );   // at index 3

    // Add top point
    this.vertices.push( new THREE.Vector3(0,size*0.66,0) );           // at index 4
  

    // Add faces
    this.faces.push( new THREE.Face3(4,0,1) );
    this.faces.push( new THREE.Face3(4,1,2) );
    this.faces.push( new THREE.Face3(4,2,3) );
    this.faces.push( new THREE.Face3(4,3,0) );
    
    // Add base face
    this.faces.push( new THREE.Face4(0,1,2,3) );

    
    this.computeCentroids();
    this.computeFaceNormals();
}


IKRS.PyramidGeometry.prototype = new THREE.Geometry();
IKRS.PyramidGeometry.prototype.constructor = IKRS.PyramidGeometry;
