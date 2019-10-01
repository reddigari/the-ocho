import React, { useState } from 'react';
import { Row, Col, Button, Modal, FormControl } from 'react-bootstrap';
import exampleLeagues from '../examples.js';
import '../styles/TopBar.css';


function LeagueInput(props) {
  const [show, setShow] = useState(props.show);
  const [leagueId, setLeagueId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function submit() {
      props.changeLeague(leagueId);
      setShow(false);
  }
  function setAndSubmit(evt, id) {
      evt.preventDefault();
      props.changeLeague(id);
      setShow(false);
  }

  return (
    <>
        <span className="change-league text-primary" onClick={handleShow}>Change</span>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h2>Choose an ESPN League</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl
                    size="lg"
                    placeholder="Enter League ID"
                    onChange={e => setLeagueId(e.target.value)}
                />
                <Row>
                    <Col>
                        <div className="league-option-title">Or select an example league:</div>
                        {
                            exampleLeagues.map(function(lg) {
                                const { name, id } = lg;
                                return (
                                    <a className="league-option" href=""
                                       onClick={(evt) => setAndSubmit(evt, id)}>
                                        {name} - {id}
                                    </a>
                                )
                            })
                        }
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose} disabled={!props.allowCancel}>
                    Cancel
                </Button>
                <Button variant="success" onClick={submit} disabled={leagueId===null}>
                    Go
                </Button>
            </Modal.Footer>
      </Modal>
    </>
  );
}

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
