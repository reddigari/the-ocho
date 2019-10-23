import React, { useState } from 'react';
import { Row, Col, Button, Modal, FormControl, Alert } from 'react-bootstrap';
import exampleLeagues from '../examples.js';
import '../styles/LeagueInput.css';

function LeagueInput(props) {
  const [show, setShow] = useState(props.show);
  const [leagueId, setLeagueId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function submit() {
      setShow(false);
      props.changeLeague(leagueId);
  }
  function setAndSubmit(evt, id) {
      evt.preventDefault();
      setShow(false);
      props.changeLeague(id);
  }

  return (
    <>
        <span className="change-league text-primary" onClick={handleShow}>Change</span>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title><h2>Choose an ESPN League</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.errorMsg ? <Alert variant="danger">{props.errorMsg}</Alert> : null}

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
                                    <div className="league-option" key={id}
                                           onClick={(evt) => setAndSubmit(evt, id)}>
                                        <span style={{width: '25%', fontWeight: 'lighter'}}>{id}</span>
                                        <span>{name}</span>
                                    </div>
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

export default LeagueInput;
