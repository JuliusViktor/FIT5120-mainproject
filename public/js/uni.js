mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbmJpbnpob3UiLCJhIjoiY2x6aHF1amJmMDc2bTJrcTJxY2lubnBxeiJ9.vQZhyROyZYPlAlVahk4HHA';

// Global variables list
const universities_info = [];
const universities_major = [];
const vacancies_info = [];

document.addEventListener('DOMContentLoaded', function () {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [133.7751, -25.2744], // Approximate center of Australia
        zoom: 3
    });

    const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/cycling',
        alternatives: true,
        geometries: 'geojson',
        controls: {
            inputs: true,
            instructions: true,
            profileSwitcher: true
        },
        flyTo: false
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

    function filterAndDisplayMarkers() {
        const selectedState = document.getElementById('location_uni').value.toLowerCase();
        const selectedAtar = document.getElementById('atarScore').value;

        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

        const filteredUniversities = universities_info.filter(university => {
            const stateMatch = selectedState === 'all' || university.state.toLowerCase() === selectedState;
            const matchingUniversity = universities_major.find(u => u.universityAcronym === university.universityAcronym);
            
            let atarMatch = true;
            if (selectedAtar !== 'All' && matchingUniversity) {
                const lowestAtar = parseFloat(matchingUniversity.lowestAtarScore);
                if (selectedAtar === '49') {
                    atarMatch = !isNaN(lowestAtar) && lowestAtar < 50;
                } else {
                    atarMatch = !isNaN(lowestAtar) && lowestAtar >= parseFloat(selectedAtar);
                }
            }

            // Only include universities with ATAR data when a specific ATAR is selected
            return stateMatch && (selectedAtar === 'All' || (matchingUniversity && matchingUniversity.lowestAtarScore !== 'No data available' && atarMatch));
        });

        filteredUniversities.forEach(university => {
            const marker = new mapboxgl.Marker()
                .setLngLat([university.longitude, university.latitude])
                .setPopup(new mapboxgl.Popup().setText(university.universityName))
                .addTo(map);

            marker.getElement().addEventListener('click', () => {
                const matchingUniversity = universities_major.find(u => u.universityAcronym === university.universityAcronym);

                let lowestAtarCourseName = 'No data available';
                let lowestAtarScore = 'No data available';

                if (matchingUniversity) {
                    lowestAtarCourseName = matchingUniversity.lowestAtarCourseName || 'No data available';
                    lowestAtarScore = matchingUniversity.lowestAtarScore || 'No data available';
                }

                const details = `
                    <strong>Name:</strong> ${university.universityName} (${university.universityAcronym})<br>
                    <strong>Campus:</strong> ${university.campusName} (${university.campusType})<br>
                    <strong>Address:</strong> ${university.campusAddress}, ${university.state}, ${university.country}, ${university.postcode}<br>
                    <strong>Lowest ATAR Major:</strong> ${lowestAtarCourseName}<br>
                    <strong>Lowest ATAR Score:</strong> ${lowestAtarScore}<br>
                `;
                document.getElementById('universityDetails').innerHTML = details;
            });
        });
    }

    document.getElementById('location_uni').addEventListener('change', function() {
        const selectedState = this.value.toLowerCase();
        const { center, zoom } = stateCenters[selectedState];
        map.flyTo({ center, zoom });
        filterAndDisplayMarkers();
    });

    document.getElementById('atarScore').addEventListener('change', filterAndDisplayMarkers);

    // Load university info
function loadUniversityInfo() {
  return fetch('json/university_australia_info.json')
      .then(response => response.json())
      .then(data => {
          data.forEach(university => {
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

              if(universityObject.campusType == 'Main'){
                  universities_info.push(universityObject);
              }
          });
      })
      .catch(error => console.error('Error loading university info:', error));
}

// Load university majors
function loadUniversityMajors() {
  return fetch('json/ATAR.json')
      .then(response => response.json())
      .then(data => {
          const universityGroups = data.reduce((acc, course) => {
              const university = course['University'];
              const courseName = course['Course name'];
              const atarScore = course['ATAR Score'];
              const universityAcronym = course['University_Acronym'];

              if (!acc[university]) {
                  acc[university] = {
                      courses: [],
                      universityAcronym: universityAcronym
                  };
              }
              acc[university].courses.push({ courseName, atarScore });
              return acc;
          }, {});

          for (const [universityName, universityData] of Object.entries(universityGroups)) {
              universityData.courses.sort((a, b) => a.atarScore - b.atarScore);

              const lowestAtarCourse = universityData.courses[0];
              const lowestAtarCourseName = lowestAtarCourse ? lowestAtarCourse.courseName : 'No data available';
              const lowestAtarScore = lowestAtarCourse ? lowestAtarCourse.atarScore : 'No data available';

              const universityObject = {
                  universityName,
                  universityAcronym: universityData.universityAcronym,
                  courses: universityData.courses,
                  lowestAtarCourseName,
                  lowestAtarScore
              };

              universities_major.push(universityObject);
          }
      })
      .catch(error => console.error('Error loading university majors:', error));
}

// Load all data and initialize
Promise.all([loadUniversityInfo(), loadUniversityMajors()])
  .then(() => {
      // Initial display of markers
      filterAndDisplayMarkers();
  })
  .catch(error => console.error('Error loading data:', error));

});
