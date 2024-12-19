import { Delete } from 'lucide-react';
import React from 'react';

const Keyboard = ({
    handleKeyPress,
    keyboardStatus,
    darkMode
}) => {
    const getKeyColor = (key) => {
        return keyboardStatus[key] || null;
    };

    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
    ];

    const renderKey = (key) => {
        const keyColor = getKeyColor(key);
        return (
            <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`
                    w-full
                    flex-1 
                    px-1 sm:px-2 md:px-3 
                    py-2 
                    rounded 
                    uppercase 
                    font-semibold 
                    text-base sm:text-base
                    min-w-[2rem] sm:min-w-[3rem] 
                    min-h-[2rem] sm:min-h-[3rem]
                    ${key === 'Enter' ? 'sm:min-w-[6rem]' : ''}
                    ${keyColor === 'green' ? 'bg-green-500 text-white' :
                        keyColor === 'yellow' ? 'bg-yellow-500 text-white' :
                            keyColor === 'gray' ? 'bg-gray-400 text-white' :
                                darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
                    ${key === 'Enter' || key === 'Backspace' ? 'text-[0.6rem] sm:text-xs' : ''}
                `}
            >
                {key === 'Backspace' ? <Delete /> : key}
            </button>
        );
    };

    return (
        <div className={`
            w-full 
            max-w-xl 
            mx-auto 
            flex 
            flex-col 
            gap-1 sm:gap-2 
            p-4 sm:p-6 
            rounded-xl 
            ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}
        `}>
            {keyboardLayout.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="
                        flex 
                        justify-center 
                        gap-1 sm:gap-2 
                        w-full
                    "
                >
                    {row.map(renderKey)}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;