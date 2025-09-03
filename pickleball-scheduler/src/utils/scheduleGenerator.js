export function generateSchedule(players, gameType, numCourts, predefinedTeams = []) {
    let teams = [];
    let unassignedPlayers = [];

    if (gameType === 'doubles') {
        // Get IDs of players already in predefined teams
        const predefinedPlayerIds = new Set(predefinedTeams.flat().map(p => p.id));
        
        // Filter out players who are not yet in a team
        const remainingPlayers = players.filter(p => !predefinedPlayerIds.has(p.id));

        // Shuffle and pair the remaining players
        let shuffledRemaining = [...remainingPlayers].sort(() => 0.5 - Math.random());
        
        if (shuffledRemaining.length % 2 !== 0) {
            unassignedPlayers.push(shuffledRemaining.pop());
        }
        
        const newRandomTeams = [];
        for (let i = 0; i < shuffledRemaining.length; i += 2) {
            newRandomTeams.push([shuffledRemaining[i], shuffledRemaining[i + 1]]);
        }
        
        // Combine predefined teams with the new randomly paired teams
        teams = [...predefinedTeams, ...newRandomTeams];

    } else { // Singles logic remains the same
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

    return {
        games: finalSchedule,
        unassigned: unassignedPlayers
    };
}