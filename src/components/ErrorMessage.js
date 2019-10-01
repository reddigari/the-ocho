import React from 'react';

function ErrorMessage(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 alert-danger">{props.message}</div>
            </div>
        </div>
    )
}

export default ErrorMessage;