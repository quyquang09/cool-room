const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const toggleLights = $("#toggle-lights");
const toggleFan = $("#toggle-fan");
const toggleAc = $("#toggle-ac");
const togglePowerSave = $("#toggle-power");
const btnMoreFan = $(".more-control-fan");
const btnMoreLight = $(".more-control-light");
const selectSpeedFan = $("#select-speed-fan");
var updates = {};
const user = JSON.parse(localStorage.getItem("user"));
$(".username").innerHTML = user.userInfo.firstname;

function Clock() {
    var current_Hou = new Date().getHours();
    var current_Min = new Date().getMinutes();
    var current_Sec = new Date().getSeconds();
    $(".value-time").innerHTML =
        (current_Hou < 10 ? "0" + current_Hou : current_Hou) +
        " : " +
        (current_Min < 10 ? "0" + current_Min : current_Min) +
        " : " +
        (current_Sec < 10 ? "0" + current_Sec : current_Sec);
}
var Dem_gio = setInterval(Clock, 1000);

toggleLights.addEventListener("click", function () {
    if (toggleLights.checked) {
        $(".status-lights").innerHTML = "Status : ON";
        $(".icon-lights").classList.add("active");
        updates["device/lights/" + "status"] = "on";
        firebase.database().ref().update(updates);
    } else {
        $(".status-lights").innerHTML = "Status : OFF";
        $(".icon-device").classList.remove("active");
        updates["device/lights/" + "status"] = "off";
        firebase.database().ref().update(updates);
    }
});
toggleFan.addEventListener("click", function () {
    if (toggleFan.checked) {
        $(".status-fan").innerHTML = "Status : ON";
        $(".icon-fan").classList.add("active");
        updates["device/fan/" + "status"] = "on";
        firebase.database().ref().update(updates);
    } else {
        $(".status-fan").innerHTML = "Status : OFF";
        $(".icon-fan").classList.remove("active");
        updates["device/fan/" + "status"] = "off";
        firebase.database().ref().update(updates);
    }
});
toggleAc.addEventListener("click", function () {
    if (toggleAc.checked) {
        $(".status-ac").innerHTML = "Status : ON";
        $(".icon-ac").classList.add("active");
        updates["device/" + "ac"] = "on";
        firebase.database().ref().update(updates);
    } else {
        $(".status-ac").innerHTML = "Status : OFF";
        $(".icon-ac").classList.remove("active");
        updates["device/" + "ac"] = "off";
        firebase.database().ref().update(updates);
    }
});
togglePowerSave.addEventListener("click", function () {
    if (togglePowerSave.checked) {
        $(".status-power").innerHTML = "Status : ON";
        $(".icon-power").classList.add("active");
        updates["device/" + "powersave"] = "on";
        firebase.database().ref().update(updates);
    } else {
        $(".status-power").innerHTML = "Status : OFF";
        $(".icon-power").classList.remove("active");
        updates["device/" + "powersave"] = "off";
        firebase.database().ref().update(updates);
    }
});
getThresholdFromFirebase = () => {
    let thresholdHumi;
    let thresholdTemp;
    firebase
        .database()
        .ref("warning")
        .child("temperature")
        .on("value", (snapshot) => {
            thresholdTemp = snapshot.val();
            thresholdTemp = Math.round(thresholdTemp);
        });
    firebase
        .database()
        .ref("warning")
        .child("humidity")
        .on("value", (snapshot) => {
            thresholdHumi = snapshot.val();
            thresholdHumi = Math.round(thresholdHumi);
        });
    return { thresholdTemp, thresholdHumi };
};
const requestSendEmail = async (type, value) => {
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let currentDate = year + "-" + month + "-" + day;
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let time = hours + ":" + minutes + ":" + seconds;

    let user = JSON.parse(localStorage.getItem("user"));
    let data = {
        type: type,
        date: currentDate,
        time: time,
        value: value + "",
        email: user.userInfo.email,
        firstname: user.userInfo.firstname,
    };
    await fetch(BASE_URL + "send-email-warning", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        "Content-Type": "application/x-www-form-urlencoded",
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        });
};
function getvalueSsTemperatue() {
    firebase
        .database()
        .ref("sensor")
        .child("temperature")
        .on("value", (snapshot) => {
            let thresholdTemp = getThresholdFromFirebase().thresholdTemp;
            let valueSstemp = snapshot.val();
            valueSstemp = Math.round(valueSstemp);
            $(".value-tempera").innerHTML = `${valueSstemp}°C   --- ${Math.round(
                valueSstemp * 1.8 + 32
            )}°F`;
            if (valueSstemp >= thresholdTemp) {
                $(".value-tempera").classList.add("text-color-red");
                requestSendEmail("temperature", valueSstemp);
            } else {
                $(".value-tempera").classList.remove("text-color-red");
            }
        });
}

