// src/pages/render.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import Chicken from "./chicken"; // 确保路径正确

(function() {
    console.log("chicken.bundle.js 执行中");

    const container = document.getElementById('react-animation-container');
    console.log("nihao", container);
    console.log("chrome.runtime", chrome.runtime);

    if (container) {
        try {
            console.log("开始创建 React root");
            const root = createRoot(container);
            root.render(<Chicken />);
            console.log("动画组件已渲染");
        } catch (error) {
            console.error("渲染组件时出错：", error);
        }
    } else {
        console.error('未找到容器元素');
    }
})();
