import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { HelpOutline } from '@material-ui/icons';
import '../styles/HelpModal.css';

function HelpModal(props) {
  const [show, setShow] = useState(props.show);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <HelpOutline className="help-icon" fontSize="small" onClick={handleShow} />

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h2>{props.title}</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.text}</p>
            </Modal.Body>
      </Modal>
    </>
  );
}

function LuckIndexHelp(props) {
    const msg = [
        <b>Luck Index</b>, " measures how lucky a team has been, where ",
        <u>lucky teams have positive values</u>, " and  ", <u>unlucky teams have negative values</u>, ".", 
        <br />, <br />, "It is equal to a team's wins minus their expected wins, determined by weekly score ranking. ",
        <br />, <br />, <b>Example</b>, ": for some week in an  8-team league, the second highest scorer would have defeated ",
        "6 of the 7 other teams, giving 6/7 = 0.857 expected wins. The lowest scorer would have defeated no teams, giving 0 expected wins. ",
        "Doing this each week and summing the values ",
        "gives a teams total expected wins. A lucky team will have more wins than expected, giving a positive luck index."]
    return <HelpModal title="Luck Index" text={msg} />
}

export { LuckIndexHelp };
