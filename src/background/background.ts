// background.js
let globalState = {
  grow: 1,
};

const ports = [];

// 监听连接
chrome.runtime.onConnect.addListener((port) => {
  ports.push(port);

  // 监听来自 content script 的消息
  port.onMessage.addListener((message) => {
    if (message.type === "GET_STATE") {
      port.postMessage({ type: "STATE_UPDATE", state: globalState });
    } else if (message.type === "SET_STATE") {
      globalState = { ...globalState, ...message.state };
      // 广播更新到所有连接的 content scripts
      ports.forEach((p) =>
        p.postMessage({ type: "STATE_UPDATE", state: globalState }),
      );
    }
  });

  // 处理断开连接
  port.onDisconnect.addListener(() => {
    const index = ports.indexOf(port);
    if (index !== -1) {
      ports.splice(index, 1);
    }
  });
});
