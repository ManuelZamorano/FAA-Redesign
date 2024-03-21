$(document).ready(function() {
   
  $('[data-toggle="tooltip"]').tooltip();

  $('#multiselect').multiselect({
      includeSelectAllOption: true // Enable "Select All" option
  });

  $('#multiselect').change(function() {
      if ($(this).val().length === 0) {
          // If no options selected, select "Select All"
          $(this).multiselect('select', $('.select-all').val());
      } else if ($(this).val().length === $(this).find('option').length - 1) {
          // If all options selected (except "Select All"), deselect "Select All"
          $(this).multiselect('deselect', $('.select-all').val());
      }
  });
   // Initialize Bootstrap Datepicker
   $('#datepicker').datepicker({
    format: 'yyyy-mm-dd', // Set date format
    todayHighlight: true, // Highlight today's date
    autoclose: true // Close the datepicker when a date is selected
});

// Set default date to today
$('#datepicker').datepicker('setDate', new Date());


mapboxgl.accessToken = 'pk.eyJ1IjoibWFubm96YW0iLCJhIjoiY2x1MGZhZjZnMDFtcjJrc2EzdGoxYzMzbyJ9.DDc0Bmy153c2v1TXqXTdkw'; // Replace with your Mapbox Access Token

// Initialize the map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-94.5, 45], // Default center coordinates
  zoom: 3 // Default zoom level
});

// Search button click event handler
document.getElementById('searchButton').addEventListener('click', function() {
  var query = document.getElementById('searchInput').value.trim();

  // Perform search using Mapbox Geocoding API
  fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=' + mapboxgl.accessToken)
    .then(response => response.json())
    .then(data => {
      // Clear previous search results
      document.getElementById('searchResults').innerHTML = '';

      // Display search results
      data.features.forEach(feature => {
        var listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = feature.place_name;
        document.getElementById('searchResults').appendChild(listItem);

        // Add click event listener to each result
        listItem.addEventListener('click', function() {
          // Center the map on the selected location
          map.flyTo({
            center: feature.center,
            zoom: 12 // Adjust zoom level as needed
          });
        });
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
});



});