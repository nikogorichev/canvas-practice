import { ImageEditor } from "../service/ImageEditor";

export interface DrawingStrategy {
  draw(editor: ImageEditor): void;
}

export class RedPenStrategy implements DrawingStrategy {
  draw(editor: ImageEditor) {
    editor.draw(3, "#ff0000");
  }
}

export class GreenMarkerStrategy implements DrawingStrategy {
  draw(editor: ImageEditor) {
    editor.draw(6, "#00ff00");
  }
}
