function showChartProject(){
    var values = [35, 41, 31, 40, 27];
    var labels = ['2022', '2021', '2020', '2019', '2018'];
    var colors = ['#456086', "#F8BD8D", "844685", "456086", "CCC1BE"] 

    var maxValue = Math.max.apply(null, values);
    var chart = document.querySelector('.chart');

    var chartHeight = chart.offsetHeight;
    var xAxis = chart.querySelector('.x-axis');
    var xAxisHeight = xAxis.offsetHeight;

    var marginRight = 10;

    var barWidth = (100 - marginRight * (values.length - 1)) / values.length
    var barHeights = values.map(function(value) {
        return (value / maxValue) * (chartHeight - xAxisHeight);
    });

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

    labels.forEach(function(label, index) {
        var xAxisValue = document.createElement('div');
        xAxisValue.className = 'x-axis-value';
        xAxisValue.style.width = barWidth + '%';
        xAxisValue.style.left = (index * (barWidth + marginRight))+ '%';
        xAxisValue.textContent = label;

        xAxis.appendChild(xAxisValue);
    });
}

const makeKeywordsLis  = (keywords) =>{
    result = "";
    for(var keyword in keywords){
        result += `<li class="project_keyword_item">#${keywords[keyword]}</li>`
    }
    return result;
};

const uniquenessDetails = (direction, keywords, matchPercent) =>(
    `
    <h3 class="sum_data_title">Сравнение проектов НОЦ</h3>
    <p class="sum_data_direction">Направление: <b>${direction}<b><p>
    <div class="match_info">
    <p class="match_text">Процент совпадения <span class="match_percent">${matchPercent ? matchPercent + '%' : 'Неизвестно'}</span></p>
    </div>
    <div class="project_keywords">
    <p>Ключевые слова</p>
    <ul class="project_keywords_list">
    ${makeKeywordsLis(keywords)}
    </ul>
    </div>
    `
);

function showUniqueness(direction, keywords){
    let uniquenessBlock = document.createElement('div');
    let mainElement = document.querySelector('main');
    let blackoutForm = document.getElementById('blackout');
    uniquenessBlock.classList.add('uniqueness_details');
    uniquenessBlock.innerHTML = uniquenessDetails(direction, keywords);
    mainElement.parentNode.insertBefore(uniquenessBlock, mainElement.nextSibling);
    blackoutForm.style.display = 'block';
};