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
                {props.body}
            </Modal.Body>
      </Modal>
    </>
  );
}

function LuckIndexHelp(props) {
    const msg = (
        <div>
            <b>Luck Index</b>  measures how lucky a team has been, where
            <u>lucky teams have positive values</u> and <u>unlucky teams
            have negative values</u>.
            <br /><br />
            It is equal to a team's wins minus their expected wins,
            determined by weekly score ranking.
            <br /><br />
            <b>Example</b>: For some week in an  8-team league, the second
            highest scorer would have defeated  6 of the 7 other teams, giving
            6/7 = 0.857 expected wins. The lowest scorer would have defeated no
            teams, giving 0 expected wins. Doing this each week and summing
            the values gives a teams total expected wins. A lucky team will
            have more wins than expected, giving a positive luck index.
        </div>
    )
    return <HelpModal title="Luck Index" body={msg} />
}

function PointsWinsHelp(props) {
    const msg = (
        <div>
            Choosing <b>Points-based Wins</b> assigns an additional win
            to each team scoring in the top half of scores that week,
            and an additional loss to those scoring in the bottom half.
            <br /><br />
            It is designed to reduce the unfairness of very high-scoring
            losses and very low-scoring wins.
        </div>
    )
    return <HelpModal title="Points-based Wins" body={msg} />
}

export { LuckIndexHelp, PointsWinsHelp };
