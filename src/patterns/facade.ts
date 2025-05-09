import { ImageEditor } from "../service/ImageEditor";
import { FlipCommand, RotateCommand, SaveCommand } from "./commands";

interface IImageEditorFacade {
  loadImage(file: File, callback?: () => void): void;
  getEditor(): ImageEditor;
  flipImage(): void;
  rotateImage(): void;
  saveImage(): void;
}

export class ImageEditorFacade implements IImageEditorFacade {
  private editor: ImageEditor;
  private flipCommand: FlipCommand;
  private rotateCommand: RotateCommand;
  private saveCommand: SaveCommand;

  constructor(canvas: HTMLCanvasElement) {
    this.editor = new ImageEditor(canvas);
    this.flipCommand = new FlipCommand(this.editor, "horizontal");
    this.rotateCommand = new RotateCommand(this.editor, "right", 90);
    this.saveCommand = new SaveCommand(this.editor);
  }

  loadImage(file: File, callback?: () => void) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        this.editor.drawImage(img);
        callback?.();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  getEditor() {
    return this.editor;
  }

  flipImage() {
    this.flipCommand.execute();
  }

  rotateImage() {
    this.rotateCommand.execute();
  }

  saveImage() {
    this.saveCommand.execute();
  }
}
