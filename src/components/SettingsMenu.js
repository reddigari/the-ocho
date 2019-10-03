import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { PointsWinsHelp } from './HelpModal.js';
import '../styles/SettingsMenu.css';

function PointsWins(props) {
    const [checked, setChecked] = useState(props.checked);

    function toggleChecked() {
        setChecked(!checked);
        props.onChange();
    }

    return (
        <Col>
            <Form.Check type="checkbox" label="Points-based Wins"
                        checked={checked} onChange={toggleChecked}
                        className="settings-item" />
            <PointsWinsHelp />
        </Col>
    )
}


function SettingsMenu(props) {
    return (
        <Row>
            <PointsWins checked={props.pointsWins} onChange={props.pointsWinsCallback} />
        </Row>
            
    )
}


export default SettingsMenu;
