const CACHE_NAME = 'adventure-portal-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // 如果你有其他 CSS 或 JS 檔案，請加在這裡
  // 注意：這裡假設 planner.html 和 osaka.html 也在同目錄下，
  // 如果希望它們也能離線存取，請取消下面兩行的註解：
  // './planner.html',
  // './osaka.html'
];

// 安裝 Service Worker 並快取資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 攔截請求：優先使用快取，沒有才去網路下載 (Offline-First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果快取中有，直接回傳
        if (response) {
          return response;
        }
        // 否則從網路抓取
        return fetch(event.request);
      })
  );
});

// 更新 Service Worker 時清除舊快取
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
