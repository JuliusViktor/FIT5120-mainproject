// Bubble Chart
const bubbleCtx = document.getElementById("bubbleChart").getContext("2d");
new Chart(bubbleCtx, {
    type: "bubble",
    data: {
        datasets: [
            {
                label: "Bubble Chart",
                data: [
                    { x: 20, y: 30, r: 15 },
                    { x: 40, y: 10, r: 10 },
                    { x: 30, y: 20, r: 8 },
                ],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: "Bubble Chart",
        },
    },
});

// Pie Chart
const pieCtx = document.getElementById("pieChart").getContext("2d");
new Chart(pieCtx, {
    type: "pie",
    data: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: "Pie Chart",
        },
        legend: {
            position: "bottom",
        },
    },
});

// Gender Comparison Visualization
const genderData = [
    { gender: "Women", value: 30, icon: "images/woman-silhouette.svg" },
    { gender: "Men", value: 70, icon: "images/man-silhouette.svg" },
];

const width = 300;
const height = 200;

const svg = d3
    .select("#genderComparison")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const maxSize = 100;
const scale = d3
    .scaleLinear()
    .domain([0, d3.max(genderData, (d) => d.value)])
    .range([20, maxSize]);

genderData.forEach((d, i) => {
    d3.xml(d.icon).then((data) => {
        const importedNode = document.importNode(data.documentElement, true);

        svg.node().appendChild(importedNode);

        d3.select(importedNode)
            .attr("width", scale(d.value))
            .attr("height", scale(d.value))
            .attr("x", i * 150 + 50 - scale(d.value) / 2)
            .attr("y", height / 2 - scale(d.value) / 2)
            .attr("fill", i === 0 ? "#FF69B4" : "#4169E1");
    });

    svg.append("text")
        .attr("x", i * 150 + 50)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .text(`${d.gender}: ${d.value}%`)
        .attr("fill", "#333")
        .attr("font-size", "14px");
});

// Line Chart
const lineCtx = document.getElementById("lineChart").getContext("2d");
new Chart(lineCtx, {
    type: "line",
    data: {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
        ],
        datasets: [
            {
                label: "Line Chart",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: "Line Chart",
        },
    },
});
