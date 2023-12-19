import React, { ChangeEvent, Component } from "react";
import { solid, Square, fromJson } from './square';
import { Editor } from "./Editor";
import { isRecord } from "./record";

type AppState = {
  showEditor: boolean;

  files: string[];

  initialSquare: Square;

  onSave: string;
}


export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = { showEditor: false, files: [], onSave: "", initialSquare: solid("white")};
  }
  
  render = (): JSX.Element => {
    return (
      <div>  
        {this.state.showEditor ? (
          <>
          <Editor initialState={this.state.initialSquare} onSave={this.state.onSave}></Editor>
          <button onClick={this.doShowChange}>Back</button>
          </>
        ) : (

          <>
          {this.renderFiles()}
          {this.renderForm()}

          </>
        )}
      </div>
    );
    }

  renderFiles = (): JSX.Element => {
    fetch("/api/listFiles").then(this.doAddResp).catch(() => this.doAddError("failed to connect"));

    const items : JSX.Element[] = [];
    for (const item of this.state.files) {
      items.push(<li><a href="#" onClick={() => this.doChangeSquareClick(item)}>{item}</a></li>);
      items.push(<div></div>);
    }

    return <ul>{items}</ul>
  };

  renderForm = (): JSX.Element => {
    const res = (
      <div>
        Name:
        <input type="text" onChange={this.doNewNameChange}></input>
        <button onClick={this.doShowChange}>Create</button>
      </div>
    );

    return res;
  };

  doAddResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doAddJson)
        .catch(() => this.doAddError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doAddError)
        .catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code ${res.status}`);
    }
  };

  doAddJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /add: not a record", data);
      return;
    }

    const items = data.files
    if (items !== undefined && Array.isArray(items) )
      this.setState({files:  items});
  };

  doAddError = (msg: string): void => {
    console.error(`Error fetching /save: ${msg}`);
  };

  doChangeSquareClick = (name: string ) : void => {
    const url = "/api/load?name=" + encodeURI(name);
    fetch(url).then((val) => this.doLoadResp(val)).catch(() => this.doLoadError("failed to connect"));
  };

  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doLoadJson)
        .catch(() => this.doLoadError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
        .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`bad status code ${res.status}`);
    }
  };

  doLoadJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /add: not a record", data);
      return;
    }
    const loadedSquare = fromJson(data.value);
    const editorPage = this.state.showEditor;
    this.setState({initialSquare: loadedSquare, showEditor: !editorPage});
  };

  doLoadError = (msg: string): void => {
    console.error(`Error fetching /save: ${msg}`);
  };

  doNewNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ onSave: evt.target.value });
  };

  doShowChange = (): void => {
    const editorPage = this.state.showEditor;
    this.setState({ initialSquare: solid("white"), showEditor: !editorPage });
  };
}

