import React, { useRef, useState, useEffect } from 'react';

type Tool = 'brush' | 'rectangle' | 'circle' | 'line';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(4);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    setStartPos(pos);
    setIsDrawing(true);

    const ctx = ctxRef.current!;
    saveToHistory();
    redoRef.current = [];

    if (tool === 'brush') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else {
      const snap = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      setSnapshot(snap);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos) return;
    const ctx = ctxRef.current!;
    const { x, y } = getMousePos(e);

    if (tool === 'brush') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);

      switch (tool) {
        case 'rectangle':
          ctx.strokeRect(
            startPos.x,
            startPos.y,
            x - startPos.x,
            y - startPos.y,
          );
          break;
        case 'circle':
          // eslint-disable-next-line no-case-declarations
          const radius = Math.sqrt(
            (x - startPos.x) ** 2 + (y - startPos.y) ** 2,
          );
          ctx.beginPath();
          ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'line':
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          break;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    ctxRef.current?.closePath();
  };

  const saveToHistory = () => {
    const ctx = ctxRef.current!;
    historyRef.current.push(
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    );
    if (historyRef.current.length > 50) {
      historyRef.current.shift(); // limit history to 50 states
    }
  };

  const undo = () => {
    if (historyRef.current.length > 0) {
      const ctx = ctxRef.current!;
      const last = historyRef.current.pop()!;
      redoRef.current.push(
        ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
      );
      ctx.putImageData(last, 0, 0);
    }
  };

  const redo = () => {
    if (redoRef.current.length > 0) {
      const ctx = ctxRef.current!;
      const redoImage = redoRef.current.pop()!;
      historyRef.current.push(
        ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
      );
      ctx.putImageData(redoImage, 0, 0);
    }
  };

  const download = () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvasRef.current!.toDataURL();
    link.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      const img = new Image();
      img.onload = function () {
        const ctx = ctxRef.current!;
        ctx.clearRect(
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height,
        );
        ctx.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>React + TypeScript Image Editor</h2>

      <div style={{ marginBottom: '10px' }}>
        {(['brush', 'rectangle', 'circle', 'line'] as Tool[]).map((t) => (
          <button
            key={t}
            onClick={() => setTool(t)}
            style={{
              marginRight: 5,
              backgroundColor: tool === t ? '#ddd' : '#f0f0f0',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: 5 }}
          />
        </label>

        <label style={{ marginLeft: 20 }}>
          Brush size:
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ marginLeft: 5 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={undo} style={{ marginRight: 5 }}>
          Undo
        </button>
        <button onClick={redo} style={{ marginRight: 5 }}>
          Redo
        </button>
        <button onClick={download} style={{ marginRight: 5 }}>
          Download
        </button>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          border: '1px solid #333',
          backgroundColor: '#fff',
          cursor: 'crosshair',
        }}
      />
    </div>
  );
}
