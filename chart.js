document.addEventListener("DOMContentLoaded", () => {
    // Flipped data points (y, x) as [y, x]
    const pre_data = [
        [4, 2], [8, 2], [16, 4], [32, 2],
        [64, 10], [128, 2], [256, 16], [512, 8],
        [1024, 34], [2048, 2], [4096, 100], [8192, 2],
        [16384, 130], [32768, 38], [65536, 256], [131072, 138],
        [262144, 1000], [524288, 306], [1048576, 1236], [2097152, 1184],
        [4194304, 4426], [8388608, 3452], [16777216, 11536], [33554432, 13132], [67108864, 32374]
    ];

    const yValues = pre_data.map(pair => pair[1]); // Take second value of each pair
    const xValues = Array.from({ length: yValues.length }, (_, i) => i + 2); // Generate [2, 3, 4, ...]
    const data1 = xValues.map((x, i) => [x, yValues[i]]);

    const percentageValues = [
        50.000, 25.000, 25.000, 6.250, 15.625, 1.562, 6.250, 1.562, 3.320, 0.098,
        2.441, 0.024, 0.793, 0.116, 0.391, 0.105, 0.381, 0.058, 0.118, 0.056,
        0.106, 0.041, 0.069, 0.039, 0.048
    ];

    // Generate x-values starting from 2
    const xValues2 = Array.from({ length: percentageValues.length }, (_, i) => i + 2); // [2, 3, 4, ...]

    // Combine x and y into data points for percentage chart
    const data2 = xValues2.map((x, i) => [x, percentageValues[i]]);

    // Highcharts configuration for combined chart with two Y-axes
    Highcharts.chart('chart', {
        chart: {
            type: 'line',
            backgroundColor: 'transparent'
        },
        title: {
            text: 'Line chart showing trend for balanced configurations and their percentage'
        },
        xAxis: {
            title: {
                text: 'n'
            },
            gridLineColor: '#666',
        },
        yAxis: [{
            // Primary y-axis for Balanced configurations
            title: {
                text: 'Balanced configurations'
            },
            labels: {
                format: '{value}'
            },
            gridLineColor: '#666',
        }, {
            // Secondary y-axis for Percentage
            title: {
                text: 'Percentage of balanced configurations (%)'
            },
            labels: {
                format: '{value}%'
            },
            opposite: true, // Place on the right side
            gridLineColor: '#666',
        }],
        tooltip: {
            shared: true, // Show tooltip for both series
            formatter: function() {
                return `n: ${this.x}<br>Balanced configurations: ${this.points[0].y}<br>Percentage: ${this.points[1].y.toFixed(3)}%`;
            }
        },
        credits: {
            enabled: false // Disable the Highcharts.com label
        },
        series: [{
            name: 'Balanced configurations',
            data: data1,
            yAxis: 0, // Use the primary y-axis
            tooltip: {
                valueSuffix: ''
            }
        }, {
            name: 'Percentage Values',
            data: data2,
            yAxis: 1, // Use the secondary y-axis
            tooltip: {
                valueSuffix: '%'
            }
        }]
    });
});
