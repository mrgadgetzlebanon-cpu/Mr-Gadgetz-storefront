"use client";

import { useEffect, useRef } from "react";

export function DistortionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- LIGHT THEME SETTINGS ---
    const settings = {
      lineColor: "#f5f5f5", // Slate-300 (Subtle Gray lines)
      activeColor: "#3b82f6", // Blue-500
      bgColor: "#ffffff", // White Background
      text: "MR.GADGETZ",
    };

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    const mouse = { x: -9999, y: -9999, radius: 200 };
    let lines: { x: number; y: number; baseX: number; baseY: number }[][] = [];

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initLines();
    };

    const initLines = () => {
      const horizontalPadding = width < 768 ? 20 : width * 0.05;
      const verticalPadding = height < 600 ? 50 : height * 0.1;
      const linesCount = Math.floor(height / 20);
      const cellWidth = 8;
      const cols = Math.floor((width - horizontalPadding * 2) / cellWidth);

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      const tempW = 300;
      const tempH = tempW * (height / width);
      tempCanvas.width = tempW;
      tempCanvas.height = tempH;

      tempCtx.fillStyle = "black";
      tempCtx.fillRect(0, 0, tempW, tempH);
      tempCtx.fillStyle = "white";
      tempCtx.font = `900 ${tempW / 5}px sans-serif`;
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";
      tempCtx.fillText(settings.text, tempW / 2, tempH / 2);

      const typeData = tempCtx.getImageData(0, 0, tempW, tempH).data;

      lines = [];
      for (let i = 0; i < linesCount; i++) {
        const y = (i / (linesCount - 1)) * height;
        const line = [];

        if (y < verticalPadding || y > height - verticalPadding) continue;

        for (let j = 0; j < cols; j++) {
          const x = horizontalPadding + j * cellWidth;
          const typeX = Math.floor((j / cols) * tempW);
          const typeY = Math.floor((y / height) * tempH);

          const safeTypeX = Math.max(0, Math.min(tempW - 1, typeX));
          const safeTypeY = Math.max(0, Math.min(tempH - 1, typeY));
          const index = (safeTypeY * tempW + safeTypeX) * 4;

          const brightness = typeData[index];
          const heightOffset = (brightness / 255) * 50;
          const finalY = y - heightOffset;

          line.push({ x, y: finalY, baseX: x, baseY: finalY });
        }
        lines.push(line);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = settings.bgColor;
      ctx.fillRect(0, 0, width, height);

      lines.forEach((line) => {
        ctx.beginPath();
        if (line.length > 0) ctx.moveTo(line[0].x, line[0].y);

        for (let i = 0; i < line.length; i++) {
          const p = line[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += Math.cos(angle) * force * 15;
            p.y += Math.sin(angle) * force * 15;
          }

          p.x += (p.baseX - p.x) * 0.08;
          p.y += (p.baseY - p.y) * 0.08;

          if (i > 0) {
            const prev = line[i - 1];
            const midX = (prev.x + p.x) / 2;
            const midY = (prev.y + p.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
          }
        }

        ctx.strokeStyle = settings.lineColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);

    resize();
    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full pointer-events-auto" />
    </div>
  );
}
