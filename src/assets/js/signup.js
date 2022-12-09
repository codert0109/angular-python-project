const progress = (value) => {
    document.getElementsByClassName("progress-bar")[0].style.width = `${value}%`;
};

let latitude;
let longitude;
function showPosition(position) {
    latitude = position.coords.latitude; 
    longitude = position.coords.longitude;
}

/* validation */
$("#email").focusout(function(){
    var request = $.ajax({
            url: "http://localhost:8000/email",
            type: "GET",
            async: false,
            data: {
                email: changetext($("#email").val())
            },
            dataType: "json"
        });
        
        request.done(function(data){
            $(".emailerror").html("");
            $("#pwd").prop('disabled', false);
            $("#cpwd").prop('disabled', false);
            $("#phone").prop('disabled', false);
            $("#age").prop('disabled', false);
        });
        
        request.fail(function(jqXHR,textStatus){            
            $(".emailerror").html("Email already exist");
            $("#pwd").prop('disabled', true);
            $("#cpwd").prop('disabled', true);
            $("#phone").prop('disabled', true);
            $("#age").prop('disabled', true);
        });
});

$("#cpwd").focusout(function(){
    let passwd = $("#pwd").val();
    let cpasswd = $("#cpwd").val();
    if(passwd != cpasswd){
        $(".pwderror").html("Password is not matched");
        $("#phone").prop('disabled', true);
        $("#age").prop('disabled', true);
    }else{
        $(".pwderror").html("");
        $("#phone").prop('disabled', false);
        $("#age").prop('disabled', false);
    }
});

let step = document.getElementsByClassName("step");
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let submitBtn = document.getElementById("submit-btn");
let form = document.getElementsByTagName("form")[0];
let preloader = document.getElementById("preloader-wrapper");
let bodyElement = document.querySelector("body");
let succcessDiv = document.getElementById("success");

form.onsubmit = () => {
    return false;
};

let current_step = 0;
let stepCount = 3;
var blob;
step[current_step].classList.add("d-block");
if (current_step == 0) {
    prevBtn.classList.add("d-none");
    submitBtn.classList.add("d-none");
    nextBtn.classList.add("d-inline-block");
}

nextBtn.addEventListener("click", () => {
    let previous_step;
    
    if(current_step == 0){
        if($("#email").val() != '' && $("#cpwd").val() != '' && $("#phone").val() != ''){
            var formdata = {
            username: $("#full_name").val(),
            email: changetext($("#email").val()),
            password: changetext($("#cpwd").val()),
            mobile: $("#phone").val(),
            age: $("#age").val(),
            gender: $("input[name='gender']:checked").val(),
            latitude : latitude,
            longitude : longitude
        }
        var request = $.ajax({
            url: "http://localhost:8000/createuser",
            type: "POST",
            async: false,
            data: formdata,
            dataType: "json"
        });
        
        request.done(function(data){
            if(data.status_code == 200){
                current_step++;
                previous_step = current_step - 1;
                statuscode = data.status_code;
                token = data.access_token;
            }
        });
        
        request.fail(function(jqXHR,textStatus){
            statuscode = jqXHR.status;
            var msg = JSON.parse(jqXHR.responseText);
            $(".step1error").html(msg.detail);
        });
        }else{
            $(".step1error").html("please enter the required fields");
        }
        
    }else if(current_step == 1){
        var formdata = {
            eotp: $("#email_otp").val(),
            motp: $("#phone_otp").val(),
            userid: changetext($("#email").val())
        }
        var request = $.ajax({
            url: "http://localhost:8000/signup/otp",
            type: "POST",
            async: false,
            data: formdata,
            dataType: "json"
        });
        
        request.done(function(data){
            statuscode = data.status_code;
            current_step++;
            previous_step = current_step-1;
        });
        
        request.fail(function(jqXHR,textStatus){
           statuscode = jqXHR.status;
        });
    }else if(current_step == 2){
        current_step++;
        previous_step = current_step-1;
    }
    
    if (current_step > 0 && current_step <= stepCount) {
        prevBtn.classList.remove("d-none");
        prevBtn.classList.add("d-inline-block");
        step[current_step].classList.remove("d-none");
        step[current_step].classList.add("d-block");
        step[previous_step].classList.remove("d-block");
        step[previous_step].classList.add("d-none");
        if (current_step == stepCount) {
            submitBtn.classList.remove("d-none");
            submitBtn.classList.add("d-inline-block");
            nextBtn.classList.remove("d-inline-block");
            nextBtn.classList.add("d-none");
        }
    } else {
        if (current_step > stepCount) {
            form.onsubmit = () => {
                return true;
            };
        }
    }
    progress((100 / stepCount) * current_step);
});

