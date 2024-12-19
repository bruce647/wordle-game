CREATE DATABASE wordle_game;
USE wordle_game;

-- Words
CREATE TABLE words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(5) NOT NULL UNIQUE,
    language VARCHAR(10) DEFAULT 'zh',
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    active BOOLEAN DEFAULT TRUE
);

-- Game Stats
CREATE TABLE game_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id VARCHAR(100) NOT NULL,
    total_games INT DEFAULT 0,
    total_wins INT DEFAULT 0,
    total_losses INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    max_streak INT DEFAULT 0,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Word Cache
CREATE TABLE word_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    generated_at INT NOT NULL,
    INDEX idx_language_difficulty (language, difficulty)
);

-- Initialize default words
INSERT INTO words (word, language, difficulty) VALUES 
('REACT', 'en', 'medium'),
('HELLO', 'en', 'easy'),
('WORLD', 'en', 'easy'),
('GAMES', 'en', 'medium'),
('CODES', 'en', 'medium');