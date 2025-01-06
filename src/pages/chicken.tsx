import React, { useEffect, useRef, useState, type FC } from "react";
import { getExtensionURL } from "../util/path";

const Chicken: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moveIndexRef = useRef<number>(1);
  const sleepIndexRef = useRef<number>(1);
  const stepRef = useRef<number>(0);
  const lastDrawChickenTimeRef = useRef<number>(0); // Add a ref to store the last draw time
  const lastDrawZZZTimeRef = useRef<number>(0); // Add a ref to store the last draw time
  const directionRef = useRef<number>(1); // 1 for forward, -1 for backward
  const flipRef = useRef<boolean>(false); // Track if the image is flipped
  const [canvasWidth] = useState(1200);
  const isMouseMoveRef = useRef(false);
  const urlRef = useRef("");
  const zzzRef = useRef([
    { x: 0, y: 200, size: 20 },
    { x: 20, y: 180, size: 30 },
    { x: 40, y: 160, size: 40 },
  ]);
  const chickenSize = 350;
  const moveDistance = canvasWidth - chickenSize;
  const moveStepDistance = 10;
  const moveMaxSteps = moveDistance / moveStepDistance;
  const stepInterval = 100;
  const zzzInterval = 10;
  const mouseStoppedDelay = 3000;

  const chickenMove = (ctx: CanvasRenderingContext2D): void => {
    moveIndexRef.current = (moveIndexRef.current % 4) + 1;

    const img = new Image();
    img.src = urlRef.current + `chicken1-${moveIndexRef.current}.png`;
    img.onload = () => {
      if (canvasRef.current !== null) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        ctx.save();

        if (flipRef.current) {
          ctx.scale(-1, 1);
        }

        ctx.drawImage(
          img,
          flipRef.current
            ? -(canvasWidth - stepRef.current * moveStepDistance)
            : moveDistance -
                stepRef.current * moveStepDistance * directionRef.current,
          0,
          chickenSize,
          chickenSize,
        );

        ctx.restore();
      }

      if (stepRef.current === moveMaxSteps) {
        directionRef.current *= -1;
        flipRef.current = !flipRef.current;
      }

      if (stepRef.current === 0 && directionRef.current === -1) {
        flipRef.current = false;
        directionRef.current = 1;
      }

      stepRef.current += directionRef.current;
    };
  };

  const zzzSleep = (ctx: CanvasRenderingContext2D): void => {
    zzzRef.current.forEach((z, index) => {
      ctx.font = "900 20px MyCustomFont";
      ctx.fillStyle = "#000";
      ctx.font = `bold ${z.size}px Arial`;
      ctx.fillText(
        "Z",
        flipRef.current
          ? -(canvasWidth - stepRef.current * moveStepDistance + z.x)
          : moveDistance -
              stepRef.current * moveStepDistance * directionRef.current -
              z.x,
        z.y,
      );
      z.x += 0.5 * directionRef.current;
      z.y -= 0.5 * index + 0.5; // 向上移动
      z.size += 0.2; // 逐渐放大

      // 如果超出边界，重置位置和大小
      if (z.y < 0 || z.size > 60) {
        z.x = index * 20;
        z.y = 160 + index * -20;
        z.size = 20 + index * 10;
      }
    });
  };

  const chickenSleep = (ctx: CanvasRenderingContext2D): void => {
    if (sleepIndexRef.current !== 2)
      sleepIndexRef.current = (sleepIndexRef.current % 2) + 1;

    const img = new Image();
    img.src = urlRef.current + `chicken2-${sleepIndexRef.current}.png`;
    img.onload = () => {
      if (canvasRef.current !== null) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.save();
        if (flipRef.current) {
          ctx.scale(-1, 1);
        }

        ctx.drawImage(
          img,
          flipRef.current
            ? -(canvasWidth - stepRef.current * moveStepDistance)
            : moveDistance -
                stepRef.current * moveStepDistance * directionRef.current,
          0,
          chickenSize,
          chickenSize,
        );
        ctx.restore();
      }
    };
  };

  useEffect(() => {
    getExtensionURL('')
    .then(url => {
      urlRef.current = url as string + "images/";
      console.log('资源 URL:', url, urlRef.current + `chicken2-${sleepIndexRef.current}.png`);
    })
    .catch(error => {
      console.error('获取资源 URL 失败:', error);
    });

    let timeout: number | undefined;
    const handleMouseMove = (e: MouseEvent): void => {
      if (timeout !== undefined) clearTimeout(timeout);
      isMouseMoveRef.current = true;
      timeout = setTimeout(() => {
        isMouseMoveRef.current = false;
        moveIndexRef.current = 0;
      }, mouseStoppedDelay);
    };
   
    window.addEventListener("mousemove", handleMouseMove);
    
    const drawFrame = (time: DOMHighResTimeStamp): void => {
      if (canvasRef.current !== null) {
        const ctx = canvasRef.current.getContext("2d");

        if (ctx !== null) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            if (isMouseMoveRef.current) {
              chickenSleep(ctx);
            } else {
              chickenMove(ctx);
            }
            lastDrawChickenTimeRef.current = time;
          }
          if (time - lastDrawZZZTimeRef.current >= zzzInterval) {
            if (isMouseMoveRef.current) {
              zzzSleep(ctx);
            }
            lastDrawZZZTimeRef.current = time;
          }
        }
      }
      requestAnimationFrame(drawFrame);
    };

    // Start the animation loop
    const id = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height="400"
        style={{
          backgroundColor: "transparent",
        }}
      ></canvas>
    </div>
  );
};

export default Chicken;

