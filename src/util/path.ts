export function getExtensionURL(path) {
    return new Promise((resolve, reject) => {
      function handleMessage(event) {
        if (event.source !== window) return;
        if (event.data && event.data.type === 'RESPONSE_EXTENSION_URL' && event.data.path === path) {
          window.removeEventListener('message', handleMessage);
          if (event.data.url) {
            resolve(event.data.url);
          } else {
            reject(new Error('未能获取到资源 URL'));
          }
        }
      }
      window.addEventListener('message', handleMessage, false);
      window.postMessage({
        type: 'REQUEST_EXTENSION_URL',
        path: path
      }, '*');
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        reject(new Error('请求资源 URL 超时'));
      }, 5000); // 5秒超时
    });
  }