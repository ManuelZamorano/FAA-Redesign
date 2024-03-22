$(document).ready(function() {
  // Function to export data to Excel
        function exportToExcel() {
            fetch('http://faa-advisory-search.nerxmedia.com/api.php')
                .then(response => response.json())
                .then(data => {
                    // Convert data to Excel workbook
                    const wb = XLSX.utils.book_new();
                    const ws = XLSX.utils.json_to_sheet(data);
                    XLSX.utils.book_append_sheet(wb, ws, "ATSCSCC_Data");

                    // Save Excel file
                    XLSX.writeFile(wb, "ATSCSCC_Data.xlsx");
                })
                .catch(error => console.error('Error exporting to Excel:', error));
        }

        // Call the fetchData function when the page loads
        window.onload = fetchData;

        // Attach exportToExcel function to export button click
        document.getElementById('export-btn').addEventListener('click', exportToExcel);
    // Function to fetch data from the API
    function fetchData() {
      fetch('http://faa-advisory-search.nerxmedia.com/api.php')
          .then(response => response.json())
          .then(data => {
              // Process the data and generate Bootstrap cards
              const dataContainer = document.getElementById('data-container');
              data.forEach(item => {
                  const cardHtml = `
                      <div class="card">
  <div class="card-body">
    <span class="bi bi-airplane" style="	position:absolute;
      right: 0px;
      padding: 2px 20px;"></span>
    <h5 class="card-title"><a href="#" class="card-link">${item.AdvisoryID}</a>
    </h5>
    <h6 class="card-subtitle mb-2 text-muted">${item.controlElement}</h6>
    <p class="card-text">${item.title}
      <br> Sent ${item.CDate}
    </p>

  </div>
</div>
                  `;
                  dataContainer.innerHTML += cardHtml;
              });
          })
          .catch(error => console.error('Error fetching data:', error));
  }

  // Call the fetchData function when the page loads
  window.onload = fetchData;
  $('[data-toggle="tooltip"]').tooltip();

  $('#categories').multiselect({
      includeSelectAllOption: true // Enable "Select All" option
  });

  $('#categories').change(function() {
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

//Search
$('#search-form').submit(function(event){
  event.preventDefault();
  var formData = $(this).serialize();
  console.log(formData)
  $.ajax({
      url: 'http://faa-advisory-search.nerxmedia.com/api.php',
      type: 'GET',
      dataType: 'json',
      success: function(data){
          var searchDate = $('#date').val();
          var searchCategories = $('#categories').val();
          var results = data.filter(function(item) {
              return item.cdate === searchDate && item.categories === searchCategories;
          });
          displayResults(results);
      },
      error: function(xhr, status, error) {
          console.error('Error fetching data:', error);
      }
  });
});

function displayResults(results) {
  var resultsContainer = $('#results');
  resultsContainer.empty();
  if (results.length > 0) {
      results.forEach(function(item) {
          resultsContainer.append('<div class="card mb-3"><div class="card-body"><h5 class="card-title">' + item.title + '</h5><p class="card-text">' + item.description + '</p><p class="card-text">Date: ' + item.cdate + '</p></div></div>');
      });
  } else {
      resultsContainer.append('<p>No results found.</p>');
  }
}
});