prevBtn.addEventListener("click", () => {
    if (current_step > 0) {
        current_step--;
        let previous_step = current_step + 1;
        prevBtn.classList.add("d-none");
        prevBtn.classList.add("d-inline-block");
        step[current_step].classList.remove("d-none");
        step[current_step].classList.add("d-block");
        step[previous_step].classList.remove("d-block");
        step[previous_step].classList.add("d-none");
        if (current_step < stepCount) {
            submitBtn.classList.remove("d-inline-block");
            submitBtn.classList.add("d-none");
            nextBtn.classList.remove("d-none");
            nextBtn.classList.add("d-inline-block");
            prevBtn.classList.remove("d-none");
            prevBtn.classList.add("d-inline-block");
        }
    }

    if (current_step == 0) {
        prevBtn.classList.remove("d-inline-block");
        prevBtn.classList.add("d-none");
    }
    progress((100 / stepCount) * current_step);
});

submitBtn.addEventListener("click", () => {
    //    preloader.classList.add('d-block');
    //
    //    const timer = ms => new Promise(res => setTimeout(res, ms));
    //
    //    timer(3000)
    //      .then(() => {
    //           bodyElement.classList.add('loaded');
    //      }).then(() =>{
    //          step[stepCount].classList.remove('d-block');
    //          step[stepCount].classList.add('d-none');
    //          prevBtn.classList.remove('d-inline-block');
    //          prevBtn.classList.add('d-none');
    //          submitBtn.classList.remove('d-inline-block');
    //          submitBtn.classList.add('d-none');
    //          succcessDiv.classList.remove('d-none');
    //          succcessDiv.classList.add('d-block');
    //      })
     $(".submiterror").html("");
    var imgfile = [];
    $('input[type="checkbox"]:checked').each(function(index){
        var id = $(this).attr('id');
        imgfile.push(changetext($('label[for="'+id+'"]').find('img').attr('src')));
    });
    
    let data = new File([blob],"audio.wav",{type:"wav",lastModified:new Date().getTime()});
    let container = new DataTransfer();
    container.items.add(data);
    let fileInputElement = document.getElementById("audiofile");
    fileInputElement.files = container.files;
    console.log(fileInputElement.files);
    
    if(imgfile.length == 0 && blob === undefined){
        $(".submiterror").html("Please give image and audio input");
    }else if(imgfile.length == 0){
        $(".submiterror").html("Please select image");
    }else if(blob === undefined){
        $(".submiterror").html("Please give voice input");
    }else{
        var formdata = new FormData();
        formdata.append("audio",fileInputElement.files[0]);
        formdata.append("file",imgfile);
        formdata.append("userid",changetext($("#email").val()));
    
        var request = $.ajax({
            url: "http://localhost:8000/signupSubmit",
            type: "POST",
            async: false,
            data: formdata,
            processData: false,
            contentType: false
        });
        
        request.done(function(data){
            if(data.status_code == 201){
                alert("Login Success")
            }
        });
        
        request.fail(function(jqXHR,textStatus){
            alert("Login Failed");
        });
    }
    
});

function changetext(message){
    var key = CryptoJS.enc.Utf8.parse("AAAAAAAAAAAAAAAA");
    var iv = CryptoJS.enc.Utf8.parse("BBBBBBBBBBBBBBBB");
    var encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv, mode: CryptoJS.mode.CBC});
    return encrypted.toString(); 
}

