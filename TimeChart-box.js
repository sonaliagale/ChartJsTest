
function formatData(chartData) {
    chartData.forEach(function (item) {
        //set data in x,y and data format
        const result = item.totals.map(total => (
            {
                x: total.date,
                y: total.count,
                data: total.details && total.details.length > 0
                    && total.details.map(obj => ({ time: obj.time, text: getMessage(obj, item.label) }))
            }))
        item.totals = result;
    });
    return chartData;
}

function getMessage(details, label) {
    label = label.replace(' ', '');
    return details.fullName + MESSAGE_LABLES[label] + details.fileName;
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
            // categoryPercentage: 0.4,
            borderSkipped: 'middle',
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
        if (i === 1 && i !== 0 && i !== legendItems.length) {
            listItem.style.borderBottom = "1px solid #CFD4DA";
            listItem.style.paddingBottom = 10;
        }
        if (i === 2) {
            listItem.style.paddingTop = 10;
        }
        legendContainer.appendChild(listItem);
    }
}


function hideTooltip() {
    const tooltipEl = document.getElementById('chartjs_tooltip');
    document.addEventListener('click', (e) => {
        if (tooltipEl && tooltipEl.contains(e.target)) {
            return;
        }
        // Otherwise, hide the tooltip
        tooltipEl.style.opacity = 0;
        //tooltipEl.style.pointerEvents = 'none';
    });
}

function removeOldElement(divRoot) {
    // Remove old children
    if (divRoot && divRoot.firstChild) {
        while (divRoot.firstChild) {
            divRoot.firstChild.remove();
            divRoot.style.overflowY = "unset";
        }
    }
}

function getTooltipData(tooltip) {
    let data = [];
    //find extra data
    if (tooltip.dataPoints) {
        const dataP = tooltip.dataPoints;
        dataP && dataP.length > 0 && dataP.forEach(function (x) {
            data.push({
                backgroundColor: x.dataset.backgroundColor,
                borderColor: x.dataset.borderColor, data: x.raw.data
            });
        });
    }

    return data;
}

function updateTooltipBody(tooltipData, divRoot) {
    let count = 0;
    const textList = document.createElement('ul');
    textList.className = "tooltip-ui";

    tooltipData.length > 0 && tooltipData.forEach((item, i) => {
        item.data.length > 0 && item.data.forEach((x, i) => {
            count += 1;
            const itemList = document.createElement('li');
            itemList.className = "tooltipItem";
            itemList.innerHTML = `
                <span class=tooltipColorBox style= "background-color: ${item.borderColor}"></span>
                <div class="tooltip-text-block"><span class="tooltip-time">${x.time}</span>
                   <div class="tooltip-text">${x.text}</div>
                </div>`;
            textList.appendChild(itemList);
        });
    })
    divRoot.appendChild(textList);

    if (count > 5) {
        divRoot.style.maxHeight = 327;
        divRoot.style.overflowY = "scroll";
    }
}

function updateTooltipFooter(tooltipEl) {
    //Link content code
    const linkContent = tooltipEl.querySelector("#tooltip_link_content");
    // Remove old children
    if (linkContent && linkContent.firstChild) {
        while (linkContent.firstChild) {
            linkContent.firstChild.remove();
        }
    }
    const aTag = document.createElement('a');
    const link = document.createTextNode('See more ');
    aTag.className = 'seeMoreLink';
    aTag.target = "_blank";
    aTag.appendChild(link);

    const linkIcon = document.createElement("img");
    linkIcon.className = "external-link-icon";
    linkIcon.src = LINK_ICON;
    aTag.appendChild(linkIcon);

    aTag.title = "See more";
    aTag.href = TOOLTIP_LINK;
    linkContent.appendChild(aTag);
}

function updateTooltipElement(tooltip, divRoot, tooltipData, tooltipEl) {
    if (tooltip.body) {
        const title = document.createElement('span');
        title.className = "engg-tooltip-title";
        title.textContent = tooltip.title[0]
        divRoot.appendChild(title);

        updateTooltipBody(tooltipData, divRoot);
        updateTooltipFooter(tooltipEl);
    }
}

function setTooltipPosition(chart, tooltip, tooltipEl) {
    const {
        offsetLeft: positionX,
        offsetTop: positionY
    } = chart.canvas;

    let offsetX = tooltip.caretX + 20;
    if (offsetX < tooltip.width)
        offsetX = tooltip.width;
    else if (tooltip.caretX > chart.width - tooltip.width)
        offsetX = chart.width - tooltip.width;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = positionX + offsetX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    // tooltipEl.style.font = tooltip.options.bodyFont.string;
    // tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
}

const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltipElement(chart);
    const divRoot = tooltipEl.querySelector('#tooltipTextContent');

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    removeOldElement(divRoot);

    let tooltipData = getTooltipData(tooltip);
    updateTooltipElement(tooltip, divRoot, tooltipData, tooltipEl)

    setTooltipPosition(chart, tooltip, tooltipEl);
    hideTooltip();
};

const getOrCreateTooltipElement = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs_tooltip';
        tooltipEl.className = 'chartjs-tooltip';

        const tooltipContent = document.createElement('div');
        tooltipContent.id = "tooltipTextContent";
        tooltipContent.className = 'tooltipTextContent';

        const linkContent = document.createElement('div');
        linkContent.id = 'tooltip_link_content';
        linkContent.className = 'tooltip-link';

        tooltipEl.appendChild(tooltipContent);
        tooltipEl.appendChild(linkContent);

        chart.canvas.parentNode.appendChild(tooltipEl);
    }
    return tooltipEl;
};

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
                autoSkip: true,
                fontFamily: "Segoe UI",
                fontSize: 12,
                fontWeight: 400,
                color: "#535B64",
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

// function selectUnit() {
//     const selectedUnit = document.querySelector('#unit')
//     myChart.config.options.scales.x.time.unit = selectedUnit.options[selectedUnit.selectedIndex].value;
//     if ("week" === selectedUnit.options[selectedUnit.selectedIndex].value) {
//         myChart.config.options.scales.x.time.displayFormats = { "week": "MMM dd" }
//     }
//     myChart.update();

// }
// function selectType() {
//     const selectedScaleType = document.querySelector('#type')
//     myChart.config.options.scales.x.type = selectedScaleType.options[selectedScaleType.selectedIndex].value;
//     myChart.update();
// }

