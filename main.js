var refreshDisplayTimeout;


var countDownDate;


var distance;
var audio3 = new Audio('bell3.mp3');
var audio2 = new Audio('bell2.mp3');

var c = 0;
var myTimer;// how much time it was paused

var countWork = 0;
var isWork = true;
var isLongBreak = false;
var sound = true;


var work = 20;
var breakTime = 15;
var longBreak = 10;
var time = work;

document.addEventListener('DOMContentLoaded', function () {

    load();
    document.querySelector('#start').addEventListener('click', setTimer);
    document.querySelector('#stop').addEventListener('click', stop);
    document.querySelector('#pause').addEventListener('click', pause);
    document.querySelector('#resume').addEventListener('click', resume);
    document.querySelector('#restart').addEventListener('click', restart);
    document.querySelector('#settings').addEventListener('click', settings);
    document.querySelector('#save-notification').addEventListener('click', notif);
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
    showInline("start");
    hide("settings-change");
    hide("stop");
    hide("resume");
    hide("settings-change");
    hide("pause");
    document.getElementById("progress-bar").style.background = "#ff9882";
    document.getElementById("change-longBreak-minutes").value = longBreak;
    document.getElementById("longBreak-time").innerHTML = longBreak;
    document.getElementById("longBreak-time-interval").innerHTML = longBreak;
    document.getElementById("change-break-minutes").value = breakTime;
    document.getElementById("break-time").innerHTML = breakTime; // Display the default slider value
    document.getElementById("break-time-interval").innerHTML = breakTime;
    document.getElementById("change-work-minutes").value = work;
    document.getElementById("work-time").innerHTML = work;
    document.getElementById("work-time-interval").innerHTML = work;

    countWork = 0;
    document.getElementById("sound").checked = true;
    sound = true;
    document.getElementById("sound").checked=true;
    document.getElementById("non").checked=false;
    isWork = true;
    document.getElementById("whatTime").innerHTML = "Work time";
    isLongBreak = false;
    document.getElementById("progress-bar").innerHTML = work + ":00";
    if (localStorage.length == 0) {
        hide("restart");
    } else if(localStorage.length == 1) {
        if (localStorage.getItem("sound") != null) {
            hide("restart");
            sound = localStorage.getItem("sound");
            if(sound==true){
                document.getElementById("sound").checked=true;
                document.getElementById("non").checked=false;
            }else{
                document.getElementById("sound").checked=false;
                document.getElementById("non").checked=true;
            }
        }
    } else
     {
        showInline("restart");


        if (localStorage.getItem("state") != null) {
            isWork = localStorage.getItem("state");
            if (isWork == true) {
                document.getElementById("progress-bar").style.background = "#ff9882";
                document.getElementById("whatTime").innerHTML = "Work time";
            } else {
                if (isLongBreak == true) {
                    document.getElementById("whatTime").innerHTML = "It's time for longer break";
                    document.getElementById("progress-bar").style.background = "#bbb6e2";
                } else {
                    document.getElementById("progress-bar").style.background = "#62c462";
                    document.getElementById("whatTime").innerHTML = "Break time";

                }
            }
        }
        if (localStorage.getItem("countWork") != null) {
            countWork = localStorage.getItem("countWork");
        }
        if (localStorage.getItem("stateBreak") != null) {
            isLongBreak = localStorage.getItem("stateBreak");
            if (isWork != true) {
                if (isLongBreak == true) {
                    document.getElementById("whatTime").innerHTML = "It's time for longer break";
                    document.getElementById("progress-bar").style.background = "#bbb6e2";
                } else {
                    document.getElementById("progress-bar").style.background = "#62c462";
                    document.getElementById("whatTime").innerHTML = "Break time";

                }
            }
        }
        if (localStorage.getItem("longBreak") != null) {
            document.getElementById("change-longBreak-minutes").value = localStorage.getItem("longBreak").valueOf();
            document.getElementById("longBreak-time").innerHTML = localStorage.getItem("longBreak").valueOf();
            document.getElementById("longBreak-time-interval").innerHTML = localStorage.getItem("longBreak");
            longBreak = localStorage.getItem("longBreak");
            if (isLongBreak) {
                document.getElementById("progress-bar").innerHTML = longBreak + ":00";
            }
        }
        if (localStorage.getItem("breakTime") != null) {
            document.getElementById("change-break-minutes").value = localStorage.getItem("breakTime").valueOf();
            document.getElementById("break-time").innerHTML = localStorage.getItem("breakTime"); // Display the default slider value

            document.getElementById("break-time-interval").innerHTML = localStorage.getItem("breakTime");
            breakTime = localStorage.getItem("breakTime");

            if (isLongBreak != true) {
                if (isWork != true) {
                    document.getElementById("progress-bar").innerHTML = breakTime + ":00";
                    document.getElementById("whatTime").innerHTML = "Break time";
                }
            }
        }
        if (localStorage.getItem("work") != null) {

            document.getElementById("change-work-minutes").value = localStorage.getItem("work").valueOf();
            document.getElementById("work-time").innerHTML = localStorage.getItem("work");
            document.getElementById("work-time-interval").innerHTML = localStorage.getItem("work");
            work = localStorage.getItem("work");


        }
        if (isWork == true) {
            time = work;
            document.getElementById("progress-bar").style.background = "#ff9882";
            document.getElementById("whatTime").innerHTML = "Work time";
            document.getElementById("progress-bar").innerHTML = work + ":00";
            document.getElementById("change-work-minutes").value = work;
            document.getElementById("work-time").innerHTML = work;
            document.getElementById("work-time-interval").innerHTML = work;
        }
        if (isWork != true) {
            time = breakTime;
            document.getElementById("progress-bar").innerHTML = breakTime + ":00";
            document.getElementById("whatTime").innerHTML = "Break time";
            document.getElementById("progress-bar").style.background = "#62c462";
            document.getElementById("change-break-minutes").value = breakTime;
            document.getElementById("break-time").innerHTML = breakTime; // Display the default slider value

            document.getElementById("break-time-interval").innerHTML = breakTime;
            if (isLongBreak == true) {
                time = longBreak;
                document.getElementById("whatTime").innerHTML = "It's time for longer break";
                document.getElementById("progress-bar").style.background = "#bbb6e2";
                document.getElementById("progress-bar").innerHTML = longBreak + ":00";
                document.getElementById("change-longBreak-minutes").value = longBreak;
                document.getElementById("longBreak-time").innerHTML = longBreak;
                document.getElementById("longBreak-time-interval").innerHTML = longBreak;
            }
        }
    }

}

function refreshDisplay() {
    var percent = document.getElementById('progress-bar').style.width;


// Find the distance between now an the count down date
    distance = countDownDate - new Date().getTime();


    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var newPercentage = ((minutes * 60 + seconds) / ((time * 60)) * 100);
    document.getElementById('progress-bar').style.width = newPercentage + "%";
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.getElementById("progress-bar").innerHTML = minutes + ":" + seconds;
    //chrome.browserAction.setBadgeText({text:  minutes + ": " + seconds});
    percent = document.getElementById('progress-bar').style.width;
    // If the count down is finished, write some text

    if (distance <= 0) {
        // document.getElementById("progress-bar").innerHTML = "00:00";
        // clearInterval(refreshDisplayTimeout);
        document.getElementById("progress-bar").style.color = "white";
        if (isWork == true) {

            isWork = false;
            localStorage.setItem("state", isWork);
            document.getElementById("progress-bar").style.background = "#62c462";
            time = breakTime;
            if (countWork == 3) {
                if (sound == true)
                    audio3.play();
                countWork = 0;

                localStorage.setItem("countWork", countWork);
                isLongBreak = true;
                localStorage.setItem("stateBreak", isLongBreak);
                document.getElementById("progress-bar").style.background = "#bbb6e2";
                document.getElementById("progress-bar").innerHTML = longBreak + ":00";
                document.getElementById('progress-bar').style.width = 100 + "%";
                time = longBreak;
                document.getElementById("whatTime").innerHTML = "It's time for long break";

            } else {
                if (sound == true)
                    audio2.play();
                ++countWork;
                localStorage.setItem("countWork", countWork);
                document.getElementById("whatTime").innerHTML = "Break time";
                document.getElementById('progress-bar').style.width = 100 + "%";
                document.getElementById("progress-bar").innerHTML = breakTime + ":00";
            }
        }
        else {
            if (sound == true)
                audio2.play();
            isWork = true;
            document.getElementById("whatTime").innerHTML = "Work time";
            localStorage.setItem("state", isWork);
            document.getElementById("progress-bar").style.background = "#ff9882";
            document.getElementById('progress-bar').style.width = 100 + "%";
            document.getElementById("progress-bar").innerHTML = work + ":00";
            time = work;
            if (isLongBreak == true) {
                isLongBreak = false;
                localStorage.setItem("stateBreak", isLongBreak);
                countWork = 0;
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
            document.getElementById("progress-bar").innerHTML = minutes + ":" + seconds;
            //chrome.browserAction.setBadgeText({text:  minutes + ": " + seconds});
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
    hide("settings-change");
    showInline("pause");
    countDownDate = countDownDate + c * 1000;
    c = 0;
    clearTimeout(myTimer);
    refreshDisplayTimeout = setTimeout(refreshDisplay, 1000);


}

function restart() {
    hide("resume");
    hide("pause");
    hide("settings-change");
    showInline("start");
    hide("stop");
    hide("restart");
    localStorage.clear();
    c = 0;
    countWork = 0;
    isWork = true;
    document.getElementById("whatTime").innerHTML = "Work time";
    isLongBreak = false;
    document.getElementById("progress-bar").style.background = "#ff9882";
    document.getElementById("progress-bar").innerHTML = work + ":00";


    work = 25;
    breakTime = 5;
    longBreak = 20;
    time = work;
    document.getElementById("change-work-minutes").value = work;
    document.getElementById("work-time").innerHTML = work;
    document.getElementById("work-time-interval").innerHTML = work;


    document.getElementById("change-break-minutes").value = breakTime;
    document.getElementById("break-time").innerHTML = breakTime;
    document.getElementById("break-time-interval").innerHTML = breakTime;


    document.getElementById("change-longBreak-minutes").value = longBreak;
    document.getElementById("longBreak-time").innerHTML = longBreak;
    document.getElementById("longBreak-time-interval").innerHTML = longBreak;


    clearTimeout(myTimer);


}

function stop() {
    hide("pause");
    hide("stop");
    hide("settings-change");
    hide("settings-change");
    showInline("start");
    //stop
    clearTimeout(refreshDisplayTimeout);
}

function pause() {
    hide("pause");
    hide("settings-change");
    showInline("resume")
    hide("settings-change");
    myTimer = setInterval(myCounter, 1000)
    clearTimeout(refreshDisplayTimeout);
}

function myCounter() {
    ++c;
}

function setTimer() {
    hide("settings-change");
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
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    document.getElementById("progress-bar").innerHTML = minutes + ":" + seconds;


    refreshDisplay();


}

function settings() {

    show("settings-change");
    hide("settings");
    showInline("close-settings");
    hide("pause");
    hide("stop");
    showInline("start");

    clearTimeout(refreshDisplayTimeout);

    var longBreakSlider = document.getElementById("change-longBreak-minutes");
    var longBreakOutput = document.getElementById("longBreak-time");
    longBreakOutput.innerHTML = longBreakSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    longBreakSlider.oninput = function () {
        longBreakOutput.innerHTML = this.value;
        document.getElementById("longBreak-time-interval").innerHTML = this.value;
        longBreak = this.value;
        localStorage.setItem("longBreak", longBreak);
        showInline("restart");
        if (isLongBreak == true) {
            document.getElementById("progress-bar").innerHTML = longBreak + ":00";
            time = longBreak;
        }
    }

    var breakSlider = document.getElementById("change-break-minutes");
    var breakOutput = document.getElementById("break-time");
    breakOutput.innerHTML = breakSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    breakSlider.oninput = function () {
        breakOutput.innerHTML = this.value;
        document.getElementById("break-time-interval").innerHTML = this.value;
        breakTime = this.value;
        localStorage.setItem("breakTime", breakTime);
        showInline("restart");
        if (isLongBreak != true) {
            if (isWork != true) {
                time = breakTime;
                document.getElementById("progress-bar").innerHTML = breakTime + ":00";
                document.getElementById("whatTime").innerHTML = "Break time";
            }
        }
    }

    var workSlider = document.getElementById("change-work-minutes");
    var workOutput = document.getElementById("work-time");
    workOutput.innerHTML = workSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    workSlider.oninput = function () {
        workOutput.innerHTML = this.value;
        document.getElementById("work-time-interval").innerHTML = this.value;
        work = this.value;
        localStorage.setItem("work", work);
        showInline("restart");
        if (isWork == true) {
            time = work;
            document.getElementById("progress-bar").innerHTML = work + ":00";
            document.getElementById("whatTime").innerHTML = "Work time";
        }
    }


}

function csettings() {
    hide("settings-change");
    showInline("settings");
    hide("close-settings");


}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function notif() {
    if (document.getElementById("non").checked) {
        sound = false;
    } else if (document.getElementById("sound").checked) {
        sound = true;
        localStorage.setItem("sound", sound);
    }
document.getElementById("save-notification").innerHTML = "Your choice was saved!";
    document.getElementById("save-notification").style.background = "#ff5e44";
    setTimeout(function() {
        document.getElementById("save-notification").innerHTML = "Save notification settings";
        document.getElementById("save-notification").style.background = "#bbb6e2";
    }, 1000);

}
