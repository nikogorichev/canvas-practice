export interface IImageEditor {
  drawImage(img: HTMLImageElement): void;
  flip(axis: "horizontal" | "vertical"): void;
  rotate(direction: "left" | "right", degrees: number): void;
  draw(lineWidth: number, strokeStyle: string): void;
  disableDrawing(): void;
  saveImage(): void;
  lazyPipeline(img: HTMLImageElement): void;
}
