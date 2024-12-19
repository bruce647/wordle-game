<?php
require_once __DIR__ . '/../config/database.php';

class WordModel extends DatabaseConnection {
    private $refreshInterval = 300; // 5分钟 = 300秒

    public function getRandomWordWithTimeCache($language = 'en', $difficulty = 'medium') {
        $currentTime = time();

        
        $stmt = $this->getConnection()->prepare("
            SELECT word, generated_at 
            FROM word_cache 
            WHERE language = :language AND difficulty = :difficulty 
            ORDER BY generated_at DESC 
            LIMIT 1
        ");
        $stmt->execute([
            ':language' => $language,
            ':difficulty' => $difficulty
        ]);
        $cachedWord = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cachedWord && ($currentTime - $cachedWord['generated_at'] < $this->refreshInterval)) {
            return [
                'word' => strtoupper($cachedWord['word']),
                'length' => strlen($cachedWord['word']),
                'remainingTime' => $this->refreshInterval - ($currentTime - $cachedWord['generated_at']),
                'nextRefreshTime' => $cachedWord['generated_at'] + $this->refreshInterval
            ];
        }

        $newWord = $this->getRandomWord($language, $difficulty);

        $stmt = $this->getConnection()->prepare("
            INSERT INTO word_cache (word, language, difficulty, generated_at) 
            VALUES (:word, :language, :difficulty, :generated_at)
        ");
        $stmt->execute([
            ':word' => $newWord,
            ':language' => $language,
            ':difficulty' => $difficulty,
            ':generated_at' => $currentTime
        ]);

        return [
            'word' => strtoupper($newWord),
            'length' => strlen($newWord),
            'remainingTime' => $this->refreshInterval,
            'nextRefreshTime' => $currentTime + $this->refreshInterval
        ];
    }

    public function getRandomWord($language = 'en', $difficulty = 'medium') {
        $stmt = $this->getConnection()->prepare(
            "SELECT word FROM words 
            WHERE language = :language 
            AND difficulty = :difficulty 
            AND active = TRUE 
            ORDER BY RAND() 
            LIMIT 1"
        );
        $stmt->execute([
            ':language' => $language,
            ':difficulty' => $difficulty
        ]);
        return $stmt->fetch(PDO::FETCH_COLUMN);
    }

    public function validateWordWithGame($inputWord, $solution, $currentRow, $maxAttempts, $keyboardStatus = [], $playerId = null) {
        $inputWord = strtoupper($inputWord);
        $solution = strtoupper($solution);
        
        // if (!$this->validateWord($inputWord)) {
        //     return [
        //         'isCorrect' => false,
        //         'newGameStatus' => 'invalid',
        //         'newFeedback' => 'Not a valid word',
        //         'newKeyboardStatus' => $keyboardStatus,
        //         'newCurrentRow' => $currentRow,
        //         'newCurrentCol' => strlen($inputWord)
        //     ];
        // }

        $solutionLetters = str_split($solution);
        $inputLetters = str_split($inputWord);
        $newKeyboardStatus = $keyboardStatus;

        // First round: check correct position (green)
        foreach ($solutionLetters as $index => $solutionLetter) {
            if (isset($inputLetters[$index]) && $inputLetters[$index] === $solutionLetter) {
                $newKeyboardStatus[$inputLetters[$index]] = "green";
            }
        }

        // Second round: check wrong position (yellow)
        foreach ($solutionLetters as $index => $solutionLetter) {
            if (isset($inputLetters[$index]) && $inputLetters[$index] !== $solutionLetter) {
                $letterIndex = array_search($solutionLetter, $inputLetters);
                if ($letterIndex !== false && 
                    (!isset($newKeyboardStatus[$solutionLetter]) || 
                     $newKeyboardStatus[$solutionLetter] !== "green")) {
                    $newKeyboardStatus[$solutionLetter] = "yellow";
                }
            }
        }

        // Third round: check missing letters (gray)
        foreach ($inputLetters as $letter) {
            if (!isset($newKeyboardStatus[$letter])) {
                $newKeyboardStatus[$letter] = "gray";
            }
        }

        // Update game status
        $newGameStatus = "playing";
        $newFeedback = "";
        $isCorrect = ($inputWord === $solution);

        if ($isCorrect) {
            $newGameStatus = "won";
            $newFeedback = "Congratulations! You guessed the word.";
            if ($playerId) {
                $this->updateGameStats($playerId, true);
            }
        } else if ($currentRow + 1 === $maxAttempts) {
            $newGameStatus = "lost";
            $newFeedback = "Game over! The correct word was {$solution}.";
            if ($playerId) {
                $this->updateGameStats($playerId, false);
            }
        }

        return [
            'isCorrect' => $isCorrect,
            'newGameStatus' => $newGameStatus,
            'newFeedback' => $newFeedback,
            'newKeyboardStatus' => $newKeyboardStatus,
            'newCurrentRow' => $currentRow + 1,
            'newCurrentCol' => 0
        ];
    }

    private function updateGameStats($playerId, $isWin) {
        try {
            $this->getConnection()->beginTransaction();

            // Get player stats
            $stmt = $this->getConnection()->prepare("
                SELECT * FROM game_stats 
                WHERE player_id = :player_id
                FOR UPDATE
            ");
            $stmt->execute([':player_id' => $playerId]);
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$stats) {
                // If no stats found, create a new record
                $stmt = $this->getConnection()->prepare("
                    INSERT INTO game_stats (
                        player_id, 
                        total_games, 
                        total_wins, 
                        total_losses, 
                        current_streak, 
                        max_streak
                    ) VALUES (
                        :player_id,
                        1,
                        :wins,
                        :losses,
                        :current_streak,
                        :max_streak
                    )
                ");

                $wins = $isWin ? 1 : 0;
                $losses = $isWin ? 0 : 1;
                $current_streak = $isWin ? 1 : 0;

                $stmt->execute([
                    ':player_id' => $playerId,
                    ':wins' => $wins,
                    ':losses' => $losses,
                    ':current_streak' => $current_streak,
                    ':max_streak' => $current_streak
                ]);
            } else {
                // Update existing stats
                $current_streak = $isWin ? $stats['current_streak'] + 1 : 0;
                $max_streak = max($stats['max_streak'], $current_streak);

                $stmt = $this->getConnection()->prepare("
                    UPDATE game_stats 
                    SET total_games = total_games + 1,
                        total_wins = total_wins + :wins,
                        total_losses = total_losses + :losses,
                        current_streak = :current_streak,
                        max_streak = :max_streak
                    WHERE player_id = :player_id
                ");

                $stmt->execute([
                    ':player_id' => $playerId,
                    ':wins' => $isWin ? 1 : 0,
                    ':losses' => $isWin ? 0 : 1,
                    ':current_streak' => $current_streak,
                    ':max_streak' => $max_streak
                ]);
            }

            $this->getConnection()->commit();
        } catch (Exception $e) {
            $this->getConnection()->rollBack();
            // Log the error
            error_log("Error updating game stats: " . $e->getMessage());
        }
    }

    private function validateWord($word, $language = 'en') {
        $stmt = $this->getConnection()->prepare("
            SELECT COUNT(*) FROM words 
            WHERE word = :word 
            AND language = :language 
            AND active = TRUE
        ");
        $stmt->execute([
            ':word' => $word,
            ':language' => $language
        ]);
        return $stmt->fetchColumn() > 0;
    }


    public function getPlayerStats($playerId) {
        try {
            $stmt = $this->getConnection()->prepare("
                SELECT 
                    total_games,
                    total_wins,
                    total_losses,
                    current_streak,
                    max_streak,
                    last_played
                FROM game_stats 
                WHERE player_id = :player_id
            ");
            $stmt->execute([':player_id' => $playerId]);
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$stats) {
                return [
                    'total_games' => 0,
                    'total_wins' => 0,
                    'total_losses' => 0,
                    'current_streak' => 0,
                    'max_streak' => 0,
                    'last_played' => null
                ];
            }
    
            return $stats;
        } catch (Exception $e) {
            // Log the error
            error_log("Error fetching player stats: " . $e->getMessage());
            return null; 
        }
    }

    public function addWord($word, $language = 'en', $difficulty = 'medium') {
        $stmt = $this->getConnection()->prepare(
            "INSERT INTO words (word, language, difficulty) 
            VALUES (:word, :language, :difficulty)"
        );
        return $stmt->execute([
            ':word' => $word,
            ':language' => $language,
            ':difficulty' => $difficulty
        ]);
    }
}