function getvalueSsHumidity() {
    firebase
        .database()
        .ref("sensor")
        .child("humidity")
        .on("value", (snapshot) => {
            let thresholdHumi = getThresholdFromFirebase().thresholdHumi;
            let valueSsHumidity = snapshot.val();
            valueSsHumidity = Math.round(valueSsHumidity);
            $(".value-humidity").innerHTML = `${valueSsHumidity} %`;
            if (valueSsHumidity >= thresholdHumi) {
                $(".value-humidity").classList.add("text-color-red");
                requestSendEmail("humidity", valueSsHumidity);
            } else {
                $(".value-humidity").classList.remove("text-color-red");
            }
        });
}

$("#log-out").addEventListener("click", function () {
    var ss = confirm("bạn có muốn đăng xuất");
    if (ss === true) {
        localStorage.setItem(
            "user",
            JSON.stringify({
                isLoggedIn: false,
                userInfo: {},
            })
        );
        window.location.href = "login.html";
    }
});

btnMoreFan.addEventListener("click", () => {
    let isMore = $(".control-fan").offsetHeight === 150;
    if (!isMore) {
        $(".sub-control-fan").classList.add("display-none");
        btnMoreFan.innerHTML = "⊻";
    } else {
        $(".sub-control-fan").classList.remove("display-none");
        btnMoreFan.innerHTML = "⊼";
    }
});
btnMoreLight.addEventListener("click", () => {
    let isMore = $(".control-light").offsetHeight === 150;
    if (!isMore) {
        $(".sub-control-light").classList.add("display-none");
        btnMoreLight.innerHTML = "⊻";
    } else {
        $(".sub-control-light").classList.remove("display-none");
        btnMoreLight.innerHTML = "⊼";
    }
});
$("#select-handwork").addEventListener("change", () => {
    $(".sub-handword").classList.remove("display-none");
    updates["device/fan/" + "mode"] = "hand";
    firebase.database().ref().update(updates);
});
$("#select-auto").addEventListener("change", () => {
    $(".sub-handword").classList.add("display-none");
    updates["device/fan/" + "mode"] = "auto";
    firebase.database().ref().update(updates);
});

selectSpeedFan.addEventListener("change", () => {
    let valueInput = +selectSpeedFan.value;
    updates["device/fan/" + "speed"] = valueInput;
    firebase.database().ref().update(updates);
});
getvalueSsHumidity();
getvalueSsTemperatue();

// set value ranger
var newValueIntensity;
const range = $("#range"),
    rangeV = $("#rangeV");
const setValue = () => {
    newValueIntensity = Number(
        ((range.value - range.min) * 100) / (range.max - range.min)
    );
    let newPosition = 10 - newValueIntensity * 0.2;

    rangeV.innerHTML = `<span>${range.value}</span>`;
    rangeV.style.left = `calc(${newValueIntensity}% + (${newPosition}px))`;
};
const sendvalueFirebase = () => {
    if (toggleLights.checked) {
        updates["device/lights/" + "intensity"] = newValueIntensity;
        firebase.database().ref().update(updates);
    } else {
        alert("Please turn on the lights first");
    }
};
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener("input", setValue);
range.addEventListener("mouseup", sendvalueFirebase);
