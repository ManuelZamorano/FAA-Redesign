<?php

// Database connection parameters
$host = 'mysql.faa-advisory-search.nerxmedia.com';
$user = 'mannozam';
$password = 'Pathos4417?';
$database = 'advisories';
$port = 3306;

// Establish a connection to the database
$mysqli = new mysqli($host, $user, $password, $database, $port);

// Check for connection errors
if ($mysqli->connect_errno) {
    echo json_encode(array("error" => "Failed to connect to MySQL: " . $mysqli->connect_error));
    exit();
}

// Define API endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Query to fetch data from the ATSCSCC table
    $query = "SELECT * FROM ATSCSCC";
    
    // Execute the query
    $result = $mysqli->query($query);

    // Check if there are any results
    if ($result->num_rows > 0) {
        // Fetch data and store it in an array
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Close the result set
        $result->close();

        // Close the database connection
        $mysqli->close();

        // Return JSON response
        echo json_encode($data);
    } else {
        // No results found
        echo json_encode(array("message" => "No data found in the table."));
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(array("error" => "Method Not Allowed"));
}
?>
