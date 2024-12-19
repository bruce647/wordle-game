<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../models/Word.php';

$wordModel = new WordModel();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_random':
        $language = $_GET['language'] ?? 'en';
        $difficulty = $_GET['difficulty'] ?? 'medium';
        
        $randomWordData = $wordModel->getRandomWordWithTimeCache($language, $difficulty);
        
        echo json_encode([
            'word' => $randomWordData['word'],
            'length' => $randomWordData['length'],
            'remainingTime' => $randomWordData['remainingTime'],
            'nextRefreshTime' => $randomWordData['nextRefreshTime']
        ]);
        break;

    case 'validate':
            // get essential parameters
            $inputWord = strtoupper($_GET['word'] ?? '');
            $solution = strtoupper($_GET['solution'] ?? '');
            $currentRow = intval($_GET['currentRow'] ?? 0);
            $maxAttempts = intval($_GET['maxAttempts'] ?? 6);
            $keyboardStatus = json_decode($_GET['keyboardStatus'] ?? '{}', true);
            $playerId = $_GET['playerId'] ?? null;

            $result = $wordModel->validateWordWithGame(
                $inputWord,
                $solution,
                $currentRow,
                $maxAttempts,
                $keyboardStatus,
                $playerId
            );
            
            echo json_encode($result);
            break;
    
            case 'get_stats':
                $playerId = $_GET['playerId'] ?? null;
                if (!$playerId) {
                    echo json_encode(['error' => 'Player ID is required']);
                    exit;
                }
            
                $stats = $wordModel->getPlayerStats($playerId);
            
                if ($stats === null) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to fetch player stats']);
                } else {
                    echo json_encode($stats);
                }
                break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}