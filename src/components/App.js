import React, {Component} from 'react';
import '../styles/App.css';
import DataParser from '../parse-data.js';
import DATA_URL from '../constants.js';
import StandingsTable from './DivisionTable.js';
import Histogram from './Histogram.js';
import TeamBarChart from './TeamBarChart.js';
import SettingsMenu from './SettingsMenu.js';
import { TopBar, LeagueInput } from './TopBar.js';
import { Container, Row, Col } from 'react-bootstrap';


function fetchData(leagueId) {
    return fetch(DATA_URL.replace("<LEAGUE_ID>", leagueId))
        .then(resp => resp.json())
        .catch(err => console.log(err));
}

class App extends Component {

    constructor() {
        super();
        this.state = {
            leagueId: null,
            leagueSettings: null,
            teams: null,
            divisions: null,
            teamId: null,
            errorMsg: null,
            pointsWins: true
        }
        this.handleTeamSelection = this.handleTeamSelection.bind(this);
        this.handleLeagueChange = this.handleLeagueChange.bind(this);
    }

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
                divisions: parser.divisions,
                errorMsg: null
            });
        })
        .catch(err => {
            this.setState({errorMsg: "Failed to load data from that league."});
            console.log(err);
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
            console.log("rendering with error");
            return ( <LeagueInput show={true} changeLeague={this.handleLeagueChange}
                       allowCancel={false} errorMsg={this.state.errorMsg} /> );
        }
        else if (this.state.divisions) {
            return (
                <Container>
                        <Row>
                            <Col>
                                <TopBar league={this.state.leagueSettings}
                                        leagueId={this.state.leagueId}
                                        changeLeague={this.handleLeagueChange} />
                            </Col>
                        </Row>
                        <SettingsMenu pointsWinsCallback={() => this.setState({pointsWins: !this.state.pointsWins})}
                                      pointsWins={this.state.pointsWins} />
                        <Row className="justify-content-center">
                            <Col>
                                <StandingsTable divisions={this.state.divisions} teams={this.state.teams}
                                                onRowHover={this.handleTeamSelection}
                                                pointsWins={this.state.pointsWins} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Histogram data={this._histogramData()}
                                           units="Fantasy Points"
                                           selectedTeam={this.state.teamId} w={500} h={350} />
                            </Col>
                            <Col md={6}>
                                <TeamBarChart data={this.state.teams.sort((a, b) => b.pointsFor - a.pointsFor)}
                                           units="Fantasy Points" pointsWins={this.state.pointsWins}
                                           selectedTeam={this.state.teamId} w={500} h={350} />
                            </Col>
                        </Row>
                    </Container>
                )
            }
            else return ( <LeagueInput show={true} changeLeague={this.handleLeagueChange}
                           allowCancel={false} /> );
        }

    }

export default App;
