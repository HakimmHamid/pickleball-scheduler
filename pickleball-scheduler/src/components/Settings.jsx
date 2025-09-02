import React from 'react';

export default function Settings({ gameType, setGameType, numCourts, setNumCourts }) {
    return (
        <div className="px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="font-medium mb-1 block text-sm">Game Type</label>
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button onClick={() => setGameType('singles')} className={`w-1/2 py-1.5 rounded-md text-center font-semibold transition text-sm ${gameType === 'singles' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'}`}>Singles</button>
                        <button onClick={() => setGameType('doubles')} className={`w-1/2 py-1.5 rounded-md text-center font-semibold transition text-sm ${gameType === 'doubles' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'}`}>Doubles</button>
                    </div>
                </div>
                <div>
                    <label htmlFor="numCourts" className="font-medium mb-1 block text-sm">Available Courts</label>
                    <input
                        id="numCourts"
                        type="number"
                        value={numCourts}
                        onChange={(e) => setNumCourts(Math.max(1, parseInt(e.target.value)) || 1)}
                        min="1"
                        className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-[#6BCB77] focus:ring-0 rounded-lg px-4 py-2 transition"
                    />
                </div>
            </div>
        </div>
    );
}