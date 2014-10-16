/**
 * @author Ikaros Kappler
 * @date 2014-08-19
 * @version 1.0.0
 **/



IKRS.AudioAnalyzer = function( context ) {

    if( context ) {
	this.context = context;
    } else {
	// Thanks to
	//   http://www.html5rocks.com/en/tutorials/webaudio/intro/?redirect_from_locale=de
	this.context = null;
	// Fix up for prefixing
	try {
	    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	    this.context = new AudioContext();
	    //window.alert( "AudioContext successfully created." );
	    document.getElementById( "status_div" ).innerHTML = "AudioContext successfully created.";
	} catch(e) {	
	    console.log( "Web Audio API is not supported in this browser." );
	    throw "Web Audio API is not supported in this browser.";
	}
    }
};


IKRS.AudioAnalyzer.prototype.constructor = IKRS.AudioAnalyzer;

IKRS.AudioAnalyzer.prototype.playAudioByArrayBuffer = function( arrayBuffer ) {
    
    // Create a callback function
    var audio_decoded = function( audioBuffer ) {
	
	var tmp = 
	    "Audio buffer created.\n" +
	    "sampleRate=" + audioBuffer.sampleRate + "\n" +
	    "length=" + audioBuffer.length + "\n" +
	    "duration=" + audioBuffer.duration + "\n" +
	    "numberOfChannels=" + audioBuffer.numberOfChannels + "\n";
	
	
	window.alert( tmp );


	// Play data	
	var src    = audioAnalyzer.context.createBufferSource();
	src.buffer = audioBuffer;   
	src.connect( audioAnalyzer.context.destination );
	
	
	// Play immediately?
	if( document.getElementById("play_sound").checked ) {
	    if( src.noteOn ) // Mozilla
		src.noteOn(0);
	    else
		src.start(0); 
	}
	
	 
    }
    
    // Start the decoder
    this.context.decodeAudioData( arrayBuffer,
				  audio_decoded,
				  function( errmsg ) { window.alert( "error: " + errmsg ); }
				);
};
