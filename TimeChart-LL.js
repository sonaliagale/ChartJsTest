function formatData(chartData) {
    chartData.forEach(function (item) {
        const result = item.totals.map(a => ({ x: a.date, y: a.count }))
        item.totals = result;
    });
    return chartData;
}
function getDataSet(dataset) {
    const data = formatData(dataset)
    const chartData = createBarConfiguration(data)
    return chartData;
}

function createBarConfiguration(data) {
    const configData = [];
    for (let i = 0; i < data.length; i++) {
        const details = data[i];
        const chartDetails = {
            label: details.label,
            //  barPercentage: 1,
            barThickness: BAR_THICKNESS,
            borderSkipped: 'middle',
            // categoryPercentage: 0.4,
            backgroundColor: BACKGROUND_COLOR[details.label.replace(' ', '')],
            borderColor: BORDER_COLOR[details.label.replace(' ', '')],
            borderWidth: {
                top: 1,
                right: 1,
                left: 1,
                bottom: 0
            },
            data: details.totals,
        }
        configData.push(chartDetails);
    }
    return configData;
}
function createLegendBullet(item) {
    const legendBullet = document.createElement('span');//box
    legendBullet.style.backgroundColor = item.fillStyle;
    legendBullet.style.border = '1px solid ' + item.strokeStyle;
    legendBullet.classList.add("itemMaker");
    return legendBullet;
}

function generateCustomLegend(timeChart) {
    //Generate custom legend
    const legendItems = timeChart?.legend?.legendItems;
    const legendContainer = document.getElementById("legend");
    legendContainer.innerHTML = '';

    // Create HTML for legend items
    for (let i = 0; i < legendItems.length; i++) {
        const item = legendItems[i];
        const text = document.createTextNode(item.text);
        const listItem = document.createElement('li');
        listItem.className = "legendItem";
        const legendBullet = createLegendBullet(item);
        const itemText = document.createElement('span');
        itemText.className = "legendLabel";
        listItem.appendChild(legendBullet);
        listItem.appendChild(itemText);
        itemText.appendChild(text);
        legendContainer.appendChild(listItem);
    }
}

function convertDateFormat(str) {
    const dateObj = new Date(str);
    const formattedDate = dateObj.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    return formattedDate;
}

function getXaxisLabels(strDate) {
    const dateObj = new Date(strDate);
    const formattedDate = dateObj.toLocaleString([], {
        month: 'short',
        day: 'numeric'
    });
    if (dateObj.getDate() === 15) {
        return dateObj.getDate();
    }
    if (dateObj.getDate() === 1) {
        return formattedDate;
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
        legend: {
            display: false,
            labels: {
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
            }
        },

    },
    interaction: {
        intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                fontFamily: "Segoe UI",
                fontSize: 12,
                fontWeight: 400,
                callback: function (val) {
                    return getXaxisLabels(val)
                },
            },
            type: 'time',
            time: {
                unit: 'day',
                displayFormats: {
                    'day': "MMM dd",
                },
                tooltipFormat: TOOLTIP_DATE_FORMAT
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

