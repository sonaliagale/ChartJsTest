
function formatData(chartData) {
    chartData.forEach(function (item) {
        //set data in x,y and data format
        const result = item.totals.map(total => (
            {
                x: total.date, y: total.count,
                data: total.details && total.details.length > 0
                    && total.details.map(obj => ({ time: obj.time, text: getMessage(obj, item.label) }))
            }))
        item.totals = result;
    });
    return chartData;
}

function getMessage(details, label) {
    label = label.replace(' ', '');
    return details.fullName + messageLabel[label] + details.fileName;
}

function getDataSet(dataset) {
    const data = formatData(dataset)
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

function createLegendBullet(item) {
    const color = item.fillStyle;
    const legendBullet = document.createElement('span');//box
    legendBullet.style.backgroundColor = color;
    legendBullet.style.border = '1.5px solid ' + color;
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
        const legendBullet = createLegendBullet(item);
        const itemText = document.createElement('span');
        listItem.appendChild(legendBullet);
        listItem.appendChild(itemText);
        itemText.appendChild(text);
        legendContainer.appendChild(listItem);
    }
}


function hideTooltip() {
    const tooltipEl = document.getElementById('chartjs-tooltip');
    document.addEventListener('click', (e) => {
        if (tooltipEl && tooltipEl.contains(e.target)) {
            return;
        }
        // Otherwise, hide the tooltip
        tooltipEl.style.opacity = 0;
        tooltipEl.style.pointerEvents = 'none';
    });
}

function removeOldElement(ulRoot) {
    // Remove old children
    if (ulRoot && ulRoot.firstChild) {
        while (ulRoot.firstChild) {
            ulRoot.firstChild.remove();
            ulRoot.style.overflowY = "unset";
        }
    }
}

function getTooltipData(tooltip) {
    let data = [];
    //find extra data
    if (tooltip.dataPoints) {
        const dataP = tooltip.dataPoints;
        dataP && dataP.length > 0 && dataP.forEach(function (x) {
            data.push({ backgroundColor: x.dataset.backgroundColor, borderColor: x.dataset.borderColor, data: x.raw.data });
        });
    }

    return data;
}

function updateTooltipBody(tooltipData, ulRoot) {
    let count = 0;
    tooltipData.length > 0 && tooltipData.forEach((item, i) => {
        item.data.length > 0 && item.data.forEach((x, i) => {
            count += 1;
            const timeBoxLiRow = document.createElement('li');
            timeBoxLiRow.textContent = x.time;
            timeBoxLiRow.innerHTML = '<li class=tooltipItem><span class=tooltipColorBox style="border-color: ' +
                item.borderColor + ';background-color: ' + item.backgroundColor + '"></span>' + x.time + '</li>';

            const textLiRow = document.createElement('li');
            textLiRow.innerHTML = '<li>' + x.text + '</li>'

            ulRoot.appendChild(timeBoxLiRow);
            ulRoot.appendChild(textLiRow);

            if (count > 4) {
                ulRoot.style.maxHeight = 200;
                ulRoot.style.overflowY = "scroll";
            }
        });
    })
}

function updateTooltipFooter(tooltipEl) {
    //Link content code
    const linkContent = tooltipEl.querySelector("div");
    // Remove old children
    if (linkContent && linkContent.firstChild) {
        while (linkContent.firstChild) {
            linkContent.firstChild.remove();
        }
    }
    const aTag = document.createElement('a');
    const link = document.createTextNode('See more ');
    aTag.className = 'more-link'
    aTag.target = "_blank"
    aTag.appendChild(link);

    const linkIcon = document.createElement("i");
    linkIcon.className = "fa fa-external-link";
    aTag.appendChild(linkIcon);

    aTag.title = "See more";
    aTag.href = tooltipLink;
    linkContent.appendChild(aTag);
}

function updateTooltipElement(tooltip, ulRoot, tooltipData, tooltipEl) {
    if (tooltip.body) {
        const title = document.createElement('li');
        title.innerHTML = '<b>' + tooltip.title[0] + '</b>'
        title.style.marginBottom = 8;
        ulRoot.appendChild(title);

        updateTooltipBody(tooltipData, ulRoot);
        updateTooltipFooter(tooltipEl);
    }
}

function setTooltipPosition(chart, tooltip, tooltipEl) {
    const {
        offsetLeft: positionX,
        offsetTop: positionY
    } = chart.canvas;


    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
}

const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltipElement(chart);
    const ulRoot = tooltipEl.querySelector('ul');

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    removeOldElement(ulRoot);

    let tooltipData = getTooltipData(tooltip);
    updateTooltipElement(tooltip, ulRoot, tooltipData, tooltipEl)

    setTooltipPosition(chart, tooltip, tooltipEl);
    hideTooltip()
};

const getOrCreateTooltipElement = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.className = 'chartjs-tooltip';

        const listUL = document.createElement('ul');
        listUL.className = 'tooltip-ui';

        const linkContent = document.createElement('div');
        linkContent.id = 'tooltip-link-content';
        linkContent.className = 'tooltip-link';

        tooltipEl.appendChild(listUL);
        tooltipEl.appendChild(linkContent);

        chart.canvas.parentNode.appendChild(tooltipEl);
    }
    return tooltipEl;
};

const barChartOptions = {
    responsive: true,
    clip: false,
    layout: {
        padding: {
            left: 50,
            right: 50,
            top: 0,
            bottom: 0
        }
    },
    onHover: (event, chartElement) => {
        if (chartElement.length === 1) {
            event.native.target.style.cursor = 'pointer'
        }
        if (chartElement.length === 0) {
            event.native.target.style.cursor = 'default'
        }
    },
    plugins: {
        tooltip: {
            maintainAspectRatio: false,
            events: ['mousemove', 'touchstart', 'touchmove'],
            enabled: false,
            interaction: {
                mode: 'x',
            },
            external: externalTooltipHandler,
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
                displayFormats: {
                    'day': 'MMM dd',
                },
                tooltipFormat: 'MMM dd, yyyy'
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

