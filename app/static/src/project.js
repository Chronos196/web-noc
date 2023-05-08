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

    xAxis.appendChild(xAxisValue);
});
// конец графа