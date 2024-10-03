mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbmJpbnpob3UiLCJhIjoiY2x6aHF1amJmMDc2bTJrcTJxY2lubnBxeiJ9.vQZhyROyZYPlAlVahk4HHA';

// Create an array to hold university info objects
const universities_info = [];
// Create university objects with sorted courses
const universities_major = [];
// Create university objects with vacancies
const vacancies_info = [];


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

    //map control part for university information
    document.getElementById('location_uni').addEventListener('change', function() {
        const selectedState = this.value.toLowerCase();
        const { center, zoom } = stateCenters[selectedState];
        map.flyTo({ center, zoom });

        // Filter universities by selected state
        const filteredUniversities = universities_info.filter(university => university.state.toLowerCase() === selectedState || selectedState === 'all');

        // Remove existing markers
        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

        // Add new markers
        filteredUniversities.forEach(university => {
            const marker = new mapboxgl.Marker()
                .setLngLat([university.longitude, university.latitude])
                .setPopup(new mapboxgl.Popup().setText(university.universityName))
                .addTo(map);
            

            universities_major.forEach(obj => {
                console.log(`universityName: ${obj.universityName}, lowestAtarCourseName: ${obj.lowestAtarCourseName}, lowestAtarScore: ${obj.lowestAtarScore}`);
              });

              universities_major.forEach(obj => {
                console.log(`universityName: ${obj.universityName}, lowestAtarCourseName: ${obj.lowestAtarCourseName}, lowestAtarScore: ${obj.lowestAtarScore}`);
              });
              

            // Add click event to update the information block
            marker.getElement().addEventListener('click', () => {
                const details = `
                    <strong>Name:</strong> ${university.universityName} (${university.universityAcronym})<br>
                    <strong>Campus:</strong> ${university.campusName} (${university.campusType})<br>
                    <strong>Address:</strong> ${university.campusAddress}, ${university.state}, ${university.country}, ${university.postcode}<br> 
                    <strong>lowestAtarCourseName:</strong> ${university.postcode}<br>
                    <strong>lowestAtarScore:</strong> ${university.postcode}<br>     
                `;
                document.getElementById('universityDetails').innerHTML = details;
            });
        });

    });

    
    

   

    //map control part for vacancy information
    document.getElementById('location_vac').addEventListener('change', function() {
        const selectedState = this.value.toLowerCase();
        const { center, zoom } = stateCenters[selectedState];
        map.flyTo({ center, zoom });

       
    });
    






    document.getElementById('universityInfoBtn').addEventListener('click', function() {
        // add dropdwon menu related to university and remove dropdown menu related to job vacancies
        document.getElementById('universityInfoDropdowns').classList.add('active');
        document.getElementById('vacanciesDropdowns').classList.remove('active');
    });

    document.getElementById('vacanciesBtn').addEventListener('click', function() {

        // Remove existing markers
        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

        // add dropdwon menu related to job vacancies and remove dropdown menu related to university
        document.getElementById('vacanciesDropdowns').classList.add('active');
        document.getElementById('universityInfoDropdowns').classList.remove('active');
    });
});


/* load university  info json file */

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
      if(universityObject.campusType == 'Main'){
        universities_info.push(universityObject);
      }
      
    });

  })
  .catch(error => console.error('Error loading JSON:', error));

  
/* load university majors */
fetch('json/ATAR.json')
  .then(response => response.json())
  .then(data => {

    // Group courses by university
    const universityGroups = data.reduce((acc, course) => {
      const university = course['University'];
      const courseName = course['Course name'];
      const atarScore = course['ATAR Score'];

      if (!acc[university]) {
        acc[university] = [];
      }
      acc[university].push({ courseName, atarScore });
      return acc;
    }, {});

    const universities_major = [];

    for (const [universityName, courses] of Object.entries(universityGroups)) {
      // Sort courses by ATAR score
      courses.sort((a, b) => a.atarScore - b.atarScore);

      // Get the course with the lowest ATAR score
      const lowestAtarCourse = courses[0];
      const lowestAtarCourseName = lowestAtarCourse.courseName;
      const lowestAtarScore = lowestAtarCourse.atarScore;

      // Create university object
      const universityObject = {
        universityName,
        courses,
        lowestAtarCourseName,
        lowestAtarScore
      };

      // Add to the universities_major array
      universities_major.push(universityObject);
    }

    console.log(universities_major);
  })
  .catch(error => console.error('Error loading JSON:', error));







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

