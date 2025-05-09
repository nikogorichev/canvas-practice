import type { IImageEditor } from "../types";

export class ImageEditor implements IImageEditor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isDrawingEnabled = false;
  private startDraw?: (e: MouseEvent) => void;
  private drawMove?: (e: MouseEvent) => void;
  private stopDraw?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot get 2D context");
    this.ctx = context;
  }

  drawImage(img: HTMLImageElement) {
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);
  }

  flip(axis: "horizontal" | "vertical") {
    const { width, height } = this.canvas;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d")!;

    tempCtx.save();
    if (axis === "horizontal") {
      tempCtx.translate(width, 0);
      tempCtx.scale(-1, 1);
    } else {
      tempCtx.translate(0, height);
      tempCtx.scale(1, -1);
    }
    tempCtx.drawImage(this.canvas, 0, 0);
    tempCtx.restore();

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(tempCanvas, 0, 0);
  }

  rotate(direction: "left" | "right", degrees: number = 90) {
    const degreesValue = direction === "right" ? degrees : -degrees;
    const radians = (degreesValue * Math.PI) / 180;
    const { width, height } = this.canvas;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.drawImage(this.canvas, 0, 0);

    this.canvas.width = height;
    this.canvas.height = width;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate(radians);
    this.ctx.drawImage(tempCanvas, -width / 2, -height / 2);
    this.ctx.restore();
  }

  draw(lineWidth: number = 5, strokeStyle: string = "#ff0000") {
    if (this.isDrawingEnabled) {
      return;
    }
    this.isDrawingEnabled = true;

    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";

    let drawing = false;

    this.startDraw = (e: MouseEvent) => {
      drawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
    };
    this.drawMove = (e: MouseEvent) => {
      if (!drawing) return;
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
    };
    this.stopDraw = () => {
      drawing = false;
      this.ctx.closePath();
    };

    this.canvas.addEventListener("mousedown", this.startDraw);
    this.canvas.addEventListener("mousemove", this.drawMove);
    window.addEventListener("mouseup", this.stopDraw);
  }

  disableDrawing() {
    if (!this.isDrawingEnabled) {
      return;
    }

    if (this.startDraw) {
      this.canvas.removeEventListener("mousedown", this.startDraw);
    }
    if (this.drawMove) {
      this.canvas.removeEventListener("mousemove", this.drawMove);
    }
    if (this.stopDraw) {
      window.removeEventListener("mouseup", this.stopDraw);
    }

    this.isDrawingEnabled = false;
  }

  saveImage() {
    const url = this.canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = url;
    link.click();
  }

  *lazyPipeline(img: HTMLImageElement) {
    yield () => this.drawImage(img);
    yield () => this.flip("horizontal");
    yield () => this.rotate("right", 180);
    yield () => this.draw(3, "#00ff00");
    yield () => this.saveImage();
  }
}
