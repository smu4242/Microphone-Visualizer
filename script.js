"use strict";

const urlParams = new URLSearchParams(window.location.search);
const getIntParam = (name, defaultValue) => {
    const tmp = parseInt(urlParams.get(name));
    if (isNaN(tmp)) {
        return defaultValue;
    }
    return tmp;
};
const getFloatParam = (name, defaultValue) => {
    const tmp = parseFloat(urlParams.get(name));
    if (isNaN(tmp)) {
        return defaultValue;
    }
    return tmp;
};
const getBoolParam = (name, defaultValue) => {
    const tmp = urlParams.get(name);
    if (tmp === "yes") {
        return true;
    }
    if (tmp === "false") {
        return false;
    }
    return defaultValue;
};

const halfArray = (bigArray, reduceFun) => {
    const result = [];
    const newLength = bigArray.length / 2;
    for (var i = 0 ; i < newLength ; i++ ) {
        result[i] = reduceFun(bigArray[i*2], bigArray[i*2+1]);
    }
    return result;
};

var wasLogged = false;
const halfArrayMultipleTimes = (bigArray, reduceFun, preferredSize) => {
    var i = 0;
    var result = bigArray;
    while ( result.length > preferredSize ) {
        i++;
        result = halfArray(result, reduceFun);
    }
    if (result.length !== preferredSize && ! wasLogged) {
        console.info("numBars should be a power of two! Since it is not, I will use "
            + result.length + " instead, because it is the next lower power of 2.");
        wasLogged = true;
    }
    return result;
};

const avg = (a, b) => {
    return (a + b) / 2.0;
};
const constant = (a, b) => {
    return 250;
};
window.onload = function () {
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var target = visualizer.getElementById('target');
    var mask = visualizer.getElementById('mask');
    var h = document.getElementsByTagName('h1')[0];
    var path, rect;

    const numBars = Math.min(getIntParam('numBars', 256), 256);
    console.info("numBars: ", numBars)
    const click = getBoolParam("click", false)
    console.info("click: ", click)
    const renderPath = false;
    const oneGap = getFloatParam('gapWidth', 0.5);
    const ONE_GAP = oneGap;
    const BAR_WIDTH = 1;

    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;
        h.innerHTML = "";
        //h.setAttribute('style', 'opacity: 0;');
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        const frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        //Through the frequencyArray has a length longer than 255, there seems to be no
        //significant data after this point. Not worth visualizing.
        for (var i = 0 ; i < numBars; i++) {
            if (renderPath) {
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('stroke-dasharray', '4,1');
                mask.appendChild(path);
            } else {
              rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
              rect.setAttribute('id', 'svgrect_' + i);
              rect.setAttribute('width', BAR_WIDTH + "px");
              rect.setAttribute('stroke-width', "1");
              rect.setAttribute('fill', "url('#myGradient')");
              target.appendChild(rect);
            }
        }

        const doDraw = function () {
            analyser.getByteFrequencyData(frequencyArray);
            const frequencyArraySmaller = halfArrayMultipleTimes(frequencyArray, Math.max, numBars)
            const numBarsSmaller = frequencyArraySmaller.length;
            const viewBoxWidth = numBarsSmaller*(ONE_GAP+BAR_WIDTH)+1;
            const viewBoxHeight = viewBoxWidth;
            visualizer.setAttribute('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
            const gradient = document.getElementById('myGradient');
            gradient.setAttribute('gradientTransform', 'rotate(' + 90 + ') ');

          	var adjustedLength;
            var gap = ONE_GAP;
            const convert = (val) => {
                return val * viewBoxHeight / 256.0
            };
            for (var i = 0 ; i < numBarsSmaller; i++) {
              	adjustedLength = convert(Math.floor(frequencyArraySmaller[i])
                    - (Math.floor(frequencyArraySmaller[i]) % 5));
                if (renderPath) {
                    paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
                } else {
                    const rect = document.getElementById('svgrect_' + i);
                    rect.setAttribute('height', adjustedLength);
                    rect.setAttribute('x', i + gap);
                    gap += ONE_GAP;
                    rect.setAttribute('y', viewBoxHeight-adjustedLength);
                }
            }
            if (!click) {
                requestAnimationFrame(doDraw);
            }
        }
        const clickBody = function () {
            console.info('ONCLICK!');
            requestAnimationFrame(doDraw);
        }

        if (click) {
            document.body.addEventListener("click", clickBody);
        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        h.innerHTML = "You must allow your microphone 🎤";
        console.log(error);
    }

    /*window.navigator = window.navigator || {}; */
    navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

};
