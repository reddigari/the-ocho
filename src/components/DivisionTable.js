import React from 'react';
import '../styles/DivisionTable.css';
import { LuckIndexHelp } from './HelpModal.js';

function TeamRow(props) {
    const t = props.team;
    return (
        <tr onMouseOver={() => props.onHover(t.teamId)}
            onMouseOut={() => props.onHover(null)}>
            <td>{t.location} {t.nickname}</td>
            <td>{t.totalWins}-{t.totalLosses}-{t.ties}</td>
            {props.pointsWins ?
                (<>
                    <td>{t.wins}</td>
                    <td>{t.pointsWins}</td>
                </>)
                : null}
            <td>{t.pointsFor.toFixed(1)}</td>
            <td>{t.pointsAgainst.toFixed(1)}</td>
            <td>{(t.wins - t.expectedWins).toFixed(2)}</td>
        </tr>
    )
}

function DivisionTable(props) {

    const COLORS = ["lightblue", "lightgreen", "lightpink", "papayawhip"];

    var teams = props.teams;
    const pw = props.pointsWins;
    teams.forEach(t => {
        t.totalWins = t.wins + (pw ? t.pointsWins : 0)
        t.totalLosses = t.losses + (pw ? t.pointsLosses : 0)
    });
    teams = teams.sort((a, b) => b.totalWins - a.totalWins);

    const rows = teams.map((t, i) =>
        <TeamRow team={t} key={t.teamId} onHover={props.onRowHover}
                 pointsWins={pw} />);
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
            <div className="help-text">Hover over a team in the table to highlight its scores in the other graphics.</div>
            <table className="table table-responsive-md table-hover table-sm division-table">
                <thead>
                    <tr>
                        <th>Division</th>
                        <th>Team</th>
                        <th>Record</th>
                        {props.pointsWins ? (
                            <>
                                <th>Game Wins</th>
                                <th>Points Wins</th>
                            </>
                        ) : null}
                        <th>Points For</th>
                        <th>Points Against</th>
                        <th>Luck Index <LuckIndexHelp /></th>
                    </tr>
                </thead>
                {props.divisions.map((d, i) =>
                    <DivisionTable key={d.id} teams={props.teams.filter(t => t.divisionId === d.id)}
                                   name={d.name} index={i} onRowHover={props.onRowHover}
                                   pointsWins={props.pointsWins} />
                )}
            </table>
        </div>
    )
}

export default StandingsTable;
