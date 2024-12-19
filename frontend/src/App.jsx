import React, { useState } from "react";
import { CircleHelp, FileChartColumn, Info, Moon, Sun } from "lucide-react";

import { useWordle } from "./hooks/useWordle";
import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import "./App.css";
import { TutorialModal } from "./components/TutorialModal";
import { StatsModal } from "./components/StatsModal";
import { getRandomWord } from "./services/wordleService";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loadingTime, setLoadingTime] = useState(true);
  const {
    board,
    currentRow,
    gameStatus,
    feedback,
    keyboardStatus,
    solution,
    loading,
    handleKeyPress,
  } = useWordle();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleOpenStatsModal = async () => {
    setLoadingTime(true);
    try {
      const response = await getRandomWord();
      setRemainingTime(response.remainingTime);
      setLoadingTime(false);
      setIsStatsOpen(true);
    } catch (error) {
      console.error("Error fetching word from API:", error);
    }
  }


  return (
    <div
      className={`
      w-full min-h-screen flex flex-col items-center justify-center p-4 
      transition-colors duration-300 
      ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
    `}
    >
      {/* Title amd dark mode */}
      <div
        className={`h-20 max-w-2xl w-full flex items-center justify-between mb-4 p-4 rounded-xl ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
      >
        <button
          className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          onClick={() => setIsTutorialOpen(true)}
        >
          <CircleHelp />
        </button>
        <h1 className="text-4xl font-bold pl-8">Wordle</h1>
        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            onClick={handleOpenStatsModal}
            loading={loadingTime}
          >
            <FileChartColumn />
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
          >
            {darkMode ? <Sun color="white" /> : <Moon />}
          </button>
        </div>
      </div>

      {/* Game board */}
      {!loading && (
        <GameBoard
          board={board}
          currentRow={currentRow}
          solution={solution}
          darkMode={darkMode}
        />
      )}
      {/* Feedback */}
      {feedback && (
        <div
          className={`
          mb-4 p-2 rounded text-white text-center
          ${gameStatus === "won" ? "bg-green-500" : "bg-red-500"}
        `}
        >
          {feedback}
        </div>
      )}

      {/* Keyboard */}
      <Keyboard
        handleKeyPress={handleKeyPress}
        keyboardStatus={keyboardStatus}
        darkMode={darkMode}
      />
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} darkMode={darkMode} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} darkMode={darkMode} remainingTime={remainingTime} solution={solution} />
    </div>
  );
};

export default App;
