mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbmJpbnpob3UiLCJhIjoiY2x6aHF1amJmMDc2bTJrcTJxY2lubnBxeiJ9.vQZhyROyZYPlAlVahk4HHA';

document.addEventListener('DOMContentLoaded', function () {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [133.7751, -25.2744], // Approximate center of Australia
        zoom: 3
    });

    // Direction control section
    const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/cycling', // Set default mode to cycling
        alternatives: true, // Show alternative routes
        geometries: 'geojson',
        controls: {
            inputs: true,
            instructions: true, // Enable turn-by-turn instructions
            profileSwitcher: true // Ensure mode switching options are displayed
        },
        flyTo: false
    });

    map.addControl(directions, 'top-left');
});

document.getElementById('universityInfoBtn').addEventListener('click', function() {
    document.getElementById('universityInfoDropdowns').classList.add('active');
    document.getElementById('vacanciesDropdowns').classList.remove('active');
});

document.getElementById('vacanciesBtn').addEventListener('click', function() {
    document.getElementById('vacanciesDropdowns').classList.add('active');
    document.getElementById('universityInfoDropdowns').classList.remove('active');
});