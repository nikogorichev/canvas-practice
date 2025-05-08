import React, { useRef, useState } from "react";
import { ImageEditor } from "../service/ImageEditor";
import { createEditorProxy } from "../service/createEditorProxy";
import { HistoryComponent } from "./HistoryComponent";

export function EditorComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editor, setEditor] = useState<ImageEditor | null>(null);
  const [logs, setLogs] = useState<Array<string>>([]);

  const logAction = ({
    method,
    args,
    timestamp,
    durationMs,
  }: {
    method: keyof ImageEditor;
    args: Array<unknown>;
    timestamp: Date;
    durationMs: number;
  }) => {
    setLogs((prev) => [
      ...prev,
      `[${timestamp.toLocaleTimeString()}] ${String(method)}(${args.join(", ")}) - ${durationMs.toFixed(2)}ms`,
    ]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) {
          return;
        }
        const newEditor = new ImageEditor(canvasRef.current);
        const proxyEditor = createEditorProxy(newEditor, logAction);
        proxyEditor.drawImage(img);
        setEditor(proxyEditor);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const stopDrawing = () => {
    editor?.disableDrawing();
  };

  const handleFlipHorizontally = () => {
    stopDrawing();
    editor?.flip("horizontal");
  };

  const handleFlipVertically = () => {
    stopDrawing();
    editor?.flip("vertical");
  };

  const handleRotateRight = () => {
    stopDrawing();
    editor?.rotate("right");
  };

  const handleRotateLeft = () => {
    stopDrawing();
    editor?.rotate("left");
  };

  const handleDrawing = () => {
    editor?.draw();
  };

  const saveImage = () => {
    stopDrawing();
    editor?.saveImage();
  };

  return (
    <>
      <h1>Редактор фото</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />
      <canvas ref={canvasRef} />
      {fileInputRef.current && (
        <div>
          <button onClick={handleFlipHorizontally}>
            Отзеркалить горизонтально
          </button>
          <button onClick={handleFlipVertically}>
            Отзеркалить вертикально
          </button>
          <button onClick={handleRotateLeft}>Повернуть влево</button>
          <button onClick={handleRotateRight}>Повернуть вправо</button>
          <button onClick={handleDrawing}>Рисовать</button>
          <button onClick={saveImage}>Сохранить</button>
        </div>
      )}

     <HistoryComponent logs={logs}/>
    </>
  );
}
