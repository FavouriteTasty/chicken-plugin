import React, { useEffect, useRef, useState, type FC } from "react";
import { getExtensionURL } from "../util/path";
import { loadImage, loadImages } from "../util/image";

interface ChickenProps {
  hasVideo?: boolean;
  hasAudio?: boolean;
  hasGame?: boolean;
}

const Chicken: FC<ChickenProps> = (props) => {
  const { hasVideo = false, hasAudio = false, hasGame = false } = props;
  const codingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const moveIndexRef = useRef<number>(1);
  const zzzIndexRef = useRef<number>(1);
  const sleepIndexRef = useRef<number>(1);
  const eatIndexRef = useRef<number>(1);
  const drinkIndexRef = useRef<number>(1);
  const musicIndexRef = useRef<number>(1);
  const gameIndexRef = useRef<number>(1);
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
  const grassPositionRef = useRef<number>(0);
  const growRef = useRef<number>(1);

  const moveStepDistance = 10;
  const stepInterval = 50;
  const mouseStoppedDelay = 3000;
  const keyStoppedDelay = 3000;

  const getChickenPosition = (): number => {
    const moveDistance = canvasWidthRef.current - chickenSize;
    return flipRef.current
      ? -(canvasWidthRef.current - stepRef.current * moveStepDistance)
      : moveDistance -
          stepRef.current * moveStepDistance * directionRef.current;
  };

  const getMousePos = (e: MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (canvas === null) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const chickenMove = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    const moveDistance = canvasWidthRef.current - chickenSize;
    const moveMaxSteps = moveDistance / moveStepDistance;

    moveIndexRef.current = (moveIndexRef.current % 4) + 1;

    const img = await loadImage(
      urlRef.current +
        (growRef.current > 3 ? "" : "baby-") +
        `chicken1-${moveIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.save();
      if (flipRef.current) {
        ctx.scale(-1, 1);
      }
      const x = getChickenPosition();
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

  const zzzSleep = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    zzzIndexRef.current = (zzzIndexRef.current % 3) + 1;
    const img = await loadImage(
      urlRef.current + `zzz-${zzzIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.save();
      if (flipRef.current) {
        ctx.scale(-1, 1);
      }
      const x = getChickenPosition();
      ctx.drawImage(img, x - 40, 15, 40, 40);
      ctx.restore();
    }
  };

  const chickenEat = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    eatIndexRef.current = (eatIndexRef.current % 4) + 1;
    const img = await loadImage(
      urlRef.current +
        (growRef.current > 3 ? "" : "baby-") +
        `chicken-eat1-${eatIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.save();
      if (flipRef.current) {
        ctx.scale(-1, 1);
      }
      const x = getChickenPosition();
      ctx.drawImage(img, x, 0, chickenSize, chickenSize);
      ctx.restore();
    }
  };

  const grassDraw = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    const img = await loadImage(urlRef.current + `grass.png`);
    if (canvasRef.current !== null) {
      ctx.save();
      if (flipRef.current) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, grassPositionRef.current, 0, chickenSize, chickenSize);
      ctx.restore();
    }
  };

  const chickenSleep = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    if (sleepIndexRef.current !== 2)
      sleepIndexRef.current = (sleepIndexRef.current % 2) + 1;
    const img = await loadImage(
      urlRef.current + `chicken2-${sleepIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.save();
      if (flipRef.current) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, getChickenPosition(), 0, chickenSize, chickenSize);
      ctx.restore();
    }
  };

  const chickenDrink = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    drinkIndexRef.current = (drinkIndexRef.current % 4) + 1;
    const img = await loadImage(
      urlRef.current + `cola-chicken1-${drinkIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const x = canvasWidthRef.current - chickenSize;
      ctx.drawImage(img, x, 0, chickenSize, chickenSize);
    }
  };

  const chickenMusic = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    musicIndexRef.current = (musicIndexRef.current % 3) + 1;
    const img = await loadImage(
      urlRef.current + `music-chicken1-${musicIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const x = canvasWidthRef.current - chickenSize;
      ctx.drawImage(img, x, 0, chickenSize, chickenSize);
    }
  };

  const chickenGame = async (ctx: CanvasRenderingContext2D): Promise<void> => {
    gameIndexRef.current = (gameIndexRef.current % 2) + 1;
    const img = await loadImage(
      urlRef.current + `game-chicken1-${gameIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const x = canvasWidthRef.current - chickenSize;
      ctx.drawImage(img, x, 0, chickenSize, chickenSize);
    }
  };

  const chickenCoding = async (
    ctx: CanvasRenderingContext2D,
  ): Promise<void> => {
    codeIndexRef.current = (codeIndexRef.current % 2) + 1;
    const img = await loadImage(
      urlRef.current + `coding-chicken1-${codeIndexRef.current}.png`,
    );
    if (canvasRef.current !== null) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.save();
      if (flipRef.current) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, getChickenPosition(), 0, chickenSize, chickenSize);
      ctx.restore();
    }
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

  const handleMessage = (event: MessageEvent): void => {
    if (event.source !== window) return;
    if (event.data && event.data.type === "STATE_UPDATE") {
      console.log("handleMessage", event.data.state);
      growRef.current = event.data.state.grow;
    }
  };

  const updateState = (): void => {
    const newState = { grow: growRef.current + 1 };
    window.postMessage(
      {
        type: "SET_STATE",
        state: newState,
      },
      "*",
    );
  };

  const getState = (): void => {
    window.postMessage(
      {
        type: "GET_STATE",
      },
      "*",
    );
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
        loadImages(urlRef.current);
      })
      .catch((error) => {
        console.error("获取资源 URL 失败:", error);
      });

    let mouseMoveTimeout: number | undefined;
    const handleMouseMove = (e: MouseEvent): void => {
      if (grassRef.current) return;
      if (mouseMoveTimeout !== undefined) clearTimeout(mouseMoveTimeout);
      isMouseMoveRef.current = true;
      mouseMoveTimeout = setTimeout(() => {
        isMouseMoveRef.current = false;
        moveIndexRef.current = 1;
      }, mouseStoppedDelay);
    };

    let keydownTimeout: number | undefined;
    const handleKeydown = (e: KeyboardEvent): void => {
      if (grassRef.current) return;
      if (keydownTimeout !== undefined) clearTimeout(keydownTimeout);
      codingRef.current = true;
      keydownTimeout = setTimeout(() => {
        codingRef.current = false;
        codeIndexRef.current = 1;
      }, keyStoppedDelay);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("message", handleMessage);
    getState();

    const drawFrame = (time: DOMHighResTimeStamp): void => {
      // console.log("coding", codingRef.current, "video", hasVideo);

      if (canvasRef.current !== null) {
        const ctx = canvasRef.current.getContext("2d");

        if (
          ctx !== null &&
          !hasVideo &&
          !codingRef.current &&
          !hasAudio &&
          !hasGame
        ) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            if (
              grassRef.current &&
              grassPositionRef.current === getChickenPosition()
            ) {
              chickenEat(ctx);
            } else {
              if (isMouseMoveRef.current && growRef.current > 3) {
                chickenSleep(ctx);
                zzzSleep(ctx);
              } else {
                chickenMove(ctx);
              }
            }
            if (grassRef.current) {
              grassDraw(ctx);
            }
            lastDrawChickenTimeRef.current = time;
          }
        }
        if (
          ctx !== null &&
          hasAudio &&
          !codingRef.current &&
          growRef.current > 3
        ) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            chickenMusic(ctx);
            lastDrawChickenTimeRef.current = time;
          }
        }
        if (
          ctx !== null &&
          hasVideo &&
          !codingRef.current &&
          growRef.current > 3
        ) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            chickenDrink(ctx);
            lastDrawChickenTimeRef.current = time;
          }
        }
        if (
          ctx !== null &&
          hasGame &&
          !codingRef.current &&
          growRef.current > 3
        ) {
          if (time - lastDrawChickenTimeRef.current >= stepInterval) {
            chickenGame(ctx);
            lastDrawChickenTimeRef.current = time;
          }
        }
        if (ctx !== null && codingRef.current && growRef.current > 3) {
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
      window.removeEventListener("message", handleMessage);

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
          const x = getChickenPosition();

          const handleClick = (): void => {
            if (grassRef.current) return;
            if (isMouseMoveRef.current) isMouseMoveRef.current = false;
            if (codingRef.current) codingRef.current = false;
            grassRef.current = true;
            if (!flipRef.current) {
              grassPositionRef.current = x - 200 > 0 ? x - 200 : 0;
            } else {
              grassPositionRef.current =
                x - 200 > -canvasWidthRef.current
                  ? x - 200
                  : -canvasWidthRef.current;
            }
            setTimeout(() => {
              grassRef.current = false;
              updateState();
            }, 4000);
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
              console.log("in", grassRef.current, x);
              handleClick();
            } else {
              console.log("out", grassRef.current, x);
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
              console.log("in", grassRef.current, x);
            } else {
              console.log("out", grassRef.current, x);
            }
          }
        }}
      ></canvas>
    </div>
  );
};

export default Chicken;
