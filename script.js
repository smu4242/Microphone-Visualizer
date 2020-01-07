window.onload = function () {
    "use strict";
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var mask = visualizer.getElementById('mask');
    var h = document.getElementsByTagName('h1')[0];
    var path;
    var line;
    var report = 0;
    
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

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        //visualizer.setAttribute('viewBox', '0 0 255 255');
      
        //Through the frequencyArray has a length longer than 255, there seems to be no
        //significant data after this point. Not worth visualizing.
        for (var i = 0 ; i < 255; i++) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	        //<line x1="100%" y1="0%" x2="0%" y2="100%" style="stroke: rgb(234, 243, 234);stroke-width: 5;"></line>

            path.setAttribute('stroke-dasharray', '4,1');
            mask.appendChild(path);
            mask.appendChild(line);
        }
        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
          	var adjustedLength;
            for (var i = 0 ; i < 255; i++) {
              	adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
                paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
                
                line[i].setAttribute('x1', ''+ (i) +'%');
                line[i].setAttribute('y1', '255');
                line[i].setAttribute('x2', '0');
                line[i].setAttribute('y2', '-'+ (adjustedLength) +'%');
            }

        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        h.innerHTML = "You must allow your microphone.";
        console.log(error);
    }

    /*window.navigator = window.navigator || {}; */
    navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

};
