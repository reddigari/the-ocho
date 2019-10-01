import React from 'react';
import '../styles/DivisionTable.css';

function TeamRow(props) {
    const t = props.team;
    return (
        <tr onMouseOver={() => props.onHover(t.teamId)}
            onMouseOut={() => props.onHover(null)}>
            <td>{t.location} {t.nickname}</td>
            <td>{t.totalWins}-{t.totalLosses}-{t.ties}</td>
            <td>{t.wins}</td>
            <td>{t.pointsWins}</td>
            <td>{t.pointsFor.toFixed(1)}</td>
            <td>{t.pointsAgainst.toFixed(1)}</td>
        </tr>
    )
}

function DivisionTable(props) {

    const COLORS = ["lightblue", "lightgreen", "lightpink", "papayawhip"];

    var teams = props.teams;
    teams.forEach(t => {
        t.totalWins = t.wins + t.pointsWins
        t.totalLosses = t.losses + t.pointsLosses
    });
    teams = teams.sort((a, b) => b.totalWins - a.totalWins);

    const rows = teams.map((t, i) => <TeamRow team={t} key={t.teamId} onHover={props.onRowHover} />);
    let style = {backgroundColor: COLORS[props.index]};
    return (
        <tbody>
            <tr>
            <td className="division-name" rowSpan={teams.length + 1}
                style={style}>{props.name}</td>
            </tr>
            {rows} 
        </tbody>
    )
}

function StandingsTable(props) {
    return (
        <div className="viz-item">
            <h2>Standings</h2>
            <table className="table table-responsive-md table-hover table-sm division-table">
                <thead>
                    <tr>
                        <th>Division</th>
                        <th>Team</th>
                        <th>Record</th>
                        <th>Game Wins</th>
                        <th>Points Wins</th>
                        <th>Points For</th>
                        <th>Points Against</th>
                    </tr>
                </thead>
                {props.divisions.map((d, i) => 
                    <DivisionTable key={d.id} teams={props.teams.filter(t => t.divisionId === d.id)}
                                   name={d.name} index={i} onRowHover={props.onRowHover} />
                )}
            </table>
        </div>
    )
}

export default StandingsTable;
