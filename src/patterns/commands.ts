import { ImageEditor } from "../service/ImageEditor";

export interface Command {
  execute(): void;
}

export class FlipCommand implements Command {
  private editor: ImageEditor;
  private axis: "horizontal" | "vertical";

  constructor(editor: ImageEditor, axis: "horizontal" | "vertical") {
    this.editor = editor;
    this.axis = axis;
  }

  execute() {
    this.editor.flip(this.axis);
  }
}

export class RotateCommand implements Command {
  private editor: ImageEditor;
  private direction: "left" | "right";
  private degrees: number;

  constructor(editor: ImageEditor, direction: "left" | "right", degrees = 90) {
    this.editor = editor;
    this.direction = direction;
    this.degrees = degrees;
  }

  execute() {
    this.editor.rotate(this.direction, this.degrees);
  }
}

export class SaveCommand implements Command {
  private editor: ImageEditor;

  constructor(editor: ImageEditor) {
    this.editor = editor;
  }

  execute() {
    this.editor.saveImage();
  }
}