(async () => {
    let leftchannel = [];
    let rightchannel = [];
    let recorder = null;
    let recording = false;
    let recordingLength = 0;
    let volume = null;
    let audioInput = null;
    let sampleRate = null;
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = null;
    let analyser = null;

    let stream = null;
    let tested = false;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success function
            showPosition, 
            // Error function
            null, 
            // Options. See MDN for details.
            {
               enableHighAccuracy: true,
               timeout: 5000,
               maximumAge: 0
            });
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    try {
        window.stream = stream = await getStream();
        console.log("Got stream");
    } catch (err) {
        alert("Issue getting mic", err);
    }

    function getStream(constraints) {
        if (!constraints) {
            constraints = { audio: true, video: false };
        }
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    setUpRecording();

    function setUpRecording() {
        context = new AudioContext();
        sampleRate = context.sampleRate;

        // creates a gain node
        volume = context.createGain();

        // creates an audio node from teh microphone incoming stream
        audioInput = context.createMediaStreamSource(stream);

        // Create analyser
        analyser = context.createAnalyser();

        // connect audio input to the analyser
        audioInput.connect(analyser);

        // connect analyser to the volume control
        // analyser.connect(volume);

        let bufferSize = 2048;
        let recorder = context.createScriptProcessor(bufferSize, 2, 2);

        // we connect the volume control to the processor
        // volume.connect(recorder);

        analyser.connect(recorder);

        // finally connect the processor to the output
        recorder.connect(context.destination);

        recorder.onaudioprocess = function (e) {
            // Check
            if (!recording) return;
            // Do something with the data, i.e Convert this to WAV
            console.log("recording");
            let left = e.inputBuffer.getChannelData(0);
            let right = e.inputBuffer.getChannelData(1);
            if (!tested) {
                tested = true;
                // if this reduces to 0 we are not getting any sound
                if (!left.reduce((a, b) => a + b)) {
                    alert("There seems to be an issue with your Mic");
                    // clean up;
                    stop();
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    context.close();
                }
            }
            // we clone the samples
            leftchannel.push(new Float32Array(left));
            rightchannel.push(new Float32Array(right));
            recordingLength += bufferSize;
        };
    }

    function mergeBuffers(channelBuffer, recordingLength) {
        let result = new Float32Array(recordingLength);
        let offset = 0;
        let lng = channelBuffer.length;
        for (let i = 0; i < lng; i++) {
            let buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    function interleave(leftChannel, rightChannel) {
        let length = leftChannel.length + rightChannel.length;
        let result = new Float32Array(length);

        let inputIndex = 0;

        for (let index = 0; index < length; ) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }

    function writeUTFBytes(view, offset, string) {
        let lng = string.length;
        for (let i = 0; i < lng; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function start() {
        recording = true;
        document.querySelector("#msg").style.visibility = "visible";
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
        console.log("context: ", !!context);
        if (!context) setUpRecording();
    }

    function stop() {
        console.log("Stop");
        recording = false;
        document.querySelector("#msg").style.visibility = "hidden";

        // we flat the left and right channels down
        let leftBuffer = mergeBuffers(leftchannel, recordingLength);
        let rightBuffer = mergeBuffers(rightchannel, recordingLength);
        // we interleave both channels together
        let interleaved = interleave(leftBuffer, rightBuffer);

        ///////////// WAV Encode /////////////////
        // from http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
        //

        // we create our wav file
        let buffer = new ArrayBuffer(44 + interleaved.length * 2);
        let view = new DataView(buffer);

        // RIFF chunk descriptor
        writeUTFBytes(view, 0, "RIFF");
        view.setUint32(4, 44 + interleaved.length * 2, true);
        writeUTFBytes(view, 8, "WAVE");
        // FMT sub-chunk
        writeUTFBytes(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        // stereo (2 channels)
        view.setUint16(22, 2, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 4, true);
        view.setUint16(32, 4, true);
        view.setUint16(34, 16, true);
        // data sub-chunk
        writeUTFBytes(view, 36, "data");
        view.setUint32(40, interleaved.length * 2, true);

        // write the PCM samples
        let lng = interleaved.length;
        let index = 44;
        let volume = 1;
        for (let i = 0; i < lng; i++) {
            view.setInt16(index, interleaved[i] * (0x7fff * volume), true);
            index += 2;
        }

        // our final binary blob
        blob = new Blob([view], { type: "audio/wav" });

        const audioUrl = URL.createObjectURL(blob);
        console.log("BLOB ", blob);
        console.log("URL ", audioUrl);
        document.querySelector("#audio").setAttribute("src", audioUrl);
        const link = document.querySelector("#download");
        link.setAttribute("href", audioUrl);
        link.download = "output.wav";
    }

    function pause() {
        recording = false;
        context.suspend();
    }

    function resume() {
        recording = true;
        context.resume();
    }

    document.querySelector("#record").onclick = (e) => {
        console.log("Start recording");
        start();
    };

    document.querySelector("#stop").onclick = (e) => {
        stop();
    };
})();


$(document).ready(function() {
    var imgid = 0;
$('.select2').select2({
closeOnSelect: false
});
    $('.select2').on('select2:select', function (e) {
    var data = e.params.data;
    var imgreq = $.ajax({
        url: "http://localhost:8000/userInterestImage",
        type: "GET",
        async: false,
        data: {
            topic: data.text,
        },
        dataType: "json"
    });
            
    imgreq.done(function(data){
        var count = 0;
        $(".image-checkbox li").each(function(index){
            if(imgid == index && count < data.length){
                $(this).find('img').attr('src',data[count]);
                imgid++;
                count++;
            }
        });
    });
            
    imgreq.fail(function(jqXHR,textStatus){
        console.log(jqXHR);
    });
});
});

