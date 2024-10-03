mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbmJpbnpob3UiLCJhIjoiY2x6aHF1amJmMDc2bTJrcTJxY2lubnBxeiJ9.vQZhyROyZYPlAlVahk4HHA';

// Create an array to hold university objects
const universities = [];



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

    //map.addControl(directions, 'top-left');


    /* change view by select different state */
    const stateCenters = {
        all: { center: [133.7751, -25.2744], zoom: 3 },
        nsw: { center: [147.6381, -32.2405], zoom: 5 },
        vic: { center: [144.9631, -37.8136], zoom: 6 },
        qld: { center: [146.7013, -20.9176], zoom: 5 },
        sa: { center: [134.4910, -30.0002], zoom: 5 },
        wa: { center: [121.6283, -25.0423], zoom: 4 },
        tas: { center: [146.3159, -41.6401], zoom: 7 },
        nt: { center: [133.7751, -19.4914], zoom: 5 },
        act: { center: [149.0124, -35.4735], zoom: 9 }
    };

    document.getElementById('location').addEventListener('change', function() {
        const selectedState = this.value.toLowerCase();
        const { center, zoom } = stateCenters[selectedState];
        map.flyTo({ center, zoom });

        // Filter universities by selected state
        const filteredUniversities = universities.filter(university => university.state.toLowerCase() === selectedState || selectedState === 'all');

        // Remove existing markers
        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

        // Add new markers
        filteredUniversities.forEach(university => {
            new mapboxgl.Marker()
                .setLngLat([university.longitude, university.latitude])
                .setPopup(new mapboxgl.Popup().setText(university.universityName))
                .addTo(map);
        });
    });
    // when selecting different state, showing university in specific state
    console.log('uni object:',universities);






    document.getElementById('universityInfoBtn').addEventListener('click', function() {
        document.getElementById('universityInfoDropdowns').classList.add('active');
        document.getElementById('vacanciesDropdowns').classList.remove('active');
    });

    document.getElementById('vacanciesBtn').addEventListener('click', function() {
        document.getElementById('vacanciesDropdowns').classList.add('active');
        document.getElementById('universityInfoDropdowns').classList.remove('active');
    });
});


/* load university json file */

fetch('json/university_australia_info.json')
  .then(response => response.json())
  .then(data => {
    

    // Iterate over each university object in the JSON array
    data.forEach(university => {
      // Create an object for each university with its attributes
      const universityObject = {
        id: university.ID,
        universityName: university.University_Name,
        universityAcronym: university.University_Acronym,
        campusType: university.Campus_Type,
        campusName: university.Campus_Name,
        campusAddress: university.Campus_Street_Address,
        postcode: university.Postcode,
        state: university.State,
        country: university.Country,
        latitude: university.Latitude,
        longitude: university.Longitude
      };

      // Add the university object to the array
      universities.push(universityObject);
    });

  })
  .catch(error => console.error('Error loading JSON:', error));
