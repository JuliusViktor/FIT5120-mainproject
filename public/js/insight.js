// Data for charts
let femalIndustryJobs = [];
let femalIndustryIncome = [];

const genderData = [
    { gender: "Women", value: 32, icon: "images/woman-silhouette.svg" },
    { gender: "Men", value: 68, icon: "images/man-silhouette.svg" },
];

// Display the selected chart in chartContainer div
function displayChart(chartId) {
    const chartContainer = document.getElementById("chartContainer");
    chartContainer.innerHTML = ""; // Clear previous chart

    if (chartId === "employed_women") {
        const canvas = document.createElement("canvas");
        canvas.id = "pieChart";
        chartContainer.appendChild(canvas);
        createPieChart();
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

// Color arrays for charts
const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
];

// Function to create the pie chart for employed women
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
                            backgroundColor: colors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Employed Women in STEM's Industries, 2021",
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
                        datalabels: {
                            formatter: (value, context) => {
                                return `${value}k`;
                            },
                            color: "#fff",
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
                            backgroundColor: colors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Average women's income in STEM, 2017-2021",
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
                        datalabels: {
                            formatter: (value, context) => {
                                return `$${value.toLocaleString()}`;
                            },
                            color: "#fff",
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

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
                            backgroundColor: colors, // Set the colors here
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "STEM Enrollment of Women in Universities, 2022",
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
                        datalabels: {
                            formatter: (value, context) => {
                                return `${value.toLocaleString()}`;
                            },
                            color: "#fff",
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

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
                            backgroundColor: colors, // Set the colors here
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Percentage of STEM Undergraduates Securing Full Employment in 2023, by Gender",
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
                        datalabels: {
                            formatter: (value, context) => {
                                return `${value}%`;
                            },
                            color: "#fff",
                        },
                    },
                },
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

//New charts

let employedWomenChart;

// Define colors for each STEM category
const stemColors = {
    "Science": "rgba(255, 99, 132, 0.8)",
    "Technology": "rgba(54, 162, 235, 0.8)",
    "Engineering": "rgba(255, 206, 86, 0.8)",
    "Mathmatics": "rgba(75, 192, 192, 0.8)",
    "Non-stem": "rgba(153, 102, 255, 0.8)"
};

function createEmployedWomenBarChart(year) {
    fetch("json/femal_industry_jobs_final.json")
        .then((response) => response.json())
        .then((data) => {
            // Filter data for the selected year
            const filteredData = data.filter((entry) => entry.Year === parseInt(year));

            // Group data by STEM_CAT
            const groupedData = filteredData.reduce((acc, entry) => {
                if (!acc[entry.STEM_CAT]) {
                    acc[entry.STEM_CAT] = [];
                }
                acc[entry.STEM_CAT].push(entry);
                return acc;
            }, {});

            // Calculate top STEM category (excluding Non-stem)
            const stemCategories = Object.keys(groupedData).filter(cat => cat !== "Non-stem");
            const employedTopSTEM = stemCategories.reduce((a, b) => 
                groupedData[a].reduce((sum, entry) => sum + entry["Number_of_jobs(thousand)"], 0) >
                groupedData[b].reduce((sum, entry) => sum + entry["Number_of_jobs(thousand)"], 0) ? a : b
            );

            // Calculate top STEM industry
            const stemIndustries = filteredData.filter(entry => entry.STEM_CAT !== "Non-stem");
            const employedTopStemIndustry = stemIndustries.reduce((a, b) => 
                a["Number_of_jobs(thousand)"] > b["Number_of_jobs(thousand)"] ? a : b
            );

            // Calculate total STEM jobs
            const employedTotalStemJobs = stemIndustries.reduce((sum, entry) => sum + entry["Number_of_jobs(thousand)"], 0);

            // Update the info boxes
            document.getElementById("employedTopSTEM").textContent = `${employedTopSTEM} (${groupedData[employedTopSTEM].reduce((sum, entry) => sum + entry["Number_of_jobs(thousand)"], 0).toFixed(2)}k jobs)`;
            document.getElementById("employedTopStemIndustry").textContent = `${employedTopStemIndustry.Industry} (${employedTopStemIndustry["Number_of_jobs(thousand)"].toFixed(2)}k jobs)`;
            document.getElementById("employedTotalStemJobs").textContent = `${employedTotalStemJobs.toFixed(2)}k jobs`;

            // Sort STEM categories
            const sortedCategories = Object.keys(groupedData).sort();

            // Flatten the grouped data while maintaining STEM category order
            const sortedData = sortedCategories.flatMap(category => 
                groupedData[category].sort((a, b) => b["Number_of_jobs(thousand)"] - a["Number_of_jobs(thousand)"])
            );

            const ctx = document.getElementById("employedWomenChart").getContext("2d");
            
            // Destroy existing chart if it exists
            if (employedWomenChart) {
                employedWomenChart.destroy();
            }

            employedWomenChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: sortedData.map(entry => entry.Industry),
                    datasets: [{
                        label: 'Number of Jobs',
                        data: sortedData.map(entry => entry["Number_of_jobs(thousand)"]),
                        backgroundColor: sortedData.map(entry => stemColors[entry.STEM_CAT]),
                        borderColor: sortedData.map(entry => stemColors[entry.STEM_CAT].replace("0.8", "1")),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `Employed Women by Industry and STEM Category in ${year}`,
                            font: {
                                size: 18,
                            },
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                generateLabels: function(chart) {
                                    return sortedCategories.map(category => ({
                                        text: category,
                                        fillStyle: stemColors[category],
                                        strokeStyle: stemColors[category].replace("0.8", "1"),
                                        lineWidth: 1,
                                        hidden: false
                                    }));
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const entry = sortedData[context.dataIndex];
                                    return `${entry.STEM_CAT}: ${context.parsed.y.toFixed(2)} thousand jobs`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Industries"
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Number of Jobs (thousands)"
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createEnrolledWomenLineChart() {
    fetch("json/university_stem_enrollment.json")
        .then((response) => response.json())
        .then((data) => {
            // Group and sum data by year and STEM category
            const groupedData = data.reduce((acc, entry) => {
                const year = entry.Year;
                const stemCat = entry.STEM_CAT.trim(); // Trim whitespace
                
                if (stemCat.toLowerCase() !== "non-stem") {
                    if (!acc[year]) {
                        acc[year] = {};
                    }
                    if (!acc[year][stemCat]) {
                        acc[year][stemCat] = 0;
                    }
                    acc[year][stemCat] += entry.Num_of_enrollment;
                }
                return acc;
            }, {});

            // Calculate info for 2022
            const data2022 = data.filter(entry => entry.Year === 2022);
            
            // Top STEM category
            const topStemCategoryEntry = Object.entries(groupedData[2022])
                .reduce((a, b) => a[1] > b[1] ? a : b);
            const topStemCategory = topStemCategoryEntry[0];
            const topStemCategoryEnrollment = topStemCategoryEntry[1];
            
            // Most popular subject (excluding non-stem)
            const mostPopularSubjectEntry = data2022
                .filter(entry => entry.STEM_CAT.trim().toLowerCase() !== "non-stem")
                .reduce((a, b) => a.Num_of_enrollment > b.Num_of_enrollment ? a : b);
            const mostPopularSubject = mostPopularSubjectEntry.Subjects.trim();
            const mostPopularSubjectEnrollment = mostPopularSubjectEntry.Num_of_enrollment;
            
            // Total STEM enrollment
            const totalStemEnrollment = data2022
                .filter(entry => entry.STEM_CAT.trim().toLowerCase() !== "non-stem")
                .reduce((sum, entry) => sum + entry.Num_of_enrollment, 0);

            // Update info boxes
            document.getElementById("enrollmentTopCategory").textContent = 
                `${topStemCategory} (${topStemCategoryEnrollment.toLocaleString()} enrollments)`;
            document.getElementById("enrollmentMostPopularSubject").textContent = 
                `${mostPopularSubject} (${mostPopularSubjectEnrollment.toLocaleString()} enrollments)`;
            document.getElementById("enrollmentTotal").textContent = `${totalStemEnrollment.toLocaleString()} enrollments`;

            // Prepare data for Chart.js
            const years = Object.keys(groupedData).sort();
            const stemCategories = ["Science", "Technology", "Engineering", "Mathmatics"];
            const datasets = stemCategories.map(category => ({
                label: category,
                data: years.map(year => {
                    // Handle different capitalizations and trim spaces
                    const matchingCategory = Object.keys(groupedData[year]).find(
                        cat => cat.toLowerCase().trim() === category.toLowerCase()
                    );
                    return groupedData[year][matchingCategory] || 0;
                }),
                borderColor: stemColors[category],
                backgroundColor: stemColors[category].replace("0.8", "0.2"),
                fill: false,
                tension: 0.1
            }));

            const ctx = document.getElementById("enrolledWomenChart").getContext("2d");
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Women Enrolled in STEM Fields',
                            font: {
                                size: 18,
                            },
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Enrollments'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    Chart.register(ChartDataLabels); // Required by chartjs plugin

    const chartSelector = document.getElementById("chartSelector");
    displayChart(chartSelector.value);

    // Event listener to the dropdown
    chartSelector.addEventListener("change", function () {
        displayChart(chartSelector.value);
    });

    // Event listener to the scroll button
    const scrollToChartBtn = document.getElementById("scrollToChartBtn");
    scrollToChartBtn.addEventListener("click", function () {
        document.querySelector(".insight_stat_section").scrollIntoView({
            behavior: "smooth",
        });
    });

    // Create the employed women bar chart
    const employedYearSelector = document.getElementById("employedYearSelector");
    createEmployedWomenBarChart(employedYearSelector.value);

    // Create the enrolled women line chart
    createEnrolledWomenLineChart();

    // Event listener for year selection
    employedYearSelector.addEventListener("change", function () {
        createEmployedWomenBarChart(employedYearSelector.value);
    });
});