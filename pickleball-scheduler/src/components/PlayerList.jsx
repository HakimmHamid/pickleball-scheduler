import React, { useState } from 'react';
import { EditIcon, DeleteIcon, DuplicateIcon, CheckIcon } from './Icons';

export default function PlayerList({ players, setPlayers }) {
    const [newPlayerName, setNewPlayerName] = useState("");
    const [showPasteBox, setShowPasteBox] = useState(false);
    const [pastedNames, setPastedNames] = useState("");
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [error, setError] = useState('');

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

    const handlePasteNames = () => {
        if (!pastedNames.trim()) return;

        const lines = pastedNames.split('\n');
        const pastedPlayerNames = lines
            .map(line =>
                line
                    .trim()
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

    return (
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
            {error && <p className="text-red-500 text-center mb-2 text-sm">{error}</p>}
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
    );
}