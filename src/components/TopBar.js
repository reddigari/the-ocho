import React, { useState } from 'react';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';
import '../styles/TopBar.css';


function LeagueInput(props) {
  const [show, setShow] = useState(props.show);
  const [leagueId, setLeagueId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const submit = function() {
      props.changeLeague(leagueId);
      setShow(false);
  }

  return (
    <>
        <span className="change-league text-primary" onClick={handleShow}>Change</span>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h2>Enter ESPN League ID</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl
                    placeholder="League ID"
                    onChange={e => setLeagueId(e.target.value)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={submit}>
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
            <LeagueInput changeLeague={props.changeLeague} />
        </div>
    )
}


export { TopBar, LeagueInput };
