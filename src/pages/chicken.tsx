import React, { useEffect, useRef, useState, type FC } from "react";
import { getExtensionURL } from "../util/path";

const Chicken: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const moveIndexRef = useRef<number>(1);
  const zzzIndexRef = useRef<number>(1);
  const sleepIndexRef = useRef<number>(1);
  const stepRef = useRef<number>(0);
  const lastDrawChickenTimeRef = useRef<number>(0); // Add a ref to store the last draw time
  const lastDrawZZZTimeRef = useRef<number>(0); // Add a ref to store the last draw time
  const directionRef = useRef<number>(1); // 1 for forward, -1 for backward
  const flipRef = useRef<boolean>(false); // Track if the image is flipped
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const canvasWidthRef = useRef(1200);
  const isMouseMoveRef = useRef(false);
  const urlRef = useRef("");
  const chickenSize = 100;

  const moveStepDistance = 10;
  const stepInterval = 100;
  const zzzInterval = 100;
  const mouseStoppedDelay = 3000;

  const chickenMove = (ctx: CanvasRenderingContext2D): void => {
    const moveDistance = canvasWidthRef.current - chickenSize;
    const moveMaxSteps = moveDistance / moveStepDistance;

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

        const x = flipRef.current
          ? -(canvasWidthRef.current - stepRef.current * moveStepDistance)
          : moveDistance -
            stepRef.current * moveStepDistance * directionRef.current;

        ctx.drawImage(img, x, 0, chickenSize, chickenSize);

        ctx.restore();
      }

      if (stepRef.current >= moveMaxSteps) {
        stepRef.current = moveMaxSteps;
        directionRef.current *= -1;
        flipRef.current = !flipRef.current;
      }

      if (stepRef.current < 0 && directionRef.current === -1) {
        stepRef.current = 0;
        flipRef.current = false;
        directionRef.current = 1;
      }

      stepRef.current += directionRef.current;
    };
  };

  const zzzSleep = (ctx: CanvasRenderingContext2D): void => {
    const moveDistance = canvasWidthRef.current - chickenSize;

    zzzIndexRef.current = (zzzIndexRef.current % 9) + 1;

    const img = new Image();
    img.src = urlRef.current + `zzz-${zzzIndexRef.current}.png`;
    img.onload = () => {
      if (canvasRef.current !== null) {
        const x = flipRef.current
          ? -(canvasWidthRef.current - stepRef.current * moveStepDistance)
          : moveDistance -
            stepRef.current * moveStepDistance * directionRef.current;

        ctx.drawImage(img, x - 30, 25, 30, 30);
      }
    };
  };

  const chickenSleep = (ctx: CanvasRenderingContext2D): void => {
    const moveDistance = canvasWidthRef.current - chickenSize;

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
            ? -(canvasWidthRef.current - stepRef.current * moveStepDistance)
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

  const handleResize = (): void => {
    if (containerRef.current !== null) {
      setCanvasWidth(containerRef.current.clientWidth);
      canvasWidthRef.current = containerRef.current.clientWidth;
      stepRef.current = 0;
      directionRef.current = 1;
      flipRef.current = false;
    }
  };

  useEffect(() => {
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    getExtensionURL("")
      .then((url) => {
        urlRef.current = (url as string) + "images/";
        console.log(
          "资源 URL:",
          url,
          urlRef.current + `chicken2-${sleepIndexRef.current}.png`,
        );
      })
      .catch((error) => {
        console.error("获取资源 URL 失败:", error);
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
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="h-full w-full flex items-center justify-center"
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={chickenSize}
        style={{
          backgroundColor: "transparent",
        }}
      ></canvas>
    </div>
  );
};

export default Chicken;
