import React, { useState, useEffect } from 'react';
import PlayerList from './components/PlayerList';
import Settings from './components/Settings';
import ScheduleView from './components/ScheduleView';
import { generateSchedule as generate } from './utils/scheduleGenerator';
import { ChevronUpIcon, ChevronDownIcon } from './components/Icons';

export default function App() {
    const [players, setPlayers] = useState([]);
    const [gameType, setGameType] = useState('doubles');
    const [numCourts, setNumCourts] = useState(2);
    const [schedule, setSchedule] = useState(null);
    const [view, setView] = useState('setup'); // 'setup' or 'schedule'
    const [error, setError] = useState('');
    const [openSection, setOpenSection] = useState('players');

    // Load data from localStorage on initial render
    useEffect(() => {
        document.title = "Sports Tournament Scheduler";
        try {
            const savedPlayers = localStorage.getItem('sportsSchedulerPlayers');
            if (savedPlayers) setPlayers(JSON.parse(savedPlayers));

            const savedGameType = localStorage.getItem('sportsSchedulerGameType');
            if (savedGameType) setGameType(savedGameType);

            const savedNumCourts = localStorage.getItem('sportsSchedulerNumCourts');
            if (savedNumCourts) setNumCourts(parseInt(savedNumCourts, 10));
        } catch (e) {
            console.error("Failed to parse from localStorage", e);
            localStorage.clear();
        }
    }, []);

    // Save data to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sportsSchedulerPlayers', JSON.stringify(players));
    }, [players]);

    useEffect(() => {
        localStorage.setItem('sportsSchedulerGameType', gameType);
    }, [gameType]);

    useEffect(() => {
        localStorage.setItem('sportsSchedulerNumCourts', numCourts);
    }, [numCourts]);

    const handleGenerateSchedule = () => {
        setError('');
        const minPlayers = gameType === 'doubles' ? 4 : 3;
        if (players.length < minPlayers) {
            setError(`You need at least ${minPlayers} players for a ${gameType} tournament.`);
            return;
        }
        const newSchedule = generate(players, gameType, numCourts);
        setSchedule(newSchedule);
        setView('schedule');
    };

    const startNew = () => {
        setPlayers([]);
        setSchedule(null);
        setError('');
        setView('setup');
    };

    if (view === 'schedule' && schedule) {
        return <ScheduleView schedule={schedule} gameType={gameType} setView={setView} />;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans p-4">
            <div className="max-w-md mx-auto">
                <header className="mb-4 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#6BCB77] dark:text-[#86d994]">Match Flow</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Smart & reliable scheduling from brackets to court assignments</p>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-2">
                    {/* --- Player Section --- */}
                    <div className="border-b dark:border-gray-700">
                        <button onClick={() => setOpenSection(openSection === 'players' ? null : 'players')} className="w-full flex justify-between items-center p-4">
                            <h2 className="text-lg font-semibold flex items-center">Player List ({players.length})</h2>
                            {openSection === 'players' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                        {openSection === 'players' && <PlayerList players={players} setPlayers={setPlayers} />}
                    </div>

                    {/* --- Settings Section --- */}
                    <div>
                         <button onClick={() => setOpenSection(openSection === 'settings' ? null : 'settings')} className="w-full flex justify-between items-center p-4">
                            <h2 className="text-lg font-semibold">Settings</h2>
                            {openSection === 'settings' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                        {openSection === 'settings' && <Settings gameType={gameType} setGameType={setGameType} numCourts={numCourts} setNumCourts={setNumCourts} />}
                    </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="mt-4 p-4">
                   {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
                    <button
                        onClick={handleGenerateSchedule}
                        disabled={players.length < (gameType === 'doubles' ? 4 : 3)}
                        className="w-full bg-[#6BCB77] hover:bg-[#5aa764] text-white text-lg font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Generate Schedule
                    </button>
                    <div className="text-center mt-3">
                        <button onClick={startNew} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs font-medium transition-colors">
                            Start New (Clear Players)
                        </button>
                    </div>
                </div>

                <footer className="text-center text-gray-500 dark:text-gray-400 text-xs mt-4">
                    <p>&copy; {new Date().getFullYear()} Match Flow</p>
                </footer>
            </div>
        </div>
    );
}