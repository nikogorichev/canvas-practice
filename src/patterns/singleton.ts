import { ImageEditor } from "../service/ImageEditor";
import type { IImageEditor } from "../types";

export class EditorSingleton {
  private static instance: IImageEditor;

  public static getInstance(canvas: HTMLCanvasElement): IImageEditor {
    if (!this.instance) {
      this.instance = new ImageEditor(canvas);
    }
    return this.instance;
  }
}
