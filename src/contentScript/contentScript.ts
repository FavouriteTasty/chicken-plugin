chrome.runtime.sendMessage("I am loading content script", (response) => {
  console.log(response);
  console.log("I am content script");
});

window.onload = (event) => {
  console.log("page is fully loaded");
};

(async () => {
  try {
    window.addEventListener(
      "message",
      function (event) {
        // 仅处理来自当前窗口的消息
        if (event.source !== window) return;

        // 检查消息类型
        if (event.data && event.data.type === "REQUEST_EXTENSION_URL") {
          const requestedPath = event.data.path;

          // 使用 chrome.runtime.getURL 获取资源的完整 URL
          const resourceUrl = chrome.runtime.getURL(requestedPath as string);

          // 通过 window.postMessage 将结果发送回网页
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

    const containerId = "react-animation-container";
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.position = "fixed";
      container.style.bottom = "0";
      container.style.left = "0";
      container.style.zIndex = "9999";
      container.style.height = "200px";
      container.style.width = "100vw";
      document.body.appendChild(container);
    }

    // 加载你的执行脚本
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("chicken.js");
    script.onload = () => {
      console.log("chicken.bundle.js 已加载并执行");
      // script.remove();
    };
    script.onerror = () => {
      console.error("无法加载 chicken.bundle.js");
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error("加载外部脚本时出错：", error);
  }
})();
