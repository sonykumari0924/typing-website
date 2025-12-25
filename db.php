<?php
// Database connection settings
$servername = "localhost";
$username = "root";   // default username in XAMPP/WAMP
$password = "";       // leave empty unless you set one
$dbname = "polytype_db";  // your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>