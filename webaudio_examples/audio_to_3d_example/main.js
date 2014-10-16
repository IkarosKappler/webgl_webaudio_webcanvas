/**
 * @author Ikaros Kappler
 * @date 2014-08-21
 * @version 1.0.0
 **/


var audioAnalyzer = null;

function init() {

    try {
	audioAnalyzer = new IKRS.AudioAnalyzer();
    } catch( e ) {
	// This probably means that the browser version does not support webaudio
	window.alert( e );
    }

}

window.addEventListener('load', init, false);


function loadInputAudioFile() {

    AudioFileReader.readAudioFile();

}