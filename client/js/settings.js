const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var updates ={}
$('#confirm-sample').addEventListener('click',function(){
    let valueInput = $('#value-sample').value;
    let inputInit = $('#select-unit').value;
    if(!valueInput) {
        $('.mess-sample').innerHTML ="Please enter the value !!!"
    }else {
        let check = checkNumber(valueInput)
        if(!check) {
            $('.mess-sample').innerHTML ="Please enter numeric value !!!"
        } else {
            $('.mess-sample').innerHTML ="";
            updates['sensor/sample/' + 'value'] = check;
            updates['sensor/sample/' + 'init'] = inputInit;
            firebase.database().ref().update(updates);
        }
    }
})
$('#confirm-warning').addEventListener('click',function(){
    let inputTemp = $('#value-temp').value;
    let inputHumi = $('#value-humi').value;
    if(!inputTemp || !inputHumi) {
        $('.mess-warning').innerHTML ="Please enter the value !!!"
    }else {
        let checkTemp = checkNumber(inputTemp);
        let checkHumi = checkNumber(inputHumi);
        if(!checkTemp || !checkHumi) {
            $('.mess-warning').innerHTML ="Please enter numeric value !!!"
        } else {
            $('.mess-warning').innerHTML ="";
            updates['warning/' + 'humidity'] = checkHumi;
            updates['warning/' + 'temperature'] = checkTemp;
            firebase.database().ref().update(updates);
        }
    }
})
const checkNumber= (inputNumber)=>{
    valueInput = +inputNumber;
    if(!valueInput) {
        return false;
    }else {
        return valueInput;
    }
}