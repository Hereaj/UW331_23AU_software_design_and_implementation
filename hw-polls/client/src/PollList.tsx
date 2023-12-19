import React, { Component, MouseEvent } from 'react';
import { Poll, parsePoll } from './poll';
import { isRecord } from './record';

type ListProps = {
    onNewClick: () => void,
    onPollClick: (name: string) => void
};

type ListState = {
    now: number, // current time when rendering
    polls: Poll[] | undefined,
};

// Shows the list of all the polls.
export class PollList extends Component<ListProps, ListState> {

    constructor(props: ListProps) {
        super(props);
        this.state = {now: Date.now(), polls: undefined};
    }

    componentDidMount = (): void => {
        this.doRefreshClick();
    }

    componentDidUpdate = (prevProps: ListProps): void => {
        if (prevProps !== this.props) {
          this.setState({now: Date.now()});  // Force a refresh
        }
    };

    render = (): JSX.Element => {
        return (
          <div>
            <h2>Current Polls</h2>
            {this.renderPolls()}
            <button type="button" onClick={this.doRefreshClick}>Refresh</button>
            <button type="button" onClick={this.doNewClick}>New Poll</button>
          </div>);
    };

    renderPolls = (): JSX.Element => {
        if (this.state.polls === undefined) {
            return <p>Loading poll list...</p>;
        } else {
            const current: JSX.Element[] = [];
            const closed: JSX.Element[]= [];

            for (const poll of this.state.polls) {
                const min = (poll.endTime - this.state.now) / 60 / 1000;
                const desc = (min < 0) ? <span>&nbsp;&ndash; Closed {(Math.round(min) * -1)} minutes ago</span> : <span>&nbsp;&ndash; {Math.round(min)} minutes remaining</span>;
            
                if (poll.endTime >= this.state.now) {
                    current.push(<li key={poll.name}>
                        <a href="#" onClick={(evt) => this.doPollClick(evt, poll.name)}>{poll.name}</a>{desc}
                    </li>);
                } else {
                    closed.push(<li key={poll.name}>
                        <a href="#" onClick={(evt) => this.doPollClick(evt, poll.name)}>{poll.name}</a>{desc}
                    </li>);
                }
            }

            const openComponent: JSX.Element = (current.length === 0) ? <span></span> : <p>Still Open</p>
            const closedComponent: JSX.Element = (closed.length === 0) ? <span></span> : <p>Closed</p>
            
            return (<div>
                <div>
                    {openComponent}
                    <ul>{current}</ul>
                </div>
                <div>
                    {closedComponent}
                    <ul>{closed}</ul>
                </div>
            </div>);
            
        }
    };

    doListResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doListJson)
              .catch(() => this.doListError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.json().then(this.doListError)
              .catch(() => this.doListError("400 response is not text"));
        } else {
          this.doListError(`bad status code from /api/list: ${resp.status}`);
        }
    };
    
    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/list: not a record", data);
            return;
        }

        if (!Array.isArray(data.polls)) {
            console.error("bad data from /api/list: polls is not an array", data);
            return;
        }

        const polls: Poll[] = [];
        for (const val of data.polls) {
            const poll = parsePoll(val);
            if (poll === undefined) {
                return;
            }
            polls.push(poll);
        }
        this.setState({polls, now: Date.now()});  // fix time also
    };
    
    doListError = (msg: string): void => {
        console.error(`Error fetching /api/list: ${msg}`);
    };

    doRefreshClick = (): void => {
        fetch("/api/list").then(this.doListResp)
            .catch(() => this.doListError("failed to connect to server"));
    };

    doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onNewClick();  // tell the parent to show the new poll page
    };

    doPollClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
        evt.preventDefault();
        this.props.onPollClick(name);
    };
}