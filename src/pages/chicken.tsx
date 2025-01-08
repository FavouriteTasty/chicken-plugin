import React, { useEffect, useRef, useState, type FC } from "react";
import { getExtensionURL } from "../util/path";

interface ChickenProps {
  hasVideo?: boolean;
}

const Chicken: FC<ChickenProps> = (props) => {
  const { hasVideo } = props;
  const codingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const moveIndexRef = useRef<number>(1);
  const zzzIndexRef = useRef<number>(1);
  const sleepIndexRef = useRef<number>(1);
  const eatIndexRef = useRef<number>(1);
  const drinkIndexRef = useRef<number>(1);
  const codeIndexRef = useRef<number>(1);
  const stepRef = useRef<number>(0);
  const lastDrawChickenTimeRef = useRef<number>(0); // Add a ref to store the last draw time
  const directionRef = useRef<number>(1); // 1 for forward, -1 for backward
  const flipRef = useRef<boolean>(false); // Track if the image is flipped
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const canvasWidthRef = useRef(1200);
  const isMouseMoveRef = useRef(false);
  const urlRef = useRef("");
  const chickenSize = 100;
  const grassRef = useRef<boolean>(false);

  const moveStepDistance = 10;
  const stepInterval = 100;
  const mouseStoppedDelay = 3000;
  const keyStoppedDelay = 3000;

  const getMousePos = (e: MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (canvas === null) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

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

    zzzIndexRef.current = (zzzIndexRef.current % 3) + 1;

    const img = new Image();
    img.src = urlRef.current + `zzz-${zzzIndexRef.current}.png`;
    img.onload = () => {
      if (canvasRef.current !== null) {
        if (flipRef.current) {
          ctx.scale(-1, 1);
        }
        const x = flipRef.current
          ? -(canvasWidthRef.current - stepRef.current * moveStepDistance)
          : moveDistance -
            stepRef.current * moveStepDistance * directionRef.current;

        ctx.drawImage(img, x - 40, 15, 40, 40);
      }
    };
  };

  const chickenEat = (ctx: CanvasRenderingContext2D): void => {
    const moveDistance = canvasWidthRef.current - chickenSize;
    eatIndexRef.current = (eatIndexRef.current % 4) + 1;
    const img = new Image();
    img.src = urlRef.current + `chicken-eat1-${eatIndexRef.current}.png`;
    img.onload = () => {
      if (canvasRef.current !== null) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        if (flipRef.current) {
          ctx.scale(-1, 1);
        }
        const x = flipRef.current
          ? -(canvasWidthRef.current - stepRef.current * moveStepDistance)
          : moveDistance -
            stepRef.current * moveStepDistance * directionRef.current;

        ctx.drawImage(img, x, 0, chickenSize, chickenSize);
      }
    };
  };

  const grassDraw = (ctx: CanvasRenderingContext2D): void => {
    const moveDistance = canvasWidthRef.current - chickenSize;

    const img = new Image();
    img.src = urlRef.current + `grass.png`;
    img.onload = () => {
      if (canvasRef.current !== null) {
        if (flipRef.current) {
          ctx.scale(-1, 1);
        }
        const x = flipRef.current
          ? -(canvasWidthRef.current - stepRef.current * moveStepDistance)
          : moveDistance -
            stepRef.current * moveStepDistance * directionRef.current;

        ctx.drawImage(img, x, 0, chickenSize, chickenSize);
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

  const chickenDrink = (ctx: CanvasRenderingContext2D): void => {
    drinkIndexRef.current = (drinkIndexRef.current % 4) + 1;
    const img = new Image();
    img.src = urlRef.current + `cola-chicken1-${drinkIndexRef.current}.png`;
    img.onload = () => {
      if (canvasRef.current !== null) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const x = canvasWidthRef.current - chickenSize;

        ctx.drawImage(img, x, 0, chickenSize, chickenSize);
      }
    };
  };

  const chickenCoding = (ctx: CanvasRenderingContext2D): void => {
    const moveDistance = canvasWidthRef.current - chickenSize;
    codeIndexRef.current = (codeIndexRef.current % 2) + 1;
    console.log("coding");

    const img = new Image();
    img.src = urlRef.current + `coding-chicken1-${codeIndexRef.current}.png`;
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

    let mouseMoveTimeout: number | undefined;
    const handleMouseMove = (e: MouseEvent): void => {
      if (mouseMoveTimeout !== undefined) clearTimeout(mouseMoveTimeout);
      isMouseMoveRef.current = true;
      mouseMoveTimeout = setTimeout(() => {
        isMouseMoveRef.current = false;
        moveIndexRef.current = 0;
      }, mouseStoppedDelay);
    };

    let keydownTimeout: number | undefined;
    const handleKeydown = (e: KeyboardEvent): void => {
      if (keydownTimeout !== undefined) clearTimeout(keydownTimeout);
      codingRef.current = true;
      keydownTimeout = setTimeout(() => {
        codingRef.current = false;
        codeIndexRef.current = 0;
      }, keyStoppedDelay);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeydown);

    const drawFrame = (time: DOMHighResTimeStamp): void => {
      console.log("coding", codingRef.current, "video", hasVideo);

      if (canvasRef.current !== null) {
        const ctx = canvasRef.current.getContext("2d");

        if (ctx !== null && !hasVideo && !codingRef.current) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            if (grassRef.current) {
              chickenEat(ctx);
              grassDraw(ctx);
            } else {
              if (isMouseMoveRef.current) {
                chickenSleep(ctx);
                zzzSleep(ctx);
              } else {
                chickenMove(ctx);
              }
            }
            lastDrawChickenTimeRef.current = time;
          }
        }
        if (ctx !== null && hasVideo && !codingRef.current) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            chickenDrink(ctx);
            lastDrawChickenTimeRef.current = time;
          }
        }
        if (ctx !== null && codingRef.current) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            chickenCoding(ctx);
            lastDrawChickenTimeRef.current = time;
          }
        }
      }
      requestAnimationFrame(drawFrame);
    };

    const id = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeydown);

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
        onClick={(e) => {
          const moveDistance = canvasWidthRef.current - chickenSize;
          const pos = getMousePos(e as unknown as MouseEvent);
          const handleClick = (): void => {
            grassRef.current = true;
            setTimeout(() => {
              grassRef.current = false;
            }, 3000);
          };
          if (flipRef.current) {
            if (
              canvasWidthRef.current - stepRef.current * moveStepDistance >=
                pos.x &&
              pos.x >=
                canvasWidthRef.current -
                  stepRef.current * moveStepDistance -
                  chickenSize
            ) {
              console.log("in", grassRef.current);
              handleClick();
            } else {
              console.log("out", grassRef.current);
            }
          } else {
            if (
              moveDistance -
                stepRef.current * moveStepDistance * directionRef.current <=
                pos.x &&
              pos.x <=
                moveDistance -
                  stepRef.current * moveStepDistance * directionRef.current +
                  chickenSize
            ) {
              handleClick();
              console.log("in", grassRef.current);
            } else {
              console.log("out", grassRef.current);
            }
          }
        }}
      ></canvas>
    </div>
  );
};

export default Chicken;
