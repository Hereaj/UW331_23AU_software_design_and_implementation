import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { isRecord } from './record';
import { stringToArray } from './helper';

type NewPollProps = {
    onBackClick: () => void
};

type NewPollState = {
    name: string,
    minutes: string,
    option: string,
    error: string,
};

export class NewPoll extends Component<NewPollProps, NewPollState> {

    constructor(props: NewPollProps) {
        super(props);
        this.state = { name : "", minutes: "60", option: "", error: "" };
    }

    render = (): JSX.Element => {
        return (
            <div>
                <h2>New Poll</h2>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input id="name" type="text" value={this.state.name} onChange={this.doNameChange}></input>
                </div>
                <div>
                    <label htmlFor="minutes">Minutes:</label>
                    <input id="minutes" type="number" min="1" value={this.state.minutes} onChange={this.doMinutesChange}></input>
                </div>
                <div>
                    <label htmlFor="options">Options (one per line, minimum 2 lines):</label>
                    <br/>
                    <textarea id="options" rows={3} cols={40} value={this.state.option} onChange={this.doOptionChange}></textarea>
                </div>
                <button type="button" onClick={this.doCreateClick}>Create</button>
                <button type="button" onClick={this.doBackClick}>Back</button>
                {this.renderError()}
            </div>
        );
    };

    renderError = (): JSX.Element => {
        if (this.state.error.length === 0) {
          return <div></div>;
        } else {
          const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
              border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
          return (<div style={{marginTop: '15px'}}>
              <span style={style}><b>Error</b>: {this.state.error}</span>
            </div>);
        }
    };

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value, error: ""});
    };

    doMinutesChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({minutes: evt.target.value, error: ""});
    };

    doOptionChange = (evt: ChangeEvent<HTMLTextAreaElement>) : void => {
        this.setState({option: evt.target.value, error: ""});
    };

    doCreateClick = (_: MouseEvent<HTMLButtonElement>): void => {
        // Verify that the user entered all required information.
        if (this.state.name.trim().length === 0 || this.state.minutes.trim().length === 0 || this.state.option.trim().length === 0) {
            this.setState({error: "a required field is missing."});
            return;
        }

        // Verify that minutes is a number.
        const minutes = parseFloat(this.state.minutes);
        if (isNaN(minutes) || minutes < 1 || Math.floor(minutes) !== minutes) {
            this.setState({error: "minutes is not a positive integer"});
            return;
        }

        const inputToList = stringToArray(this.state.option);
        const optionList = [];
        for ( const item of inputToList) {
            optionList.push({option: item, voter: 0})
        }

        // Ask the app to start this poll (adding it to the list).
        const args = { name: this.state.name, options: optionList, minutes: minutes, total: 0 };
        fetch("/api/add", {method: "POST", body: JSON.stringify(args), headers: {"Content-Type": "application/json"} })
          .then(this.doAddResp)
          .catch(() => this.doAddError("failed to connect to server"));
    };

    doAddResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doAddJson)
              .catch(() => this.doAddError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.json().then(this.doAddError)
              .catch(() => this.doAddError("400 response is not text"));
        } else {
          this.doAddError(`bad status code from /api/add: ${resp.status}`);
        }
    };

    doAddJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/add: not a record", data);
          return;
        }
    
        this.props.onBackClick();  // show the updated list
    };

    doAddError = (msg: string): void => {
        this.setState({error: msg})
    };

    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();  // tell the parent this was clicked
    };
}