let menuElements = document.querySelectorAll('.nav-item-link');
let blackoutForm = document.getElementById('blackout');
let addReqForm = document.getElementById('form');
let addReqButton = document.getElementById('add_request');

const fileUpload = document.querySelector('#file-upload');
const fileUploadLabel = document.querySelector('.custom-file-upload');
const fileUploadLabelText = document.querySelector('.custom-file-upload p');

var form = document.querySelector('form');

fileUpload.addEventListener('change', () => {
    if (fileUpload.files.length > 0) {
      const fileName = fileUpload.files[0].name;
      fileUploadLabelText.textContent = fileName;
    }
});

addReqButton.addEventListener('click', () => {
    blackoutForm.style.display = 'block';
    addReqForm.style.display = 'block';
    var text = form.querySelector('.form-text');
    text.innerHTML = 'Загрузите документ в формате<br> <b>.pdf</b> или <b>.doc</b>';
});


blackoutForm.onclick = () => {
    blackoutForm.style.display = 'none';
    addReqForm.style.display = 'none';
};

menuElements.forEach(element => {
    element.addEventListener('click', () => {
        menuElements.forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    });
});


form.addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(form);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload_file');
    xhr.send(formData);
    xhr.onload = function() {
        var jsonText = JSON.parse(xhr.responseText);
        if (jsonText['status'] === "Success") {
            var text = form.querySelector('.form-text');
            text.textContent = "Файл " + jsonText["filename"] + " был успешно отправлен";
        } 
        else if (jsonText['status'] === "EmptyFile"){
            var text = form.querySelector('.form-text');
            text.textContent = 'Вы не выбрали файл, либо он оказался пустым'
        }
        else if (jsonText['status'] === "TooMuch"){
            var text = form.querySelector('.form-text');
            text.textContent = "Файл " + jsonText["filename"] + " превышает допустимый размер";
        }
        form.reset();
    };
});


// Граф
var values = [35, 41, 31, 40, 27];

// Метки для оси x
var labels = ['2022', '2021', '2020', '2019', '2018'];

var colors = ['#456086', "#F8BD8D", "844685", "456086", "CCC1BE"] 

// Максимальное значение
var maxValue = Math.max.apply(null, values);

// Контейнер гистограммы
var chart = document.querySelector('.chart');

// Высота контейнера гистограммы
var chartHeight = chart.offsetHeight;

// Ось x
var xAxis = chart.querySelector('.x-axis');

// Высота оси x
var xAxisHeight = xAxis.offsetHeight;

// Ширина столбца гистограммы
// var barWidth = (100 / values.length) - 4;
var marginRight = 10;
var barWidth = (100 - marginRight * (values.length - 1)) / values.length
// Вычисляем высоту столбцов гистограммы
var barHeights = values.map(function(value) {
    return (value / maxValue) * (chartHeight - xAxisHeight);
});

// Добавляем столбцы гистограммы и значения над столбцами
values.forEach(function(value, index) {
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = barWidth + '%';
    bar.style.height = barHeights[index] + 'px';
    bar.style.backgroundColor = colors[index];
    bar.style.left = (index * (barWidth + marginRight)) + '%';

    var barValue = document.createElement('div');
    barValue.className = 'bar-value';
    barValue.textContent = value;

    bar.appendChild(barValue);
    chart.appendChild(bar);
});

// Добавляем значения на ось x
labels.forEach(function(label, index) {
    var xAxisValue = document.createElement('div');
    xAxisValue.className = 'x-axis-value';
    xAxisValue.style.width = barWidth + '%';
    xAxisValue.style.left = (index * (barWidth + marginRight))+ '%';
    xAxisValue.textContent = label;

    console.log(barWidth);

    xAxis.appendChild(xAxisValue);
});
// конец графа