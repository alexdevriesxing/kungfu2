const CACHE='green-dragon-v8-legacy';
const CORE=[
  './','./index.html','./styles.css','./manifest.webmanifest','./assets/icon.svg',
  './src/bootstrap.js','./src/game.js','./src/content.js','./src/audio.js','./src/render.js','./src/art.js','./src/combat.js',
  './src/production-assets.js','./src/named-fighters.js','./src/sprite-atlas.js','./src/enhancements.js','./src/world-systems.js',
  './src/act-two.js','./src/act-two-compat.js','./src/act-three.js','./src/act-four.js','./src/legacy-journey.js','./src/legacy-progression.js','./src/wuxia-presentation.js'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(caches.match(event.request).then(cached=>{
    const network=fetch(event.request).then(response=>{if(response?.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>cached);
    return cached||network;
  }));
});
