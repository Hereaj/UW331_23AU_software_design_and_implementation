import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, Color, toColor, replace, find, solid, split, toJson } from "./square";
import { SquareElem } from "./square_draw";
import { prefix, len, nil } from "./list";
import { isRecord } from "./record";

type EditorProps = {
  /** Initial state of the file. */
  initialState: Square;

  /** name of item */
  onSave: string;
};

type EditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Name of item */
  onSave: string;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
};

/** UI for editing the image. */
export class Editor extends Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = { root: props.initialState, onSave: props.onSave, };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <div>
          <SquareElem
            width={600}
            height={600}
            square={this.state.root}
            selected={this.state.selected}
            onClick={this.doSquareClick}
          ></SquareElem>
        </div>
        <div>
        <button onClick={this.doSaveClick}>Save</button>
          {this.renderColorDropbox()}
          {this.renderSplit()}
          {this.renderMerge()}
        </div>
      </div>
    );
  };

  renderSplit = (): JSX.Element => {
    const selectedRoot = this.state.root;
    const selectedPath = this.state.selected;

    if (selectedPath !== undefined) {
      const selectedSquare = find(selectedRoot, selectedPath);

      if (selectedSquare.kind === "solid") {
        return <button onClick={this.doSplitClick}>Split</button>;
      }
    }

    return <span></span>;
  };

  renderMerge = (): JSX.Element => {
    const selectedRoot = this.state.root;
    const selectedPath = this.state.selected;

    if (selectedPath !== undefined) {
      const selectedSquare = find(selectedRoot, selectedPath);

      if (selectedSquare.kind === "solid") {
        return <button onClick={this.doMergeClick}>Merge</button>;
      }
    }

    return <span></span>;
  };

  renderColorDropbox = (): JSX.Element => {
    const selectedRoot = this.state.root;
    const selectedPath = this.state.selected;

    if (selectedPath !== undefined) {
      const selectedSquare = find(selectedRoot, selectedPath);

      if (selectedSquare.kind === "solid") {
        return (
          <select value={selectedSquare.color} onChange={this.doColorChange}>
            <option value="white">white</option>
            <option value="red">red</option>
            <option value="orange">orange</option>
            <option value="yellow">yellow</option>
            <option value="green">green</option>
            <option value="blue">blue</option>
            <option value="purple">purple</option>
          </select>
        );
      }
    }

    return <span></span>;
  };

  doSquareClick = (path: Path): void => {
    this.setState({ root: this.state.root, selected: path });
  };

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const selectedPath = this.state.selected;
    const selectedRoot = this.state.root;

    if (selectedPath !== undefined) {
      const selectedSquare = find(selectedRoot, selectedPath);

      if (selectedSquare.kind === "solid") {
        const newSquare = split(
          solid(selectedSquare.color),
          solid(selectedSquare.color),
          solid(selectedSquare.color),
          solid(selectedSquare.color)
        );
        const newRoot = replace(selectedRoot, selectedPath, newSquare);

        this.setState({ root: newRoot });
      }
    }
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    const selectedPath = this.state.selected;
    const selectedRoot = this.state.root;

    if (selectedPath !== undefined) {
      const selectedSquare = find(selectedRoot, selectedPath);

      if (selectedSquare.kind === "solid") {
        const newSquare = solid(selectedSquare.color);
        const newPath: Path = prefix(len(selectedPath) - 1, selectedPath);
        const newRoot = replace(selectedRoot, newPath, newSquare);

        this.setState({ root: newRoot, selected: nil,})
      }
    }
  };

  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    const newColor: Color = toColor(_evt.target.value);
    const newSquare = solid(newColor);

    const selectedPath = this.state.selected;
    const selectedRoot = this.state.root;

    if (selectedPath !== undefined) {
      const selectedSquare = find(selectedRoot, selectedPath);

      if (selectedSquare.kind === "solid") {
        const newRoot = replace(selectedRoot, selectedPath, newSquare);
        this.setState({ root: newRoot, });
      }
    }
  };

  doSaveClick = (): void => {
    const fileName = this.state.onSave;
    const selectedRoot = this.state.root;

    fetch("/api/save", {
      method: "POST",
      body: JSON.stringify({ name: fileName, value: toJson(selectedRoot) }),
      headers: { "Content-Type": "application/json" },
    })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect to server"));
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
  };

  doAddError = (msg: string): void => {
    console.error(`Error fetching /save: ${msg}`);
  };
}
