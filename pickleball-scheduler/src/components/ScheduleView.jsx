import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, DocumentArrowDownIcon, ArrowLeftIcon } from './Icons';

export default function ScheduleView({ schedule, gameType, setView }) {
    const [scheduleView, setScheduleView] = useState('byRound');
    const [collapsedSections, setCollapsedSections] = useState([]);
    const [completedRounds, setCompletedRounds] = useState([]);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [error, setError] = useState('');
    const [logoDataUrl, setLogoDataUrl] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.src = '/net.svg';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 50, 50);
            setLogoDataUrl(canvas.toDataURL('image/png'));
        };

        try {
            const savedCompletedRounds = localStorage.getItem('sportsSchedulerCompletedRounds');
            if (savedCompletedRounds) setCompletedRounds(JSON.parse(savedCompletedRounds));
        } catch (e) {
            console.error("Failed to parse from localStorage", e);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sportsSchedulerCompletedRounds', JSON.stringify(completedRounds));
    }, [completedRounds]);

    const toggleSectionCollapse = (sectionId) => {
        setCollapsedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const toggleRoundCompletion = (round) => {
        const roundNumber = parseInt(round, 10);
        setCompletedRounds(prev =>
            prev.includes(roundNumber)
                ? prev.filter(r => r !== roundNumber)
                : [...prev, roundNumber]
        );
    };

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

    const exportToPDF = async () => {
        if (isExportingPdf) return;
        if (!schedule || !schedule.games) return;
        setError('');
        setIsExportingPdf(true);
    
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            const themeColor = "#6BCB77";
            let lastY = 25;
    
            if (logoDataUrl) {
                doc.addImage(logoDataUrl, 'PNG', 15, 8, 12, 12);
            }
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text("Match Flow", pageWidth / 2, 15, { align: 'center' });
            doc.setDrawColor(themeColor);
            doc.line(15, 18, pageWidth - 15, 18);
    
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text("Schedule by Round", 15, lastY + 10);
            lastY += 15;
    
            Object.entries(memoizedScheduleByRound).forEach(([round, games]) => {
                const isRoundComplete = completedRounds.includes(parseInt(round, 10));
                const head = [['Court', 'Team 1', 'Team 2']];
                const body = games.map(game => [`Court ${game.court}`, game.team1.map(p => p.name).join(' & '), game.team2.map(p => p.name).join(' & ')]);
                
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(`${isRoundComplete ? "✅ " : ""}Round ${round}`, 15, lastY + 5);
                lastY += 7;
    
                doc.autoTable({
                    head, body, startY: lastY, headStyles: { fillColor: themeColor }, tableLineColor: [230, 230, 230], tableLineWidth: 0.1,
                });
                lastY = doc.autoTable.previous.finalY + 10;
            });
    
            doc.addPage();
            lastY = 25;
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text("Schedule by Court", 15, lastY);
            lastY += 5;
    
            Object.entries(memoizedScheduleByCourt).forEach(([court, games]) => {
                const head = [['Round', 'Team 1', 'Team 2']];
                const body = games.map(game => {
                    const isRoundComplete = completedRounds.includes(game.round);
                    return [`${isRoundComplete ? "✅ " : ""}Round ${game.round}`, game.team1.map(p => p.name).join(' & '), game.team2.map(p => p.name).join(' & ')];
                });
    
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(`Court ${court}`, 15, lastY + 5);
                lastY += 7;
    
                doc.autoTable({
                    head, body, startY: lastY, headStyles: { fillColor: themeColor }, tableLineColor: [230, 230, 230], tableLineWidth: 0.1,
                });
                lastY = doc.autoTable.previous.finalY + 10;
            });
    
            doc.addPage();
            lastY = 25;
            const entityType = gameType === 'doubles' ? 'Team' : 'Player';
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(`Schedule by ${entityType}`, 15, lastY);
            lastY += 5;
            
            const entityData = gameType === 'doubles' ? memoizedScheduleByTeam : memoizedScheduleByPlayer;
            Object.values(entityData).sort((a, b) => a.name.localeCompare(b.name)).forEach(entity => {
                const head = [['Round', 'Court', 'Opponent']];
                const body = entity.games.map(game => {
                    const isRoundComplete = completedRounds.includes(game.round);
                    const opponent = gameType === 'doubles' ? game.opponent : (game.team1.some(p => p.id === entity.id) ? game.team2 : game.team1);
                    return [`${isRoundComplete ? "✅ " : ""}Round ${game.round}`, `Court ${game.court}`, opponent.map(p => p.name).join(' & ')];
                });
    
                if (lastY + (body.length * 10) + 30 > pageHeight) {
                    doc.addPage();
                    lastY = 25;
                }
    
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(entity.name, 15, lastY + 5);
                lastY += 7;
    
                doc.autoTable({
                    head, body, startY: lastY, headStyles: { fillColor: themeColor }, tableLineColor: [230, 230, 230], tableLineWidth: 0.1,
                });
                lastY = doc.autoTable.previous.finalY + 10;
            });
    
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                
                const footerText1 = `Page ${i} of ${pageCount} | Generated: ${new Date().toLocaleDateString()}`;
                doc.text(footerText1, pageWidth / 2, pageHeight - 15, { align: 'center' });
                
                const footerText2 = "Created by Hakim Hamid | hakimmhamiddev@gmail.com | @hakimmhamiddev";
                doc.text(footerText2, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
    
            doc.save('sports_schedule.pdf');
        } catch (err) {
            console.error(err);
            setError("Failed to generate PDF. Please try again.");
        } finally {
            setIsExportingPdf(false);
        }
    };
    
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#6BCB77] dark:text-[#86d994]">Match Flow</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Generated Schedule</p>
                </header>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <button onClick={() => setView('setup')} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                        <ArrowLeftIcon /> Back to Setup
                    </button>
                    <button 
                        onClick={exportToPDF} 
                        disabled={isExportingPdf}
                        className="w-full sm:w-auto bg-[#6BCB77] hover:bg-[#5aa764] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                       <DocumentArrowDownIcon /> {isExportingPdf ? 'Generating...' : 'Export as PDF'}
                    </button>
                </div>

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
                {error && <p className="text-red-500 text-center mb-2 text-sm">{error}</p>}
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
            </div>
        </div>
    );
}