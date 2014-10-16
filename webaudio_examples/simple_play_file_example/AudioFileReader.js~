/**
 * Reads audio files locally (inside the browser). 
 *
 * @author Ikaros Kappler
 * @date 2014-08-25
 * @version 1.0.0
 **/


AudioFileReader = {

    readAudioFile : function() {
	var audioFile = document.getElementById( "input_audio_file" );
	AudioFileReader._readAudioFile( audioFile );
    },

    _readAudioFile : function( audioFile ) {
		
	if( audioFile.files && audioFile.files[0] ) {

	    var width;
	    var height;
	    var fileSize;
	    var reader = new FileReader();
	    reader.onload = function(event) {
		//var dataURI = event.target.result;
		var arrayBuffer = event.target.result;
		
		// Global instance audioAnalyzer
		//audioAnalyzer.setAudioByDataURI( dataURI );
		audioAnalyzer.setAudioByArrayBuffer( arrayBuffer );

	    };
	    reader.onerror = function(event) {
		console.error("File could not be read! Code " + event.target.error.code);
		window.alert( "File could not be read! Code " + event.target.error.code );
	    };
	    //reader.readAsDataURL(audioFile.files[0]);
	    reader.readAsArrayBuffer( audioFile.files[0] ); // Read as binary data!
	} else {
	    window.alert( "Error: no audio files found to be read." );
	}
    }
};
