// src/pages/render.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import Chicken from "./chicken"; // 确保路径正确

(function () {
  console.log("chicken.bundle.js 执行中");

  const audioUrls = ["music.163.com"];
  const gameUrls = ["4399", "mihoyo"];

  const container = document.getElementById("react-animation-container");
  const currentUrl = window.location.href;
  const hasVideo = !!document.querySelector("video");
  const hasGame = gameUrls.some((url) => currentUrl.includes(url));
  const hasAudio =
    !!document.querySelector("audio") ||
    audioUrls.some((url) => currentUrl.includes(url));
  console.log(
    "nihao",
    container,
    "url",
    currentUrl,
    "hasVideo",
    hasVideo,
    "hasAudio",
    hasAudio,
    "hasGame",
    hasGame,
  );
  console.log("chrome.runtime", chrome.runtime);

  if (container) {
    try {
      console.log("开始创建 React root");
      const root = createRoot(container);
      root.render(
        <Chicken hasVideo={hasVideo} hasAudio={hasAudio} hasGame={hasGame} />,
      );
      console.log("动画组件已渲染");
    } catch (error) {
      console.error("渲染组件时出错：", error);
    }
  } else {
    console.error("未找到容器元素");
  }
})();
