const express = require('express');
const mysql = require('mysql');

const app = express();

// Database connection configuration
const dbConnection = mysql.createConnection({
  host: 'mysql.faa-advisory-search.nerxmedia.com',
  user: 'mannozam',
  password: 'Pathos4417?',
  database: 'advisories',
  port: 3306
});

// Connect to the database
dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// API endpoint to fetch data from the table ATSCSCC
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM ATSCSCC';

  // Execute the query
  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the results as JSON
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
