import React from 'react';

export default function GameTypeSettings({ gameType, setGameType }) {
    return (
        <div className="px-4 pb-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                    onClick={() => setGameType('singles')}
                    className={`w-1/2 py-2 rounded-md text-center font-semibold transition text-sm ${
                        gameType === 'singles' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'
                    }`}
                >
                    Singles
                </button>
                <button
                    onClick={() => setGameType('doubles')}
                    className={`w-1/2 py-2 rounded-md text-center font-semibold transition text-sm ${
                        gameType === 'doubles' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'
                    }`}
                >
                    Doubles
                </button>
            </div>
        </div>
    );
}