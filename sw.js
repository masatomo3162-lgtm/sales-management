const CACHE='sales-app-icon-20260704';
const ASSETS=['./','./index.html','./manifest.webmanifest','./manifest.json','./favicon.ico','./favicon-16.png','./favicon-32.png','./icon.svg','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-512-maskable.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached)return cached;
      return fetch(event.request).then(response=>{
        if(response&&(response.ok||response.type==='opaque')){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      }).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error());
    })
  );
});
