import { useState, useEffect } from "react";
import { WORD_LENGTH, MAX_ATTEMPTS } from "../utils/wordList";
import { getRandomWord, validateWord } from "../services/wordleService";

export const useWordle = () => {
  const [solution, setSolution] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [board, setBoard] = useState(
    Array(MAX_ATTEMPTS)
      .fill()
      .map(() => Array(WORD_LENGTH).fill(""))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [feedback, setFeedback] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const handleGetRandomWord = async () => {
    try {
      setLoading(true);
      const response = await getRandomWord();
      console.log(response);
      const data = await response;
      if (data.word && data.length === WORD_LENGTH) {
        setSolution(data.word.toUpperCase());
        setRemainingTime(data.remainingTime);
      } else {
        console.error("Invalid word received from API");
      }
      setLoading(false);
    } catch (error) {
      setLoading;
      console.error("Error fetching word from API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize the game
  useEffect(() => {
    handleGetRandomWord();
  }, []);

  // Handle key press
  const handleKeyPress = (key) => {
    if (gameStatus !== "playing") return;

    switch (key) {
      case "Backspace":
        if (currentCol > 0) {
          const newBoard = [...board];
          newBoard[currentRow][currentCol - 1] = "";
          setBoard(newBoard);
          setCurrentCol(currentCol - 1);
        }
        break;

      case "Enter":
        if (currentCol === WORD_LENGTH) {
          submitWord();
        }
        break;

      default:
        if (/^[A-Z]$/.test(key) && currentCol < WORD_LENGTH) {
          const newBoard = [...board];
          newBoard[currentRow][currentCol] = key;
          setBoard(newBoard);
          setCurrentCol(currentCol + 1);
        }
        break;
    }
  };

  // Submit word
  const submitWord = async () => {
    const currentWord = board[currentRow].join("");
    try {
      const {
        isCorrect,
        newGameStatus,
        newFeedback,
        newKeyboardStatus,
        newCurrentRow,
        newCurrentCol,
      } = await validateWord(
        currentWord,
        solution,
        keyboardStatus,
        currentRow,
        MAX_ATTEMPTS
      );

      if (isCorrect) {
        setGameStatus("won");
        setFeedback(newFeedback);
      } else if (newGameStatus === "lost") {
        setGameStatus("lost");
        setFeedback(newFeedback);
      }

      setKeyboardStatus(newKeyboardStatus);
      setCurrentRow(newCurrentRow);
      setCurrentCol(newCurrentCol);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    solution,
    remainingTime,
    board,
    currentRow,
    gameStatus,
    feedback,
    keyboardStatus,
    loading,
    handleKeyPress,
  };
};
