import React, { useState, useMemo } from 'react';
import { LinkIcon, UnlinkIcon } from './Icons';

export default function PairManager({ players, teams, setTeams }) {
    const [selected, setSelected] = useState([]);

    const unpairedPlayers = useMemo(() => {
        const pairedPlayerIds = new Set(teams.flat().map(p => p.id));
        return players.filter(p => !pairedPlayerIds.has(p.id));
    }, [players, teams]);

    const handlePlayerSelect = (player) => {
        setSelected(prevSelected => {
            if (prevSelected.find(p => p.id === player.id)) {
                return prevSelected.filter(p => p.id !== player.id);
            }
            if (prevSelected.length < 2) {
                return [...prevSelected, player];
            }
            return prevSelected; // Max 2 selected
        });
    };

    const handleCreatePair = () => {
        if (selected.length === 2) {
            setTeams(prevTeams => [...prevTeams, selected]);
            setSelected([]);
        }
    };

    const handleBreakPair = (teamToBreak) => {
        setTeams(prevTeams => prevTeams.filter(team => team !== teamToBreak));
    };

    return (
        <div className="px-4 pb-4 space-y-4">
            <div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Unpaired Players ({unpairedPlayers.length})</h3>
                <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[40px]">
                    {unpairedPlayers.map(player => {
                        const isSelected = selected.find(p => p.id === player.id);
                        return (
                            <button
                                key={player.id}
                                onClick={() => handlePlayerSelect(player)}
                                className={`px-3 py-1 text-sm font-medium rounded-full transition ${isSelected ? 'bg-[#6BCB77] text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'}`}
                            >
                                {player.name}
                            </button>
                        );
                    })}
                    {unpairedPlayers.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 px-2">All players are paired.</p>}
                </div>
                <button
                    onClick={handleCreatePair}
                    disabled={selected.length !== 2}
                    className="w-full mt-2 bg-[#6BCB77] hover:bg-[#5aa764] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <LinkIcon /> Create Pair
                </button>
            </div>
            <div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Pre-defined Pairs ({teams.length})</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {teams.map((team, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg">
                            <span className="font-medium text-sm">{team.map(p => p.name).join(' & ')}</span>
                            <button onClick={() => handleBreakPair(team)} className="text-red-500 hover:text-red-600">
                                <UnlinkIcon />
                            </button>
                        </li>
                    ))}
                    {teams.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 px-2">No pairs defined yet.</p>}
                </ul>
            </div>
        </div>
    );
}