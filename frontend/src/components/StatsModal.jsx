import { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { Modal } from "./ui/modal";
import { getStats } from "@/services/wordleService";

export const StatsModal = ({ isOpen, onClose, darkMode, remainingTime, solution }) => {
    const [stats, setStats] = useState({
        total_games: 0,
        total_wins: 0,
        total_losses: 0,
        current_streak: 0,
        max_streak: 0,
    });

    const { total_games, total_wins, current_streak, max_streak } = stats;
    const winRate = total_games ? Math.round((total_wins / total_games) * 100) : 0;

    const handleGetStats = async () => {
        try {
            const response = await getStats(); // 假设返回的就是 stats 格式
            setStats(response);
        } catch (error) {
            console.error("Error fetching stats from API:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            handleGetStats();
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold w-full text-center
                ">Statistics</h2>

                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-3xl font-bold">{total_games}</div>
                        <div className="text-sm">Played</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">{winRate}</div>
                        <div className="text-sm">Win %</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">{current_streak}</div>
                        <div className="text-sm">Current Streak</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">{max_streak}</div>
                        <div className="text-sm">Max Streak</div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg mb-2">
                        CORRECT WORD: <b>{solution}</b>
                    </h3>
                    <h3 className="text-lg mb-2">NEXT WORD IN:</h3>
                    <CountdownTimer initialTime={remainingTime} />
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <button className="modal-close-button bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded
                " onClick={onClose}>
                    Accept
                </button></div>
        </Modal>
    );
};
