<?php
/**
 * API Endpoints Test Script
 * Tests all API endpoints to verify JSON responses
 */

// Set JSON accept header
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// Base URL
$baseUrl = 'http://localhost/userpanel-event/userpanel-backend';

// List of endpoints to test
$endpoints = [
    'GET /pets' => '/pets',
    'GET /appointments' => '/appointments',
    'GET /veterinarians' => '/veterinarians',
    'GET /services' => '/services',
];

echo "=== API Endpoints Test ===\n\n";

foreach ($endpoints as $name => $endpoint) {
    echo "Testing: $name\n";
    echo "URL: $baseUrl$endpoint\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Code: $httpCode\n";
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            echo "✓ Valid JSON response\n";
            echo "Response keys: " . implode(', ', array_keys($data)) . "\n";
        } else {
            echo "✗ Invalid JSON: " . json_last_error_msg() . "\n";
            echo "Raw response: " . substr($response, 0, 200) . "\n";
        }
    } else {
        echo "✗ Failed with HTTP $httpCode\n";
        echo "Response: " . substr($response, 0, 200) . "\n";
    }
    
    echo "\n" . str_repeat('-', 50) . "\n\n";
}

echo "=== Test Complete ===\n";
