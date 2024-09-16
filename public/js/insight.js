// Data for charts
let femalIndustryJobs = [];
let femalIndustryIncome = [];

const genderData = [
    { gender: "Women", value: 32, icon: "images/woman-silhouette.svg" },
    { gender: "Men", value: 68, icon: "images/man-silhouette.svg" },
];

// Function to display the selected chart
function displayChart(chartId) {
    const chartContainer = document.getElementById("chartContainer");
    chartContainer.innerHTML = ""; // Clear previous chart

    if (chartId === "employed_women") {
        const canvas = document.createElement("canvas");
        canvas.id = "pieChart";
        chartContainer.appendChild(canvas);
        createPieChart();
    } else if (chartId === "genderComparison") {
        const div = document.createElement("div");
        div.id = "genderComparison";
        chartContainer.appendChild(div);
        createGenderComparison();
    } else if (chartId === "industry_income") {
        const canvas = document.createElement("canvas");
        canvas.id = "incomePieChart";
        chartContainer.appendChild(canvas);
        createIncomePieChart();
    } else if (chartId === "enrollment_2022") {
        const canvas = document.createElement("canvas");
        canvas.id = "enrollmentPieChart";
        chartContainer.appendChild(canvas);
        createEnrollmentPieChart();
    } else if (chartId === "employment_outcomes_2023") {
        const canvas = document.createElement("canvas");
        canvas.id = "employmentOutcomesPieChart";
        chartContainer.appendChild(canvas);
        createEmploymentOutcomesPieChart();
    }
}

// Initial display
document.addEventListener("DOMContentLoaded", function () {
    const chartSelector = document.getElementById("chartSelector");
    displayChart(chartSelector.value); // Display the chart based on the selected dropdown option

    // Add event listener to the dropdown
    chartSelector.addEventListener("change", function () {
        displayChart(chartSelector.value);
    });

    // Add event listener to the scroll button
    const scrollToChartBtn = document.getElementById("scrollToChartBtn");
    scrollToChartBtn.addEventListener("click", function () {
        document.querySelector(".insight_stat_section").scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Functions to create charts
function createPieChart() {
    fetch("json/femal_industry_jobs_final.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Filter and group data by STEM_CAT
            const groupedData = data
                .filter((job) => job.Gender === "Femal")
                .reduce((acc, job) => {
                    if (!acc[job.STEM_CAT]) {
                        acc[job.STEM_CAT] = 0;
                    }
                    acc[job.STEM_CAT] += job["Number_of_jobs(thousand)"];
                    return acc;
                }, {});

            // Convert grouped data to array format for chart and round values
            femalIndustryJobs = Object.keys(groupedData).map((key) => ({
                STEM_CAT: key,
                "Number_of_jobs(thousand)": Math.round(groupedData[key]),
            }));

            const pieCtx = document.getElementById("pieChart").getContext("2d");
            new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: femalIndustryJobs.map((job) => job.STEM_CAT),
                    datasets: [
                        {
                            data: femalIndustryJobs.map(
                                (job) => job["Number_of_jobs(thousand)"]
                            ),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Employed Women in STEM",
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
                                    return `${context.label}: ${context.raw} thousand jobs`;
                                },
                            },
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createIncomePieChart() {
    fetch("json/femal_industry_income_final.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Filter and group data by Type
            const groupedData = data
                .filter((job) => job.Gender === "Female")
                .reduce((acc, job) => {
                    const type = job.Type || "Not STEM";
                    if (!acc[type]) {
                        acc[type] = { total: 0, count: 0 };
                    }
                    acc[type].total += job.Value;
                    acc[type].count += 1;
                    return acc;
                }, {});

            // Convert grouped data to array format for chart and calculate average values
            femalIndustryIncome = Object.keys(groupedData).map((key) => ({
                Type: key,
                Value: Math.round(
                    groupedData[key].total / groupedData[key].count
                ),
            }));

            const pieCtx = document
                .getElementById("incomePieChart")
                .getContext("2d");
            new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: femalIndustryIncome.map((job) => job.Type),
                    datasets: [
                        {
                            data: femalIndustryIncome.map((job) => job.Value),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "STEM Industry income",
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
                                    return `${
                                        context.label
                                    }: $${context.raw.toLocaleString()}`;
                                },
                            },
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createGenderComparison() {
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
            const importedNode = document.importNode(
                data.documentElement,
                true
            );

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
}

// New function to create the enrollment pie chart
function createEnrollmentPieChart() {
    fetch("json/university_stem_enrollment.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Filter data for the year 2022 and group by STEM_CAT
            const groupedData = data
                .filter((entry) => entry.Year === 2022)
                .reduce((acc, entry) => {
                    if (!acc[entry.STEM_CAT]) {
                        acc[entry.STEM_CAT] = 0;
                    }
                    acc[entry.STEM_CAT] += entry.Num_of_enrollment;
                    return acc;
                }, {});

            // Convert grouped data to array format for chart
            const enrollmentData = Object.keys(groupedData).map((key) => ({
                STEM_CAT: key,
                Num_of_enrollment: groupedData[key],
            }));

            const pieCtx = document
                .getElementById("enrollmentPieChart")
                .getContext("2d");
            new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: enrollmentData.map((entry) => entry.STEM_CAT),
                    datasets: [
                        {
                            data: enrollmentData.map(
                                (entry) => entry.Num_of_enrollment
                            ),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Female University STEM Enrolment in 2022",
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
                                    return `${
                                        context.label
                                    }: ${context.raw.toLocaleString()} enrollments`;
                                },
                            },
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

// New function to create the employment outcomes pie chart
function createEmploymentOutcomesPieChart() {
    fetch("json/Undergraduate employment outcomes, 2022 and 2023 (_).json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Filter data for the year 2023
            const filteredData = data.filter((entry) => entry.Year === 2023);

            // Group data by Gender
            const groupedData = filteredData.reduce((acc, entry) => {
                if (!acc[entry.Gender]) {
                    acc[entry.Gender] = 0;
                }
                acc[entry.Gender] += entry.Percentage_get_job;
                return acc;
            }, {});

            // Convert grouped data to array format for chart
            const employmentData = Object.keys(groupedData).map((key) => ({
                Gender: key,
                Percentage_get_job: groupedData[key],
            }));

            const pieCtx = document
                .getElementById("employmentOutcomesPieChart")
                .getContext("2d");
            new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: employmentData.map((entry) => entry.Gender),
                    datasets: [
                        {
                            data: employmentData.map(
                                (entry) => entry.Percentage_get_job
                            ),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Undergraduate employment outcomes, 2023, Male & Female",
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
                                    return `${context.label}: ${context.raw}%`;
                                },
                            },
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}
