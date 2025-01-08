// contentScript.ts
window.onload = (event) => {
  console.log("Page is fully loaded");
};

(async () => {
  try {
    // 1. 处理来自页面的消息请求
    window.addEventListener(
      "message",
      function (event) {
        if (event.source !== window) return;
        if (event.data && event.data.type === "REQUEST_EXTENSION_URL") {
          const requestedPath = event.data.path;
          const resourceUrl = chrome.runtime.getURL(requestedPath as string);
          window.postMessage(
            {
              type: "RESPONSE_EXTENSION_URL",
              path: requestedPath,
              url: resourceUrl,
            },
            "*",
          );
        }
      },
      false,
    );

    // 2. 创建 React 组件的容器
    const containerId = "react-animation-container";
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.position = "fixed";
      container.style.bottom = "0";
      container.style.left = "0";
      container.style.zIndex = "10011";
      container.style.height = "100px";
      container.style.width = "100vw";
      document.body.appendChild(container);
    }

    // 3. 加载你的 React 组件脚本
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("chicken.js");
    script.onload = () => {
      console.log("chicken.bundle.js 已加载并执行");
      // script.remove(); // 可选：加载后移除脚本标签
    };
    script.onerror = () => {
      console.error("无法加载 chicken.bundle.js");
    };
    document.head.appendChild(script);

    // 4. 建立与 Background 的长连接
    const port = chrome.runtime.connect({ name: "content-script-port" });

    // 5. 请求当前全局状态
    port.postMessage({ type: "GET_STATE" });

    // 6. 监听来自 Background 的状态更新
    port.onMessage.addListener((message) => {
      if (message.type === "STATE_UPDATE") {
        // 将状态传递给页面中的 React 组件
        window.postMessage(
          {
            type: "STATE_UPDATE",
            state: message.state,
          },
          "*",
        );
      }
    });

    // 7. 监听来自页面的状态更新请求
    window.addEventListener(
      "message",
      function (event) {
        if (event.source !== window) return;
        if (event.data && event.data.type === "SET_STATE") {
          // 将新的状态发送给 Background 脚本
          port.postMessage({ type: "SET_STATE", state: event.data.state });
        }
      },
      false,
    );

    // 8. 处理连接断开
    port.onDisconnect.addListener(() => {
      console.log("Disconnected from background");
    });
  } catch (error) {
    console.error("加载外部脚本时出错：", error);
  }
})();
