import React, { useState, useEffect, useMemo } from 'react';

// --- Helper Icons (as SVG components) ---
// Using modern, consistent icons from Heroicons for a cleaner look
const UsersIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm-7.5 2.962c0-.53.162-1.022.46-1.462A4.5 4.5 0 0112 13.5a4.5 4.5 0 015.04 4.242M12 13.5v-3.375c-1.353 0-2.662-.32-3.874-.92-1.212-.6-2.03-1.46-2.03-2.384C6.096 6.161 7.153 5.25 8.5 5.25c1.347 0 2.404.911 2.404 2.025v3.375z" />
    </svg>
);
const EditIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const DeleteIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
const DuplicateIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);
const CheckIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);
const ChevronDownIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);
const ChevronUpIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

const ArrowDownTrayIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const DocumentArrowDownIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
    </svg>
);

// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [players, setPlayers] = useState([]);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [showPasteBox, setShowPasteBox] = useState(false);
    const [pastedNames, setPastedNames] = useState("");
    const [editingPlayer, setEditingPlayer] = useState(null);

    const [gameType, setGameType] = useState('doubles');
    const [numCourts, setNumCourts] = useState(2);
    
    const [schedule, setSchedule] = useState(null);
    const [view, setView] = useState('setup'); // 'setup' or 'schedule'
    const [scheduleView, setScheduleView] = useState('byRound'); // 'byRound', 'byCourt', 'byPlayer', or 'byTeam'
    const [error, setError] = useState('');
    const [openSection, setOpenSection] = useState('players'); // 'players' or 'settings'
    const [collapsedSections, setCollapsedSections] = useState([]);
    const [completedRounds, setCompletedRounds] = useState([]);

    // --- Toggle collapsible sections in schedule view ---
    const toggleSectionCollapse = (sectionId) => {
        setCollapsedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    // --- Mark rounds as complete ---
    const toggleRoundCompletion = (round) => {
        const roundNumber = parseInt(round, 10);
        setCompletedRounds(prev =>
            prev.includes(roundNumber)
                ? prev.filter(r => r !== roundNumber)
                : [...prev, roundNumber]
        );
    };

    // --- Effects for Local Storage ---
    useEffect(() => {
        try {
            const savedPlayers = localStorage.getItem('pickleballPlayers');
            if (savedPlayers) setPlayers(JSON.parse(savedPlayers));

            const savedGameType = localStorage.getItem('pickleballGameType');
            if (savedGameType) setGameType(savedGameType);

            const savedNumCourts = localStorage.getItem('pickleballNumCourts');
            if (savedNumCourts) setNumCourts(parseInt(savedNumCourts, 10));

            const savedCompletedRounds = localStorage.getItem('pickleballCompletedRounds');
            if (savedCompletedRounds) setCompletedRounds(JSON.parse(savedCompletedRounds));

        } catch (e) {
            console.error("Failed to parse from localStorage", e);
            // In case of corrupted data, clear it
            localStorage.removeItem('pickleballPlayers');
            localStorage.removeItem('pickleballGameType');
            localStorage.removeItem('pickleballNumCourts');
            localStorage.removeItem('pickleballCompletedRounds');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('pickleballPlayers', JSON.stringify(players));
    }, [players]);

    useEffect(() => {
        localStorage.setItem('pickleballGameType', gameType);
    }, [gameType]);

    useEffect(() => {
        localStorage.setItem('pickleballNumCourts', numCourts);
    }, [numCourts]);

    useEffect(() => {
        localStorage.setItem('pickleballCompletedRounds', JSON.stringify(completedRounds));
    }, [completedRounds]);
    
    // --- Player Management Handlers ---
    const handlePasteNames = () => {
        if (!pastedNames.trim()) return;

        const lines = pastedNames.split('\n');
        const pastedPlayerNames = lines
            .map(line =>
                line
                    .trim()
                    // Removes list prefixes like "1.", "1)", "* ", "- "
                    .replace(/^\s*\d+[\.\-\)]?\s*|\s*[\*\-]\s*/, '')
                    .trim()
            )
            .filter(name => name.length > 0);

        const existingPlayerNames = new Set(players.map(p => p.name.toLowerCase()));
        
        const uniqueNewPlayers = [];
        const seenPastedNames = new Set();

        for (const name of pastedPlayerNames) {
            const lowerCaseName = name.toLowerCase();
            if (!seenPastedNames.has(lowerCaseName) && !existingPlayerNames.has(lowerCaseName)) {
                seenPastedNames.add(lowerCaseName);
                uniqueNewPlayers.push({ id: crypto.randomUUID(), name });
            }
        }

        if (uniqueNewPlayers.length > 0) {
            setPlayers(prevPlayers => [...prevPlayers, ...uniqueNewPlayers]);
        }
        
        setPastedNames("");
        setError("");
        setShowPasteBox(false);
    };

    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            if (players.some(p => p.name.toLowerCase() === newPlayerName.trim().toLowerCase())) {
                setError("Player name already exists.");
                return;
            }
            setPlayers([...players, { id: crypto.randomUUID(), name: newPlayerName.trim() }]);
            setNewPlayerName("");
            setError("");
        }
    };
    
    const handleDeletePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
    };
    
    const handleDuplicatePlayer = (name) => {
        let newName = `${name} 2`;
        let i = 2;
        while (players.some(p => p.name.toLowerCase() === newName.toLowerCase())) {
            i++;
            newName = `${name} ${i}`;
        }
        setPlayers([...players, { id: crypto.randomUUID(), name: newName }]);
    };

    const handleStartEdit = (player) => {
        setEditingPlayer({ ...player });
    };

    const handleCancelEdit = () => {
        setEditingPlayer(null);
    };

    const handleSaveEdit = () => {
        if (!editingPlayer || !editingPlayer.name.trim()) return;

        if (players.some(p => p.id !== editingPlayer.id && p.name.toLowerCase() === editingPlayer.name.trim().toLowerCase())) {
            setError("Player name already exists.");
            return;
        }

        setPlayers(players.map(p => p.id === editingPlayer.id ? { ...p, name: editingPlayer.name.trim() } : p));
        setEditingPlayer(null);
        setError('');
    };
    
    // --- Schedule Generation Logic ---
    const generateSchedule = () => {
        setError('');
        const minPlayers = gameType === 'doubles' ? 4 : 3;
        if (players.length < minPlayers) {
            setError(`You need at least ${minPlayers} players for a ${gameType} tournament.`);
            return;
        }

        setCompletedRounds([]);
        setCollapsedSections([]);
        setScheduleView('byRound');

        let teams = [];
        let unassignedPlayers = [];
        if (gameType === 'doubles') {
            let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
            if (shuffledPlayers.length % 2 !== 0) {
                unassignedPlayers.push(shuffledPlayers.pop());
            }
            for (let i = 0; i < shuffledPlayers.length; i += 2) {
                teams.push([shuffledPlayers[i], shuffledPlayers[i+1]]);
            }
        } else {
            teams = players.map(p => [p]);
        }

        if (teams.length % 2 !== 0) {
            teams.push([{ id: 'BYE', name: 'BYE' }]);
        }
        
        const numAlgoRounds = teams.length - 1;
        const allMatchups = [];

        for (let round = 0; round < numAlgoRounds; round++) {
            for (let i = 0; i < teams.length / 2; i++) {
                const team1 = teams[i];
                const team2 = teams[teams.length - 1 - i];
                if (team1[0].id !== 'BYE' && team2[0].id !== 'BYE') {
                    allMatchups.push({ team1, team2 });
                }
            }
            const lastTeam = teams.pop();
            teams.splice(1, 0, lastTeam);
        }

        const finalSchedule = [];
        allMatchups.forEach((match, index) => {
            finalSchedule.push({
                game: index + 1,
                round: Math.floor(index / numCourts) + 1,
                court: (index % numCourts) + 1,
                ...match
            });
        });
        
        setSchedule({
            games: finalSchedule,
            unassigned: unassignedPlayers
        });
        setView('schedule');
    };

    const startNew = () => {
        setPlayers([]);
        setSchedule(null);
        setError('');
        setView('setup');
        setCompletedRounds([]);
    };

    // --- Share functionality ---
    const shareSchedule = async () => {
        if (!schedule) return;

        let shareText = "🏆 Pickleball Tournament Schedule 🏆\n\n";
        
        const gamesByRound = schedule.games.reduce((acc, game) => {
            acc[game.round] = acc[game.round] || [];
            acc[game.round].push(game);
            return acc;
        }, {});

        Object.keys(gamesByRound).sort((a,b) => a-b).forEach(round => {
            const roundNum = parseInt(round, 10);
            const isComplete = completedRounds.includes(roundNum) ? "✅ " : "";
            shareText += `--- ${isComplete}ROUND ${round} ---\n`;
            gamesByRound[round].forEach(game => {
                const team1Name = game.team1.map(p => p.name).join(' & ');
                const team2Name = game.team2.map(p => p.name).join(' & ');
                shareText += `Court ${game.court}: ${team1Name} vs ${team2Name}\n`;
            });
            shareText += '\n';
        });

        if (schedule.unassigned.length > 0) {
            shareText += `Player sitting out: ${schedule.unassigned.map(p => p.name).join(', ')}\n`;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Pickleball Tournament Schedule',
                    text: shareText,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Schedule copied to clipboard!');
            });
        }
    };

    // --- CSV Export ---
    const exportToCSV = () => {
        if (!schedule || !schedule.games) return;

        const headers = ['Game', 'Round', 'Court', 'Team 1', 'Team 2', 'Status'];
        const csvRows = [headers.join(',')];

        const escapeCSV = (text) => `"${text.replace(/"/g, '""')}"`;

        schedule.games.forEach(game => {
            const team1Name = game.team1.map(p => p.name).join(' & ');
            const team2Name = game.team2.map(p => p.name).join(' & ');
            const status = completedRounds.includes(game.round) ? 'Completed' : 'Pending';
            
            const row = [
                game.game,
                game.round,
                game.court,
                escapeCSV(team1Name),
                escapeCSV(team2Name),
                status
            ].join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'pickleball_schedule.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // --- PDF Export ---
    const exportToPDF = () => {
        if (typeof window.jspdf === 'undefined') {
            setError("PDF library not found. Cannot export schedule.");
            return;
        }
        if (!schedule || !schedule.games) return;
        setError('');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const gamesByRound = memoizedScheduleByRound;
        let yPosition = 20;
        const leftMargin = 15;
        const lineHeight = 7;
        const pageHeight = doc.internal.pageSize.height;

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("Pickleball Tournament Schedule", doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
        yPosition += lineHeight * 2;

        Object.keys(gamesByRound).sort((a,b) => a-b).forEach(round => {
            if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = 20;
            }
            const roundNum = parseInt(round, 10);
            const isComplete = completedRounds.includes(roundNum);
            
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(`${isComplete ? "✅ " : ""}Round ${round}`, leftMargin, yPosition);
            yPosition += lineHeight * 1.5;

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');

            gamesByRound[round].forEach(game => {
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                }
                const team1Name = game.team1.map(p => p.name).join(' & ');
                const team2Name = game.team2.map(p => p.name).join(' & ');
                const gameText = `Court ${game.court}: ${team1Name} vs ${team2Name}`;
                doc.text(gameText, leftMargin + 5, yPosition);
                yPosition += lineHeight;
            });
            yPosition += lineHeight;
        });

        if (schedule.unassigned.length > 0) {
             if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }
            doc.setFontSize(12);
            doc.setFont('helvetica', 'italic');
            doc.text(`Player sitting out: ${schedule.unassigned.map(p => p.name).join(', ')}`, leftMargin, yPosition);
        }

        doc.save('pickleball_schedule.pdf');
    };
    
    // --- Memoized Selectors for Schedule Views ---
    const memoizedScheduleByRound = useMemo(() => {
        if (!schedule) return {};
        return schedule.games.reduce((acc, game) => {
            acc[game.round] = acc[game.round] || [];
            acc[game.round].push(game);
            return acc;
        }, {});
    }, [schedule]);

    const memoizedScheduleByCourt = useMemo(() => {
        if (!schedule) return {};
        return schedule.games.reduce((acc, game) => {
            acc[game.court] = acc[game.court] || [];
            acc[game.court].push(game);
            return acc;
        }, {});
    }, [schedule]);

    const memoizedScheduleByPlayer = useMemo(() => {
        if (!schedule || gameType !== 'singles') return {};
        const byPlayer = {};
        schedule.games.forEach(game => {
            [...game.team1, ...game.team2].forEach(player => {
                if (player.id === 'BYE') return;
                if (!byPlayer[player.id]) {
                    byPlayer[player.id] = { id: player.id, name: player.name, games: [] };
                }
                byPlayer[player.id].games.push(game);
            });
        });
        return byPlayer;
    }, [schedule, gameType]);

    const memoizedScheduleByTeam = useMemo(() => {
        if (!schedule || gameType !== 'doubles') return {};
        const byTeam = {};
        const getTeamId = (team) => team.map(p => p.id).sort().join('_');
        
        schedule.games.forEach(game => {
            [game.team1, game.team2].forEach((team, i) => {
                const teamId = getTeamId(team);
                const opponent = i === 0 ? game.team2 : game.team1;
                if (!byTeam[teamId]) {
                    byTeam[teamId] = { id: teamId, name: team.map(p => p.name).join(' & '), games: [] };
                }
                byTeam[teamId].games.push({ ...game, opponent });
            });
        });
        return byTeam;
    }, [schedule, gameType]);

    // --- Render logic ---
    if (view === 'schedule' && schedule) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-6 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#6BCB77] dark:text-[#86d994]">Tournament Schedule</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Here is your generated game plan.</p>
                    </header>
                    
                    <div className="flex justify-center mb-6">
                        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 flex-wrap justify-center">
                            <button onClick={() => setScheduleView('byRound')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${scheduleView === 'byRound' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                                View by Round
                            </button>
                            <button onClick={() => setScheduleView('byCourt')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${scheduleView === 'byCourt' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                                View by Court
                            </button>
                            {gameType === 'doubles' ? (
                                <button onClick={() => setScheduleView('byTeam')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${scheduleView === 'byTeam' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                                    View by Team
                                </button>
                            ) : (
                                <button onClick={() => setScheduleView('byPlayer')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${scheduleView === 'byPlayer' ? 'bg-white dark:bg-gray-900 text-[#6BCB77] shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                                    View by Player
                                </button>
                            )}
                        </div>
                    </div>

                    {schedule.unassigned.length > 0 && (
                        <div className="bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-md mb-6" role="alert">
                            <p className="font-bold">Player Sitting Out</p>
                            <p>{schedule.unassigned.map(p => p.name).join(', ')} will be assigned in the next tournament if players change.</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {scheduleView === 'byRound' && Object.entries(memoizedScheduleByRound).map(([round, games]) => {
                            const sectionId = `round-${round}`;
                            const isCollapsed = collapsedSections.includes(sectionId);
                            const isRoundComplete = completedRounds.includes(parseInt(round, 10));
                            return (
                                <div key={round} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <div className="w-full flex justify-between items-center p-3 text-left">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id={`round-${round}-checkbox`}
                                                checked={isRoundComplete}
                                                onChange={() => toggleRoundCompletion(round)}
                                                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-[#6BCB77] focus:ring-[#6BCB77] bg-gray-100 dark:bg-gray-900"
                                            />
                                            <label htmlFor={`round-${round}-checkbox`} className="text-xl font-semibold cursor-pointer">Round {round}</label>
                                        </div>
                                        <button onClick={() => toggleSectionCollapse(sectionId)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                            {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
                                        </button>
                                    </div>
                                    {!isCollapsed && (
                                        <div className={`px-3 pb-3 space-y-2 transition duration-300 ${isRoundComplete ? 'opacity-60' : ''}`}>
                                            {games.map((game) => (
                                                <div key={game.game} className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-2">
                                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                                        <span className="font-bold text-[#6BCB77] dark:text-[#86d994] mr-2">Court {game.court}:</span>
                                                        <span className="font-medium">{game.team1.map(p => p.name).join(' & ')}</span>
                                                        <span className="text-gray-400 dark:text-gray-500 mx-2">vs</span>
                                                        <span className="font-medium">{game.team2.map(p => p.name).join(' & ')}</span>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {scheduleView === 'byCourt' && Object.entries(memoizedScheduleByCourt).map(([court, games]) => {
                             const sectionId = `court-${court}`;
                             const isCollapsed = collapsedSections.includes(sectionId);
                             return (
                                <div key={court} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <button onClick={() => toggleSectionCollapse(sectionId)} className="w-full flex justify-between items-center p-3 text-left">
                                        <h2 className="text-xl font-semibold">Court {court}</h2>
                                        {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
                                    </button>
                                    {!isCollapsed && (
                                        <div className="px-3 pb-3 space-y-2">
                                            {games.map((game) => {
                                                const isGameComplete = completedRounds.includes(game.round);
                                                return (
                                                    <div key={game.game} className={`bg-gray-50 dark:bg-gray-700/50 rounded-md p-2 transition ${isGameComplete ? 'opacity-60' : ''}`}>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                            <span className="font-bold text-[#6BCB77] dark:text-[#86d994] mr-2">Round {game.round}:</span>
                                                            <span className="flex-grow">
                                                                <span className="font-medium">{game.team1.map(p => p.name).join(' & ')}</span>
                                                                <span className="text-gray-400 dark:text-gray-500 mx-2">vs</span>
                                                                <span className="font-medium">{game.team2.map(p => p.name).join(' & ')}</span>
                                                            </span>
                                                            {isGameComplete && <CheckIcon className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {scheduleView === 'byPlayer' && Object.values(memoizedScheduleByPlayer)
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((player) => {
                            const sectionId = `player-${player.id}`;
                            const isCollapsed = collapsedSections.includes(sectionId);
                            return (
                                <div key={player.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <button onClick={() => toggleSectionCollapse(sectionId)} className="w-full flex justify-between items-center p-3 text-left">
                                        <h2 className="text-xl font-semibold">{player.name}</h2>
                                        {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
                                    </button>
                                    {!isCollapsed && (
                                        <div className="px-3 pb-3 space-y-2">
                                            {player.games.map((game, index) => {
                                                const isGameComplete = completedRounds.includes(game.round);
                                                const opponentTeam = game.team1.some(p => p.id === player.id) ? game.team2 : game.team1;
                                                return (
                                                    <div key={index} className={`bg-gray-50 dark:bg-gray-700/50 rounded-md p-2 transition ${isGameComplete ? 'opacity-60' : ''}`}>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                            <span className="flex-grow">
                                                                <span className="font-bold text-[#6BCB77] dark:text-[#86d994] mr-2">Round {game.round} (Court {game.court}):</span>
                                                                vs <span className="font-medium">{opponentTeam.map(p => p.name).join(' & ')}</span>
                                                            </span>
                                                            {isGameComplete && <CheckIcon className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {scheduleView === 'byTeam' && Object.values(memoizedScheduleByTeam)
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((team) => {
                            const sectionId = `team-${team.id}`;
                            const isCollapsed = collapsedSections.includes(sectionId);
                            return (
                                <div key={team.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <button onClick={() => toggleSectionCollapse(sectionId)} className="w-full flex justify-between items-center p-3 text-left">
                                        <h2 className="text-xl font-semibold">{team.name}</h2>
                                        {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
                                    </button>
                                    {!isCollapsed && (
                                        <div className="px-3 pb-3 space-y-2">
                                            {team.games.map((game, index) => {
                                                const isGameComplete = completedRounds.includes(game.round);
                                                return (
                                                    <div key={index} className={`bg-gray-50 dark:bg-gray-700/50 rounded-md p-2 transition ${isGameComplete ? 'opacity-60' : ''}`}>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                            <span className="flex-grow">
                                                                <span className="font-bold text-[#6BCB77] dark:text-[#86d994] mr-2">Round {game.round} (Court {game.court}):</span>
                                                                vs <span className="font-medium">{game.opponent.map(p => p.name).join(' & ')}</span>
                                                            </span>
                                                            {isGameComplete && <CheckIcon className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <footer className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                        <button onClick={() => setView('setup')} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                            Back to Setup
                        </button>
                        <button onClick={shareSchedule} className="w-full sm:w-auto bg-[#6BCB77] hover:bg-[#5aa764] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                            Share Schedule
                        </button>
                        <button onClick={exportToCSV} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                           <ArrowDownTrayIcon /> Export as CSV
                        </button>
                        <button onClick={exportToPDF} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                           <DocumentArrowDownIcon /> Export as PDF
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans p-4">
            <div className="max-w-md mx-auto">
                <header className="mb-4 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#6BCB77] dark:text-[#86d994]">Pickleball Scheduler</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Create a schedule in seconds.</p>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-2">
                    {/* --- Player Section Accordion --- */}
                    <div className="border-b dark:border-gray-700">
                        <button onClick={() => setOpenSection(openSection === 'players' ? null : 'players')} className="w-full flex justify-between items-center p-4">
                            <h2 className="text-lg font-semibold flex items-center"><UsersIcon className="mr-2 text-[#6BCB77]"/>Player List ({players.length})</h2>
                            {openSection === 'players' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                        {openSection === 'players' && (
                            <div className="px-4 pb-4">
                                <form onSubmit={handleAddPlayer} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newPlayerName}
                                        onChange={(e) => setNewPlayerName(e.target.value)}
                                        placeholder="Enter player name"
                                        className="flex-grow bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-[#6BCB77] focus:ring-0 rounded-lg px-4 py-2 transition"
                                    />
                                    <button type="submit" className="bg-[#6BCB77] hover:bg-[#5aa764] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Add</button>
                                </form>

                                <div className="text-center my-2">
                                    <button onClick={() => setShowPasteBox(!showPasteBox)} className="text-sm font-medium text-[#6BCB77] hover:underline dark:text-[#86d994]">
                                        {showPasteBox ? 'Hide Paste Option' : 'Or, Paste a List of Names'}
                                    </button>
                                </div>

                                {showPasteBox && (
                                    <div className="mb-4">
                                        <textarea
                                            id="paste-names"
                                            value={pastedNames}
                                            onChange={(e) => setPastedNames(e.target.value)}
                                            placeholder="1. John Doe&#10;2. Jane Smith&#10;* Another Player"
                                            rows="4"
                                            className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-[#6BCB77] focus:ring-0 rounded-lg px-4 py-2 transition text-sm"
                                        ></textarea>
                                        <button onClick={handlePasteNames} className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                                            Add Names from List
                                        </button>
                                    </div>
                                )}

                                <ul className="space-y-2 max-h-60 overflow-y-auto">
                                     {players.map(player => (
                                        <li key={player.id} className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                            {editingPlayer && editingPlayer.id === player.id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editingPlayer.name}
                                                        onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                                                        className="flex-grow bg-white dark:bg-gray-600 border-2 border-[#6BCB77] rounded-md px-2 py-1 text-sm"
                                                        autoFocus
                                                    />
                                                    <div className="flex items-center ml-2 space-x-2">
                                                        <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-600"><CheckIcon /></button>
                                                        <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-600"><DeleteIcon /></button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="flex-grow font-medium text-sm">{player.name}</span>
                                                    <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                                                        <button onClick={() => handleStartEdit(player)} className="hover:text-[#6BCB77]"><EditIcon /></button>
                                                        <button onClick={() => handleDuplicatePlayer(player.name)} className="hover:text-green-500"><DuplicateIcon /></button>
                                                        <button onClick={() => handleDeletePlayer(player.id)} className="hover:text-red-500"><DeleteIcon /></button>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    {/* --- Settings Section Accordion --- */}
                    <div>
                         <button onClick={() => setOpenSection(openSection === 'settings' ? null : 'settings')} className="w-full flex justify-between items-center p-4">
                            <h2 className="text-lg font-semibold">Settings</h2>
                            {openSection === 'settings' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                        {openSection === 'settings' && (
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
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 p-4">
                   {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
                    <button 
                        onClick={generateSchedule} 
                        disabled={players.length < (gameType === 'doubles' ? 4 : 3)}
                        className="w-full bg-[#6BCB77] hover:bg-[#5aa764] text-white text-lg font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Generate Tournament
                    </button>
                    <div className="text-center mt-3">
                        <button onClick={startNew} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs font-medium transition-colors">
                            Start New (Clear Players)
                        </button>
                    </div>
                </div>

                <footer className="text-center text-gray-500 dark:text-gray-400 text-xs mt-4">
                    <p>&copy; {new Date().getFullYear()} Pickleball Scheduler</p>
                </footer>
            </div>
        </div>
    );
}

