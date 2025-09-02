export function generateSchedule(players, gameType, numCourts) {
    let teams = [];
    let unassignedPlayers = [];

    if (gameType === 'doubles') {
        let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
        if (shuffledPlayers.length % 2 !== 0) {
            unassignedPlayers.push(shuffledPlayers.pop());
        }
        for (let i = 0; i < shuffledPlayers.length; i += 2) {
            teams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
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

    return {
        games: finalSchedule,
        unassigned: unassignedPlayers
    };
}