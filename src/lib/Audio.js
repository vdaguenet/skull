'use strict';

function Audio(file) {
    this.file = file;
    this.context = new webkitAudioContext();
    this.source = this.context.createBufferSource();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.buffer = null;
    this.audioBuffer = null;
    this.freqByteData = 0;
    // Connect audio processing graph
    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.initByteBuffer();
}

Audio.prototype.load = function(callback) {
    // Load asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", this.file, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        console.log(this);
        this.context.decodeAudioData(request.response, function(b) {
            this.audioBuffer = b;
            this.source.buffer = this.audioBuffer;
            if (callback) {
                callback();
            }
        }.bind(this), function(buffer) {
                console.log("Error decoding sound!");
            }
        );
    }.bind(this);

    request.send();
};

Audio.prototype.play = function(time) {
    this.source.start(time);
};

Audio.prototype.initByteBuffer = function() {
    if (!this.freqByteData || this.freqByteData.length != this.analyser.frequencyBinCount) {
        var freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
        this.freqByteData = freqByteData;
    }
};

Audio.prototype.getFrequencyAnalysis = function() {
    this.analyser.smoothingTimeConstant = 0.75;
    this.analyser.getByteFrequencyData(this.freqByteData);

    return this.freqByteData;
};

module.exports = Audio;