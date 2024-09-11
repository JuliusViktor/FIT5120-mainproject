// Data for charts
const bubbleChartData = [
    { x: 20, y: 30, r: 15 },
    { x: 40, y: 10, r: 10 },
    { x: 30, y: 20, r: 8 },
];

const pieChartData = {
    labels: ["Red", "Blue", "Yellow"],
    values: [300, 50, 100],
    colors: ["#FF6384", "#36A2EB", "#FFCE56"],
};

const genderData = [
    { gender: "Women", value: 15, icon: "images/woman-silhouette.svg" },
    { gender: "Men", value: 70, icon: "images/man-silhouette.svg" },
];

const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    values: [65, 59, 80, 81, 56, 55, 40],
};

// Bubble Chart
const bubbleCtx = document.getElementById("bubbleChart").getContext("2d");
new Chart(bubbleCtx, {
    type: "bubble",
    data: {
        datasets: [
            {
                label: "Bubble Chart",
                data: bubbleChartData,
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
const width = 500; // Increased from 300
const height = 300; // Increased from 200

const svg = d3
    .select("#genderComparison")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const maxSize = 150; // Increased from 100
const scale = d3
    .scaleLinear()
    .domain([0, d3.max(genderData, (d) => d.value)])
    .range([30, maxSize]); // Increased minimum size from 20 to 30

const iconSpacing = 180; // Reduced from 250 to bring icons closer

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
        .attr("font-size", "16px"); // Increased font size
});

// Line Chart
const lineCtx = document.getElementById("lineChart").getContext("2d");
new Chart(lineCtx, {
    type: "line",
    data: {
        labels: lineChartData.labels,
        datasets: [
            {
                label: "Line Chart",
                data: lineChartData.values,
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

// Learn How button
document.addEventListener("DOMContentLoaded", function () {
    const learnHowBtn = document.getElementById("learnHowBtn");
    const insightStatSection = document.querySelector(".insight_stat_section");

    learnHowBtn.addEventListener("click", function (e) {
        e.preventDefault();
        insightStatSection.scrollIntoView({ behavior: "smooth" });
    });
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
