mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbmJpbnpob3UiLCJhIjoiY2x6aHF1amJmMDc2bTJrcTJxY2lubnBxeiJ9.vQZhyROyZYPlAlVahk4HHA';

// Global variables list
const vacancies_info = [];

document.addEventListener('DOMContentLoaded', function () {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [133.7751, -25.2744],
        zoom: 3
    });

    map.on('load', function() {
        addStatesBoundaries(map);
    });

    const stateCenters = {
        all: { center: [133.7751, -25.2744], zoom: 3 },
        nsw: { center: [147.6381, -32.2405], zoom: 5 },
        vic: { center: [144.9631, -37.8136], zoom: 6 },
        qld: { center: [149.1868, -21.1411], zoom: 4 },
        sa: { center: [138.6007, -34.9285], zoom: 5 },
        wa: { center: [121.6283, -25.0423], zoom: 4 },
        tas: { center: [146.3159, -41.6401], zoom: 6 },
        nt: { center: [133.7751, -19.4914], zoom: 5 },
        act: { center: [149.0124, -35.4735], zoom: 9 }
    };

    const locationSelect = document.getElementById('location_vac');
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const jobTitlesSelect = document.getElementById('jobTitles');
    const universityDetails = document.getElementById('universityDetails');

    [locationSelect, yearSelect, monthSelect, jobTitlesSelect].forEach(select => {
        select.addEventListener('change', () => {
            updateInfo();
            updateMapColors();
        });
    });

    function updateInfo() {
        const selectedState = locationSelect.value.toUpperCase();
        const selectedYear = yearSelect.value;
        const selectedMonth = monthSelect.value;
        const selectedJob = jobTitlesSelect.value.toLowerCase();

        const filteredVacancies = vacancies_info.filter(vacancy => {
            const normalizedVacancyTitle = vacancy.title.toLowerCase().replace(/[, ]/g, '').replace(/and/g, '');
            const normalizedSelectedJob = selectedJob.toLowerCase().replace(/[, ]/g, '').replace(/and/g, '');
        
            return (selectedState === 'ALL' || vacancy.state === selectedState) &&
                   (selectedYear === 'All Year' || vacancy.year.toString() === selectedYear) &&
                   (selectedMonth === 'All Year' || vacancy.month.toString() === selectedMonth) &&
                   (selectedJob === 'all' || normalizedVacancyTitle === normalizedSelectedJob);
        });

        if (filteredVacancies.length > 0) {
            const monthNames = {
                1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
            };
        
            let infoHTML = '<ul>';
            filteredVacancies.forEach(vacancy => {
                infoHTML += `<li>
                    <strong>${vacancy.title}</strong><br>
                    State: ${vacancy.state}<br>
                    Year: ${vacancy.year}<br>
                    Month: ${monthNames[vacancy.month] || vacancy.month}<br>
                    Number of Vacancies: ${Math.floor(vacancy.numberOfVacancies)}
                </li>`;
            });
            infoHTML += '</ul>';
            universityDetails.innerHTML = infoHTML;
        } else {
            universityDetails.innerHTML = 'No matching vacancies found.';
        }
        
    }

    // New function to update map colors based on vacancies
    function updateMapColors() {
        const selectedState = locationSelect.value.toUpperCase();
        const selectedYear = yearSelect.value;
        const selectedMonth = monthSelect.value;
        const selectedJob = jobTitlesSelect.value.toLowerCase();
    
        if (selectedState === 'ALL') {
            const stateVacancies = {};
            vacancies_info.forEach(vacancy => {
                if ((selectedYear === 'All Year' || vacancy.year.toString() === selectedYear) &&
                    (selectedMonth === 'All Year' || vacancy.month.toString() === selectedMonth) &&
                    (selectedJob === 'all' || vacancy.title.toLowerCase().replace(/[, ]/g, '').replace(/and/g, '') === selectedJob)) {
                    stateVacancies[vacancy.state] = (stateVacancies[vacancy.state] || 0) + vacancy.numberOfVacancies;
                }
            });
    
            const maxVacancies = Math.max(...Object.values(stateVacancies));
            
            
            // First, we need to create an array containing state names and vacancy counts, sorted by vacancy count in descending order
            const stateRankings = Object.entries(stateVacancies).sort((a, b) => b[1] - a[1]);

            // Create an array of colors, from dark blue to light blue
            const colors = [
                '#000080', // Navy
                '#0000FF', // Blue
                '#1E90FF', // Dodger Blue
                '#4169E1', // Royal Blue
                '#6495ED', // Cornflower Blue
                '#87CEFA', // Light Sky Blue
                '#ADD8E6', // Light Blue
                '#F0F8FF'  // Alice Blue
            ];

            // Create a mapping object to map state names to colors
            const stateColorMap = Object.fromEntries(
                stateRankings.map((state, index) => [state[0], colors[index]])
            );

            // Set the map fill color
            map.setPaintProperty('state-fills', 'fill-color', [
                'match',
                ['get', 'STATE_NAME'],
                'New South Wales', stateColorMap['NSW'] || '#E6E6E6',
                'Victoria', stateColorMap['VIC'] || '#E6E6E6',
                'Queensland', stateColorMap['QLD'] || '#E6E6E6',
                'South Australia', stateColorMap['SA'] || '#E6E6E6',
                'Western Australia', stateColorMap['WA'] || '#E6E6E6',
                'Tasmania', stateColorMap['TAS'] || '#E6E6E6',
                'Northern Territory', stateColorMap['NT'] || '#E6E6E6',
                'Australian Capital Territory', stateColorMap['ACT'] || '#E6E6E6',
                '#E6E6E6'
            ]);

        } else {
            
            const stateFullNames = {
                'NSW': 'New South Wales',
                'VIC': 'Victoria',
                'QLD': 'Queensland',
                'SA': 'South Australia',
                'WA': 'Western Australia',
                'TAS': 'Tasmania',
                'NT': 'Northern Territory',
                'ACT': 'Australian Capital Territory'
            };
    
            // set the filling color
            map.setPaintProperty('state-fills', 'fill-color', [
                'match',
                ['get', 'STATE_NAME'],
                stateFullNames[selectedState], '#2a801b', // selected state is setting to specific color
                '#E6E6E6' // orthers state key grey
            ]);
        }
    }

    // Update info and map colors once on initial load
    updateInfo();
    updateMapColors();

    // Map control part for vacancy information
    locationSelect.addEventListener('change', function() {
        const selectedState = this.value.toLowerCase();
        const { center, zoom } = stateCenters[selectedState];
        map.flyTo({ center, zoom });
    });
});

// Load job vacancies data
fetch('json/Stem_state_vacanies_final.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(vacancy => {
            const vacancyObject = {
                level: vacancy.Level,
                anzscoCode: vacancy.ANZSCO_CODE,
                title: vacancy.Title,
                state: vacancy.State,
                year: vacancy.Year,
                month: vacancy.Month,
                numberOfVacancies: vacancy["Number of vacancies (thousand)"]
            };
            vacancies_info.push(vacancyObject);
        });
        console.log(vacancies_info);
        // After loading data, update the map colors
        updateMapColors();
    })
    .catch(error => console.error('Error loading JSON:', error));

    function addStatesBoundaries(map) {
        map.addSource('states', {
            type: 'geojson',
            data: '../json/australian-states.geojson' 
        });
    
        map.addLayer({
            'id': 'state-fills',
            'type': 'fill',
            'source': 'states',
            'layout': {},
            'paint': {
                'fill-color': '#E6E6E6', 
                'fill-opacity': 0.5
            }
        });
    
        map.addLayer({
            'id': 'state-borders',
            'type': 'line',
            'source': 'states',
            'layout': {},  
            'paint': {     
                'line-color': '#000',
                'line-width': 1
            }
        });
    }
    
