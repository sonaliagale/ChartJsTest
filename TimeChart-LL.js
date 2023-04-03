function formateData(chartData) {
    chartData.forEach(function (item) {
        const result = item.totals.map(a => ({ x: a.date, y: a.count }))
        item.totals = result;
    });
    return chartData;
}
function getDataSet(formatData) {
    const data = formateData(formatData)
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const details = data[i];
        const chartDetails = {
            label: details.label,
            //barPercentage: 1,
            barThickness: barThickness,
            //categoryPercentage: 1,
            backgroundColor:  backgroundColor && backgroundColor[details.label.replace(' ', '')],
            borderColor:  borderColor && borderColor[details.label.replace(' ', '')],
            borderWidth: 1,
            data: details.totals,
        }
        result.push(chartDetails);
    }
    return result;
}

function generateCustomLegend(timeChart) {
    //Generate custom legend
    const legendItems = timeChart.legend.legendItems;
    const legendContainer = document.getElementById("legend");
    legendContainer.innerHTML = '';

    // Create HTML for legend items
    for (let i = 0; i < legendItems.length; i++) {
        const item = legendItems[i];
        const text = document.createTextNode(item.text);
        const color = item.fillStyle;
        const listItem = document.createElement('li');
        const itemMarker = document.createElement('span');//box
        const itemText = document.createElement('span');//text
        listItem.appendChild(itemMarker);
        listItem.appendChild(itemText);
        itemMarker.style.backgroundColor = color;
        itemMarker.style.border = '1.5px solid ' + color;

        itemMarker.classList.add("itemMaker");
        itemText.appendChild(text);
        legendContainer.appendChild(listItem);
    }

}

const barChartOptions = {
    responsive: true,
    clip: false,
    layout: {
        padding: {
            left: 0,
            right: 50,
            top: 0,
            bottom: 0
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                title: function (context) {
                    const d = new Date(context[0].raw.x);
                    const formattedDate = d.toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    return formattedDate;
                }
            }
        },
        legend: {
            display: false,
            position: "top",  //top/bottom/left/right
            align: "start",  //start/center/end
            maxWidth: 10,
            maxRows: 2,
            labels: {
                boxWidth: 15,
                generateLabels: (chart) => {
                    return Chart.defaults.plugins.legend.labels.generateLabels(chart).map(function (label) {
                        let dataset = chart.data.datasets[label.datasetIndex];
                        let total = 0;
                        for (let j = 0; j < dataset.data.length; j++)
                            total += dataset.data[j].y;
                        label.text = dataset.label + '-' + total;
                        return label;
                    });
                }
            },
        },

    },
    interaction: {
        intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                callback: function (val, index) {
                    const d = new Date(val);
                    const formattedDate = d.toLocaleString([], {
                        //year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    if (d.getDate() === 15) {
                        return d.getDate();
                    }
                    if (d.getDate() === 1) {
                        return formattedDate;
                    }

                },

            },
            type: 'time',
            time: {
                unit: 'day',
                stepSize: 200,
                displayFormats: {
                    'day': 'MMM dd',
                }
            },
            stacked: true,
            grid: {
                display: false
            }
        },
        y: {
            display: false,
            stacked: true,
            grid: {
                display: false
            }
        },
    },
    title: {
        display: true,
        text: "Chart.js Bar Chart"
    }
}


const barChartData = {
    datasets: getDataSet(chartData.aggregates)
};


const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: barChartOptions
});
generateCustomLegend(myChart);



function selectDays() {
    const selectedDayCount = document.querySelector('#days')
    if (selectedDayCount.options[selectedDayCount.selectedIndex].value === "100") {
        myChart.data.datasets = getDataSet(chartData2.aggregates);
        myChart.update();
        generateCustomLegend(myChart);

    }
}

function selectUnit() {
    const selectedUnit = document.querySelector('#unit')
    myChart.config.options.scales.x.time.unit = selectedUnit.options[selectedUnit.selectedIndex].value;
    if ("week" === selectedUnit.options[selectedUnit.selectedIndex].value) {
        myChart.config.options.scales.x.time.displayFormats = { "week": "MMM dd" }
    }
    myChart.update();

}
function selectType() {
    const selectedScaleType = document.querySelector('#type')
    myChart.config.options.scales.x.type = selectedScaleType.options[selectedScaleType.selectedIndex].value;
    myChart.update();
}

