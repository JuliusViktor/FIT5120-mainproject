// Data for charts
const bubbleChartData = [
    { x: 2017, y: 18, r: 15, field: "Engineering" },
    { x: 2018, y: 20, r: 16, field: "Engineering" },
    { x: 2019, y: 22, r: 17, field: "Engineering" },
    { x: 2020, y: 23, r: 18, field: "Engineering" },
    { x: 2021, y: 25, r: 19, field: "Engineering" },
    { x: 2017, y: 35, r: 20, field: "Science" },
    { x: 2018, y: 37, r: 21, field: "Science" },
    { x: 2019, y: 38, r: 22, field: "Science" },
    { x: 2020, y: 40, r: 23, field: "Science" },
    { x: 2021, y: 42, r: 24, field: "Science" },
    { x: 2017, y: 28, r: 18, field: "Technology" },
    { x: 2018, y: 30, r: 19, field: "Technology" },
    { x: 2019, y: 32, r: 20, field: "Technology" },
    { x: 2020, y: 33, r: 21, field: "Technology" },
    { x: 2021, y: 35, r: 22, field: "Technology" },
];

const pieChartData = {
    labels: ["Engineering", "Science", "Technology", "Mathematics"],
    values: [25, 42, 35, 30],
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
};

const genderData = [
    { gender: "Women", value: 32, icon: "images/woman-silhouette.svg" },
    { gender: "Men", value: 68, icon: "images/man-silhouette.svg" },
];

const lineChartData = {
    labels: ["2017", "2018", "2019", "2020", "2021"],
    values: [28, 30, 32, 34, 36],
};

// Bubble Chart
const bubbleCtx = document.getElementById("bubbleChart").getContext("2d");
new Chart(bubbleCtx, {
    type: "bubble",
    data: {
        datasets: [
            {
                label: "Engineering",
                data: bubbleChartData.filter((d) => d.field === "Engineering"),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
                label: "Science",
                data: bubbleChartData.filter((d) => d.field === "Science"),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
                label: "Technology",
                data: bubbleChartData.filter((d) => d.field === "Technology"),
                backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Women's Enrolment in STEM Fields (2017-2021)",
                font: {
                    size: 18,
                },
            },
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}% in ${context.parsed.x}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: "linear",
                position: "bottom",
                title: {
                    display: true,
                    text: "Year",
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value, index, values) {
                        return Math.floor(value);
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Percentage of Women Enrolled",
                },
            },
        },
    },
});

// Pie Chart
const pieCtx = document.getElementById("pieChart").getContext("2d");
new Chart(pieCtx, {
    type: "pie",
    data: {
        labels: pieChartData.labels,
        datasets: [
            {
                data: pieChartData.values,
                backgroundColor: pieChartData.colors,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Distribution of Women in STEM Fields (2021)",
                font: {
                    size: 18,
                },
            },
            legend: {
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.parsed}%`;
                    },
                },
            },
        },
    },
});

// Gender Comparison Visualization
const width = 500;
const height = 300;

const svg = d3
    .select("#genderComparison")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const maxSize = 150;
const scale = d3
    .scaleLinear()
    .domain([0, d3.max(genderData, (d) => d.value)])
    .range([30, maxSize]);

const iconSpacing = 180;

genderData.forEach((d, i) => {
    d3.xml(d.icon).then((data) => {
        const importedNode = document.importNode(data.documentElement, true);

        svg.node().appendChild(importedNode);

        d3.select(importedNode)
            .attr("width", scale(d.value))
            .attr("height", scale(d.value))
            .attr(
                "x",
                i * iconSpacing +
                    width / 2 -
                    iconSpacing / 2 -
                    scale(d.value) / 2
            )
            .attr("y", height - scale(d.value) - 40)
            .attr("fill", i === 0 ? "#FF69B4" : "#4169E1");
    });

    svg.append("text")
        .attr("x", i * iconSpacing + width / 2 - iconSpacing / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .text(`${d.gender}: ${d.value}%`)
        .attr("fill", "#333")
        .attr("font-size", "16px");
});

svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text("Gender Distribution in STEM Workforce (2021)")
    .attr("fill", "#333")
    .attr("font-size", "18px")
    .attr("font-weight", "bold");

// Line Chart
const lineCtx = document.getElementById("lineChart").getContext("2d");
new Chart(lineCtx, {
    type: "line",
    data: {
        labels: lineChartData.labels,
        datasets: [
            {
                label: "Women in STEM Workforce",
                data: lineChartData.values,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Percentage of Women in STEM Workforce (2017-2021)",
                font: {
                    size: 18,
                },
            },
            legend: {
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Women in STEM: ${context.parsed.y}%`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Year",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Percentage of Women",
                },
                suggestedMin: 0,
                suggestedMax: 50,
            },
        },
    },
});



// Fetch data from the server
fetch("/api/insight-data")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        // Display fetched data in the new section
        const fetchedDataElement = document.getElementById("fetchedData");
        fetchedDataElement.textContent = JSON.stringify(data, null, 2);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        // Display error message in the new section
        const fetchedDataElement = document.getElementById("fetchedData");
        fetchedDataElement.textContent =
            "Error fetching data. Please try again later.";
    });
