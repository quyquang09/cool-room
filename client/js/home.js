const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const firebaseConfig = {
    apiKey: "AIzaSyBfPVK97MC_9hov7K7mssswtbSuBzLbcCc",
    authDomain: "cool-room.firebaseapp.com",
    databaseURL: "https://cool-room-default-rtdb.firebaseio.com",
    projectId: "cool-room",
    storageBucket: "cool-room.appspot.com",
    messagingSenderId: "260260952595",
    appId: "1:260260952595:web:63e60e00151d4cfcaa1de6"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const toggleLights=$('#toggle-lights')
const toggleFan =$('#toggle-fan')
const toggleAc=$('#toggle-ac')
const togglePowerSave =$('#toggle-power')

var updates ={}
const user = JSON.parse(localStorage.getItem('user'));
$('.username').innerHTML=user.userInfo.firstname;

function Clock() {
    var current_Hou = new Date().getHours();
    var current_Min = new Date().getMinutes();
    var current_Sec = new Date().getSeconds();
    $('.value-time').innerHTML = (current_Hou<10?'0'+current_Hou:current_Hou ) + ' : '+
                                (current_Min<10?'0'+current_Min:current_Min ) + ' : '+
                                (current_Sec<10?'0'+current_Sec:current_Sec );
}
var Dem_gio = setInterval(Clock, 1000);


toggleLights.addEventListener('click',function(){
    if(toggleLights.checked){
        $('.status-lights').innerHTML= 'Status : ON'
        $('.icon-lights').classList.add('active')
        updates['device/' + 'lights'] = 'on';
        firebase.database().ref().update(updates);
    }
    else {
        $('.status-lights').innerHTML= 'Status : OFF';
        $('.icon-device').classList.remove('active')
        updates['device/' + 'lights'] = 'off';
        firebase.database().ref().update(updates);
    }
})
toggleFan.addEventListener('click',function(){
    if(toggleFan.checked){
        $('.status-fan').innerHTML= 'Status : ON';
        $('.icon-fan').classList.add('active')
        updates['device/' + 'fan'] = 'on';
        firebase.database().ref().update(updates);
    }
    else {
        $('.status-fan').innerHTML= 'Status : OFF';
        $('.icon-fan').classList.remove('active')
        updates['device/' + 'fan'] = 'off';
        firebase.database().ref().update(updates);
    }
})
toggleAc.addEventListener('click',function(){
    if(toggleAc.checked){
        $('.status-ac').innerHTML= 'Status : ON'
        $('.icon-ac').classList.add('active')
        updates['device/' + 'ac'] = 'on';
        firebase.database().ref().update(updates);
    }
    else {
        $('.status-ac').innerHTML= 'Status : OFF';
        $('.icon-ac').classList.remove('active')
        updates['device/' + 'ac'] = 'off';
        firebase.database().ref().update(updates);
    }
})
togglePowerSave.addEventListener('click',function(){
    if(togglePowerSave.checked){
        $('.status-power').innerHTML= 'Status : ON'
        $('.icon-power').classList.add('active')
        updates['device/' + 'powersave'] = 'on';
        firebase.database().ref().update(updates);
    }
    else {
        $('.status-power').innerHTML= 'Status : OFF';
        $('.icon-power').classList.remove('active')
        updates['device/' + 'powersave'] = 'off';
        firebase.database().ref().update(updates);
    }
})
function getvalueSsTemperatue(){
    firebase.database().ref("sensor").child('temperature').on("value",snapshot=>{
        valueSstemp = snapshot.val();
        valueSstemp =Math.round(valueSstemp)
        $('.value-tempera').innerHTML =(`${valueSstemp}°C   --- ${Math.round((valueSstemp*1.8+32))}°F`)
    }) 
}

 function getvalueSsHumidity(){
    firebase.database().ref("sensor").child('humidity').on("value",snapshot=>{
        valueSsHumidity = snapshot.val();
        valueSsHumidity =Math.round(valueSsHumidity)
        console.log(valueSsHumidity)
        $('.value-humidity').innerHTML=(`${valueSsHumidity} %`)
    })
}

$('#log-out').addEventListener('click',function(){
    var ss = confirm('bạn có muốn đăng xuất')
    if(ss===true){
        localStorage.setItem(
            'user',
            JSON.stringify({
                isLoggedIn: false,
                userInfo: {},
            }),
            );
        window.location.href ='login.html';
    }
})
getvalueSsHumidity();
getvalueSsTemperatue();
