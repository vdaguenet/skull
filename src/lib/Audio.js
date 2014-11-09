'use strict';

function Audio(file) {
    this.file = file;
    this.context = new webkitAudioContext();
    this.source = this.context.createBufferSource();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.gainNode = this.context.createGain();
    this.buffer = undefined;
    this.audioBuffer = undefined;
    this.freqByteData = 0;
    // Connect audio processing graph
    this.source.connect(this.analyser);
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    this.initByteBuffer();
}

/**
 * Load asynchronously a sound in the buffer
 */
Audio.prototype.load = function(callback) {
    var request = new XMLHttpRequest();
    request.open("GET", this.file, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        this.context.decodeAudioData(request.response, function(b) {
            this.audioBuffer = b;
            this.source.buffer = this.audioBuffer;
            if (callback && typeof(callback) === 'function') {
                callback();
            }
        }.bind(this), function(buffer) {
                console.log("Error decoding sound!");
            }
        );
    }.bind(this);

    request.send();
};

/**
 * Play the sound loaded
 * @param  {Integer} delay    Waiting time before playing
 * @param  {Integer} start    Start time on the sound
 * @param  {Integer} duration How long the sound will be played
 * @param  {Object} params    Some options
 */
Audio.prototype.play = function(delay, start, duration, params) {
    this.duration = duration = duration || this.source.duration;
    var fadeInDuration = params.fadeInDuration || undefined;
    var fadeOutDuration = params.fadeOutDuration || undefined;

    if (fadeInDuration) {
        this.duration += fadeInDuration;
        // Fade the track in.
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + fadeInDuration);
    }
    if (fadeOutDuration) {
        this.duration += fadeOutDuration;
        // Fade the track out.
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + duration - fadeOutDuration);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + duration);
    }

    this.source.start(delay, start, duration);
};

Audio.prototype.initByteBuffer = function() {
    if (!this.freqByteData || this.freqByteData.length != this.analyser.frequencyBinCount) {
        this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
    }
};

Audio.prototype.getFrequencyAnalysis = function() {
    this.analyser.smoothingTimeConstant = 0.75;
    this.analyser.getByteFrequencyData(this.freqByteData);
    if(this.context.currentTime >= this.duration) {
        this.source.stop();
        return false;
    }
    return this.freqByteData;
};

module.exports = Audio;