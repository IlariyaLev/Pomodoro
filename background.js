var refreshDisplayTimeout;


var countDownDate;
var distance;

var c = 0;
var myTimer;// how much time it was paused

var countWork = 0;
var isWork = true;
var isLongBreak = false;


var work = 1;
var breakTime = 0.5;
var longBreak = 1;
var time = work;

document.addEventListener('DOMContentLoaded', function () {
    load();
    document.querySelector('#start').addEventListener('click', setTimer);
    document.querySelector('#stop').addEventListener('click', stop);
    document.querySelector('#pause').addEventListener('click', pause);
    document.querySelector('#resume').addEventListener('click', resume);
    document.querySelector('#settings').addEventListener('click', settings);

    document.querySelector('#close-settings').addEventListener('click', csettings);
});


function show(section) {
    document.getElementById(section).style.display = "block";
}

function showInline(section) {
    document.getElementById(section).style.display = "inline";
}

function hide(section) {
    document.getElementById(section).style.display = "none";
}

function load() {
    hide("settings-change");
    hide("stop");
    hide("resume");
    hide ("settings-change");
    hide("pause");
    document.getElementById("progress-bar").innerHTML = work + ":00";

}

function refreshDisplay() {
    var percent = document.getElementById('progress-bar').style.width;


// Find the distance between now an the count down date
    distance = countDownDate - new Date().getTime();
    localStorage.setItem("countDownDate", distance);


    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var newPercentage = ((minutes * 60 + seconds) / ((time * 60)) * 100);
    document.getElementById('progress-bar').style.width = newPercentage + "%";
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.getElementById("progress-bar").innerHTML = minutes + ": " + seconds;
    chrome.browserAction.setBadgeText({text:  minutes + ": " + seconds});
    percent = document.getElementById('progress-bar').style.width;
    // If the count down is finished, write some text

    if (distance <= 0) {
        document.getElementById("progress-bar").innerHTML = "00:00";
        // clearInterval(refreshDisplayTimeout);
        document.getElementById("progress-bar").style.color = "white";
        if (isWork) {

            isWork = false;
            document.getElementById("progress-bar").style.background = "#62c462";
            time = breakTime;
            if (countWork == 4) {
                countWork = 0;
                isLongBreak = true;
                document.getElementById("progress-bar").style.background = "#bbb6e2";
                time = longBreak;

            } else {
                ++countWork;
            }
        }
        else {
            isWork = true;
            document.getElementById("progress-bar").style.background = "#ff9882";
            time = work;
            if (isLongBreak) {
                isLongBreak = false;
                countWork=0;
             }
        }

        showInline("pause");
        showInline("stop");
        hide("start");
        hide("resume");
        // Get todays date and time
        var now = new Date().getTime();
        countDownDate = new Date().getTime();
        countDownDate = countDownDate + time * 60 * 1000;

        // Find the distance between now an the count down date
        distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        if (distance >= 0) {

            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            document.getElementById("progress-bar").innerHTML = minutes + ": " + seconds;
            chrome.browserAction.setBadgeText({text:  minutes + ": " + seconds});
        }
    }


    if (((minutes * 60 + seconds) / ((work * 60)) * 100) < 15) {
        document.getElementById("progress-bar").style.color = "grey";
    }
// document.getElementById("progress-bar").textContent = backgroundpage.getTimeLeftString();
    document.getElementById("progress-bar").style.width = percent + "%";

    refreshDisplayTimeout = setTimeout(refreshDisplay, 1000);

}


function resume() {
    hide("resume");
    hide("settings-change");
    hide ("settings-change");
    showInline("pause");
    countDownDate = countDownDate + c * 1000;
    c = 0;
    clearTimeout(myTimer);
    refreshDisplayTimeout = setTimeout(refreshDisplay, 1000);


}


function stop() {
    hide("pause");
    hide("stop");
    hide ("settings-change");
    hide("settings-change");
    showInline("start");
    //stop
    clearTimeout(refreshDisplayTimeout);
}

function pause() {
    hide("pause");
    hide ("settings-change");
    showInline("resume")
    hide("settings-change");
    myTimer = setInterval(myCounter, 1000)
    clearTimeout(refreshDisplayTimeout);
}

function myCounter() {
    ++c;
}

function setTimer() {
    hide ("settings-change");
    showInline("pause");
    showInline("stop");
    hide("start");
    hide("resume");
    document.getElementById("progress-bar").style.background = "#ff9882";
    time = work;
    countWork=0;
    isWork=true    ;
    isLongBreak=false;
    // Get todays date and time
    var now = new Date().getTime();
    countDownDate = new Date().getTime();
    countDownDate = countDownDate + time * 60 * 1000;

    // Find the distance between now an the count down date
    distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    document.getElementById("progress-bar").innerHTML = minutes + ": " + seconds;


    refreshDisplay();


}

function settings(){

        show("settings-change");
        hide("settings");
        show("close-settings");
    hide("pause");
    hide("stop");
    showInline("start");

    clearTimeout(refreshDisplayTimeout);

    var longBreakSlider = document.getElementById("change-longBreak-minutes");
    var longBreakOutput = document.getElementById("longBreak-time");
    longBreakOutput.innerHTML = longBreakSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    longBreakSlider.oninput = function() {
        longBreakOutput.innerHTML = this.value;
        document.getElementById("longBreak-time-interval").innerHTML = this.value;
        longBreak= this.value;
        if(isLongBreak){
            document.getElementById("progress-bar").innerHTML = longBreak + ":00" ;
        }
    }

    var breakSlider = document.getElementById("change-break-minutes");
    var breakOutput = document.getElementById("break-time");
    breakOutput.innerHTML = breakSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    breakSlider.oninput = function() {
        breakOutput.innerHTML = this.value;
        document.getElementById("break-time-interval").innerHTML = this.value;
        breakTime = this.value;
        if(!isLongBreak){
            if(!isWork)
            document.getElementById("progress-bar").innerHTML = breakTime + ":00" ;
        }
    }

    var workSlider = document.getElementById("change-work-minutes");
    var workOutput = document.getElementById("work-time");
    workOutput.innerHTML = workSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    workSlider.oninput = function() {
        workOutput.innerHTML = this.value;
        document.getElementById("work-time-interval").innerHTML= this.value;
        work=this.value;
        if(isWork)
            document.getElementById("progress-bar").innerHTML = work + ":00" ;
    }
}

function  csettings() {
    hide ("settings-change");
    show("settings");
    hide("close-settings");



}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}