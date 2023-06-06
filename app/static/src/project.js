function showChartProject(scopus_stat){
    var scopusData = [];
    var scopusLabels = [];
    for (var key in scopus_stat){
        scopusLabels.push(key);
        scopusData.push(scopus_stat[key]);
    }
    var ctx = document.getElementById('scopus_statistic').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: scopusLabels,
            datasets: [{
                data: scopusData,
                backgroundColor: [
                    '#456086',
                    '#F8BD8D',
                    '#844685',
                    "#456086",
                    "#CCC1BE",
                ],
                borderWidth: 0,
            }]
        },
        options: {
            datasets: {
                bar: {
                    barPercentage: 0.6,
                    categoryPercentage: 0.6
                }
              },
            legend: {
                display: false,
            },
            title: {
                display: scopusData.length ===0 ? true: false,
                text: 'Данных не найдено',
                position: 'top',
                fontSize: 24,
                padding: 40,
                fontColor: '#ff0000',
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 20
                }
            },
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        min: 0
                    }
                }],
                xAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        fontSize: 10,
                        fontColor: '#000000',
                        fontStyle: 600
                    },
                    // barPercentage: 0.6,
                    // categoryPercentage: 0.6
                }]
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                var ctx = chart.ctx;
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
    
                chart.data.datasets.forEach(function(dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                        ctx.fillText(dataset.data[i], model.x, model.y - 5);
                    }
                });
            }
        }]
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