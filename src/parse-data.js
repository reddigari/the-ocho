class DataParser {

    constructor(data) {
        this.leagueSettings = data.settings;
        this.divisions = data.settings.scheduleSettings.divisions;
        this.teams = data.teams.map(this.parseTeam);
        const teamIdx = {};
        this.teams.forEach((team, i) => teamIdx[team.teamId] = i);
        this.matchups  = data.schedule.map(this.parseMatchup);
        const ptsWins = this.getPointsWins(this.matchups);
        ptsWins.forEach(week => {
            week.forEach(d => {
                this.teams[teamIdx[d.teamId]].pointsWins += d.points_win ? 1 : 0;
                this.teams[teamIdx[d.teamId]].pointsLosses += d.points_win ? 0 : 1;
                this.teams[teamIdx[d.teamId]].expectedWins += d.expectedWins;
                this.teams[teamIdx[d.teamId]].scores.push(d.points);
            });
        });
    }

    parseTeam(data) {
        const team = {};
        team.teamId = data.id;
        team.divisionId = data.divisionId;
        team.location = data.location;
        team.nickname = data.nickname;
        team.abbrev = data.abbrev;
        team.wins = data.record.overall.wins;
        team.losses = data.record.overall.losses;
        team.ties = data.record.overall.ties;
        team.pointsFor = data.record.overall.pointsFor;
        team.pointsAgainst = data.record.overall.pointsAgainst;
        team.pointsWins = 0;
        team.pointsLosses = 0;
        team.expectedWins = 0;
        team.scores = [];
        return team;
    }

    parseMatchup(data) {
        const matchup = {};
        matchup.matchupPeriodId = data.matchupPeriodId;
        matchup.homeTeamId = data.home.teamId;
        matchup.homePoints = data.home.totalPoints;
        if (data.away) {
            matchup.awayTeamId = data.away.teamId;
            matchup.awayPoints = data.away.totalPoints;
        }
        matchup.winner = data.winner;
        matchup.winnerId = data.winner === "HOME" ? matchup.homeTeamId : matchup.awayTeamId
        if (data.winner === "TIE") matchup.winnerId = 0;
        return matchup;
    }

    getScoresByMatchup(matchups, matchupId) {
        const ofInterest = matchups.filter(m => m.matchupPeriodId === matchupId);
        const scores = [];
        ofInterest.forEach(m => {
            scores.push({teamId: m.homeTeamId, points: m.homePoints});
            scores.push({teamId: m.awayTeamId, points: m.awayPoints});
        })
        return scores;
    }

    cutoffFromScores(scores) {
        const sorted = scores.sort((a, b) => a.points - b.points);
        return sorted[sorted.length / 2].points;
    }

    getPointsWins(matchups) {
        const finished = matchups.filter(m => m.winner !== "UNDECIDED"),
              allIds = new Set(finished.map(m => m.matchupPeriodId));
        const finishedIds = [];
        allIds.forEach(i => finishedIds.push(i));
        const teamScores = finishedIds.map(id => this.getScoresByMatchup(finished, id));
        const out = teamScores.map(scores => {
            const cutoff = this.cutoffFromScores(scores),
                  sorted = scores.sort((a, b) => a.points - b.points),
                  N = scores.length - 1;
            sorted.forEach((s, i) => {
                s.expectedWins = i / N;
                s.points_win = s.points >= cutoff;
            });
            return sorted;
        });
        return out;
    }


}

export default DataParser;


