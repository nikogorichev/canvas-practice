import React, { useRef, useState } from "react";
import { ImageEditor } from "../service/ImageEditor";

export default function EditorComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editor, setEditor] = useState<ImageEditor | null>(null);

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
        newEditor.drawImage(img);
        setEditor(newEditor);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFlipHorizontally = () => {
    editor?.flip("horizontal");
  };

  const handleFlipVertically = () => {
    editor?.flip("vertical");
  };

  const handleRotate = () => {
    editor?.rotate(90);
  };

  const handleDrawing = () => {
    editor?.draw();
  };

  const saveImage = () => {
    editor?.saveImage();
  };

  return (
    <div>
      <h1>Редактор фото</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />
      <canvas ref={canvasRef} />
      <div className="flex gap-2">
        <button onClick={handleFlipHorizontally}>flipHorizontally</button>
        <button onClick={handleFlipVertically}>handleFlipVertically</button>
        <button onClick={handleRotate}>rotate</button>
        <button onClick={handleDrawing}>draw</button>
        <button onClick={saveImage}>Save</button>
      </div>
    </div>
  );
}
