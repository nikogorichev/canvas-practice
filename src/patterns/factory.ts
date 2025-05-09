import { ImageEditor } from "../service/ImageEditor";
import type { IImageEditor } from "../types";

export class EditorFactory {
  static create(canvas: HTMLCanvasElement): IImageEditor {
    return new ImageEditor(canvas);
  }
}
