import { Modal } from "./ui/modal";

export const TutorialModal = ({ isOpen, onClose, darkMode }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">How to Play</h2>

                <p className="text-lg">Guess the hidden word in five attempts.</p>

                <div className="space-y-2">
                    <p>Each attempt must be a valid 5-letter word.</p>
                    <p>After each attempt, the color of the letters changes to show how close you are to guessing the word.</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-bold text-lg mb-2">Examples</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex w-full justify-center justify-around space-x-1 text-3xl">
                                <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-white font-bold rounded">G</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">R</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">A</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">P</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">E</div>
                            </div>
                            <p >
                                The letter <b>G</b> is in the word and in the correct position.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex w-full justify-center justify-around space-x-1 text-3xl">
                                <div className="w-16 h-16 bg-gray-400  flex items-center justify-center text-white font-bold rounded">F</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">O</div>
                                <div className="w-16 h-16 bg-yellow-500 flex items-center justify-center text-white font-bold rounded">C</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">U</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">S</div>
                            </div>
                            <p>
                                The letter <b>C</b> is in the word but not in the correct position.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex w-full justify-center justify-around space-x-1 text-3xl">
                                <div className="w-16 h-16 bg-gray-400  flex items-center justify-center text-white font-bold rounded">M</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">A</div>
                                <div className="w-16 h-16  bg-gray-400 flex items-center justify-center text-white font-bold rounded">N</div>
                                <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold rounded">G</div>
                                <div className="w-16 h-16 bg-gray-500 flex items-center justify-center text-white font-bold rounded">O</div>
                            </div>

                            <p>
                                The letter <b>O</b> is not in the word.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2 border-t pt-4">
                        <p className="text-sm">There may be repeated letters. The hints are independent for each letter.</p>
                        <p className="text-sm font-bold">A new word each 5 minutes!</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};