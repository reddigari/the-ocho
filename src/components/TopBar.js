import React from 'react';
import LeagueInput from './LeagueInput.js';
import '../styles/TopBar.css';


function TopBar(props) {
    
    const name = props.league.name;

    return (
        <div>
            <h1 className="league-title">{name}
                <span className="league-id"> | ESPN League {props.leagueId}</span>
            </h1>
            <LeagueInput changeLeague={props.changeLeague}
             allowCancel={true} />
        </div>
    )
}


export { TopBar, LeagueInput };
