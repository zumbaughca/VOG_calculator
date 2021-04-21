$(document).ready(function () {
    // Get inputs and declare charts
    var fcChart;
    var vogChart;
    const cornPriceInput = document.getElementById("cornPriceInput");
    const miloPriceInput = document.getElementById("miloPriceInput");
    const initialLambPriceInput = document.getElementById("initialLambPriceInput");
    const finalLambPriceInput = document.getElementById("finalLambPriceInput");

    // Calculate the change in feed cost based on inputs
    function calculateFeedCostChange(cornPriceBushel, miloPriceBushel, ingredientRatio) {
        return Math.round(((miloPriceBushel / 56) - (cornPriceBushel / 56)) * ingredientRatio * 2000 * 100) / 100
    }

    // Calculate the value of gain based on inputs
    function calculateVOG(initialLambPrice, finalLambPrice, initialWeight, finalWeight) {
        const weightGain = finalWeight - initialWeight;
        const finalValue = finalLambPrice / 100 * finalWeight;
        const initialValue = initialLambPrice / 100 * initialWeight;
        return Math.round((finalValue - initialValue) / weightGain * 100) / 100
    }

    // Ensure inputs are a valid number, if entered.
    // If not, throw an error
    function validateFields() {
        const inputs = [cornPriceInput, miloPriceInput, initialLambPriceInput, finalLambPriceInput];

        inputs.forEach((input) => {
            if (input.value !== "") {
                var value = parseFloat(input.value)
                if (Object.is(value, NaN)) {
                    throw input.placeholder
                }
            }
        })
    }

    $(document).keyup((event) => {
        if (event.which === 13) {
            $('#calculateButton').click();
        }
    });


    // Calculate button clicked.
    $('#calculateButton').click(() => {
        // First, validate input to ensure it is a valid number. If not alert user to reformat.
        try {
            validateFields()
        } catch (e) {
            alert("Ensure " + e + " is a valid number.")
            return
        }
        // If valid, grab reference to table and iterate over its rows.
        const $rows = $('#outputTable').find('tbody').find('tr')
        var fcChartData = [];
        var vogChartData = [];
        $rows.each((row) => {
            // Set feed cost and value of gain cells to appropriate values, and push values into chart data array.
            const ratio = $($rows[row]).find('td')[0].innerText;
            const initWT = $($rows[row]).find('td')[1].innerText;
            const finalWT = $($rows[row]).find('td')[2].innerText;
            const feedCostCell = $($rows[row]).find('td')[3];
            const vogCell = $($rows[row]).find('td')[4];
            vogData = calculateVOG(parseFloat(initialLambPriceInput.value), parseFloat(finalLambPriceInput.value), parseFloat(initWT), parseFloat(finalWT));
            fcData = calculateFeedCostChange(parseFloat(cornPriceInput.value), parseFloat(miloPriceInput.value), parseFloat(ratio));
            vogCell.innerText = Object.is(vogData, NaN) ? "Price not set" : vogData;
            feedCostCell.innerText = Object.is(fcData, NaN) ? "Price not set" : fcData;
            vogChartData.push(vogData);

            if (ratio != "0") {
                fcChartData.push(fcData);
            }
        });
        // After all fields are set, update chart data and call update()
        fcChart.data.datasets[0].data = fcChartData;
        vogChart.data.datasets[0].data = vogChartData;

        fcChart.update();
        vogChart.update();
    });

    $('#showTableButton').click(() => {
        $('.output-div').toggle();
        if ($('#showTableButton').text() == "Show Data Table") {
            $('#showTableButton').text(text = "Hide Data Table");
        } else {
            $('#showTableButton').text(text = "Show Data Table");
        }
    })

    //Create a new bar chart
    function createChart(elementId, xlab, ylab, title, labels) {
        chart = new Chart(document.getElementById(elementId), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: title,
                        backgroundColor: 'rgba(81, 40, 136, 0.75)',
                        borderColor: '#512888',
                        data: []
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 24,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        displayColors: false,
                        boxHeight: 30,
                        callbacks: {
                            title: function(tooltipItem) {
                                return tooltipItem[0].dataset.label + " for " + tooltipItem[0].label + "% inclusion:"
                            },
                            label: function(tooltipItem, data) {
                                if (tooltipItem.dataset.label === "Change in feed cost") {
                                    return "Change in feed cost, $/ton: " + "$ " + tooltipItem.raw
                                } else {
                                    return "Value of gain: " + "$ " + tooltipItem.raw
                                }
                                
                            },
                            afterLabel: function(tooltipItem) {
                                if (tooltipItem.dataset.label === "Change in feed cost") {
                                    return "Change in feed cost, $/lb: " + "$ " + tooltipItem.raw / 2000
                                } else {
                                    return ""
                                }
                            },
                            labelPointStyle: function(context) {
                                return {
                                    display: false
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            text: ylab,
                            display: true,
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function (value, index, values) {
                                return '$ ' + value;
                            },
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        title: {
                            text: xlab,
                            display: true,
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        })

        return chart;
    }
    
    // On load, create a new bar chart for feed cost and value of gain
    fcChart = createChart('fcChart', "Sorghum inclusion, % DM",
        "Change in feed cost, $/ton", "Change in feed cost", ["10", "20", "30"]);
    vogChart = createChart('vogChart', "Sorghum inclusion, % DM", "Value of gain, $", "Value of gain",
        ["0", "10", "20", "30"]);
});