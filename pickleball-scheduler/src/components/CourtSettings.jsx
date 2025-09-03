import React from 'react';

export default function CourtSettings({ numCourts, setNumCourts }) {
    return (
        <div className="px-4 pb-4">
            <select
                id="numCourts"
                value={numCourts}
                onChange={(e) => setNumCourts(parseInt(e.target.value, 10))}
                className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-[#6BCB77] focus:ring-0 rounded-lg px-4 py-2 transition"
            >
                {[...Array(8).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1} Court{i > 0 ? 's' : ''}
                    </option>
                ))}
            </select>
        </div>
    );
}
