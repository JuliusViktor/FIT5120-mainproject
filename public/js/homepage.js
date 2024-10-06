const genderData = [
    { gender: "Women", value: 32, icon: "images/woman-silhouette.svg" },
    { gender: "Men", value: 68, icon: "images/man-silhouette.svg" },
];

/* learn how button action */
document.getElementById("learnHowBtn").addEventListener("click", function () {
    window.scrollBy({
        top: window.innerHeight,
        left: 0,
        behavior: "smooth",
    });
});

document.addEventListener("DOMContentLoaded", function () {
    createGenderComparison();
});

function createGenderComparison() {
    const container = document.getElementById("genderComparison");
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3
        .select("#genderComparison")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const maxSize = 500;
    const scale = d3
        .scaleLinear()
        .domain([0, d3.max(genderData, (d) => d.value)])
        .range([30, maxSize]);

    const iconSpacing = 180;
    const centerOffset = (width - iconSpacing * (genderData.length - 1)) / 2;

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
                .attr("x", centerOffset + i * iconSpacing - scale(d.value) / 2)
                .attr("y", height - scale(d.value) - 40)
                .attr("fill", i === 0 ? "#FF69B4" : "#4169E1");
        });

        svg.append("text")
            .attr("x", centerOffset + i * iconSpacing)
            .attr("y", height - 15)
            .attr("text-anchor", "middle")
            .text(`${d.gender}: ${d.value}%`)
            .attr("fill", "#333")
            .attr("font-size", "16px");
    });

    // Responsive title
    const title = "Gender Distribution in STEM Workforce (2021)";
    const titleX = width / 2;
    const titleY = 30;
    const titleMaxWidth = Math.min(width - 40, 300);

    svg.append("text")
        .attr("x", titleX)
        .attr("y", titleY)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .call(wrapText, titleMaxWidth);

    function wrapText(text, width) {
        text.each(function () {
            const text = d3.select(this);
            const words = title.split(/\s+/).reverse();
            let word;
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1; // ems
            const y = text.attr("y");
            const dy = parseFloat(text.attr("dy") || 0);
            let tspan = text
                .text(null)
                .append("tspan")
                .attr("x", titleX)
                .attr("y", y)
                .attr("dy", dy + "em");

            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text
                        .append("tspan")
                        .attr("x", titleX)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
    }
}

// Function to draw the bubble chart
function drawBubbleChart() {
    d3.select("#bubble-chart").selectAll("*").remove();

    const margin = { top: 50, right: 200, bottom: 50, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
        .select("#bubble-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Initialize tooltip
    const tooltip = d3
        .select("#bubble-chart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid 1px #ccc")
        .style("padding", "8px")
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("text-align", "center");

    // Load data from JSON
    d3.json("json/femal_industry_income_final.json")
        .then((data) => {
            const types = [
                "Science",
                "Technology",
                "Engineering",
                "Mathematic",
            ];

            const z = d3
                .scaleSqrt()
                .domain([0, d3.max(data, (d) => d.Value)])
                .range([10, 120]);

            const color = d3.scaleOrdinal().domain(types).range(d3.schemeSet2);

            function updateChart(year) {
                const filteredData = data.filter(
                    (d) => d.Year == year && types.includes(d.Type)
                );

                const averageData = types.map((type) => {
                    const typeData = filteredData.filter(
                        (d) => d.Type === type
                    );
                    const averageValue = d3.mean(typeData, (d) => d.Value);
                    return { Type: type, AverageValue: averageValue };
                });

                const simulation = d3
                    .forceSimulation(averageData)
                    .force("x", d3.forceX(width / 2).strength(0.05))
                    .force("y", d3.forceY(height / 2).strength(0.05))
                    .force(
                        "collide",
                        d3.forceCollide((d) => z(d.AverageValue) + 1)
                    )
                    .stop();

                const nodes = svg
                    .selectAll("g.node")
                    .data(averageData, (d) => d.Type);

                nodes.exit().remove();

                const nodesEnter = nodes
                    .enter()
                    .append("g")
                    .attr("class", "node");

                nodesEnter
                    .append("circle")
                    .attr("r", (d) => z(d.AverageValue))
                    .style("fill", (d) => color(d.Type))
                    .style("opacity", "0.7")
                    .attr("stroke", "black")
                    .on("mouseover", function (event, d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.transition().duration(200).style("opacity", 1);
                        tooltip
                            .html(
                                `Industry: ${d.Type}<br>Income: ${d3.format(
                                    ".2f"
                                )(d.AverageValue)}`
                            )
                            .style("left", event.pageX + 10 + "px")
                            .style("top", event.pageY - 30 + "px");
                    })
                    .on("mousemove", function (event) {
                        tooltip
                            .style("left", event.pageX + 10 + "px")
                            .style("top", event.pageY - 30 + "px");
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("opacity", 0.7);
                        tooltip.transition().duration(200).style("opacity", 0);
                    });

                nodesEnter
                    .append("text")
                    .attr("class", "name")
                    .attr("dy", "-0.5em")
                    .style("text-anchor", "middle")
                    .style("pointer-events", "none")
                    .style("font-size", "12px")
                    .style("fill", "black")
                    .text((d) => d.Type);

                nodesEnter
                    .append("text")
                    .attr("class", "value")
                    .attr("dy", "1.5em")
                    .style("text-anchor", "middle")
                    .style("pointer-events", "none")
                    .style("font-size", "10px")
                    .style("fill", "black")
                    .text((d) => d3.format(".2f")(d.AverageValue));

                nodes
                    .select("circle")
                    .attr("r", (d) => z(d.AverageValue))
                    .style("fill", (d) => color(d.Type));

                nodes.select(".name").text((d) => d.Type);

                nodes
                    .select(".value")
                    .text((d) => d3.format(".2f")(d.AverageValue));

                for (let i = 0; i < 300; ++i) simulation.tick();

                nodesEnter
                    .merge(nodes)
                    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
            }

            updateChart(2017);

            document
                .getElementById("bubbleYearSlider")
                .addEventListener("input", function () {
                    const year = +this.value;
                    d3.select("#bubbleYearDisplay").text(year);
                    updateChart(year);
                });

            /* legend
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width + 20}, 0)`);

        const legendData = color.domain();

        svg.append("text")
            .attr("x", width - 550)
            .attr("y", height / 30 - 50)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text("Years Filter");

        svg.append("text")
            .attr("x", width + 30)
            .attr("y", height / 28 - 50)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text("Industries");

        legend.selectAll("rect")
            .data(legendData)
            .enter().append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.selectAll("text")
            .data(legendData)
            .enter().append("text")
            .attr("x", 24)
            .attr("y", (d, i) => i * 20 + 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .text(d => d);
            */
        })
        .catch((error) =>
            console.error("Error loading bubble chart data:", error)
        );
}

// Call the function to draw the bubble chart
drawBubbleChart();

document
    .getElementById("show-visualization-button")
    .addEventListener("click", function () {
        var visualizationContainer = document.querySelector(
            ".bubble-chart-container"
        );
        var incomeInsightTitle = document.querySelector(
            ".income-insight-container h1"
        );

        // Check if the bubble chart is currently visible
        if (
            visualizationContainer.style.display === "none" ||
            visualizationContainer.style.display === ""
        ) {
            visualizationContainer.style.display = "block"; // Show the chart
            incomeInsightTitle.style.display = "none"; // Hide the title
            this.textContent = "Hide it from me"; // Change button text
        } else {
            visualizationContainer.style.display = "none"; // Hide the chart
            incomeInsightTitle.style.display = "block"; // Show the title
            this.textContent = "Show me"; // Change button text back
        }
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