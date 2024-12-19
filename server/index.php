<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

error_log("Request Path: $request, Method: $method");

$logFile = __DIR__ . '/request.log';
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Request Path: $request, Method: $method\n", FILE_APPEND);

switch ($request) {
    case '/api/words':
        require __DIR__ . '/api/words.php';
        break;
    case '/api/stats':
        require __DIR__ . '/api/stats.php';
        break;
    default:
        http_response_code(404);
        
        // Log 404
        error_log("404 Not Found - Requested Path: $request");
        
        echo json_encode(['error' => 'Not Found']);
        break;
}