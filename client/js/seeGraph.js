const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const selectMode = $("#select-mode");

var dataDraw = [];
displayNone = function (mess) {
    $$(".extra-mode div").forEach((element) => {
        element.classList.add("display-none");
    });
    if (mess === true) {
        $(".mess").innerHTML = "Please select display mode !!!";
    } else {
        $(".mess").innerHTML = "";
    }
};
checkValueInput = function (select) {
    var value = $(`input[name=${select}]`).value;
    if (value === "") {
        return false;
    } else {
        return value;
    }
};

checkInput = function () {
    var value;
    if (selectMode.value === "") {
        displayNone(true);
        value = false;
    } else if (selectMode.value === "day") {
        displayNone(false);
        value = checkValueInput("day");
        $("#day").classList.remove("display-none");
    } else if (selectMode.value === "month") {
        displayNone(false);
        value = checkValueInput("month");
        $("#month").classList.remove("display-none");
    } 
    return value;
};
$("#select-mode").onchange = function () {
    checkInput();
};

$(".see-submit").onclick =async function () {
    var valueInput = checkInput();
    if (valueInput === false) {
    } else {
        let dataDraw =[];
        await  fetch(BASE_URL + `valuesensor/${selectMode.value}/sensor/${valueInput}`)
        .then((res) => res.json())
        .then((data) => {
            dataDraw = convertArrValue(data.value, selectMode.value);
        });
        
        //Xử lí khi ngày/ Tháng không có dữ liệu
        if (dataDraw[1].length === 0 || dataDraw[1].length === 0) {
            $(".charting-notice").innerHTML = `No data for this ${selectMode.value} !
            <br/>Please select another ${selectMode.value} ...`;
            $("#container").classList.add("display-none");
        } else {
            $("#container").classList.remove("display-none");
            $(".charting-notice").innerHTML = "";
            
            drawChart(dataDraw, valueInput);
        }
    }
};

function convertArrValue(data, mode) {
    let valueTemperaturs = [];
    let valueHumiditys = [];
    let times = [];
    let dates = [];
    if (data !== undefined) {
        for (const i in data) {
            valueTemperaturs.push(parseFloat(data[i].temperature));
            valueHumiditys.push(parseFloat(data[i].humidity));

            if (mode === "day") {
                dates = data[0].date;
                times.push(data[i].time.slice(0, 5));
            }
            if (mode === "month") {
                var day = data[i].date.split("-")[2];
                times.push("Ngày " + day + "_" + data[i].time.slice(0, 5));
            }
        }
    }
    return [dates, times, valueTemperaturs, valueHumiditys];
}
function drawChart(dataDraw, subtitle) {
    var date = dataDraw[0];
    var time = dataDraw[1];
    var categories = dataDraw[1];
    var valueTemperature = dataDraw[2];
    var valueHumidity = dataDraw[3];
    Highcharts.chart("container", {
        chart: {
            type: "line",
        },
        title: {
            text: "Temperature/humidity chart",
            style: {
                fontSize: "18px",
                fontFamily: "Times New Roman",
                color: "#32CD32",
            },
        },
        subtitle: {
            text: subtitle,
            style: {
                fontSize: "14px",
                fontFamily: "Times New Roman",
                color: "#00FF00",
            },
        },
        xAxis: {
            categories: categories,
            crosshair: false,
            labels: {
                rotation: 0,
                style: {
                    fontSize: "11px",
                    fontFamily: "Verdana, sans-serif",
                    color: "#FFA500",
                },
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: "Value",
            },
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true,
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        exporting: {
           
            buttons: {
                menuItems: ['viewFullscreen', 'printChart', 'separator', 'downloadPNG', 'downloadJPEG'],
            },
        },
        series: [
            {
                name: "Temperature °C",
                data: valueTemperature,
            },
            {
                name: "Humidity %",
                data: valueHumidity,
            },
        ],
    });
}
