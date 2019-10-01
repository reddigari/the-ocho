import React, {Component} from 'react';
import '../styles/App.css';
import DataParser from '../parse-data.js';
import DATA_URL from '../constants.js';
import StandingsTable from './DivisionTable.js';
import Histogram from './Histogram.js';
import TeamBarChart from './TeamBarChart.js';
import { TopBar, LeagueInput } from './TopBar.js';
import ErrorMessage from './ErrorMessage.js';
import { Row, Col } from 'react-bootstrap';


function fetchData(leagueId) {
    return fetch(DATA_URL.replace("<LEAGUE_ID>", leagueId))
        .then(resp => resp.json())
        .catch(err => console.log(err));
}

function getLeagueIdFromURL() {
    const query = window.location.search;
    const params = new URLSearchParams(query);
    return params.get("leagueId");
}

class App extends Component {

    constructor() {
        super();
        this.state = {
            teams: null,
            divisions: null,
            teamId: null
        }
        this.handleTeamSelection = this.handleTeamSelection.bind(this);
        this.handleLeagueChange = this.handleLeagueChange.bind(this);
    }

    //componentDidMount() {
        //const id = getLeagueIdFromURL();
        //this.handleLeagueChange(id);
    //}

    handleLeagueChange(leagueId) {
        fetchData(leagueId).then(resp => {
            const parser = new DataParser(resp);
            const {teams, divisions} = parser;
            divisions.forEach(d => {
                d.teams = teams.filter(t => t.divisionId === d.id);
            })
            this.setState({
                leagueId: leagueId,
                leagueSettings: parser.leagueSettings,
                teams: parser.teams,
                divisions: parser.divisions
            });
        })
        .catch(err => {
            this.setState({errorMsg: "oops"});
        });
    }

    handleTeamSelection(teamId) {
        this.setState({teamId: teamId});
    }

    _histogramData() {
        const data = this.state.teams;   
        const scores = [];
        data.forEach(d => {
            var items = d.scores.map(s => ({teamId: d.teamId, value: s}));
            scores.push(...items);
        });
        return scores;

    }

    render() {
        if (this.state.errorMsg) {
            return (<ErrorMessage message={this.state.errorMsg} />)
        }
        if (this.state.divisions) {
            return (
                <div className="container">
                    <Row>
                        <Col>
                            <TopBar league={this.state.leagueSettings}
                                    leagueId={this.state.leagueId}
                                    changeLeague={this.handleLeagueChange} />
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col>
                            <StandingsTable divisions={this.state.divisions} teams={this.state.teams} 
                                            onRowHover={this.handleTeamSelection} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Histogram data={this._histogramData()}
                                       units="Fantasy Points"
                                       selectedTeam={this.state.teamId} w={500} h={350} />                    
                        </Col>
                        <Col md={6}>
                            <TeamBarChart data={this.state.teams}
                                       units="Fantasy Points"
                                       selectedTeam={this.state.teamId} w={500} h={350} />                    
                        </Col>
                    </Row>
                </div>
            )
        }
        else return ( <LeagueInput show={true} changeLeague={this.handleLeagueChange} /> );
    }

}

export default App;
