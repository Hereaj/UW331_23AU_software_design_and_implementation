import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { Poll, parsePoll, parseOptions } from './poll';
import { isRecord } from './record';

type DetailsProps = {
    name: string,
    onBackClick: () => void,
};

type DetailsState = {
    now: number,
    poll: Poll | undefined,
    voterInput: string,
    selectedOption: string | undefined;
    message: string,
    error: string
};

// Shows an individual poll and allows voting (if ongoing).
export class PollDetails extends Component<DetailsProps, DetailsState> {
    constructor(props: DetailsProps) {
        super(props);
        this.state = { now: Date.now(), poll: undefined, selectedOption: undefined, voterInput: "", message: "", error: ""};
    }

    componentDidMount = (): void => {
        this.doRefreshClick(); 
    };

    render = (): JSX.Element => {
        if (this.state.poll === undefined) {
            return <p>Loading poll "{this.props.name}"...</p>
        } else {
            if (this.state.poll.endTime <= this.state.now) {
                return this.renderCompleted(this.state.poll);
            } else {
                return this.renderOngoing(this.state.poll);
            }
        }
    };

    renderCompleted = (poll: Poll): JSX.Element => {
        const min = Math.round((this.state.now - poll.endTime) / 60 / 100) / 10;
        const unorderList: JSX.Element[] = [];
        for (const item of poll.options) {
            if (parseOptions(item)) {
                const total = (poll.total === 0) ? 1 : poll.total;
                const cal = (item.voter * 100 / total).toFixed(1);
                const people = (item.voter === 1) ? "person" : "people";
                
                unorderList.push(<li key={item.option}><div>
                    <p><b>{item.option}</b>:</p>
                    <span>{cal} %, {item.voter} {people} voted.</span>
                    </div></li>);
            }
        }

        return (
            <div>
             <div>
                <h2>{poll.name}</h2>
                <h3>Total people who voted: {this.state.poll?.total}</h3>
                <ul>{unorderList}</ul>
                <p><i>Poll closed {min} minutes ago.</i></p>
             </div>
            <button type="button" onClick={this.doBackClick}>Back</button>
            <button type="button" onClick={this.doRefreshClick}>Refresh</button>
            </div>
        );
    };

    renderOngoing = (poll: Poll): JSX.Element => {
        const min = Math.round((poll.endTime - this.state.now) / 60 / 100) / 10;
        const unorderList: JSX.Element[] = [];

        for (const option of poll.options) {
            if (parseOptions(option)) {
                unorderList.push(
             
                        <div key={option.option}>
                            <input type="radio" id={option.option} name= "pollOptions" value={option.option} checked={option.option === this.state.selectedOption} onChange={this.doOptionChange}></input>
                            <label htmlFor={option.option}> {option.option}</label>
                        </div>
            
                );
            }
        }

        return (
            <div>
                <h2>{poll.name}</h2>
                <p><i>Poll closes in {min} minutes...</i></p>
                <ul>{unorderList}</ul>
                <div>
                    <label htmlFor="voter">Voter Name:</label>
                    <input type="text" id="voter" value={this.state.voterInput} onChange={this.doInputChange}></input>
                </div>
                <button type="button" onClick={this.doBackClick}>Back</button>
                <button type="button" onClick={this.doRefreshClick}>Refresh</button>
                <button type="button" onClick={this.doVoteClick}>Vote</button>
                {this.renderMessage()}
                {this.renderError()}
            </div>
        );
    };

    renderMessage = (): JSX.Element => {
        return <div>{this.state.message}</div>
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

    doRefreshClick = (): void => {
        const args = {name: this.props.name};
        fetch("/api/getpoll", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
          .then(this.doGetResp)
          .catch(() => this.doGetError("failed to connect to server"));

        this.setState({message: "", voterInput: ""});
    };

    doGetResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doGetJson)
              .catch(() => this.doGetError("200 res is not JSON"));
        } else if (res.status === 400) {
          res.json().then(this.doGetError)
              .catch(() => this.doGetError("400 response is not text"));
        } else {
          this.doGetError(`bad status code from /api/refersh: ${res.status}`);
        }
    };

    doGetJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/refresh: not a record", data);
          return;
        }
    
        this.doPollChange(data);
    };

    // Shared helper to update the state with the new poll.
    doPollChange = (data: {poll?: unknown}): void => {
        const poll = parsePoll(data.poll);
        if (poll !== undefined) {
            this.setState({poll, now: Date.now(), error: ""});
        } else {
            console.error("poll from /api/fresh did not parse", data.poll)
        }
    };

    doGetError = (msg: string): void => {
        console.error(`Error fetching /api/refresh: ${msg}`);
    };

    doInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({voterInput: evt.target.value, error: ""});
    }

    doOptionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({selectedOption: evt.target.value, error: ""});
    }

    doVoteClick = (_: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.poll === undefined)
          throw new Error("impossible");
    
        if (this.state.voterInput.trim().length === 0) {
          this.setState({error: "a required field is missing."});
          return;
        }
        
        const args = {name: this.props.name, option: this.state.selectedOption};
        fetch("/api/vote", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
          .then(this.doVoteResp)
          .catch(() => this.doVoteError("failed to connect to server"));
        
        const votername = this.state.voterInput;
        const selectedOption = this.state.selectedOption;
        const msg = "Recorded vote of \"" + votername +"\" as \"" + selectedOption + "\"";
        this.setState({message: msg,voterInput: "" });
    };

    doVoteResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doVoteJson)
              .catch(() => this.doVoteError("200 response is not JSON"));
        } else if (res.status === 400) {
          res.json().then(this.doVoteError)
              .catch(() => this.doVoteError("400 response is not text"));
        } else {
          this.doVoteError(`bad status code from /api/vote: ${res.status}`);
        }
    };

    doVoteJson = (data: unknown): void => {
        if (this.state.poll === undefined)
          throw new Error("impossible");
    
        if (!isRecord(data)) {
          console.error("bad data from /api/vote: not a record", data);
          return;
        }
    
        this.doPollChange(data);
    };

    doVoteError = (msg: string): void => {
        console.error(`Error fetching /api/vote: ${msg}`);
    };

    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();  // tell the parent to show the full list again
    };
}