var ctx = document.getElementById('project_processing_chart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['В обработке', 'Отклонено', 'Одобрено'],
        datasets: [{
            data: [55, 55, 55],
            backgroundColor: ['#A5A5A5', '#4472C4', '#ED7D31'],
            borderWidth: 0.5,
            borderColor: '#ddd'
        }]
    },
    options: {
        title: {
            display: true,
            position: 'top',
            fontSize: 26,
            text: 'Количество проектов',
            fontColor: '#111',
            padding: 20
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 20,
                fontColor: '#111',
                padding: 15,
                fontSize: 19,
                filter: (legendItem, data) => {
                    const labelIndex = data.labels.indexOf(legendItem.text);
                    legendItem.text = legendItem.text + " - " + data.datasets[0].data[labelIndex];
                    return true
                  }
            }
        },
        tooltips: {
            enabled: true,
        },
        plugins: {
            datalabels: {
                color: '#111',
                textAlign: 'center',
                font: {
                    lineHeight: 1.6
                },
                formatter: function(value, ctx) {
                    return ctx.chart.data.labels[ctx.dataIndex] + '\n' + value + '%';
                }
            }
        }
    }
});


var ctx = document.getElementById('intersections_chart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['С пересечениями', 'Без пересечений'],
        datasets: [{
            data: [55, 45],
            backgroundColor: ['#456086', '#A5A5A5'],
            borderWidth: 0.5,
            borderColor: '#ddd'
        }]
    },
    options: {
        title: {
            display: true,
            position: 'top',
            fontSize: 26,
            text: 'Пересечения',
            fontColor: '#111',
            padding: 20
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 20,
                fontColor: '#111',
                padding: 15,
                fontSize: 19,
                filter: (legendItem, data) => {
                    const labelIndex = data.labels.indexOf(legendItem.text);
                    legendItem.text = legendItem.text + " - " + data.datasets[0].data[labelIndex] + '%';
                    return true
                  }
            }
        },
        tooltips: {
            enabled: true,
            callbacks: {
                label: function(tooltipItem, data) {

                    let label = data.labels[tooltipItem.index];
                    let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return ' ' + label + ': ' + value + ' %';

                }
            }
        },
        plugins: {
            datalabels: {
                color: '#111',
                textAlign: 'center',
                font: {
                    lineHeight: 1.6
                },
                formatter: function(value, ctx) {
                    return ctx.chart.data.labels[ctx.dataIndex] + '\n' + value + '%';
                }
            }
        }
    }
});


new Chart(document.getElementById("budget_chart"), {
    type: 'horizontalBar',
    data: {
      labels: ["Максимальный", "Средний", "Минимальный"],
      datasets: [
        {
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [10000000, 1000000, 500100]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Бюджет',
        position: 'top',
        fontSize: 26,
        padding: 20,
        fontColor: '#111',
      },
      scales: {
        xAxes: [{
            ticks: {
                min: 10000
            }
        }],
        yAxes: [{
            ticks: {
                fontSize: 17,
                fontColor: '#111'
            },
        }]
    }
}
});



var ctx = document.getElementById('process_work_сhart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Еще не начали работу', 'В работе', 'Закончили работу'],
        datasets: [{
            label: 'Процесс работы',
            data: [97, 65, 79],
            backgroundColor: [
                'rgba(69, 96, 134, 1)',
                'rgba(165, 165, 165, 1)',
                'rgba(135, 97, 132, 1)',
            ],
            borderColor: [
                'rgba(69, 96, 134, 1)',
                'rgba(165, 165, 165, 1)',
                'rgba(135, 97, 132, 1)',
            ],
            borderWidth: 1,
        }]
    },
    options: {
        datasets: {
            bar: {
                barPercentage: 0.4,
                categoryPercentage: 0.6
            }
          },
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Процесс работы',
            position: 'top',
            fontSize: 26,
            padding: 20,
            fontColor: '#111',
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 20
                }
            }],
            xAxes: [{
                ticks: {
                    fontSize: 17,
                    fontColor: '#111'
                },
                // barPercentage: 0.4,
                // categoryPercentage: 0.6
            }]
        }
    }
});