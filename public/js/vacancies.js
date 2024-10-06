mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbmJpbnpob3UiLCJhIjoiY2x6aHF1amJmMDc2bTJrcTJxY2lubnBxeiJ9.vQZhyROyZYPlAlVahk4HHA';


//global variables list
// Create an array to hold university info objects
const universities_info = [];
// Create university objects with sorted courses
const universities_major = [];
// Create university objects with vacancies
const vacancies_info = [];

// add dropdwon menu related to job vacancies 


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
        qld: { center: [149.1868, -21.1411], zoom: 4 },
        sa: { center: [138.6007, -34.9285], zoom: 5 },
        wa: { center: [121.6283, -25.0423], zoom: 4 },
        tas: { center: [146.3159, -41.6401], zoom: 6 },
        nt: { center: [133.7751, -19.4914], zoom: 5 },
        act: { center: [149.0124, -35.4735], zoom: 9 }
    };


   

    //map control part for vacancy information
    document.getElementById('location_vac').addEventListener('change', function() {
        const selectedState = this.value.toLowerCase();
        const { center, zoom } = stateCenters[selectedState];
        map.flyTo({ center, zoom });

       
    });
    






    

    


        
        
    
});






  /* load job vacancies data */
  fetch('json/Stem_state_vacanies_final.json')
  .then(response => response.json())
  .then(data => {
    

    // Iterate over each vacancy object in the JSON array
    data.forEach(vacancy => {
      // Create an object for each vacancy with its attributes
      const vacancyObject = {
        level: vacancy.Level,
        anzscoCode: vacancy.ANZSCO_CODE,
        title: vacancy.Title,
        state: vacancy.State,
        year: vacancy.Year,
        month: vacancy.Month,
        numberOfVacancies: vacancy["Number of vacancies (thousand)"]
      };

      // Add the vacancy object to the array
      vacancies_info.push(vacancyObject);
    });

    // You can now use the vacancies_info array as needed
    console.log(vacancies_info);
  })
  .catch(error => console.error('Error loading JSON:', error));

