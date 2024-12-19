import React from "react";

const GameBoard = ({ board, currentRow, solution, darkMode }) => {
  const getCellColor = (rowIndex, colIndex) => {
    if (rowIndex >= currentRow) return "";

    const letter = board[rowIndex][colIndex];

    if (letter === solution[colIndex]) {
      return "bg-green-500 text-white";
    }

    if (solution.includes(letter)) {
      return "bg-yellow-500 text-white";
    }

    return "bg-gray-400 text-white";
  };

  return (
    <div
      className="
            w-full 
            max-w-md 
            mx-auto 
            grid 
            grid-rows-5 
            gap-1 sm:gap-2 
            mb-4 sm:mb-8 
            px-2 
            pt-4 sm:pt-20
        "
    >
      {board.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="
                        grid 
                        grid-cols-5 
                        gap-1 sm:gap-2
                    "
        >
          {row.map((letter, colIndex) => (
            <div
              key={colIndex}
              className={`
                                aspect-square 
                                flex 
                                items-center 
                                justify-center 
                                text-lg sm:text-2xl 
                                font-bold 
                                uppercase 
                                rounded
                                ${
                                  rowIndex < currentRow
                                    ? getCellColor(rowIndex, colIndex)
                                    : `${
                                        darkMode
                                          ? "bg-gray-700 border border-gray-600"
                                          : "bg-gray-200 border border-gray-300"
                                      }`
                                }               
                            `}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
