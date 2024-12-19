<?php
class DatabaseConnection {
    private $host = 'localhost:3306';
    private $username = 'bruce';
    private $password = 'LGXshi123';
    private $database = 'wordle_game';
    private $charset = 'utf8mb4';

    protected $connection;
    private $logFile = 'database_connection.log';

    public function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->database};charset={$this->charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);

            // Log the successful connection
            $this->logMessage('Database connection successful.');
        } catch (PDOException $e) {
            // Log the connection error
            $this->logMessage('Database connection failed: ' . $e->getMessage());
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    protected function getConnection() {
        return $this->connection;
    }

    private function logMessage($message) {
        $logEntry = date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL;
        file_put_contents($this->logFile, $logEntry, FILE_APPEND);
    }
}