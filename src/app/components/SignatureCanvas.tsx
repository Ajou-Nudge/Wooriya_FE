"use client"
import React, { useRef, useState, useEffect } from 'react';

function SignatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawnImageURL, setDrawnImageURL] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvasResize(canvas);

    const handleResize = () => canvasResize(canvas);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const canvasResize = (canvas: HTMLCanvasElement) => {
    const div = canvas.parentNode as HTMLDivElement;

    const dpr = window.devicePixelRatio;
    canvas.width = div.clientWidth;
    canvas.height = div.clientHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  };

  const crispPixel = (pixel: number, thickness = 1) => {
    const halfThickness = thickness / 2;
    
    return thickness % 2
      ? (Number.isInteger(pixel) ? pixel : Math.round(pixel - halfThickness)) + halfThickness
      : Math.round(pixel);
  };

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // 화면 좌표를 캔버스 좌표로 변환
    const x = crispPixel((clientX - rect.left) * scaleX);
    const y = crispPixel((clientY - rect.top) * scaleY);
    return { x, y };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("!canvas");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log("!ctx");
      return;
    }

    const { x, y } = getPosition(e);
    const dpr = window.devicePixelRatio;

    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(x/dpr, y/dpr);
        break;
      case 'mousemove':
      case 'touchmove':
        if (isDrawing) {
          ctx.lineTo(x/dpr, y/dpr);
          ctx.stroke();
        }
        break;
      case 'mouseup':
      case 'mouseout':
      case 'touchend':
      case 'touchcancel':
        if (isDrawing) {
          setIsDrawing(false);
          ctx.closePath();
        }
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setDrawnImageURL(canvas.toDataURL('image/png'));
    setShowConfirmation(true);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleConfirmSave = () => {
    if (drawnImageURL) {
      const link = document.createElement('a');
      link.href = drawnImageURL;
      link.download = 'image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }

    setShowConfirmation(false);
    setDrawnImageURL('');
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
    setDrawnImageURL('');
  };

  return (
    <div>
      <div style={{ width: '300px', height: '300px' }}>
        <canvas
          ref={canvasRef}
          style={{ border: '1px solid black' }}
          onMouseDown={draw}
          onMouseMove={draw}
          onMouseUp={draw}
          onMouseOut={draw}
          onTouchStart={draw}
          onTouchMove={draw}
          onTouchEnd={draw}
          onTouchCancel={draw}
        ></canvas>
      </div>
      <div>
        <button onClick={handleSave}>저장</button>
      </div>
      {showConfirmation && (
        <div>
          <p>그림을 저장하시겠습니까?</p>
          <button onClick={handleConfirmSave}>예</button>
          <button onClick={handleCancelSave}>아니요</button>
        </div>
      )}
      {drawnImageURL && (
        <div>
          <img src={drawnImageURL} alt="Drawn Signature" />
        </div>
      )}
    </div>
  );
}

export default SignatureCanvas;
