// Data for charts
let femalIndustryJobs = [];
let femalIndustryIncome = [];

//New charts
let employedWomenChart;

// Define colors for each STEM category
const stemColors = {
    "Science": "rgba(255, 99, 132, 0.8)",
    "Technology": "rgba(54, 162, 235, 0.8)",
    "Engineering": "rgba(255, 206, 86, 0.8)",
    "Mathmatics": "rgba(75, 192, 192, 0.8)",
    "Mathematics": "rgba(75, 192, 192, 0.8)",
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

function createWomenIncomeLineChart() {
    fetch("json/undergraduate_salary(2015-2023).json")
        .then((response) => response.json())
        .then((data) => {
            // Group and average data by year and STEM category
            const groupedData = data.reduce((acc, entry) => {
                const year = entry.Year;
                const stemCat = entry.STEM_CAT;
                
                if (!acc[year]) {
                    acc[year] = {};
                }
                if (!acc[year][stemCat]) {
                    acc[year][stemCat] = { sum: 0, count: 0 };
                }
                acc[year][stemCat].sum += entry.Full_time_salaries;
                acc[year][stemCat].count += 1;
                return acc;
            }, {});

            // Calculate averages
            Object.keys(groupedData).forEach(year => {
                Object.keys(groupedData[year]).forEach(stemCat => {
                    groupedData[year][stemCat] = Math.round(groupedData[year][stemCat].sum / groupedData[year][stemCat].count);
                });
            });

            // Calculate average income in STEM for 2023
            const averageIncome2023 = Object.values(groupedData[2023]).reduce((sum, value) => sum + value, 0) / Object.keys(groupedData[2023]).length;

            // Calculate average growth rate
            const years = Object.keys(groupedData).sort();
            const earliestYear = years[0];
            const latestYear = years[years.length - 1];
            const averageGrowthRate = calculateAverageGrowthRate(groupedData, earliestYear, latestYear);

            // Update info boxes
            document.getElementById("IncomeAverage").textContent = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(averageIncome2023);
            document.getElementById("IncomeGrowthRate").textContent = `${(averageGrowthRate * 100).toFixed(2)}%`;

            // Prepare data for Chart.js
            const stemCategories = ["Science", "Technology", "Engineering", "Mathematics"];
            const datasets = stemCategories.map(category => ({
                label: category,
                data: years.map(year => groupedData[year][category] || null),
                borderColor: stemColors[category],
                backgroundColor: stemColors[category].replace("0.8", "0.2"),
                fill: false,
                tension: 0.1
            }));

            const ctx = document.getElementById("IncomeChart").getContext("2d");
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
                            text: 'Women\'s Income in STEM Fields',
                            font: {
                                size: 18,
                            },
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
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
                                text: 'Average Salary (AUD)'
                            },
                            beginAtZero: false,
                            ticks: {
                                callback: function(value, index, values) {
                                    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function calculateAverageGrowthRate(data, startYear, endYear) {
    const categories = Object.keys(data[startYear]);
    const growthRates = categories.map(category => {
        const startValue = data[startYear][category];
        const endValue = data[endYear][category];
        const years = endYear - startYear;
        return Math.pow(endValue / startValue, 1 / years) - 1;
    });
    return growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
}

document.addEventListener("DOMContentLoaded", function () {
    Chart.register(ChartDataLabels); // Required by chartjs plugin
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

    // Create the women's income line chart
    createWomenIncomeLineChart();

    // Event listener for year selection
    employedYearSelector.addEventListener("change", function () {
        createEmployedWomenBarChart(employedYearSelector.value);
    });
});

// scroll up bottom
// Get the button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
};

// When the user clicks on the button, scroll to the top of the document
scrollToTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};